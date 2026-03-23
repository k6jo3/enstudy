import { useEffect, useRef, useState } from 'react';
import { postApi } from '../hooks/useApi';

function TimedChallenge({ onExit }) {
  const [items, setItems] = useState([]);
  const [idx, setIdx] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [answered, setAnswered] = useState(0);
  const [correct, setCorrect] = useState(0);
  const [done, setDone] = useState(false);
  const [started, setStarted] = useState(false);
  const [feedback, setFeedback] = useState(null);
  const timerRef = useRef(null);

  useEffect(() => {
    fetch('/api/games/items?type=timed&count=40')
      .then(r => r.json())
      .then(words => {
        // Pre-generate options for each word
        const prepared = words.map((w, i) => {
          const others = words.filter((_, j) => j !== i).sort(() => Math.random() - 0.5).slice(0, 3);
          const options = [w, ...others].sort(() => Math.random() - 0.5);
          return { word: w, options: options.map(o => o.meaning), correctIdx: options.indexOf(w) };
        });
        setItems(prepared);
      });
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, []);

  function startGame() {
    setStarted(true);
    timerRef.current = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) {
          clearInterval(timerRef.current);
          setDone(true);
          return 0;
        }
        return t - 1;
      });
    }, 1000);
  }

  useEffect(() => {
    if (done) {
      clearInterval(timerRef.current);
      postApi('/games/score', { gameType: 'timed', score, duration: 60, details: { answered, correct, streak } });
    }
  }, [done]);

  function handleAnswer(optIdx) {
    if (done || feedback !== null) return;
    const item = items[idx];
    const isCorrect = optIdx === item.correctIdx;

    setFeedback(optIdx);
    setAnswered(a => a + 1);

    if (isCorrect) {
      const newStreak = streak + 1;
      setStreak(newStreak);
      setCorrect(c => c + 1);
      const multiplier = newStreak >= 10 ? 3 : newStreak >= 5 ? 2 : 1;
      setScore(s => s + 10 * multiplier);
    } else {
      setStreak(0);
      setScore(s => Math.max(0, s - 5));
    }

    setTimeout(() => {
      setFeedback(null);
      if (idx + 1 < items.length) {
        setIdx(i => i + 1);
      } else {
        setDone(true);
      }
    }, 400);
  }

  if (!items.length) return <div className="loading">Loading...</div>;

  if (done) {
    return (
      <div className="game-container">
        <div className="game-result">
          <h3>Time's Up!</h3>
          <div className="final-score">{score}</div>
          <p style={{ color: '#94a3b8' }}>{correct}/{answered} correct | Best streak: {streak}</p>
          <div className="game-result-btns">
            <button className="game-btn game-btn-primary" onClick={() => window.location.reload()}>Play Again</button>
            <button className="game-btn game-btn-secondary" onClick={onExit}>Back</button>
          </div>
        </div>
      </div>
    );
  }

  if (!started) {
    return (
      <div className="game-container">
        <div className="game-header">
          <h2>Speed Quiz</h2>
          <button className="game-back-btn" onClick={onExit}>Back</button>
        </div>
        <div className="game-result">
          <h3>Ready?</h3>
          <p style={{ color: '#94a3b8', margin: '1rem 0' }}>60 seconds — answer as many as you can!</p>
          <button className="game-btn game-btn-primary" onClick={startGame}>Start!</button>
        </div>
      </div>
    );
  }

  const item = items[idx];
  const multiplier = streak >= 10 ? 3 : streak >= 5 ? 2 : 1;

  return (
    <div className="game-container">
      <div className="game-header">
        <h2>Speed Quiz</h2>
        <button className="game-back-btn" onClick={onExit}>Back</button>
      </div>

      <div className={`timed-timer ${timeLeft <= 10 ? 'warning' : 'normal'}`}>{timeLeft}</div>

      <div className="game-score-display">Score: {score}</div>
      {streak >= 3 && <div className="streak-display">Streak: {streak} {multiplier > 1 ? `(x${multiplier})` : ''}</div>}

      <div className="timed-word">{item.word.word}</div>

      <div className="timed-options">
        {item.options.map((opt, i) => {
          let cls = 'timed-option';
          if (feedback !== null) {
            if (i === item.correctIdx) cls += ' correct';
            else if (i === feedback) cls += ' wrong';
          }
          return (
            <button key={i} className={cls} onClick={() => handleAnswer(i)}>{opt}</button>
          );
        })}
      </div>
    </div>
  );
}

export default TimedChallenge;
