import { useState, useEffect, useRef, useCallback } from 'react';
import { postApi, useApi } from '../hooks/useApi';
import './GradedReadingPage.css';

// ---- Abbreviation-safe sentence splitting (shared with ReadingPage) ----
const ABBREVIATIONS = ['Mr', 'Mrs', 'Ms', 'Dr', 'Prof', 'Jr', 'Sr', 'St', 'Inc', 'Corp', 'Ltd', 'Ave', 'Blvd', 'etc', 'vs', 'Vol', 'Gen', 'Sgt', 'Capt'];
const PH = '\uE000';

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

const GRADE_LABELS = {
  1: '1st Grade', 2: '2nd Grade', 3: '3rd Grade',
  4: '4th Grade', 5: '5th Grade', 6: '6th Grade',
  7: '7th Grade', 8: '8th Grade', 9: '9th Grade',
};

const GRADE_DESCRIPTIONS = {
  1: '基礎詞彙、簡單句型', 2: '過去式、形容詞', 3: '複合句、描述性語言',
  4: '學術詞彙、因果關係', 5: '被動語態、現在完成式', 6: '抽象概念、條件句',
  7: '分析性寫作、複雜句型', 8: '議論文、進階被動語態', 9: '近成人程度、學術英文',
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
    utterance.onerror = (e) => { if (e.error === 'canceled' || e.error === 'interrupted') return; queueIdxRef.current += 1; speakNext(); };
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
            words.forEach(word => {
              queue.push({ text: word, rate: 0.5, lang: 'en-US', paraIdx: pIdx, sentenceIdx: sIdx, speedLevel: speed });
            });
          } else {
            queue.push({ text: sentence, rate: config.rate, lang: 'en-US', paraIdx: pIdx, sentenceIdx: sIdx, speedLevel: speed });
          }
          if (config.withZh && zhSentences[sIdx]) {
            queue.push({ text: zhSentences[sIdx], rate: 0.9, lang: 'zh-TW', paraIdx: pIdx, sentenceIdx: sIdx, speedLevel: speed });
          }
        });
      });
      // Grammar notes for speed 1
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
    queueRef.current = queue;
    queueIdxRef.current = 0;
    setIsPlaying(true); setIsPaused(false); setMode('multi-speed');
    speakNext();
  }, [buildQueue, speakNext]);

  const playFullArticle = useCallback((paragraphs) => {
    if (!window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    cancelledRef.current = false;
    const queue = [];
    paragraphs.forEach((para, pIdx) => {
      const sentences = splitSentences(para);
      sentences.forEach((sentence, sIdx) => {
        queue.push({ text: sentence, rate: 0.9, lang: 'en-US', paraIdx: pIdx, sentenceIdx: sIdx });
      });
    });
    queueRef.current = queue;
    queueIdxRef.current = 0;
    setIsPlaying(true); setIsPaused(false); setMode('full');
    speakNext();
  }, [speakNext]);

  const playParagraph = useCallback((text, paraIdx) => {
    if (!window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    cancelledRef.current = false;
    const sentences = splitSentences(text);
    const queue = sentences.map((sentence, sIdx) => ({ text: sentence, rate: 0.9, lang: 'en-US', paraIdx, sentenceIdx: sIdx }));
    queueRef.current = queue;
    queueIdxRef.current = 0;
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

// ---- Shuffle utility ----
function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// ---- Sub-components ----

function HighlightedParagraph({ text, paraIdx, currentParaIdx, currentSentenceIdx, vocabWords, onClickWord, showMeanings, vocabMeaningsMap }) {
  const isActivePara = paraIdx === currentParaIdx;
  const sentences = splitSentences(text);

  function highlightContent(content) {
    if (!vocabWords?.length) return content;
    const regex = new RegExp(`\\b(${vocabWords.map(w => w.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|')})\\b`, 'gi');
    const parts = content.split(regex);
    return parts.map((part, i) => {
      const lower = part.toLowerCase();
      const isVocab = vocabWords.some(v => v.toLowerCase() === lower);
      if (isVocab) {
        return (
          <span key={i} className="gr-vocab-highlight" onClick={() => onClickWord(lower)}>
            {part}
            {showMeanings[lower] && vocabMeaningsMap[lower] && (
              <span className="gr-vocab-tooltip">{vocabMeaningsMap[lower]}</span>
            )}
          </span>
        );
      }
      return part;
    });
  }

  if (!isActivePara || sentences.length <= 1) {
    return <>{highlightContent(text)}</>;
  }
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

function SpeedSelector({ selectedSpeeds, onToggle, hasZhContent }) {
  return (
    <div className="gr-speed-selector">
      <div className="gr-speed-title">聽力練習語速選擇（可複選）</div>
      <div className="gr-speed-options">
        {Object.entries(SPEED_CONFIG).map(([key, config]) => {
          const speed = Number(key);
          const checked = selectedSpeeds.includes(speed);
          const needsZh = config.withZh && !hasZhContent;
          return (
            <label key={speed} className={`gr-speed-option ${checked ? 'checked' : ''} ${needsZh ? 'disabled' : ''}`}>
              <input type="checkbox" checked={checked} onChange={() => !needsZh && onToggle(speed)} disabled={needsZh} />
              <span className="gr-speed-number">{speed}</span>
              <span className="gr-speed-info">
                <span className="gr-speed-label">{config.label}</span>
                <span className="gr-speed-desc">{config.desc}</span>
              </span>
            </label>
          );
        })}
      </div>
    </div>
  );
}

// ---- Vocabulary Quiz ----
function VocabTab({ vocabulary }) {
  const [quizMode, setQuizMode] = useState(false);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selected, setSelected] = useState(null);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);
  const [quizItems, setQuizItems] = useState([]);

  function startQuiz() {
    const items = shuffle(vocabulary).map(v => {
      const wrongOptions = shuffle(vocabulary.filter(w => w.word !== v.word)).slice(0, 3).map(w => w.meaning);
      const options = shuffle([v.meaning, ...wrongOptions]);
      return { ...v, options, correctIdx: options.indexOf(v.meaning) };
    });
    setQuizItems(items);
    setCurrentIdx(0);
    setSelected(null);
    setScore(0);
    setFinished(false);
    setQuizMode(true);
  }

  function handleSelect(idx) {
    if (selected !== null) return;
    setSelected(idx);
    if (idx === quizItems[currentIdx].correctIdx) setScore(s => s + 1);
    setTimeout(() => {
      if (currentIdx + 1 < quizItems.length) {
        setCurrentIdx(i => i + 1);
        setSelected(null);
      } else {
        setFinished(true);
      }
    }, 1000);
  }

  if (!quizMode) {
    return (
      <div className="gr-vocab-tab">
        <div className="gr-vocab-list">
          {vocabulary.map((v, i) => (
            <div key={i} className="gr-vocab-card">
              <div className="gr-vocab-word">{v.word} <span className="gr-vocab-pos">{v.pos}</span></div>
              <div className="gr-vocab-meaning">{v.meaning}</div>
              <div className="gr-vocab-example">{v.example}</div>
              <div className="gr-vocab-example-zh">{v.example_zh}</div>
            </div>
          ))}
        </div>
        {vocabulary.length >= 4 && (
          <button className="gr-quiz-btn" onClick={startQuiz}>開始單字測驗</button>
        )}
      </div>
    );
  }

  if (finished) {
    return (
      <div className="gr-vocab-tab">
        <div className="gr-quiz-result">
          <h3>測驗結果</h3>
          <p className="gr-quiz-score">{score} / {quizItems.length}</p>
          <button className="gr-quiz-btn" onClick={startQuiz}>再測一次</button>
          <button className="gr-quiz-btn secondary" onClick={() => setQuizMode(false)}>返回單字列表</button>
        </div>
      </div>
    );
  }

  const item = quizItems[currentIdx];
  return (
    <div className="gr-vocab-tab">
      <div className="gr-quiz-progress">{currentIdx + 1} / {quizItems.length}</div>
      <div className="gr-quiz-question">
        <div className="gr-quiz-word">{item.word}</div>
        <div className="gr-quiz-options">
          {item.options.map((opt, i) => {
            let cls = 'gr-quiz-option';
            if (selected !== null) {
              if (i === item.correctIdx) cls += ' correct';
              else if (i === selected) cls += ' wrong';
            }
            return <button key={i} className={cls} onClick={() => handleSelect(i)}>{opt}</button>;
          })}
        </div>
      </div>
    </div>
  );
}

// ---- Phrases Quiz ----
function PhrasesTab({ phrases }) {
  const [quizMode, setQuizMode] = useState(false);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selected, setSelected] = useState(null);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);
  const [quizItems, setQuizItems] = useState([]);

  function startQuiz() {
    const items = shuffle(phrases).map(p => {
      const wrongOptions = shuffle(phrases.filter(w => w.phrase !== p.phrase)).slice(0, 3).map(w => w.meaning);
      const options = shuffle([p.meaning, ...wrongOptions]);
      return { ...p, options, correctIdx: options.indexOf(p.meaning) };
    });
    setQuizItems(items);
    setCurrentIdx(0);
    setSelected(null);
    setScore(0);
    setFinished(false);
    setQuizMode(true);
  }

  function handleSelect(idx) {
    if (selected !== null) return;
    setSelected(idx);
    if (idx === quizItems[currentIdx].correctIdx) setScore(s => s + 1);
    setTimeout(() => {
      if (currentIdx + 1 < quizItems.length) {
        setCurrentIdx(i => i + 1);
        setSelected(null);
      } else {
        setFinished(true);
      }
    }, 1000);
  }

  if (!quizMode) {
    return (
      <div className="gr-phrases-tab">
        <div className="gr-phrase-list">
          {phrases.map((p, i) => (
            <div key={i} className="gr-phrase-card">
              <div className="gr-phrase-text">{p.phrase}</div>
              <div className="gr-phrase-meaning">{p.meaning}</div>
              <div className="gr-phrase-example">{p.example}</div>
              <div className="gr-phrase-example-zh">{p.example_zh}</div>
            </div>
          ))}
        </div>
        {phrases.length >= 4 && (
          <button className="gr-quiz-btn" onClick={startQuiz}>開始片語測驗</button>
        )}
      </div>
    );
  }

  if (finished) {
    return (
      <div className="gr-phrases-tab">
        <div className="gr-quiz-result">
          <h3>測驗結果</h3>
          <p className="gr-quiz-score">{score} / {quizItems.length}</p>
          <button className="gr-quiz-btn" onClick={startQuiz}>再測一次</button>
          <button className="gr-quiz-btn secondary" onClick={() => setQuizMode(false)}>返回片語列表</button>
        </div>
      </div>
    );
  }

  const item = quizItems[currentIdx];
  return (
    <div className="gr-phrases-tab">
      <div className="gr-quiz-progress">{currentIdx + 1} / {quizItems.length}</div>
      <div className="gr-quiz-question">
        <div className="gr-quiz-word">{item.phrase}</div>
        <div className="gr-quiz-options">
          {item.options.map((opt, i) => {
            let cls = 'gr-quiz-option';
            if (selected !== null) {
              if (i === item.correctIdx) cls += ' correct';
              else if (i === selected) cls += ' wrong';
            }
            return <button key={i} className={cls} onClick={() => handleSelect(i)}>{opt}</button>;
          })}
        </div>
      </div>
    </div>
  );
}

// ---- Grammar Tab ----
function GrammarTab({ grammar }) {
  return (
    <div className="gr-grammar-tab">
      {grammar.map((g, i) => (
        <div key={i} className="gr-grammar-card">
          <div className="gr-grammar-point">{g.point}</div>
          <div className="gr-grammar-explanation">{g.explanation}</div>
          <div className="gr-grammar-examples">
            {g.examples.map((ex, j) => (
              <div key={j} className="gr-grammar-example">
                <div className="gr-grammar-en">{ex.en}</div>
                <div className="gr-grammar-zh">{ex.zh}</div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

// ---- Reading Tab (article + comprehension quiz) ----
function ReadingTab({ article, tts }) {
  const [showMeanings, setShowMeanings] = useState({});
  const [quizMode, setQuizMode] = useState(false);
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);

  const paragraphs = article.content.split('\n').filter(p => p.trim());
  const paragraphsZh = article.content_zh ? article.content_zh.split('\n').filter(p => p.trim()) : null;

  const vocabWords = (article.vocabulary || []).map(v => v.word);
  const vocabMeaningsMap = {};
  for (const v of (article.vocabulary || [])) {
    vocabMeaningsMap[v.word.toLowerCase()] = v.meaning;
  }

  function toggleMeaning(word) {
    setShowMeanings(prev => ({ ...prev, [word]: !prev[word] }));
  }

  function handleAnswer(qIdx, optIdx) {
    if (submitted) return;
    setAnswers(prev => ({ ...prev, [qIdx]: optIdx }));
  }

  async function handleSubmitQuiz() {
    setSubmitted(true);
    const correct = article.questions.filter((q, i) => answers[i] === q.answer).length;
    const score = Math.round((correct / article.questions.length) * 100);
    await postApi('/graded-reading/complete', { articleId: article.id, quizScore: score });
  }

  const quizScore = submitted ? article.questions.filter((q, i) => answers[i] === q.answer).length : 0;

  return (
    <div className="gr-reading-tab">
      <div className="gr-story-card">
        {paragraphs.map((para, i) => (
          <div key={i} className={`gr-para-row ${i === tts.currentParaIdx ? 'para-active' : ''}`}>
            <p className="gr-para-text">
              <HighlightedParagraph
                text={para} paraIdx={i}
                currentParaIdx={tts.currentParaIdx}
                currentSentenceIdx={tts.currentSentenceIdx}
                vocabWords={vocabWords}
                onClickWord={toggleMeaning}
                showMeanings={showMeanings}
                vocabMeaningsMap={vocabMeaningsMap}
              />
            </p>
            {paragraphsZh && paragraphsZh[i] && (
              <p className="gr-para-zh">{paragraphsZh[i]}</p>
            )}
            <button
              className={`gr-tts-para-btn ${tts.isPlaying && tts.mode === 'paragraph' && tts.currentParaIdx === i ? 'playing' : ''}`}
              onClick={() => {
                if (tts.isPlaying && tts.mode === 'paragraph' && tts.currentParaIdx === i) tts.stop();
                else tts.playParagraph(para, i);
              }}
            >
              {tts.isPlaying && tts.mode === 'paragraph' && tts.currentParaIdx === i ? '■' : '\uD83D\uDD0A'}
            </button>
          </div>
        ))}
      </div>
      <div className="gr-vocab-hint">點擊藍色單字查看中文意思</div>

      {article.questions?.length > 0 && (
        <>
          {!quizMode ? (
            <button className="gr-quiz-btn" onClick={() => setQuizMode(true)}>閱讀理解測驗</button>
          ) : (
            <div className="gr-comprehension">
              <h3>Comprehension Questions</h3>
              {article.questions.map((q, qIdx) => (
                <div key={qIdx} className="gr-cq">
                  <p className="gr-cq-text">{qIdx + 1}. {q.question}</p>
                  <div className="gr-cq-options">
                    {q.options.map((opt, oIdx) => {
                      let cls = 'gr-cq-option';
                      if (submitted) {
                        if (oIdx === q.answer) cls += ' correct';
                        else if (answers[qIdx] === oIdx) cls += ' wrong';
                      } else if (answers[qIdx] === oIdx) cls += ' selected';
                      return <button key={oIdx} className={cls} onClick={() => handleAnswer(qIdx, oIdx)}>{opt}</button>;
                    })}
                  </div>
                </div>
              ))}
              {!submitted ? (
                <button className="gr-quiz-btn" onClick={handleSubmitQuiz}
                  disabled={Object.keys(answers).length < article.questions.length}>Submit</button>
              ) : (
                <div className="gr-quiz-result">
                  <p>Score: {quizScore}/{article.questions.length} correct</p>
                </div>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
}

// ---- Listening Tab ----
function ListeningTab({ article, tts }) {
  const [selectedSpeeds, setSelectedSpeeds] = useState([3]);
  const [showSpeedPanel, setShowSpeedPanel] = useState(true);

  const paragraphs = article.content.split('\n').filter(p => p.trim());
  const paragraphsZh = article.content_zh ? article.content_zh.split('\n').filter(p => p.trim()) : null;
  const hasZhContent = !!paragraphsZh && paragraphsZh.length > 0;

  // Build grammar notes from article data for speed 1
  const grammarNotes = {
    vocabulary: (article.vocabulary || []).map(v => ({ word: v.word, meaning: v.meaning, usage: '', example: v.example, exampleZh: v.example_zh })),
    phrases: (article.phrases || []).map(p => ({ phrase: p.phrase, meaning: p.meaning, example: p.example, exampleZh: p.example_zh })),
    grammar: (article.grammar || []).map(g => ({ point: g.point, explanation: g.explanation, example: g.examples?.[0]?.en, exampleZh: g.examples?.[0]?.zh })),
  };

  function toggleSpeed(speed) {
    setSelectedSpeeds(prev => {
      if (prev.includes(speed)) {
        const next = prev.filter(s => s !== speed);
        return next.length > 0 ? next : prev;
      }
      return [...prev, speed];
    });
  }

  function startListening() {
    if (selectedSpeeds.length === 0) return;
    tts.playMultiSpeed(paragraphs, paragraphsZh, selectedSpeeds, grammarNotes);
    setShowSpeedPanel(false);
  }

  return (
    <div className="gr-listening-tab">
      <div className="gr-listen-controls">
        {!tts.isPlaying ? (
          <>
            <button className="gr-listen-btn" onClick={() => tts.playFullArticle(paragraphs)}>
              &#9654; 朗讀全文
            </button>
            <button className="gr-listen-btn accent" onClick={() => setShowSpeedPanel(p => !p)}>
              &#127911; 聽力練習
            </button>
          </>
        ) : tts.mode === 'multi-speed' ? (
          <span className="gr-now-playing">&#127911; 聽力練習中 — 第{tts.currentSpeedLevel}段</span>
        ) : (
          <span className="gr-now-playing">&#9835; 朗讀中...</span>
        )}
      </div>

      {showSpeedPanel && !tts.isPlaying && (
        <div className="gr-speed-panel">
          <SpeedSelector selectedSpeeds={selectedSpeeds} onToggle={toggleSpeed} hasZhContent={hasZhContent} />
          <button className="gr-quiz-btn" onClick={startListening} disabled={selectedSpeeds.length === 0}>
            開始聽力練習（已選 {selectedSpeeds.sort((a, b) => a - b).join(', ')} 段）
          </button>
        </div>
      )}

      {/* Show article text during playback */}
      {tts.isPlaying && (
        <div className="gr-listen-article">
          {paragraphs.map((para, i) => (
            <p key={i} className={`gr-listen-para ${i === tts.currentParaIdx ? 'para-active' : ''}`}>
              {splitSentences(para).map((sentence, sIdx) => (
                <span key={sIdx} className={i === tts.currentParaIdx && sIdx === tts.currentSentenceIdx ? 'sentence-active' : ''}>
                  {sentence + ' '}
                </span>
              ))}
            </p>
          ))}
        </div>
      )}
    </div>
  );
}

// =============== MAIN PAGE ===============
export default function GradedReadingPage() {
  const [view, setView] = useState('grades'); // 'grades' | 'articles' | 'detail'
  const [selectedGrade, setSelectedGrade] = useState(null);
  const [articles, setArticles] = useState([]);
  const [articleProgress, setArticleProgress] = useState({});
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [activeTab, setActiveTab] = useState('reading');
  const [loadingArticles, setLoadingArticles] = useState(false);

  const { data: progressData, refetch: refetchProgress } = useApi('/graded-reading/progress');
  const tts = useArticleTTS();

  async function loadGrade(grade) {
    setLoadingArticles(true);
    try {
      const res = await fetch(`/api/graded-reading/grade/${grade}`);
      const json = await res.json();
      setArticles(json.articles || []);
      setArticleProgress(json.progress || {});
      setSelectedGrade(grade);
      setView('articles');
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingArticles(false);
    }
  }

  async function loadArticle(article) {
    tts.stop();
    setSelectedArticle(article);
    setActiveTab('reading');
    setView('detail');
  }

  function goBack() {
    tts.stop();
    if (view === 'detail') {
      setView('articles');
      setSelectedArticle(null);
      // Refresh progress
      if (selectedGrade) loadGrade(selectedGrade);
    } else if (view === 'articles') {
      setView('grades');
      setSelectedGrade(null);
      refetchProgress();
    }
  }

  const byGrade = {};
  if (progressData?.byGrade) {
    for (const row of progressData.byGrade) {
      byGrade[row.grade] = row;
    }
  }

  // ---- Grade Selection View ----
  if (view === 'grades') {
    return (
      <div className="gr-page">
        <h2 className="gr-title">分級閱讀</h2>
        <p className="gr-subtitle">參考美國 1-9 年級讀物，每級 4 篇文章</p>
        <div className="gr-grade-grid">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(grade => {
            const info = byGrade[grade] || { total: 4, done: 0 };
            return (
              <button key={grade} className="gr-grade-card" onClick={() => loadGrade(grade)}>
                <div className="gr-grade-number">G{grade}</div>
                <div className="gr-grade-label">{GRADE_LABELS[grade]}</div>
                <div className="gr-grade-desc">{GRADE_DESCRIPTIONS[grade]}</div>
                <div className="gr-grade-progress">
                  <div className="gr-progress-bar">
                    <div className="gr-progress-fill" style={{ width: `${(info.done / info.total) * 100}%` }} />
                  </div>
                  <span className="gr-progress-text">{info.done}/{info.total}</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  // ---- Article List View ----
  if (view === 'articles') {
    return (
      <div className="gr-page">
        <button className="gr-back-btn" onClick={goBack}>&larr; 返回年級選擇</button>
        <h2 className="gr-title">{GRADE_LABELS[selectedGrade]}</h2>
        <p className="gr-subtitle">{GRADE_DESCRIPTIONS[selectedGrade]}</p>
        {loadingArticles ? (
          <div className="loading">Loading...</div>
        ) : (
          <div className="gr-article-grid">
            {articles.map(article => {
              const prog = articleProgress[article.id];
              return (
                <button key={article.id} className={`gr-article-card ${prog?.completed ? 'completed' : ''}`} onClick={() => loadArticle(article)}>
                  <div className="gr-article-topic">{article.topic}</div>
                  <div className="gr-article-title">{article.title}</div>
                  <div className="gr-article-meta">
                    <span>{article.vocabulary?.length || 0} 單字</span>
                    <span>{article.phrases?.length || 0} 片語</span>
                    <span>{article.grammar?.length || 0} 文法</span>
                  </div>
                  {prog?.completed && <div className="gr-article-done">&#10003; 已完成 ({prog.quiz_score}分)</div>}
                  {prog?.exercises_done && (
                    <div className="gr-article-exercises">
                      {prog.exercises_done.vocabulary && <span className="gr-ex-done">單字</span>}
                      {prog.exercises_done.phrases && <span className="gr-ex-done">片語</span>}
                      {prog.exercises_done.grammar && <span className="gr-ex-done">文法</span>}
                      {prog.exercises_done.listening && <span className="gr-ex-done">聽力</span>}
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        )}
      </div>
    );
  }

  // ---- Article Detail View ----
  const TABS = [
    { key: 'reading', label: '閱讀' },
    { key: 'vocabulary', label: '單字' },
    { key: 'phrases', label: '片語' },
    { key: 'grammar', label: '文法' },
    { key: 'listening', label: '聽力' },
  ];

  return (
    <div className="gr-page">
      <button className="gr-back-btn" onClick={goBack}>&larr; 返回文章列表</button>
      <div className="gr-detail-header">
        <span className="gr-detail-badge">Grade {selectedArticle.grade} - {selectedArticle.topic}</span>
        <h2 className="gr-detail-title">{selectedArticle.title}</h2>
      </div>

      <div className="gr-tabs">
        {TABS.map(tab => (
          <button
            key={tab.key}
            className={`gr-tab ${activeTab === tab.key ? 'active' : ''}`}
            onClick={() => { tts.stop(); setActiveTab(tab.key); }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="gr-tab-content">
        {activeTab === 'reading' && <ReadingTab article={selectedArticle} tts={tts} />}
        {activeTab === 'vocabulary' && <VocabTab vocabulary={selectedArticle.vocabulary || []} />}
        {activeTab === 'phrases' && <PhrasesTab phrases={selectedArticle.phrases || []} />}
        {activeTab === 'grammar' && <GrammarTab grammar={selectedArticle.grammar || []} />}
        {activeTab === 'listening' && <ListeningTab article={selectedArticle} tts={tts} />}
      </div>

      {/* Floating playback bar */}
      {tts.isPlaying && (
        <div className="gr-floating-bar">
          <div className="gr-bar-label">
            {tts.mode === 'multi-speed'
              ? `\uD83C\uDFA7 聽力練習 — 第${tts.currentSpeedLevel}段 ${SPEED_CONFIG[tts.currentSpeedLevel]?.label || ''}`
              : tts.mode === 'full' ? '\u266B 全文朗讀中' : '\uD83D\uDD0A 段落朗讀中'}
          </div>
          <div className="gr-bar-controls">
            {tts.isPaused ? (
              <button className="gr-bar-btn" onClick={tts.resume}>&#9654;</button>
            ) : (
              <button className="gr-bar-btn" onClick={tts.pause}>&#10074;&#10074;</button>
            )}
            <button className="gr-bar-btn stop" onClick={tts.stop}>&#9632;</button>
          </div>
        </div>
      )}
    </div>
  );
}
