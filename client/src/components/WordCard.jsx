import { Link } from 'react-router-dom';
import { useTTS } from '../hooks/useTTS';
import './WordCard.css';

function WordCard({ word, showMeaning = true, hasError = false, onNext }) {
  const { speak } = useTTS();
  const masteryLevel = word.mastery_level;
  const roots = (() => { try { return word.roots_json ? JSON.parse(word.roots_json) : []; } catch { return []; } })();
  const examples = Array.isArray(word.examples) && word.examples.length > 0
    ? word.examples
    : (word.example ? [{
        text: word.example,
        zh: word.exampleZh || word.example_zh || '',
        label: '',
        labelZh: '',
      }] : []);

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
        <button className="speak-btn" onClick={() => speak(word.word)} title="播放發音（快捷鍵：` 或 Alt+S）">
          &#128264;
        </button>
      </div>
      <p className="word-phonetic">{word.phonetic}</p>
      <p className="word-pos">{word.part_of_speech}</p>
      {showMeaning && (
        <>
          <p className="word-meaning">{word.meaning}</p>
          {word.context && (
            <p className="word-context" style={{ whiteSpace: 'pre-wrap' }}>
              <span className="context-label">語境：</span>{word.context}
            </p>
          )}
          {examples.length > 0 && (
            <div className="word-examples">
              <span className="example-label">例句：</span>
              {examples.map((example, index) => (
                <div key={`${example.text}-${index}`} className="word-example-item">
                  {(example.labelZh || example.label) && (
                    <div className="word-example-usage">{example.labelZh || example.label}</div>
                  )}
                  <div className="word-example-line">
                    <span>{example.text}</span>
                    <button
                      className="speak-btn small"
                      onClick={() => speak(example.text)}
                      title="播放例句"
                    >
                      &#128264;
                    </button>
                  </div>
                  {example.zh && <div className="word-example-zh">{example.zh}</div>}
                </div>
              ))}
            </div>
          )}
        </>
      )}
      {showMeaning && roots.length > 0 && (
        <div className="word-roots">
          <span className="roots-label">詞根</span>
          <div className="word-roots-list">
            {roots.map((r, i) => (
              <Link key={i} to={`/roots?root=${r.root}`} className="word-root-tag">
                <span className="root-tag-root">{r.root}-</span>
                <span className="root-tag-meaning">{r.meaning_zh}</span>
                <span className="root-tag-origin">（{r.origin}）</span>
              </Link>
            ))}
          </div>
        </div>
      )}
      {onNext && (
        <button className="next-btn" onClick={onNext}>下一個</button>
      )}
    </div>
  );
}

export default WordCard;
