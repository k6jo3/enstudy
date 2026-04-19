import { useEffect, useMemo, useRef, useState } from 'react';
import { postApi } from '../hooks/useApi';
import { useTTS } from '../hooks/useTTS';

const VOWELS = new Set(['a', 'e', 'i', 'o', 'u']);

function classifyWord(word) {
  const w = word.toLowerCase();
  const positions = [];
  for (let i = 0; i < w.length; i++) {
    if (w[i] !== 'r') continue;
    const prev = w[i - 1];
    const next = w[i + 1];
    const prevV = prev && VOWELS.has(prev);
    const nextV = next && VOWELS.has(next);
    if (prevV && !nextV) positions.push({ index: i, type: 'Vr' });
    else if (!prevV && nextV) positions.push({ index: i, type: 'rV' });
  }
  return positions;
}

function pickTarget(word) {
  const positions = classifyWord(word);
  if (positions.length === 0) return null;
  return positions[Math.floor(Math.random() * positions.length)];
}

function typeLabel(type) {
  return type === 'Vr' ? 'r 在母音後（Vr）' : 'r 在母音前（rV）';
}

function typeHint(type) {
  return type === 'Vr'
    ? '聽起來有「ㄦ」感，母音被 r 拉長／捲起（例 burn, form）'
    : '先捲舌，再清楚發母音，r 是獨立子音（例 rose, true）';
}

function RDrill({ onExit }) {
  const [items, setItems] = useState([]);
  const [idx, setIdx] = useState(0);
  const [answer, setAnswer] = useState(null);
  const [score, setScore] = useState(0);
  const [errors, setErrors] = useState(0);
  const [done, setDone] = useState(false);
  const [loading, setLoading] = useState(true);
  const { speak } = useTTS();
  const savedRef = useRef(false);

  useEffect(() => {
    fetch('/api/games/items?type=rdrill&count=15')
      .then(r => r.json())
      .then(words => {
        const usable = [];
        for (const w of words) {
          const target = pickTarget(w.word);
          if (target) usable.push({ ...w, target });
          if (usable.length >= 15) break;
        }
        setItems(usable);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const current = items[idx];

  useEffect(() => {
    if (current && answer === null) {
      const t = setTimeout(() => speak(current.word, 0.85), 150);
      return () => clearTimeout(t);
    }
  }, [current, answer, speak]);

  const handleAnswer = useMemo(() => (picked) => {
    if (!current || answer !== null) return;
    const correct = picked === current.target.type;
    setAnswer({ picked, correct });
    if (correct) setScore(s => s + 100);
    else setErrors(e => e + 1);
    speak(current.word, 0.85);
  }, [current, answer, speak]);

  const handleNext = useMemo(() => () => {
    if (idx + 1 >= items.length) {
      setDone(true);
      if (!savedRef.current) {
        savedRef.current = true;
        postApi('/games/score', {
          gameType: 'rdrill',
          score,
          duration: 0,
          details: { total: items.length, errors },
        });
      }
      return;
    }
    setIdx(i => i + 1);
    setAnswer(null);
  }, [idx, items.length, score, errors]);

  useEffect(() => {
    const onKey = (e) => {
      if (done) return;
      if (answer === null) {
        if (e.key === '1') { e.preventDefault(); handleAnswer('Vr'); }
        else if (e.key === '2') { e.preventDefault(); handleAnswer('rV'); }
      } else {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); handleNext(); }
      }
      if (e.key === '`' || (e.altKey && (e.key === 's' || e.key === 'S'))) {
        if (current?.word) { e.preventDefault(); speak(current.word, 0.85); }
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [answer, done, current, handleAnswer, handleNext, speak]);

  if (loading) return <div className="loading">Loading...</div>;

  if (items.length === 0) {
    return (
      <div className="game-container">
        <div className="game-header">
          <h2>R Position Drill</h2>
          <button className="game-back-btn" onClick={onExit}>Back</button>
        </div>
        <p style={{ textAlign: 'center', color: '#94a3b8' }}>
          目前沒有可用的 r 單字題目。
        </p>
      </div>
    );
  }

  if (done) {
    const total = items.length;
    const pct = Math.round((score / (total * 100)) * 100);
    return (
      <div className="game-container">
        <div className="game-result">
          <h3>R Drill 完成！</h3>
          <div className="final-score">{score}</div>
          <p style={{ color: '#94a3b8' }}>答對率：{pct}%（{total - errors}/{total}）</p>
          <div className="game-result-btns">
            <button className="game-btn game-btn-primary" onClick={() => window.location.reload()}>再來一輪</button>
            <button className="game-btn game-btn-secondary" onClick={onExit}>Back</button>
          </div>
        </div>
      </div>
    );
  }

  const word = current.word;
  const rIndex = current.target.index;
  const wordDisplay = word.split('').map((ch, i) => (
    <span
      key={i}
      style={{
        color: i === rIndex ? '#f472b6' : undefined,
        fontWeight: i === rIndex ? 700 : 400,
        textDecoration: i === rIndex ? 'underline' : 'none',
        textDecorationThickness: i === rIndex ? '3px' : undefined,
        textUnderlineOffset: i === rIndex ? '4px' : undefined,
      }}
    >{ch}</span>
  ));

  return (
    <div className="game-container">
      <div className="game-header">
        <h2>R Position Drill</h2>
        <button className="game-back-btn" onClick={onExit}>Back</button>
      </div>
      <div className="game-score-display">Score: {score}</div>

      <div className="spelling-prompt">
        <p style={{ color: '#94a3b8', fontSize: '0.9rem', marginBottom: '0.75rem' }}>
          聽發音，判斷被標記的 <span style={{ color: '#f472b6', fontWeight: 700 }}>r</span> 是在母音前還是後
        </p>
        <div style={{ fontSize: '3rem', letterSpacing: '0.1em', fontWeight: 600, marginBottom: '0.5rem' }}>
          {wordDisplay}
        </div>
        {current.meaning && <div className="spelling-meaning" style={{ fontSize: '1rem' }}>{current.meaning}</div>}
        <p style={{ color: '#64748b', fontSize: '0.8rem', marginTop: '0.5rem' }}>
          {idx + 1} / {items.length}
        </p>
        <button
          className="game-btn game-btn-secondary"
          onClick={() => speak(word, 0.85)}
          style={{ marginTop: '0.5rem' }}
          title="重播發音（快捷鍵：` 或 Alt+S）"
        >
          🔊 重播
        </button>
      </div>

      <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap', marginTop: '1.5rem' }}>
        {['Vr', 'rV'].map((type, i) => {
          const picked = answer?.picked === type;
          const isCorrect = answer && type === current.target.type;
          let bg = '#1f2937', border = '#334155';
          if (answer) {
            if (isCorrect) { bg = '#065f46'; border = '#10b981'; }
            else if (picked) { bg = '#7f1d1d'; border = '#ef4444'; }
          }
          return (
            <button
              key={type}
              onClick={() => handleAnswer(type)}
              disabled={answer !== null}
              style={{
                flex: '1 1 200px', maxWidth: '320px',
                padding: '1rem',
                borderRadius: '0.75rem',
                background: bg,
                border: `2px solid ${border}`,
                color: '#e2e8f0',
                cursor: answer ? 'default' : 'pointer',
                fontSize: '1rem',
                textAlign: 'left',
              }}
            >
              <div style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '0.35rem' }}>
                <span style={{ color: '#94a3b8', marginRight: '0.5rem' }}>{i + 1}</span>
                {typeLabel(type)}
              </div>
              <div style={{ fontSize: '0.85rem', color: '#94a3b8' }}>{typeHint(type)}</div>
            </button>
          );
        })}
      </div>

      {answer && (
        <div style={{ marginTop: '1.5rem', textAlign: 'center' }}>
          <p style={{ color: answer.correct ? '#22c55e' : '#f87171', fontSize: '1.1rem', marginBottom: '0.5rem' }}>
            {answer.correct ? '答對！' : `答錯，應該是 ${typeLabel(current.target.type)}`}
          </p>
          <p style={{ color: '#94a3b8', fontSize: '0.9rem' }}>
            {current.target.type === 'Vr'
              ? `在「${word}」裡，r 前面是母音 → r 收束音節，整個母音+r 發「ㄦ」`
              : `在「${word}」裡，r 後面接母音 → r 是音節開頭的子音`}
          </p>
          <button
            className="game-btn game-btn-primary"
            onClick={handleNext}
            style={{ marginTop: '0.75rem' }}
          >
            {idx + 1 >= items.length ? '查看結果' : '下一題'} （Enter）
          </button>
        </div>
      )}

      {!answer && (
        <p style={{ textAlign: 'center', color: '#64748b', fontSize: '0.8rem', marginTop: '1rem' }}>
          快捷鍵：1 = Vr，2 = rV，` 或 Alt+S 重播發音
        </p>
      )}
    </div>
  );
}

export default RDrill;
