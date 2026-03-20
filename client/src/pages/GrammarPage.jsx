import { useState } from 'react';
import { postApi } from '../hooks/useApi';
import { useTTS } from '../hooks/useTTS';
import './GrammarPage.css';

const TOPIC_LABELS = {
  word_form: '詞性判斷',
  verb_tense: '動詞時態',
  agreement: '主詞動詞一致',
  preposition: '介系詞',
  pronoun: '代名詞',
  article: '冠詞',
  conjunction: '連接詞',
  passive: '被動語態',
  comparative: '比較級',
  modal: '助動詞',
};

function GrammarPage() {
  const [topic, setTopic] = useState('');
  const [started, setStarted] = useState(false);
  const [items, setItems] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selected, setSelected] = useState(null);
  const [result, setResult] = useState(null);
  const [feedback, setFeedback] = useState(null);
  const [score, setScore] = useState({ correct: 0, wrong: 0 });
  const [finished, setFinished] = useState(false);
  const [loadingItems, setLoadingItems] = useState(false);
  const { speak } = useTTS();

  const startPractice = async () => {
    setLoadingItems(true);
    try {
      const url = topic ? `/api/grammar/items?count=15&topic=${topic}` : '/api/grammar/items?count=15';
      const res = await fetch(url);
      const data = await res.json();
      if (data.items && data.items.length > 0) {
        setItems(data.items);
        setStarted(true);
      }
    } catch (err) {
      console.error('Failed to load grammar items:', err);
    }
    setLoadingItems(false);
  };

  const handleSelect = async (index) => {
    if (result) return;
    setSelected(index);

    const item = items[currentIndex];
    const res = await postApi('/grammar/submit', {
      questionId: item.id,
      selectedIndex: index,
    });

    setResult(res.correct ? 'correct' : 'wrong');
    setFeedback(res);
    setScore(s => ({
      correct: s.correct + (res.correct ? 1 : 0),
      wrong: s.wrong + (res.correct ? 0 : 1),
    }));
  };

  const handleNext = () => {
    if (currentIndex < items.length - 1) {
      setCurrentIndex(i => i + 1);
      setSelected(null);
      setResult(null);
      setFeedback(null);
    } else {
      setFinished(true);
    }
  };

  // Start screen
  if (!started) {
    return (
      <div className="grammar-page">
        <div className="grammar-start">
          <h2>文法填空練習</h2>
          <p className="grammar-desc">多益 Part 5 — 選出最適合填入空格的答案</p>

          <div className="topic-selector">
            <label>選擇主題：</label>
            <select value={topic} onChange={e => setTopic(e.target.value)}>
              <option value="">全部主題</option>
              {Object.entries(TOPIC_LABELS).map(([key, label]) => (
                <option key={key} value={key}>{label}</option>
              ))}
            </select>
          </div>

          <button
            className="start-btn"
            onClick={startPractice}
            disabled={loadingItems}
          >
            {loadingItems ? '載入中...' : '開始練習'}
          </button>
        </div>
      </div>
    );
  }

  // Finished screen
  if (finished) {
    const total = score.correct + score.wrong;
    const pct = total > 0 ? Math.round((score.correct / total) * 100) : 0;
    return (
      <div className="grammar-page">
        <div className="grammar-result-summary">
          <h2>練習完成！</h2>
          <div className="score-circle">
            <span className="score-pct">{pct}%</span>
          </div>
          <div className="score-details">
            <span className="correct-score">正確：{score.correct}</span>
            <span className="wrong-score">錯誤：{score.wrong}</span>
          </div>
          <p className="grammar-info">本次練習 {total} 題</p>
          <button className="restart-btn" onClick={() => {
            setStarted(false);
            setItems([]);
            setCurrentIndex(0);
            setSelected(null);
            setResult(null);
            setFeedback(null);
            setScore({ correct: 0, wrong: 0 });
            setFinished(false);
          }}>再練一次</button>
        </div>
      </div>
    );
  }

  const item = items[currentIndex];
  const parts = item.sentence.split('_____');

  return (
    <div className="grammar-page">
      <div className="grammar-header">
        <h2>文法填空</h2>
        <span className="grammar-progress">{currentIndex + 1} / {items.length}</span>
      </div>

      <div className="grammar-score-bar">
        <span className="correct-count">&#10003; {score.correct}</span>
        <span className="wrong-count">&#10007; {score.wrong}</span>
        <span className="grammar-topic-badge">{TOPIC_LABELS[item.topic] || item.topic}</span>
      </div>

      <div className="grammar-card">
        <p className="grammar-sentence">
          {parts[0]}
          <span className={`grammar-blank ${result === 'correct' ? 'blank-correct' : result === 'wrong' ? 'blank-wrong' : ''}`}>
            {result ? item.options[feedback.answer] : '_____'}
          </span>
          {parts[1]}
        </p>

        <div className="grammar-choices">
          {item.options.map((opt, i) => (
            <button
              key={i}
              className={`grammar-choice-btn ${
                result && i === feedback.answer ? 'choice-correct' :
                result && i === selected && i !== feedback.answer ? 'choice-wrong' :
                result ? 'choice-dim' : ''
              }`}
              onClick={() => handleSelect(i)}
              disabled={result !== null}
            >
              <span className="choice-letter">{String.fromCharCode(65 + i)}</span>
              {opt}
            </button>
          ))}
        </div>

        {result && feedback && (
          <div className={`result-feedback ${result}`}>
            <p>{result === 'correct' ? '正確！' : '錯誤！'}</p>
            <p className="grammar-explanation">{feedback.explanation}</p>
            {item.grammar_point && (
              <span className="grammar-point-tag">{item.grammar_point}</span>
            )}
            <div className="grammar-actions">
              <button className="speak-btn-inline" onClick={() => speak(item.sentence.replace('_____', item.options[feedback.answer]))}>
                &#128264; 聽整句
              </button>
              <button className="next-btn" onClick={handleNext}>
                {currentIndex < items.length - 1 ? '下一題' : '查看結果'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default GrammarPage;
