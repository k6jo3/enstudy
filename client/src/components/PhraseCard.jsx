import { useTTS } from '../hooks/useTTS';
import './PhraseCard.css';

function PhraseCard({ phrase, showMeaning = true, hasError = false, onNext }) {
  const { speak } = useTTS();
  const masteryLevel = phrase.mastery_level;

  return (
    <div className={`phrase-card ${hasError ? 'has-error' : ''}`}>
      {hasError && <span className="error-badge">易錯</span>}
      {masteryLevel != null && (
        <span className={`mastery-badge mastery-${masteryLevel}`}>
          {'★'.repeat(masteryLevel)}{'☆'.repeat(5 - masteryLevel)}
        </span>
      )}
      <div className="phrase-main">
        <h2 className="phrase-text">{phrase.phrase}</h2>
        <button className="speak-btn" onClick={() => speak(phrase.phrase)} title="播放發音">
          &#128264;
        </button>
      </div>
      {showMeaning && (
        <>
          <p className="phrase-meaning">{phrase.meaning}</p>
          <p className="phrase-example">
            <span className="example-label">例句：</span>
            {phrase.example}
            <button className="speak-btn small" onClick={() => speak(phrase.example)} title="播放例句">
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

export default PhraseCard;
