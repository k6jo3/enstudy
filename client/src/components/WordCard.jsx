import { useTTS } from '../hooks/useTTS';
import './WordCard.css';

function WordCard({ word, showMeaning = true, hasError = false, onNext }) {
  const { speak } = useTTS();
  const masteryLevel = word.mastery_level;

  return (
    <div className={`word-card ${hasError ? 'has-error' : ''}`}>
      {hasError && <span className="error-badge">易錯字</span>}
      {masteryLevel != null && (
        <span className={`mastery-badge mastery-${masteryLevel}`}>
          {'★'.repeat(masteryLevel)}{'☆'.repeat(5 - masteryLevel)}
        </span>
      )}
      <div className="word-main">
        <h2 className="word-text">{word.word}</h2>
        <button className="speak-btn" onClick={() => speak(word.word)} title="播放發音">
          &#128264;
        </button>
      </div>
      <p className="word-phonetic">{word.phonetic}</p>
      <p className="word-pos">{word.part_of_speech}</p>
      {showMeaning && (
        <>
          <p className="word-meaning">{word.meaning}</p>
          {word.context && (
            <p className="word-context">
              <span className="context-label">語境：</span>{word.context}
            </p>
          )}
          <p className="word-example">
            <span className="example-label">例句：</span>
            {word.example}
            <button className="speak-btn small" onClick={() => speak(word.example)} title="播放例句">
              &#128264;
            </button>
          </p>
        </>
      )}
      {onNext && (
        <button className="next-btn" onClick={onNext}>下一個</button>
      )}
    </div>
  );
}

export default WordCard;
