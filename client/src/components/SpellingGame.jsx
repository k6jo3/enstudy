import { useEffect, useRef, useState } from 'react';
import { postApi } from '../hooks/useApi';

function SpellingGame({ onExit }) {
  const [words, setWords] = useState([]);
  const [idx, setIdx] = useState(0);
  const [input, setInput] = useState('');
  const [score, setScore] = useState(0);
  const [errors, setErrors] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const [done, setDone] = useState(false);
  const [feedback, setFeedback] = useState('');
  const [hintUsed, setHintUsed] = useState(false);
  const inputRef = useRef(null);

  useEffect(() => {
    fetch('/api/games/items?type=spelling&count=15')
      .then(r => r.json())
      .then(data => setWords(data));
  }, []);

  useEffect(() => {
    if (inputRef.current) inputRef.current.focus();
  }, [idx]);

  const current = words[idx];
  if (!current && !done) return <div className="loading">Loading...</div>;

  function handleSubmit(e) {
    e.preventDefault();
    if (!current || revealed) return;

    const answer = input.trim().toLowerCase();
    const correct = current.word.toLowerCase();

    if (answer === correct) {
      const pts = current.word.length * 10 * (hintUsed ? 0.5 : 1);
      setScore(s => s + pts);
      setFeedback('Correct!');
      setRevealed(true);
      setTimeout(nextWord, 1000);
    } else {
      setErrors(e => e + 1);
      setFeedback('Try again!');
      setInput('');
    }
  }

  function handleHint() {
    if (!current || hintUsed) return;
    setHintUsed(true);
    setInput(current.word[0]);
  }

  function handleSkip() {
    setRevealed(true);
    setFeedback(`Answer: ${current.word}`);
    setTimeout(nextWord, 1500);
  }

  function nextWord() {
    if (idx + 1 >= words.length) {
      setDone(true);
      postApi('/games/score', { gameType: 'spelling', score, duration: 0, details: { total: words.length, errors } });
      return;
    }
    setIdx(i => i + 1);
    setInput('');
    setRevealed(false);
    setFeedback('');
    setHintUsed(false);
  }

  if (done) {
    return (
      <div className="game-container">
        <div className="game-result">
          <h3>Spelling Complete!</h3>
          <div className="final-score">{score}</div>
          <p style={{ color: '#94a3b8' }}>Words: {words.length} | Errors: {errors}</p>
          <div className="game-result-btns">
            <button className="game-btn game-btn-primary" onClick={() => window.location.reload()}>Play Again</button>
            <button className="game-btn game-btn-secondary" onClick={onExit}>Back</button>
          </div>
        </div>
      </div>
    );
  }

  const letters = current.word.split('');

  return (
    <div className="game-container">
      <div className="game-header">
        <h2>Spelling Bee</h2>
        <button className="game-back-btn" onClick={onExit}>Back</button>
      </div>
      <div className="game-score-display">Score: {score}</div>

      <div className="spelling-prompt">
        <div className="spelling-meaning">{current.meaning}</div>
        {current.part_of_speech && <div className="spelling-pos">{current.part_of_speech}</div>}
        <p style={{ color: '#64748b', fontSize: '0.8rem', marginTop: '0.5rem' }}>
          {idx + 1} / {words.length}
        </p>
      </div>

      <div className="letter-boxes">
        {letters.map((l, i) => {
          const typed = input[i]?.toLowerCase();
          const isCorrect = typed === l.toLowerCase();
          let cls = 'letter-box';
          if (typed) cls += isCorrect ? ' correct' : ' wrong';
          return <div key={i} className={cls}>{revealed ? l : (typed || '')}</div>;
        })}
      </div>

      {feedback && <p style={{ textAlign: 'center', color: revealed ? '#22c55e' : '#f87171', marginBottom: '0.5rem' }}>{feedback}</p>}

      <form onSubmit={handleSubmit} style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem' }}>
        <input
          ref={inputRef}
          className="spelling-input"
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="Type the word..."
          disabled={revealed}
          autoComplete="off"
        />
        <button type="button" className="hint-btn" onClick={handleHint} disabled={hintUsed}>Hint</button>
      </form>

      <div style={{ textAlign: 'center', marginTop: '0.75rem' }}>
        <button className="game-btn game-btn-secondary" onClick={handleSkip} disabled={revealed}>Skip</button>
      </div>
    </div>
  );
}

export default SpellingGame;
