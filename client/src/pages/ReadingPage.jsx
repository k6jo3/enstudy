import { useState, useEffect, useRef, useCallback } from 'react';
import { postApi, useApi } from '../hooks/useApi';
import './ReadingPage.css';

// ---- TTS Engine for Reading Page ----
function useArticleTTS() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [currentParaIdx, setCurrentParaIdx] = useState(-1);
  const [currentSentenceIdx, setCurrentSentenceIdx] = useState(-1);
  const [mode, setMode] = useState(null); // 'full' | 'paragraph' | null
  const utteranceRef = useRef(null);
  const queueRef = useRef([]); // array of { paraIdx, sentenceIdx, text }
  const queueIdxRef = useRef(0);
  const cancelledRef = useRef(false);

  const getVoice = useCallback(() => {
    const voices = window.speechSynthesis?.getVoices() || [];
    return voices.find(v => v.lang === 'en-US') || voices.find(v => v.lang.startsWith('en')) || null;
  }, []);

  const speakNext = useCallback(() => {
    if (cancelledRef.current) return;
    const queue = queueRef.current;
    const idx = queueIdxRef.current;
    if (idx >= queue.length) {
      // Done
      setIsPlaying(false);
      setIsPaused(false);
      setCurrentParaIdx(-1);
      setCurrentSentenceIdx(-1);
      setMode(null);
      return;
    }
    const item = queue[idx];
    setCurrentParaIdx(item.paraIdx);
    setCurrentSentenceIdx(item.sentenceIdx);

    const utterance = new SpeechSynthesisUtterance(item.text);
    utterance.lang = 'en-US';
    utterance.rate = 0.9;
    utterance.pitch = 1;
    const voice = getVoice();
    if (voice) utterance.voice = voice;

    utterance.onend = () => {
      queueIdxRef.current += 1;
      speakNext();
    };
    utterance.onerror = (e) => {
      if (e.error === 'canceled' || e.error === 'interrupted') return;
      queueIdxRef.current += 1;
      speakNext();
    };

    utteranceRef.current = utterance;
    window.speechSynthesis.speak(utterance);
  }, [getVoice]);

  // Split paragraph text into sentences
  const splitSentences = useCallback((text) => {
    // Split on sentence-ending punctuation followed by space or end
    const sentences = text.match(/[^.!?]*[.!?]+[\s]*/g);
    if (!sentences) return [text];
    // Clean up and filter empty
    return sentences.map(s => s.trim()).filter(Boolean);
  }, []);

  const playFullArticle = useCallback((paragraphs) => {
    if (!window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    cancelledRef.current = false;

    const queue = [];
    paragraphs.forEach((para, pIdx) => {
      const sentences = splitSentences(para);
      sentences.forEach((sentence, sIdx) => {
        queue.push({ paraIdx: pIdx, sentenceIdx: sIdx, text: sentence });
      });
    });

    queueRef.current = queue;
    queueIdxRef.current = 0;
    setIsPlaying(true);
    setIsPaused(false);
    setMode('full');
    speakNext();
  }, [splitSentences, speakNext]);

  const playParagraph = useCallback((text, paraIdx) => {
    if (!window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    cancelledRef.current = false;

    const sentences = splitSentences(text);
    const queue = sentences.map((sentence, sIdx) => ({
      paraIdx, sentenceIdx: sIdx, text: sentence
    }));

    queueRef.current = queue;
    queueIdxRef.current = 0;
    setIsPlaying(true);
    setIsPaused(false);
    setMode('paragraph');
    speakNext();
  }, [splitSentences, speakNext]);

  const pause = useCallback(() => {
    if (window.speechSynthesis?.speaking) {
      window.speechSynthesis.pause();
      setIsPaused(true);
    }
  }, []);

  const resume = useCallback(() => {
    if (window.speechSynthesis?.paused) {
      window.speechSynthesis.resume();
      setIsPaused(false);
    }
  }, []);

  const stop = useCallback(() => {
    cancelledRef.current = true;
    window.speechSynthesis?.cancel();
    queueRef.current = [];
    queueIdxRef.current = 0;
    setIsPlaying(false);
    setIsPaused(false);
    setCurrentParaIdx(-1);
    setCurrentSentenceIdx(-1);
    setMode(null);
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      cancelledRef.current = true;
      window.speechSynthesis?.cancel();
    };
  }, []);

  return {
    isPlaying, isPaused, currentParaIdx, currentSentenceIdx, mode,
    playFullArticle, playParagraph, pause, resume, stop
  };
}

// ---- Sentence-highlighted paragraph renderer ----
function HighlightedParagraph({ text, paraIdx, currentParaIdx, currentSentenceIdx, highlightContent }) {
  const isActivePara = paraIdx === currentParaIdx;

  // Split into sentences for highlight tracking
  const sentenceRegex = /([^.!?]*[.!?]+[\s]*)/g;
  const sentences = text.match(sentenceRegex);

  if (!isActivePara || !sentences) {
    // No sentence-level highlighting — render normally
    return <>{highlightContent(text)}</>;
  }

  // Render sentence by sentence with highlighting
  return (
    <>
      {sentences.map((sentence, sIdx) => (
        <span
          key={sIdx}
          className={sIdx === currentSentenceIdx ? 'sentence-active' : ''}
        >
          {highlightContent(sentence)}
        </span>
      ))}
    </>
  );
}

function ReadingPage() {
  const { data, loading, error, refetch } = useApi('/reading');
  const [showMeanings, setShowMeanings] = useState({});
  const [quizMode, setQuizMode] = useState(false);
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);

  const tts = useArticleTTS();

  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div className="loading">Error: {error}</div>;
  if (!data?.story) return (
    <div className="reading-page">
      <h2>Every Day Reading</h2>
      <div className="all-done-card">
        <p>All stories have been completed! New stories coming soon.</p>
      </div>
    </div>
  );

  const { story } = data;
  const paragraphs = story.content.split('\n').filter(p => p.trim());

  function toggleMeaning(word) {
    setShowMeanings(prev => ({ ...prev, [word]: !prev[word] }));
  }

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
            {showMeanings[lower] && story.vocab_meanings[lower] && (
              <span className="vocab-tooltip">{story.vocab_meanings[lower]}</span>
            )}
          </span>
        );
      }
      return part;
    });
  }

  function handleAnswer(qIdx, optIdx) {
    if (submitted) return;
    setAnswers(prev => ({ ...prev, [qIdx]: optIdx }));
  }

  async function handleSubmitQuiz() {
    setSubmitted(true);
    const correct = story.questions.filter((q, i) => answers[i] === q.answer).length;
    const score = Math.round((correct / story.questions.length) * 100);
    await postApi('/reading/complete', { storyId: story.id || story.story_id, quizScore: score });
  }

  const quizScore = submitted
    ? story.questions.filter((q, i) => answers[i] === q.answer).length
    : 0;

  function handleNextStory() {
    tts.stop();
    refetch();
    setQuizMode(false);
    setAnswers({});
    setSubmitted(false);
    setShowMeanings({});
  }

  return (
    <div className="reading-page">
      <div className="story-header">
        <div className="series-badge">{story.series_name} - Episode {story.episode}</div>
        <h2>{story.title}</h2>
      </div>

      {/* Full article TTS button */}
      <div className="tts-article-controls">
        {!tts.isPlaying || tts.mode !== 'full' ? (
          <button
            className="tts-article-btn"
            onClick={() => tts.playFullArticle(paragraphs)}
            title="朗讀全文"
          >
            <span className="tts-icon">&#9654;</span> 朗讀全文
          </button>
        ) : (
          <div className="tts-playback-group">
            <span className="tts-now-playing">&#9835; 朗讀中...</span>
          </div>
        )}
      </div>

      <div className="story-card">
        <div className="story-content">
          {paragraphs.map((para, i) => (
            <div key={i} className={`story-para-row ${i === tts.currentParaIdx ? 'para-active' : ''}`}>
              <p className="story-para-text">
                <HighlightedParagraph
                  text={para}
                  paraIdx={i}
                  currentParaIdx={tts.currentParaIdx}
                  currentSentenceIdx={tts.currentSentenceIdx}
                  highlightContent={highlightContent}
                />
              </p>
              <button
                className={`tts-para-btn ${tts.isPlaying && tts.mode === 'paragraph' && tts.currentParaIdx === i ? 'playing' : ''}`}
                onClick={() => {
                  if (tts.isPlaying && tts.mode === 'paragraph' && tts.currentParaIdx === i) {
                    tts.stop();
                  } else {
                    tts.playParagraph(para, i);
                  }
                }}
                title="朗讀此段"
              >
                {tts.isPlaying && tts.mode === 'paragraph' && tts.currentParaIdx === i ? '■' : '🔊'}
              </button>
            </div>
          ))}
        </div>
        <div className="vocab-hint">點擊藍色單字查看中文意思 | 點擊 🔊 朗讀段落</div>
      </div>

      {!quizMode ? (
        <button className="quiz-start-btn" onClick={() => setQuizMode(true)}>
          Reading Comprehension Quiz
        </button>
      ) : (
        <div className="quiz-section">
          <h3>Comprehension Questions</h3>
          {story.questions.map((q, qIdx) => (
            <div key={qIdx} className="reading-question">
              <p className="q-text">{qIdx + 1}. {q.question}</p>
              <div className="q-options">
                {q.options.map((opt, oIdx) => {
                  let cls = 'q-option';
                  if (submitted) {
                    if (oIdx === q.answer) cls += ' correct';
                    else if (answers[qIdx] === oIdx) cls += ' wrong';
                  } else if (answers[qIdx] === oIdx) {
                    cls += ' selected';
                  }
                  return (
                    <button key={oIdx} className={cls} onClick={() => handleAnswer(qIdx, oIdx)}>
                      {opt}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
          {!submitted ? (
            <button
              className="quiz-submit-btn"
              onClick={handleSubmitQuiz}
              disabled={Object.keys(answers).length < story.questions.length}
            >Submit</button>
          ) : (
            <div className="quiz-result">
              <p>Score: {quizScore}/{story.questions.length} correct</p>
              <button className="next-story-btn" onClick={handleNextStory}>
                Next Story
              </button>
            </div>
          )}
        </div>
      )}

      {/* Floating playback bar when full-article TTS is active */}
      {tts.isPlaying && tts.mode === 'full' && (
        <div className="tts-floating-bar">
          <div className="tts-bar-label">&#9835; 全文朗讀中</div>
          <div className="tts-bar-controls">
            {tts.isPaused ? (
              <button className="tts-bar-btn" onClick={tts.resume} title="繼續">&#9654;</button>
            ) : (
              <button className="tts-bar-btn" onClick={tts.pause} title="暫停">&#10074;&#10074;</button>
            )}
            <button className="tts-bar-btn tts-bar-stop" onClick={tts.stop} title="停止">&#9632;</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default ReadingPage;
