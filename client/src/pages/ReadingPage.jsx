import { useState, useCallback, useRef, useEffect } from 'react';
import { postApi, useApi } from '../hooks/useApi';
import './ReadingPage.css';

// ---- Abbreviation-safe sentence splitting ----
const ABBREVIATIONS = ['Mr', 'Mrs', 'Ms', 'Dr', 'Prof', 'Jr', 'Sr', 'St', 'Inc', 'Corp', 'Ltd', 'Ave', 'Blvd', 'etc', 'vs', 'Vol', 'Gen', 'Sgt', 'Capt'];
const PH = '';

function splitSentences(text) {
  if (!text) return [text || ''];
  let processed = text;
  for (const abbr of ABBREVIATIONS) {
    processed = processed.replace(new RegExp(`\\b(${abbr})\\.`, 'gi'), `$1${PH}`);
  }
  processed = processed.replace(/([A-Z])\.([A-Z])\./g, `$1${PH}$2${PH}`);
  const sentences = processed.match(/[^.!?]*[.!?]+[\s]*/g);
  if (!sentences) return [text];
  const phRegex = new RegExp(PH, 'g');
  return sentences.map(s => s.replace(phRegex, '.').trim()).filter(Boolean);
}

function splitChineseSentences(text) {
  if (!text) return [];
  const sentences = text.match(/[^。！？]*[。！？]+/g);
  if (!sentences) return [text];
  return sentences.map(s => s.trim()).filter(Boolean);
}

function alignChineseSentences(zhText, enCount) {
  const zhSentences = splitChineseSentences(zhText);
  if (zhSentences.length === enCount) return zhSentences;
  if (zhSentences.length === 0) return Array(enCount).fill('');
  if (zhSentences.length > enCount) {
    const merged = [];
    const ratio = zhSentences.length / enCount;
    for (let i = 0; i < enCount; i++) {
      const start = Math.floor(i * ratio);
      const end = Math.floor((i + 1) * ratio);
      merged.push(zhSentences.slice(start, end).join(''));
    }
    return merged;
  }
  return [...zhSentences, ...Array(enCount - zhSentences.length).fill('')];
}

// ---- Speed configuration ----
const SPEED_CONFIG = {
  1: { rate: 0.4, label: '最慢速（逐字）', desc: '逐字朗讀 + 中文翻譯 + 單字/片語/文法說明', withZh: true, withNotes: true, wordByWord: true },
  2: { rate: 0.6, label: '慢速', desc: '慢速朗讀 + 每句中文翻譯', withZh: true, withNotes: false, wordByWord: false },
  3: { rate: 0.8, label: '中速', desc: '中速朗讀 + 每句中文翻譯', withZh: true, withNotes: false, wordByWord: false },
  4: { rate: 1.0, label: '正常速', desc: '正常語速 + 每句中文翻譯', withZh: true, withNotes: false, wordByWord: false },
  5: { rate: 1.3, label: '快速', desc: '快速朗讀（純英文，無翻譯）', withZh: false, withNotes: false, wordByWord: false },
};

// ---- TTS Engine ----
function useArticleTTS() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [currentParaIdx, setCurrentParaIdx] = useState(-1);
  const [currentSentenceIdx, setCurrentSentenceIdx] = useState(-1);
  const [currentSpeedLevel, setCurrentSpeedLevel] = useState(0);
  const [mode, setMode] = useState(null);
  const utteranceRef = useRef(null);
  const queueRef = useRef([]);
  const queueIdxRef = useRef(0);
  const cancelledRef = useRef(false);

  const getVoice = useCallback((lang) => {
    const voices = window.speechSynthesis?.getVoices() || [];
    if (lang === 'zh-TW' || lang === 'zh') {
      return voices.find(v => v.lang === 'zh-TW') || voices.find(v => v.lang.startsWith('zh')) || null;
    }
    return voices.find(v => v.lang === 'en-US') || voices.find(v => v.lang.startsWith('en')) || null;
  }, []);

  const speakNext = useCallback(() => {
    if (cancelledRef.current) return;
    const queue = queueRef.current;
    const idx = queueIdxRef.current;
    if (idx >= queue.length) {
      setIsPlaying(false); setIsPaused(false);
      setCurrentParaIdx(-1); setCurrentSentenceIdx(-1);
      setCurrentSpeedLevel(0); setMode(null);
      return;
    }
    const item = queue[idx];
    if (item.paraIdx !== undefined && item.paraIdx >= 0) setCurrentParaIdx(item.paraIdx);
    if (item.sentenceIdx !== undefined && item.sentenceIdx >= 0) setCurrentSentenceIdx(item.sentenceIdx);
    if (item.speedLevel) setCurrentSpeedLevel(item.speedLevel);
    const utterance = new SpeechSynthesisUtterance(item.text);
    utterance.lang = item.lang || 'en-US';
    utterance.rate = item.rate || 0.9;
    utterance.pitch = 1;
    const voice = getVoice(item.lang);
    if (voice) utterance.voice = voice;
    utterance.onend = () => { queueIdxRef.current += 1; speakNext(); };
    utterance.onerror = (e) => {
      if (e.error === 'canceled' || e.error === 'interrupted') return;
      queueIdxRef.current += 1; speakNext();
    };
    utteranceRef.current = utterance;
    window.speechSynthesis.speak(utterance);
  }, [getVoice]);

  const buildQueue = useCallback((paragraphs, paragraphsZh, selectedSpeeds, grammarNotes) => {
    const queue = [];
    const sorted = [...selectedSpeeds].sort((a, b) => a - b);
    for (const speed of sorted) {
      const config = SPEED_CONFIG[speed];
      if (!config) continue;
      if (sorted.length > 1) {
        queue.push({ text: `第${speed}段，${config.label}`, rate: 0.9, lang: 'zh-TW', speedLevel: speed, paraIdx: -1, sentenceIdx: -1 });
      }
      paragraphs.forEach((para, pIdx) => {
        const enSentences = splitSentences(para);
        const zhPara = paragraphsZh ? paragraphsZh[pIdx] : '';
        const zhSentences = zhPara ? alignChineseSentences(zhPara, enSentences.length) : [];
        enSentences.forEach((sentence, sIdx) => {
          if (config.wordByWord) {
            const words = sentence.trim().split(/\s+/).map(w => w.replace(/^['"(]+|[.!?,;:'")\]]+$/g, '')).filter(Boolean);
            words.forEach(word => queue.push({ text: word, rate: 0.5, lang: 'en-US', paraIdx: pIdx, sentenceIdx: sIdx, speedLevel: speed }));
          } else {
            queue.push({ text: sentence, rate: config.rate, lang: 'en-US', paraIdx: pIdx, sentenceIdx: sIdx, speedLevel: speed });
          }
          if (config.withZh && zhSentences[sIdx]) {
            queue.push({ text: zhSentences[sIdx], rate: 0.9, lang: 'zh-TW', paraIdx: pIdx, sentenceIdx: sIdx, speedLevel: speed });
          }
        });
      });
      if (config.withNotes && grammarNotes) {
        if (grammarNotes.vocabulary?.length) {
          queue.push({ text: '以下是重點單字說明', rate: 0.9, lang: 'zh-TW', speedLevel: speed, paraIdx: -1, sentenceIdx: -1 });
          for (const v of grammarNotes.vocabulary) {
            queue.push({ text: v.word, rate: 0.7, lang: 'en-US', speedLevel: speed, paraIdx: -1, sentenceIdx: -1 });
            queue.push({ text: `${v.meaning}。${v.usage || ''}`, rate: 0.9, lang: 'zh-TW', speedLevel: speed, paraIdx: -1, sentenceIdx: -1 });
            if (v.example) {
              queue.push({ text: v.example, rate: 0.8, lang: 'en-US', speedLevel: speed, paraIdx: -1, sentenceIdx: -1 });
              if (v.exampleZh) queue.push({ text: v.exampleZh, rate: 0.9, lang: 'zh-TW', speedLevel: speed, paraIdx: -1, sentenceIdx: -1 });
            }
          }
        }
        if (grammarNotes.phrases?.length) {
          queue.push({ text: '以下是重點片語說明', rate: 0.9, lang: 'zh-TW', speedLevel: speed, paraIdx: -1, sentenceIdx: -1 });
          for (const p of grammarNotes.phrases) {
            queue.push({ text: p.phrase, rate: 0.7, lang: 'en-US', speedLevel: speed, paraIdx: -1, sentenceIdx: -1 });
            queue.push({ text: p.meaning, rate: 0.9, lang: 'zh-TW', speedLevel: speed, paraIdx: -1, sentenceIdx: -1 });
            if (p.example) {
              queue.push({ text: p.example, rate: 0.8, lang: 'en-US', speedLevel: speed, paraIdx: -1, sentenceIdx: -1 });
              if (p.exampleZh) queue.push({ text: p.exampleZh, rate: 0.9, lang: 'zh-TW', speedLevel: speed, paraIdx: -1, sentenceIdx: -1 });
            }
          }
        }
        if (grammarNotes.grammar?.length) {
          queue.push({ text: '以下是文法重點說明', rate: 0.9, lang: 'zh-TW', speedLevel: speed, paraIdx: -1, sentenceIdx: -1 });
          for (const g of grammarNotes.grammar) {
            queue.push({ text: `${g.point}。${g.explanation}`, rate: 0.9, lang: 'zh-TW', speedLevel: speed, paraIdx: -1, sentenceIdx: -1 });
            if (g.example) {
              queue.push({ text: g.example, rate: 0.8, lang: 'en-US', speedLevel: speed, paraIdx: -1, sentenceIdx: -1 });
              if (g.exampleZh) queue.push({ text: g.exampleZh, rate: 0.9, lang: 'zh-TW', speedLevel: speed, paraIdx: -1, sentenceIdx: -1 });
            }
          }
        }
      }
    }
    return queue;
  }, []);

  const playMultiSpeed = useCallback((paragraphs, paragraphsZh, selectedSpeeds, grammarNotes) => {
    if (!window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    cancelledRef.current = false;
    const queue = buildQueue(paragraphs, paragraphsZh, selectedSpeeds, grammarNotes);
    queueRef.current = queue; queueIdxRef.current = 0;
    setIsPlaying(true); setIsPaused(false); setMode('multi-speed');
    speakNext();
  }, [buildQueue, speakNext]);

  const playFullArticle = useCallback((paragraphs) => {
    if (!window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    cancelledRef.current = false;
    const queue = [];
    paragraphs.forEach((para, pIdx) => {
      splitSentences(para).forEach((sentence, sIdx) => {
        queue.push({ text: sentence, rate: 0.9, lang: 'en-US', paraIdx: pIdx, sentenceIdx: sIdx });
      });
    });
    queueRef.current = queue; queueIdxRef.current = 0;
    setIsPlaying(true); setIsPaused(false); setMode('full');
    speakNext();
  }, [speakNext]);

  const playParagraph = useCallback((text, paraIdx) => {
    if (!window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    cancelledRef.current = false;
    const queue = splitSentences(text).map((sentence, sIdx) => ({ text: sentence, rate: 0.9, lang: 'en-US', paraIdx, sentenceIdx: sIdx }));
    queueRef.current = queue; queueIdxRef.current = 0;
    setIsPlaying(true); setIsPaused(false); setMode('paragraph');
    speakNext();
  }, [speakNext]);

  const pause = useCallback(() => { if (window.speechSynthesis?.speaking) { window.speechSynthesis.pause(); setIsPaused(true); } }, []);
  const resume = useCallback(() => { if (window.speechSynthesis?.paused) { window.speechSynthesis.resume(); setIsPaused(false); } }, []);
  const stop = useCallback(() => {
    cancelledRef.current = true;
    window.speechSynthesis?.cancel();
    queueRef.current = []; queueIdxRef.current = 0;
    setIsPlaying(false); setIsPaused(false);
    setCurrentParaIdx(-1); setCurrentSentenceIdx(-1);
    setCurrentSpeedLevel(0); setMode(null);
  }, []);

  useEffect(() => { return () => { cancelledRef.current = true; window.speechSynthesis?.cancel(); }; }, []);

  return { isPlaying, isPaused, currentParaIdx, currentSentenceIdx, currentSpeedLevel, mode, playMultiSpeed, playFullArticle, playParagraph, pause, resume, stop };
}

// ---- Sentence-highlighted paragraph ----
function HighlightedParagraph({ text, paraIdx, currentParaIdx, currentSentenceIdx, highlightContent }) {
  const isActivePara = paraIdx === currentParaIdx;
  const sentences = splitSentences(text);
  if (!isActivePara || sentences.length <= 1) return <>{highlightContent(text)}</>;
  return (
    <>
      {sentences.map((sentence, sIdx) => (
        <span key={sIdx} className={sIdx === currentSentenceIdx ? 'sentence-active' : ''}>
          {highlightContent(sentence + ' ')}
        </span>
      ))}
    </>
  );
}

// ---- Speed selector ----
function SpeedSelector({ selectedSpeeds, onToggle, hasZhContent }) {
  return (
    <div className="speed-selector">
      <div className="speed-selector-title">聽力練習語速選擇（可複選）</div>
      <div className="speed-options">
        {Object.entries(SPEED_CONFIG).map(([key, config]) => {
          const speed = Number(key);
          const checked = selectedSpeeds.includes(speed);
          const needsZh = config.withZh && !hasZhContent;
          return (
            <label key={speed} className={`speed-option ${checked ? 'checked' : ''} ${needsZh ? 'disabled' : ''}`}>
              <input type="checkbox" checked={checked} onChange={() => !needsZh && onToggle(speed)} disabled={needsZh} />
              <span className="speed-number">{speed}</span>
              <span className="speed-info">
                <span className="speed-label">{config.label}</span>
                <span className="speed-desc">{config.desc}</span>
              </span>
            </label>
          );
        })}
      </div>
      {!hasZhContent && <div className="speed-no-zh-hint">部分語速需要中文翻譯資料，目前此篇尚無翻譯</div>}
    </div>
  );
}

// ---- Story List ----
function StoryList({ onSelect }) {
  const { data, loading, error } = useApi('/reading/list');

  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div className="loading">Error: {error}</div>;

  const stories = data?.stories || [];

  const seriesMap = {};
  for (const s of stories) {
    if (!seriesMap[s.series]) seriesMap[s.series] = { name: s.series_name, items: [] };
    seriesMap[s.series].items.push(s);
  }

  return (
    <div className="reading-page">
      <h2 className="reading-list-title">閱讀練習</h2>
      {Object.values(seriesMap).map(({ name, items }) => (
        <div key={name} className="series-section">
          <div className="series-section-title">{name}</div>
          <div className="story-list">
            {items.map(story => (
              <button key={story.id} className={`story-list-item ${story.completed ? 'completed' : ''}`} onClick={() => onSelect(story.id)}>
                <span className="story-list-ep">Ep.{story.episode}</span>
                <span className="story-list-name">{story.title}</span>
                {story.completed ? <span className="story-list-done">✓</span> : <span className="story-list-arrow">›</span>}
              </button>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

// ---- Story View ----
function StoryView({ storyId, onBack }) {
  const { data, loading, error } = useApi(`/reading/story/${storyId}`);
  const [showMeanings, setShowMeanings] = useState({});
  const [quizMode, setQuizMode] = useState(false);
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [selectedSpeeds, setSelectedSpeeds] = useState([3]);
  const [showSpeedPanel, setShowSpeedPanel] = useState(false);
  const tts = useArticleTTS();

  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div className="loading">Error: {error}</div>;
  if (!data?.story) return <div className="loading">Story not found.</div>;

  const { story } = data;
  const paragraphs = story.content.split('\n').filter(p => p.trim());
  const paragraphsZh = story.content_zh ? story.content_zh.split('\n').filter(p => p.trim()) : null;
  const hasZhContent = !!paragraphsZh && paragraphsZh.length > 0;

  function toggleMeaning(word) { setShowMeanings(prev => ({ ...prev, [word]: !prev[word] })); }
  function toggleSpeed(speed) {
    setSelectedSpeeds(prev => {
      if (prev.includes(speed)) { const next = prev.filter(s => s !== speed); return next.length > 0 ? next : prev; }
      return [...prev, speed];
    });
  }
  function startListening() { if (selectedSpeeds.length === 0) return; tts.playMultiSpeed(paragraphs, paragraphsZh, selectedSpeeds, story.grammar_notes); }

  function highlightContent(content) {
    if (!story.vocabulary?.length) return content;
    const regex = new RegExp(`\\b(${story.vocabulary.join('|')})\\b`, 'gi');
    const parts = content.split(regex);
    return parts.map((part, i) => {
      const lower = part.toLowerCase();
      const isVocab = story.vocabulary.some(v => v.toLowerCase() === lower);
      if (isVocab) {
        return (
          <span key={i} className="vocab-highlight" onClick={() => toggleMeaning(lower)}>
            {part}
            {showMeanings[lower] && story.vocab_meanings[lower] && <span className="vocab-tooltip">{story.vocab_meanings[lower]}</span>}
          </span>
        );
      }
      return part;
    });
  }

  function handleAnswer(qIdx, optIdx) { if (submitted) return; setAnswers(prev => ({ ...prev, [qIdx]: optIdx })); }

  async function handleSubmitQuiz() {
    setSubmitted(true);
    const correct = story.questions.filter((q, i) => answers[i] === q.answer).length;
    const score = Math.round((correct / story.questions.length) * 100);
    await postApi('/reading/complete', { storyId: story.id, quizScore: score });
  }

  function handleBack() { tts.stop(); onBack(); }

  const quizScore = submitted ? story.questions.filter((q, i) => answers[i] === q.answer).length : 0;

  return (
    <div className="reading-page">
      <button className="back-to-list-btn" onClick={handleBack}>← 返回列表</button>

      <div className="story-header">
        <div className="series-badge">{story.series_name} - Episode {story.episode}</div>
        <h2>{story.title}</h2>
      </div>

      <div className="tts-article-controls">
        {!tts.isPlaying ? (
          <>
            <button className="tts-article-btn" onClick={() => tts.playFullArticle(paragraphs)}>
              <span className="tts-icon">&#9654;</span> 朗讀全文
            </button>
            <button className="tts-article-btn tts-listening-btn" onClick={() => setShowSpeedPanel(prev => !prev)}>
              <span className="tts-icon">&#127911;</span> 聽力練習
            </button>
          </>
        ) : tts.mode === 'multi-speed' ? (
          <div className="tts-playback-group">
            <span className="tts-now-playing">&#127911; 聽力練習中 — 第{tts.currentSpeedLevel}段</span>
          </div>
        ) : tts.mode === 'full' ? (
          <div className="tts-playback-group"><span className="tts-now-playing">&#9835; 朗讀中...</span></div>
        ) : null}
      </div>

      {showSpeedPanel && !tts.isPlaying && (
        <div className="speed-panel">
          <SpeedSelector selectedSpeeds={selectedSpeeds} onToggle={toggleSpeed} hasZhContent={hasZhContent} />
          <button className="start-listening-btn" onClick={startListening} disabled={selectedSpeeds.length === 0}>
            開始聽力練習（已選 {selectedSpeeds.sort((a, b) => a - b).join(', ')} 段）
          </button>
        </div>
      )}

      <div className="story-card">
        <div className="story-content">
          {paragraphs.map((para, i) => (
            <div key={i} className={`story-para-row ${i === tts.currentParaIdx ? 'para-active' : ''}`}>
              <p className="story-para-text">
                <HighlightedParagraph text={para} paraIdx={i} currentParaIdx={tts.currentParaIdx} currentSentenceIdx={tts.currentSentenceIdx} highlightContent={highlightContent} />
              </p>
              <button
                className={`tts-para-btn ${tts.isPlaying && tts.mode === 'paragraph' && tts.currentParaIdx === i ? 'playing' : ''}`}
                onClick={() => { if (tts.isPlaying && tts.mode === 'paragraph' && tts.currentParaIdx === i) { tts.stop(); } else { tts.playParagraph(para, i); } }}
              >
                {tts.isPlaying && tts.mode === 'paragraph' && tts.currentParaIdx === i ? '■' : '🔊'}
              </button>
            </div>
          ))}
        </div>
        <div className="vocab-hint">點擊藍色單字查看中文意思 | 點擊 🔊 朗讀段落</div>
      </div>

      {!quizMode ? (
        <button className="quiz-start-btn" onClick={() => setQuizMode(true)}>Reading Comprehension Quiz</button>
      ) : (
        <div className="quiz-section">
          <h3>Comprehension Questions</h3>
          {story.questions.map((q, qIdx) => (
            <div key={qIdx} className="reading-question">
              <p className="q-text">{qIdx + 1}. {q.question}</p>
              <div className="q-options">
                {q.options.map((opt, oIdx) => {
                  let cls = 'q-option';
                  if (submitted) { if (oIdx === q.answer) cls += ' correct'; else if (answers[qIdx] === oIdx) cls += ' wrong'; }
                  else if (answers[qIdx] === oIdx) cls += ' selected';
                  return <button key={oIdx} className={cls} onClick={() => handleAnswer(qIdx, oIdx)}>{opt}</button>;
                })}
              </div>
            </div>
          ))}
          {!submitted ? (
            <button className="quiz-submit-btn" onClick={handleSubmitQuiz} disabled={Object.keys(answers).length < story.questions.length}>Submit</button>
          ) : (
            <div className="quiz-result">
              <p>Score: {quizScore}/{story.questions.length} correct</p>
              <button className="next-story-btn" onClick={handleBack}>← 返回列表</button>
            </div>
          )}
        </div>
      )}

      {tts.isPlaying && (
        <div className="tts-floating-bar">
          <div className="tts-bar-label">
            {tts.mode === 'multi-speed' ? `🎧 聽力練習 — 第${tts.currentSpeedLevel}段 ${SPEED_CONFIG[tts.currentSpeedLevel]?.label || ''}` : tts.mode === 'full' ? '♫ 全文朗讀中' : '🔊 段落朗讀中'}
          </div>
          <div className="tts-bar-controls">
            {tts.isPaused ? <button className="tts-bar-btn" onClick={tts.resume}>&#9654;</button> : <button className="tts-bar-btn" onClick={tts.pause}>&#10074;&#10074;</button>}
            <button className="tts-bar-btn tts-bar-stop" onClick={tts.stop}>&#9632;</button>
          </div>
        </div>
      )}
    </div>
  );
}

// ---- Main ----
function ReadingPage() {
  const [selectedStoryId, setSelectedStoryId] = useState(null);

  if (selectedStoryId) {
    return <StoryView storyId={selectedStoryId} onBack={() => setSelectedStoryId(null)} />;
  }
  return <StoryList onSelect={setSelectedStoryId} />;
}

export default ReadingPage;
