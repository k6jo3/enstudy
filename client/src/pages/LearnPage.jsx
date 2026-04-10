import { useEffect, useState } from 'react';
import PhraseCard from '../components/PhraseCard';
import WordCard from '../components/WordCard';
import { useApi, postApi } from '../hooks/useApi';
import { useTTS } from '../hooks/useTTS';
import { formatLocalDate } from '../utils/date';
import './LearnPage.css';

function LearnPage() {
  const { data, loading, error, refetch } = useApi('/daily');
  const [phase, setPhase] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [sessionCompleted, setSessionCompleted] = useState(false);
  const [loadingNext, setLoadingNext] = useState(false);
  const [scoreGateMsg, setScoreGateMsg] = useState(null);

  useEffect(() => {
    if (data?.session?.completed) {
      setSessionCompleted(true);
    }

    if (data?.scoreGated) {
      setScoreGateMsg(`目前平均分數 ${data.averageScore} 低於 6，請先複習並完成測驗後再開啟新課程。`);
    }
  }, [data]);

  useEffect(() => {
    if (!data) return;

    const { reviewItems, newWords, newPhrases } = data;
    if (reviewItems.length > 0) setPhase('review');
    else if (newWords.length > 0) setPhase('words');
    else if (newPhrases.length > 0) setPhase('phrases');
    else setPhase('sentences');
  }, [data]);

  if (loading) return <div className="loading">載入今日學習內容中...</div>;
  if (error) return <div className="error-msg">載入失敗：{error}</div>;
  if (!data || !phase) return null;

  const { newWords, newPhrases, reviewItems, sentences } = data;

  function handleNext() {
    if (phase === 'review') {
      if (currentIndex < reviewItems.length - 1) {
        setCurrentIndex((index) => index + 1);
      } else {
        setPhase('words');
        setCurrentIndex(0);
      }
      return;
    }

    if (phase === 'words') {
      if (currentIndex < newWords.length - 1) {
        setCurrentIndex((index) => index + 1);
      } else {
        setPhase('phrases');
        setCurrentIndex(0);
      }
      return;
    }

    if (phase === 'phrases' && currentIndex < newPhrases.length - 1) {
      setCurrentIndex((index) => index + 1);
    } else if (phase === 'phrases') {
      setPhase('sentences');
      setCurrentIndex(0);
    }
  }

  function renderPhaseLabel() {
    switch (phase) {
      case 'review': {
        const item = reviewItems[currentIndex];
        const level = item?.mastery_level ?? '?';
        return `複習 (${currentIndex + 1}/${reviewItems.length}) - 熟練度 Lv.${level}`;
      }
      case 'words':
        return `單字 (${currentIndex + 1}/${newWords.length})`;
      case 'phrases':
        return `片語 (${currentIndex + 1}/${newPhrases.length})`;
      case 'sentences':
        return '情境例句';
      default:
        return '';
    }
  }

  async function handleLoadNextSession() {
    setLoadingNext(true);
    try {
      const result = await postApi('/daily/next', {});
      if (result.error === 'score_gate') {
        setScoreGateMsg(result.message);
        return;
      }

      setScoreGateMsg(null);
      setSessionCompleted(false);
      setPhase(null);
      setCurrentIndex(0);
      refetch();
    } catch (requestError) {
      console.error(requestError);
    } finally {
      setLoadingNext(false);
    }
  }

  async function handleCompleteSession() {
    await postApi('/daily/complete', {});
    setSessionCompleted(true);
  }

  function renderContent() {
    if (phase === 'review' && reviewItems.length > 0) {
      const item = reviewItems[currentIndex];
      if (item.item_type === 'word' || item.word) {
        return <WordCard word={item} hasError onNext={handleNext} />;
      }
      return <PhraseCard phrase={item} hasError onNext={handleNext} />;
    }

    if (phase === 'words' && newWords.length > 0) {
      return <WordCard word={newWords[currentIndex]} hasError={newWords[currentIndex].hasError} onNext={handleNext} />;
    }

    if (phase === 'phrases' && newPhrases.length > 0) {
      return <PhraseCard phrase={newPhrases[currentIndex]} hasError={newPhrases[currentIndex].hasError} onNext={handleNext} />;
    }

    if (phase === 'sentences') {
      return (
        <div className="sentences-section">
          {sentences.map((sentence, index) => (
            <SentenceItem key={index} sentence={sentence} index={index} />
          ))}
          <div className="learn-complete">
            {scoreGateMsg && (
              <div className="score-gate-banner">
                <p>{scoreGateMsg}</p>
              </div>
            )}
            {sessionCompleted ? (
              <>
                <p>今日課程已完成。你可以直接開始下一課。</p>
                <button
                  className="continue-btn"
                  disabled={loadingNext || !!scoreGateMsg}
                  onClick={handleLoadNextSession}
                >
                  {loadingNext ? '載入中...' : '開始下一課'}
                </button>
              </>
            ) : (
              <>
                <p>所有單字、片語和例句都看完後，請將今天課程標記為完成。</p>
                <button className="complete-btn" onClick={handleCompleteSession}>
                  完成今日課程
                </button>
              </>
            )}
          </div>
        </div>
      );
    }

    return (
      <div className="learn-complete">
        <p>目前沒有可顯示的學習內容。</p>
      </div>
    );
  }

  const today = formatLocalDate();
  const showSessionDate = data.session?.session_date && data.session.session_date !== today;

  return (
    <div className="learn-page">
      <div className="learn-header">
        <h2>今日學習 {showSessionDate ? `(${data.session.session_date})` : ''}</h2>
        <span className="phase-label">{renderPhaseLabel()}</span>
      </div>

      <div className="phase-nav">
        <button
          className={phase === 'review' ? 'active' : ''}
          onClick={() => {
            setPhase('review');
            setCurrentIndex(0);
          }}
          disabled={reviewItems.length === 0}
        >
          複習 ({reviewItems.length})
        </button>
        <button
          className={phase === 'words' ? 'active' : ''}
          onClick={() => {
            setPhase('words');
            setCurrentIndex(0);
          }}
        >
          單字 ({newWords.length})
        </button>
        <button
          className={phase === 'phrases' ? 'active' : ''}
          onClick={() => {
            setPhase('phrases');
            setCurrentIndex(0);
          }}
        >
          片語 ({newPhrases.length})
        </button>
        <button
          className={phase === 'sentences' ? 'active' : ''}
          onClick={() => {
            setPhase('sentences');
            setCurrentIndex(0);
          }}
        >
          例句 ({sentences.length})
        </button>
      </div>

      {renderContent()}
    </div>
  );
}

function SentenceItem({ sentence, index }) {
  const { speak } = useTTS();

  if (sentence.lines) {
    const fullText = sentence.lines.map((line) => line.text).join(' ');
    return (
      <div className="sentence-item dialogue-item">
        <span className="sentence-num">{index + 1}.</span>
        <div className="dialogue-content">
          <div className="dialogue-lines">
            {sentence.lines.map((line, lineIndex) => (
              <div key={lineIndex} className={`dialogue-line speaker-${line.speaker.toLowerCase()}`}>
                <span className="speaker-label">{line.speaker}:</span>
                <div className="speaker-bubble">
                  <span className="speaker-text">{line.text}</span>
                  {line.zh && <span className="speaker-zh">{line.zh}</span>}
                </div>
              </div>
            ))}
          </div>
          <div className="dialogue-footer">
            <button className="speak-btn small" onClick={() => speak(fullText)} title="播放語音">
              &#128264;
            </button>
            <div className="sentence-words">
              {(sentence.highlightWords || []).map((word, wordIndex) => (
                <span key={wordIndex} className="highlight-word">{word}</span>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="sentence-item">
      <span className="sentence-num">{index + 1}.</span>
      <p className="sentence-text">{sentence.sentence}</p>
      <button className="speak-btn small" onClick={() => speak(sentence.sentence)} title="播放語音">
        &#128264;
      </button>
      <div className="sentence-words">
        {(sentence.highlightWords || []).map((word, wordIndex) => (
          <span key={wordIndex} className="highlight-word">{word}</span>
        ))}
      </div>
    </div>
  );
}

export default LearnPage;
