import { useEffect, useRef, useState } from 'react';
import { postApi, useApi } from '../hooks/useApi';
import './ListenPage.css';

function ListenPage() {
  const { data, loading } = useApi('/daily');
  const [items, setItems] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answer, setAnswer] = useState('');
  const [result, setResult] = useState(null);
  const [score, setScore] = useState({ correct: 0, wrong: 0 });
  const [finished, setFinished] = useState(false);
  const [hasPlayed, setHasPlayed] = useState(false);
  const inputRef = useRef(null);

  useEffect(() => {
    if (data) {
      const allItems = [
        ...data.newWords.map(w => ({ ...w, item_type: 'word', text: w.word })),
        ...data.newPhrases.map(p => ({ ...p, item_type: 'phrase', text: p.phrase })),
        ...(data.reviewItems || []).map(r => ({
          ...r,
          item_type: r.item_type || (r.word ? 'word' : 'phrase'),
          text: r.word || r.phrase
        })),
      ].sort(() => Math.random() - 0.5);
      setItems(allItems);
    }
  }, [data]);

  useEffect(() => {
    if (inputRef.current && !result) {
      inputRef.current.focus();
    }
  }, [currentIndex, result]);

  const speak = (text, rate = 0.85) => {
    if (!window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.lang = 'en-US';
    u.rate = rate;
    const voices = window.speechSynthesis.getVoices();
    const enVoice = voices.find(v => v.lang.startsWith('en'));
    if (enVoice) u.voice = enVoice;
    window.speechSynthesis.speak(u);
    setHasPlayed(true);
  };

  const handlePlay = () => {
    if (items.length > 0) {
      speak(items[currentIndex].text);
    }
  };

  const handlePlaySlow = () => {
    if (items.length > 0) {
      speak(items[currentIndex].text, 0.5);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!answer.trim() || result) return;

    const item = items[currentIndex];
    const correct = item.text.toLowerCase().trim();
    const input = answer.toLowerCase().trim();
    const isCorrect = input === correct;

    setResult(isCorrect ? 'correct' : 'wrong');
    setScore(s => ({
      correct: s.correct + (isCorrect ? 1 : 0),
      wrong: s.wrong + (isCorrect ? 0 : 1)
    }));

    postApi('/quiz/submit', {
      itemType: item.item_type,
      itemId: item.id,
      isCorrect
    });
  };

  const handleNext = () => {
    if (currentIndex < items.length - 1) {
      setCurrentIndex(i => i + 1);
      setAnswer('');
      setResult(null);
      setHasPlayed(false);
    } else {
      setFinished(true);
    }
  };

  if (loading) return <div className="loading">載入英聽練習...</div>;
  if (!data || items.length === 0) return <div className="loading">今日沒有英聽內容。</div>;

  if (finished) {
    const total = score.correct + score.wrong;
    const pct = total > 0 ? Math.round((score.correct / total) * 100) : 0;
    return (
      <div className="listen-page">
        <div className="listen-result">
          <h2>英聽練習完成！</h2>
          <div className="score-circle">
            <span className="score-pct">{pct}%</span>
          </div>
          <div className="score-details">
            <span className="correct-score">正確：{score.correct}</span>
            <span className="wrong-score">錯誤：{score.wrong}</span>
          </div>
        </div>
      </div>
    );
  }

  const item = items[currentIndex];

  return (
    <div className="listen-page">
      <div className="listen-header">
        <h2>英聽練習</h2>
        <span className="listen-progress">{currentIndex + 1} / {items.length}</span>
      </div>

      <div className="listen-score-bar">
        <span className="correct-count">&#10003; {score.correct}</span>
        <span className="wrong-count">&#10007; {score.wrong}</span>
      </div>

      <div className="listen-card">
        <p className="listen-instruction">聆聽發音，輸入你聽到的英文單字或片語</p>

        <div className="listen-controls">
          <button className="play-btn" onClick={handlePlay}>
            &#9654; 播放
          </button>
          <button className="play-btn slow" onClick={handlePlaySlow}>
            &#128034; 慢速播放
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <input
            ref={inputRef}
            type="text"
            className={`listen-input ${result === 'correct' ? 'input-correct' : result === 'wrong' ? 'input-wrong' : ''}`}
            value={answer}
            onChange={e => setAnswer(e.target.value)}
            placeholder={hasPlayed ? '輸入你聽到的...' : '先點擊播放按鈕'}
            disabled={result !== null}
            autoComplete="off"
          />
          {!result && (
            <button type="submit" className="submit-btn" disabled={!hasPlayed}>
              確認
            </button>
          )}
        </form>

        {result && (
          <div className={`listen-feedback ${result}`}>
            {result === 'correct' ? (
              <p className="feedback-text">&#10003; 正確！</p>
            ) : (
              <p className="feedback-text">&#10007; 錯誤！正確答案：<strong>{item.text}</strong></p>
            )}
            <p className="feedback-meaning">中文：{item.meaning}</p>
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
