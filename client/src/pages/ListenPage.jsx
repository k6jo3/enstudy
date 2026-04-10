import { useEffect, useRef, useState } from 'react';
import { postApi, useApi } from '../hooks/useApi';
import { useTTS } from '../hooks/useTTS';
import './ListenPage.css';

function ListenPage() {
  const { data, loading } = useApi('/quiz/items?type=listen');
  const { speak } = useTTS();
  const [items, setItems] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answer, setAnswer] = useState('');
  const [result, setResult] = useState(null);
  const [score, setScore] = useState({ correct: 0, wrong: 0 });
  const [finished, setFinished] = useState(false);
  const [hasPlayed, setHasPlayed] = useState(false);
  const inputRef = useRef(null);
  const loadedRef = useRef(false);

  useEffect(() => {
    if (data?.items && !loadedRef.current) {
      loadedRef.current = true;
      setItems(data.items.map(item => ({
        ...item,
        item_type: item.item_type || (item.word ? 'word' : 'phrase'),
        text: item.word || item.phrase,
      })));
    }
  }, [data]);

  useEffect(() => {
    if (inputRef.current && !result) {
      inputRef.current.focus();
    }
  }, [currentIndex, result]);

  function playCurrent(rate = 0.85) {
    if (items.length === 0) return;
    speak(items[currentIndex].text, rate);
    setHasPlayed(true);
  }

  function handleSubmit(event) {
    event.preventDefault();
    if (!answer.trim() || result) return;

    const item = items[currentIndex];
    const correct = item.text.toLowerCase().trim();
    const input = answer.toLowerCase().trim();
    const isCorrect = input === correct;

    setResult(isCorrect ? 'correct' : 'wrong');
    setScore((current) => ({
      correct: current.correct + (isCorrect ? 1 : 0),
      wrong: current.wrong + (isCorrect ? 0 : 1),
    }));

    postApi('/quiz/submit', {
      itemType: item.item_type,
      itemId: item.id,
      isCorrect,
      questionMode: 'typing',
    }).catch(() => {});
  }

  function handleNext() {
    if (currentIndex < items.length - 1) {
      setCurrentIndex((index) => index + 1);
      setAnswer('');
      setResult(null);
      setHasPlayed(false);
      return;
    }

    setFinished(true);
  }

  if (loading) return <div className="loading">載入聽寫題目中...</div>;
  if (!data || items.length === 0) return <div className="loading">目前沒有可用的聽寫題目。</div>;

  if (finished) {
    const total = score.correct + score.wrong;
    const pct = total > 0 ? Math.round((score.correct / total) * 100) : 0;

    return (
      <div className="listen-page">
        <div className="listen-result">
          <h2>聽寫完成</h2>
          <div className="score-circle">
            <span className="score-pct">{pct}%</span>
          </div>
          <div className="score-details">
            <span className="correct-score">答對：{score.correct}</span>
            <span className="wrong-score">答錯：{score.wrong}</span>
          </div>
        </div>
      </div>
    );
  }

  const item = items[currentIndex];

  return (
    <div className="listen-page">
      <div className="listen-header">
        <h2>聽寫練習</h2>
        <span className="listen-progress">{currentIndex + 1} / {items.length}</span>
      </div>

      <div className="listen-score-bar">
        <span className="correct-count">&#10003; {score.correct}</span>
        <span className="wrong-count">&#10007; {score.wrong}</span>
      </div>

      <div className="listen-card">
        <p className="listen-instruction">先播放音訊，再輸入你聽到的單字或片語。</p>

        <div className="listen-controls">
          <button className="play-btn" onClick={() => playCurrent(0.85)}>
            &#9654; 播放
          </button>
          <button className="play-btn slow" onClick={() => playCurrent(0.5)}>
            &#128034; 慢速播放
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <input
            ref={inputRef}
            type="text"
            className={`listen-input ${result === 'correct' ? 'input-correct' : result === 'wrong' ? 'input-wrong' : ''}`}
            value={answer}
            onChange={(event) => setAnswer(event.target.value)}
            placeholder={hasPlayed ? '請輸入答案...' : '請先播放音訊'}
            disabled={result !== null}
            autoComplete="off"
          />
          {!result && (
            <button type="submit" className="submit-btn" disabled={!hasPlayed}>
              送出
            </button>
          )}
        </form>

        {result && (
          <div className={`listen-feedback ${result}`}>
            {result === 'correct' ? (
              <p className="feedback-text">&#10003; 答對了</p>
            ) : (
              <p className="feedback-text">&#10007; 答錯了，正確答案是 <strong>{item.text}</strong></p>
            )}
            <p className="feedback-meaning">意思：{item.meaning}</p>
            <button className="next-btn" onClick={handleNext}>
              {currentIndex < items.length - 1 ? '下一題' : '查看結果'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default ListenPage;
