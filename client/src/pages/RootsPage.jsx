import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useApi } from '../hooks/useApi';
import './RootsPage.css';

// ---- Main Page ----
function RootsPage() {
  const [searchParams] = useSearchParams();
  const [tab, setTab] = useState('browse');
  const preselectedRoot = searchParams.get('root');

  // If arrived via word card link, switch to browse tab
  useEffect(() => {
    if (preselectedRoot) setTab('browse');
  }, [preselectedRoot]);

  return (
    <div className="roots-page">
      <h1 className="roots-title">詞根學習</h1>
      <div className="roots-tabs">
        <button className={`roots-tab ${tab === 'browse' ? 'active' : ''}`} onClick={() => setTab('browse')}>
          詞根瀏覽
        </button>
        <button className={`roots-tab ${tab === 'quiz' ? 'active' : ''}`} onClick={() => setTab('quiz')}>
          詞根測驗
        </button>
      </div>
      {tab === 'browse' ? <RootsBrowser preselectedRoot={preselectedRoot} /> : <RootsQuiz />}
    </div>
  );
}

// ---- Browser ----
function RootsBrowser({ preselectedRoot }) {
  const { data, loading, error } = useApi('/roots');
  const [selectedRoot, setSelectedRoot] = useState(null);
  const [search, setSearch] = useState('');

  useEffect(() => {
    if (preselectedRoot && data?.roots) {
      const found = data.roots.find(r => r.root === preselectedRoot);
      if (found) setSelectedRoot(found);
    }
  }, [preselectedRoot, data]);

  if (loading) return <div className="loading">載入中...</div>;
  if (error) return <div className="loading">載入失敗：{error}</div>;

  const roots = data?.roots || [];

  if (roots.length === 0) {
    return (
      <div className="roots-empty">
        <p>詞根資料尚未載入。</p>
        <p className="roots-empty-hint">請等待 etymology.json 生成並重啟伺服器。</p>
      </div>
    );
  }

  if (selectedRoot) {
    return <RootDetail root={selectedRoot} onBack={() => setSelectedRoot(null)} />;
  }

  const filtered = search
    ? roots.filter(r => r.root.includes(search.toLowerCase()) || r.meaning_zh.includes(search))
    : roots;

  return (
    <div className="roots-browser">
      <div className="roots-stats">共 {roots.length} 個詞根，涵蓋 {roots.reduce((s, r) => s + r.words.length, 0)} 個單字</div>
      <input
        className="roots-search"
        placeholder="搜尋詞根或中文意思..."
        value={search}
        onChange={e => setSearch(e.target.value)}
      />
      <div className="roots-grid">
        {filtered.map(r => (
          <button key={r.root} className="root-card" onClick={() => setSelectedRoot(r)}>
            <div className="root-name">{r.root}-</div>
            <div className="root-meaning">{r.meaning_zh}</div>
            <div className="root-meta">{r.origin} · {r.words.length} 個單字</div>
          </button>
        ))}
      </div>
    </div>
  );
}

// ---- Root Detail ----
function RootDetail({ root, onBack }) {
  return (
    <div className="root-detail">
      <button className="back-to-list-btn" onClick={onBack}>← 返回詞根列表</button>
      <div className="root-detail-header">
        <span className="root-detail-name">{root.root}-</span>
        <span className="root-detail-meaning">{root.meaning_zh}</span>
        <span className="root-detail-origin">{root.origin}</span>
      </div>
      <div className="root-words-list">
        {root.words.map(w => (
          <div key={w.id} className="root-word-item">
            <span className="root-word-en">{w.word}</span>
            <span className="root-word-zh">{w.meaning}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ---- Quiz ----
function RootsQuiz() {
  const [phase, setPhase] = useState('idle');
  const [questions, setQuestions] = useState([]);
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  async function startQuiz() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/roots/quiz?count=10');
      const data = await res.json();
      if (!data.questions || data.questions.length === 0) {
        setError('詞根資料尚未載入，無法出題。');
        return;
      }
      setQuestions(data.questions);
      setCurrent(0);
      setAnswers({});
      setPhase('playing');
    } catch (e) {
      setError('載入失敗：' + e.message);
    } finally {
      setLoading(false);
    }
  }

  if (phase === 'idle') {
    return (
      <div className="quiz-idle">
        <div className="quiz-idle-card">
          <div className="quiz-idle-icon">📚</div>
          <h3 className="quiz-idle-title">詞根測驗</h3>
          <p className="quiz-idle-desc">測試你對詞根意思的掌握程度，共 10 題，包含三種題型：</p>
          <ul className="quiz-type-list">
            <li>詞根 → 意思（uni- 是什麼意思？）</li>
            <li>單字 → 詞根意思（telescope 中 tele- 是什麼意思？）</li>
            <li>意思 → 找單字（哪個字含有「生命」這個詞根？）</li>
          </ul>
          {error && <p className="quiz-error">{error}</p>}
          <button className="quiz-start-btn" onClick={startQuiz} disabled={loading}>
            {loading ? '載入中...' : '開始測驗'}
          </button>
        </div>
      </div>
    );
  }

  if (phase === 'done') {
    const correct = questions.filter((q, i) => answers[i] === q.correct).length;
    const pct = Math.round((correct / questions.length) * 100);
    return (
      <div className="quiz-done">
        <div className="quiz-score-card">
          <p className="quiz-score-label">測驗結果</p>
          <p className="quiz-score-number">{correct} / {questions.length}</p>
          <p className="quiz-score-pct">{pct}%</p>
        </div>
        <div className="quiz-review">
          {questions.map((q, i) => {
            const isCorrect = answers[i] === q.correct;
            return (
              <div key={i} className={`review-item ${isCorrect ? 'correct' : 'wrong'}`}>
                <div className="review-q">{q.question}</div>
                <div className="review-a">✓ {q.correct}</div>
                {!isCorrect && <div className="review-wrong">✗ 你答：{answers[i] || '（未作答）'}</div>}
              </div>
            );
          })}
        </div>
        <button className="quiz-start-btn" onClick={startQuiz}>再來一次</button>
      </div>
    );
  }

  // Playing
  const q = questions[current];
  const isAnswered = answers[current] !== undefined;

  function handleAnswer(option) {
    if (isAnswered) return;
    setAnswers(prev => ({ ...prev, [current]: option }));
  }

  function handleNext() {
    if (current + 1 >= questions.length) setPhase('done');
    else setCurrent(prev => prev + 1);
  }

  return (
    <div className="quiz-playing">
      <div className="quiz-progress-row">
        <div className="quiz-progress-bar">
          <div className="quiz-progress-fill" style={{ width: `${((current + 1) / questions.length) * 100}%` }} />
        </div>
        <span className="quiz-progress-text">{current + 1} / {questions.length}</span>
      </div>

      <div className="quiz-question-card">
        {q.type !== 'find_word' && q.origin && (
          <span className="quiz-origin-badge">{q.origin}</span>
        )}
        <p className="quiz-q-text">{q.question}</p>
        <div className="quiz-options">
          {q.options.map(opt => {
            let cls = 'quiz-option';
            if (isAnswered) {
              if (opt === q.correct) cls += ' correct';
              else if (opt === answers[current]) cls += ' wrong';
            }
            return (
              <button key={opt} className={cls} onClick={() => handleAnswer(opt)}>
                {opt}
              </button>
            );
          })}
        </div>
        {isAnswered && (
          <button className="quiz-next-btn" onClick={handleNext}>
            {current + 1 >= questions.length ? '查看結果 →' : '下一題 →'}
          </button>
        )}
      </div>
    </div>
  );
}

export default RootsPage;
