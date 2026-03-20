import { useEffect, useState } from 'react';
import PhraseCard from '../components/PhraseCard';
import WordCard from '../components/WordCard';
import { useApi } from '../hooks/useApi';
import { useTTS } from '../hooks/useTTS';
import './LearnPage.css';

function LearnPage() {
  const { data, loading, error } = useApi('/daily');
  const [phase, setPhase] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Set initial phase once data loads
  useEffect(() => {
    if (!data) return;
    const { reviewItems, newWords, newPhrases } = data;
    if (reviewItems.length > 0) setPhase('review');
    else if (newWords.length > 0) setPhase('words');
    else if (newPhrases.length > 0) setPhase('phrases');
    else setPhase('sentences');
  }, [data]);

  if (loading) return <div className="loading">載入今日學習內容...</div>;
  if (error) return <div className="error-msg">載入失敗：{error}</div>;
  if (!data || !phase) return null;

  const { newWords, newPhrases, reviewItems, sentences } = data;

  const handleNext = () => {
    if (phase === 'review') {
      if (currentIndex < reviewItems.length - 1) {
        setCurrentIndex(i => i + 1);
      } else {
        setPhase('words');
        setCurrentIndex(0);
      }
    } else if (phase === 'words') {
      if (currentIndex < newWords.length - 1) {
        setCurrentIndex(i => i + 1);
      } else {
        setPhase('phrases');
        setCurrentIndex(0);
      }
    } else if (phase === 'phrases') {
      if (currentIndex < newPhrases.length - 1) {
        setCurrentIndex(i => i + 1);
      } else {
        setPhase('sentences');
        setCurrentIndex(0);
      }
    }
  };

  const renderPhaseLabel = () => {
    switch (phase) {
      case 'review': {
        const item = reviewItems[currentIndex];
        const level = item?.mastery_level ?? '?';
        return `複習 (${currentIndex + 1}/${reviewItems.length}) - 熟練度 Lv.${level}`;
      }
      case 'words': return `新單字 (${currentIndex + 1}/${newWords.length})`;
      case 'phrases': return `新片語 (${currentIndex + 1}/${newPhrases.length})`;
      case 'sentences': return '今日例句';
      default: return '';
    }
  };

  const renderContent = () => {
    if (phase === 'review' && reviewItems.length > 0) {
      const item = reviewItems[currentIndex];
      if (item.item_type === 'word' || item.word) {
        return <WordCard word={item} hasError={true} onNext={handleNext} />;
      } else {
        return <PhraseCard phrase={item} hasError={true} onNext={handleNext} />;
      }
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
          {sentences.map((s, i) => (
            <SentenceItem key={i} sentence={s} index={i} />
          ))}
          <div className="learn-complete">
            <p>今日學習完成！前往測驗鞏固記憶。</p>
          </div>
        </div>
      );
    }

    return <div className="learn-complete"><p>今日沒有新內容，所有內容已學完！</p></div>;
  };

  return (
    <div className="learn-page">
      <div className="learn-header">
        <h2>今日學習</h2>
        <span className="phase-label">{renderPhaseLabel()}</span>
      </div>

      <div className="phase-nav">
        <button
          className={phase === 'review' ? 'active' : ''}
          onClick={() => { setPhase('review'); setCurrentIndex(0); }}
          disabled={reviewItems.length === 0}
        >
          複習 ({reviewItems.length})
        </button>
        <button
          className={phase === 'words' ? 'active' : ''}
          onClick={() => { setPhase('words'); setCurrentIndex(0); }}
        >
          單字 ({newWords.length})
        </button>
        <button
          className={phase === 'phrases' ? 'active' : ''}
          onClick={() => { setPhase('phrases'); setCurrentIndex(0); }}
        >
          片語 ({newPhrases.length})
        </button>
        <button
          className={phase === 'sentences' ? 'active' : ''}
          onClick={() => { setPhase('sentences'); setCurrentIndex(0); }}
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

  // New dialogue format: sentence has .lines array
  if (sentence.lines) {
    const fullText = sentence.lines.map(l => l.text).join(' ');
    return (
      <div className="sentence-item dialogue-item">
        <span className="sentence-num">{index + 1}.</span>
        <div className="dialogue-content">
          <div className="dialogue-lines">
            {sentence.lines.map((line, i) => (
              <div key={i} className={`dialogue-line speaker-${line.speaker.toLowerCase()}`}>
                <span className="speaker-label">{line.speaker}:</span>
                <div className="speaker-bubble">
                  <span className="speaker-text">{line.text}</span>
                  {line.zh && <span className="speaker-zh">{line.zh}</span>}
                </div>
              </div>
            ))}
          </div>
          <div className="dialogue-footer">
            <button className="speak-btn small" onClick={() => speak(fullText)} title="播放">&#128264;</button>
            <div className="sentence-words">
              {(sentence.highlightWords || []).map((w, i) => (
                <span key={i} className="highlight-word">{w}</span>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Fallback: old single-sentence format
  return (
    <div className="sentence-item">
      <span className="sentence-num">{index + 1}.</span>
      <p className="sentence-text">{sentence.sentence}</p>
      <button className="speak-btn small" onClick={() => speak(sentence.sentence)} title="播放">&#128264;</button>
      <div className="sentence-words">
        {(sentence.highlightWords || []).map((w, i) => (
          <span key={i} className="highlight-word">{w}</span>
        ))}
      </div>
    </div>
  );
}

export default LearnPage;
