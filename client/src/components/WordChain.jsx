import { useEffect, useRef, useState } from 'react';
import { postApi } from '../hooks/useApi';

function WordChain({ onExit }) {
  const [allWords, setAllWords] = useState([]);
  const [validSet, setValidSet] = useState(new Set());
  const [chain, setChain] = useState([]);
  const [usedWords, setUsedWords] = useState(new Set());
  const [input, setInput] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [errorCount, setErrorCount] = useState(0);
  const [done, setDone] = useState(false);
  const [score, setScore] = useState(0);
  const inputRef = useRef(null);

  useEffect(() => {
    fetch('/api/games/items?type=wordchain&count=500')
      .then(r => r.json())
      .then(words => {
        const wordMap = new Set(words.map(w => w.word.toLowerCase()));
        setAllWords(words);
        setValidSet(wordMap);
        // Pick a random starting word
        const start = words[Math.floor(Math.random() * words.length)];
        setChain([start.word.toLowerCase()]);
        setUsedWords(new Set([start.word.toLowerCase()]));
      });
  }, []);

  useEffect(() => {
    if (inputRef.current) inputRef.current.focus();
  }, [chain]);

  function getLastLetter() {
    if (chain.length === 0) return '';
    const last = chain[chain.length - 1];
    return last[last.length - 1].toLowerCase();
  }

  function handleSubmit(e) {
    e.preventDefault();
    const word = input.trim().toLowerCase();
    if (!word) return;

    const requiredLetter = getLastLetter();

    if (word[0] !== requiredLetter) {
      setErrorMsg(`Word must start with "${requiredLetter.toUpperCase()}"`);
      setErrorCount(c => c + 1);
    } else if (!validSet.has(word)) {
      setErrorMsg('Word not found in vocabulary');
      setErrorCount(c => c + 1);
    } else if (usedWords.has(word)) {
      setErrorMsg('Word already used!');
      setErrorCount(c => c + 1);
    } else {
      // Valid
      setChain(prev => [...prev, word]);
      setUsedWords(prev => new Set(prev).add(word));
      const pts = word.length >= 6 ? 20 : 10;
      setScore(s => s + pts);
      setErrorMsg('');
      setErrorCount(0);
    }

    setInput('');

    if (errorCount + 1 >= 3 && word[0] !== requiredLetter || (!validSet.has(word) && errorCount + 1 >= 3) || (usedWords.has(word) && errorCount + 1 >= 3)) {
      // Check if this was the 3rd error
    }
  }

  useEffect(() => {
    if (errorCount >= 3 && !done) {
      setDone(true);
      postApi('/games/score', {
        gameType: 'wordchain',
        score,
        duration: 0,
        details: { chainLength: chain.length }
      });
    }
  }, [errorCount]);

  function handleGiveUp() {
    setDone(true);
    postApi('/games/score', {
      gameType: 'wordchain',
      score,
      duration: 0,
      details: { chainLength: chain.length }
    });
  }

  if (!allWords.length) return <div className="loading">Loading...</div>;

  if (done) {
    return (
      <div className="game-container">
        <div className="game-result">
          <h3>Word Chain Complete!</h3>
          <div className="final-score">{score}</div>
          <p style={{ color: '#94a3b8' }}>Chain length: {chain.length} words</p>
          <div className="chain-display" style={{ marginTop: '1rem' }}>
            {chain.map((w, i) => (
              <span key={i} className="chain-word">
                {i > 0 && <span className="chain-connector">{w[0].toUpperCase()}</span>}
                {i > 0 ? w.slice(1) : w}
              </span>
            ))}
          </div>
          <div className="game-result-btns">
            <button className="game-btn game-btn-primary" onClick={() => window.location.reload()}>Play Again</button>
            <button className="game-btn game-btn-secondary" onClick={onExit}>Back</button>
          </div>
        </div>
      </div>
    );
  }

  const lastLetter = getLastLetter();

  return (
    <div className="game-container">
      <div className="game-header">
        <h2>Word Chain</h2>
        <button className="game-back-btn" onClick={onExit}>Back</button>
      </div>

      <div className="game-score-display">Score: {score} | Chain: {chain.length}</div>

      <div className="chain-display">
        {chain.map((w, i) => (
          <span key={i} className="chain-word">{w}</span>
        ))}
      </div>

      <div className="chain-hint">
        Next word must start with <strong style={{ color: '#f59e0b', fontSize: '1.25rem' }}>{lastLetter.toUpperCase()}</strong>
        {errorCount > 0 && <span style={{ color: '#f87171' }}> ({3 - errorCount} tries left)</span>}
      </div>

      {errorMsg && <div className="chain-error">{errorMsg}</div>}

      <form onSubmit={handleSubmit} className="chain-input-area">
        <input
          ref={inputRef}
          className="chain-input"
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder={`Type a word starting with ${lastLetter.toUpperCase()}...`}
          autoComplete="off"
        />
        <button type="submit" className="chain-submit">Go</button>
      </form>

      <div style={{ textAlign: 'center' }}>
        <button className="game-btn game-btn-secondary" onClick={handleGiveUp}>Give Up</button>
      </div>
    </div>
  );
}

export default WordChain;
