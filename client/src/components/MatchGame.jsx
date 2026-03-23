import { useEffect, useRef, useState } from 'react';
import { postApi } from '../hooks/useApi';

function MatchGame({ onExit }) {
  const [cards, setCards] = useState([]);
  const [flipped, setFlipped] = useState([]);
  const [matched, setMatched] = useState(new Set());
  const [timer, setTimer] = useState(0);
  const [moves, setMoves] = useState(0);
  const [done, setDone] = useState(false);
  const [loading, setLoading] = useState(true);
  const timerRef = useRef(null);
  const lockRef = useRef(false);

  useEffect(() => {
    fetch('/api/games/items?type=match&count=8')
      .then(r => r.json())
      .then(words => {
        const pairs = [];
        words.forEach((w, i) => {
          pairs.push({ id: i * 2, wordId: i, text: w.word, type: 'en' });
          pairs.push({ id: i * 2 + 1, wordId: i, text: w.meaning, type: 'zh' });
        });
        setCards(pairs.sort(() => Math.random() - 0.5));
        setLoading(false);
        timerRef.current = setInterval(() => setTimer(t => t + 1), 1000);
      });
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, []);

  function handleClick(idx) {
    if (lockRef.current || flipped.includes(idx) || matched.has(cards[idx].wordId)) return;

    const newFlipped = [...flipped, idx];
    setFlipped(newFlipped);

    if (newFlipped.length === 2) {
      setMoves(m => m + 1);
      lockRef.current = true;
      const [a, b] = newFlipped;
      if (cards[a].wordId === cards[b].wordId && cards[a].type !== cards[b].type) {
        const newMatched = new Set(matched);
        newMatched.add(cards[a].wordId);
        setMatched(newMatched);
        setFlipped([]);
        lockRef.current = false;

        if (newMatched.size === cards.length / 2) {
          clearInterval(timerRef.current);
          const score = Math.max(0, 1000 - timer * 5 - (moves + 1 - cards.length / 2) * 20);
          setDone(true);
          postApi('/games/score', { gameType: 'match', score, duration: timer, details: { moves: moves + 1, pairs: cards.length / 2 } });
        }
      } else {
        setTimeout(() => { setFlipped([]); lockRef.current = false; }, 800);
      }
    }
  }

  if (loading) return <div className="loading">Loading...</div>;

  const score = Math.max(0, 1000 - timer * 5 - (moves - cards.length / 2) * 20);

  if (done) {
    return (
      <div className="game-container">
        <div className="game-result">
          <h3>Well done!</h3>
          <div className="final-score">{score}</div>
          <p style={{ color: '#94a3b8' }}>Time: {timer}s | Moves: {moves}</p>
          <div className="game-result-btns">
            <button className="game-btn game-btn-primary" onClick={() => window.location.reload()}>Play Again</button>
            <button className="game-btn game-btn-secondary" onClick={onExit}>Back</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="game-container">
      <div className="game-header">
        <h2>Match Pairs</h2>
        <button className="game-back-btn" onClick={onExit}>Back</button>
      </div>
      <div className="match-timer">Time: {timer}s | Moves: {moves}</div>
      <div className="match-grid">
        {cards.map((card, idx) => {
          const isFlipped = flipped.includes(idx);
          const isMatched = matched.has(card.wordId);
          let cls = 'match-card';
          if (isFlipped || isMatched) cls += ' flipped';
          if (isMatched) cls += ' matched';
          if (card.type === 'zh') cls += ' zh';
          return (
            <div key={card.id} className={cls} onClick={() => handleClick(idx)}>
              {(isFlipped || isMatched) ? card.text : '?'}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default MatchGame;
