import { useEffect, useRef, useState } from 'react';
import { postApi, useApi } from '../hooks/useApi';
import { useTTS } from '../hooks/useTTS';
import './QuizPage.css';

function QuizPage() {
  const { data, loading } = useApi('/quiz/items');
  const [quizItems, setQuizItems] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answer, setAnswer] = useState('');
  const [result, setResult] = useState(null);
  const [score, setScore] = useState({ correct: 0, wrong: 0 });
  const [quizMode, setQuizMode] = useState(null);
  const [choices, setChoices] = useState([]);
  const [choicesReady, setChoicesReady] = useState(false);
  const [finished, setFinished] = useState(false);
  const [choicesForId, setChoicesForId] = useState(null);
  const inputRef = useRef(null);
  const { speak } = useTTS();
  // Stable mode per question index — survives React StrictMode double-invoke
  const modeMapRef = useRef({});
  // Track which item the current async work is for (StrictMode-safe)
  const activeItemKeyRef = useRef(null);

  useEffect(() => {
    if (data?.items) {
      const items = data.items.map(item => ({
        ...item,
        item_type: item.item_type || (item.word ? 'word' : 'phrase'),
        display: item.word || item.phrase,
        hint: item.meaning,
        hasError: (item.error_count || 0) > 0
      }));
      setQuizItems(items);
    }
  }, [data]);

  useEffect(() => {
    if (quizItems.length > 0 && currentIndex < quizItems.length && !finished) {
      // Use stable random mode per index to avoid StrictMode double-invoke issues
      if (modeMapRef.current[currentIndex] === undefined) {
        modeMapRef.current[currentIndex] = Math.random() > 0.5 ? 'typing' : 'choice';
      }
      const mode = modeMapRef.current[currentIndex];
      const item = quizItems[currentIndex];
      const itemKey = `${item.item_type}:${item.id}:${currentIndex}`;
      activeItemKeyRef.current = itemKey;
      setQuizMode(mode);
      setChoicesReady(false);
      setChoices([]);
      if (mode === 'choice') {
        generateChoices(item, itemKey);
      }
    }
  }, [currentIndex, quizItems.length]);

  useEffect(() => {
    if (quizMode === 'typing' && inputRef.current) {
      inputRef.current.focus();
    }
  }, [quizMode, currentIndex]);

  const generateChoices = async (item, itemKey) => {
    const isStale = () => activeItemKeyRef.current !== itemKey;
    try {
      if (!item.hint) {
        if (!isStale()) setQuizMode('typing');
        return;
      }
      const res = await fetch(
        `/api/quiz/options?itemType=${item.item_type}&itemId=${item.id}&count=5&difficulty=${item.difficulty || ''}`
      );
      if (isStale()) return;
      if (!res.ok) {
        setQuizMode('typing');
        return;
      }
      const distractors = await res.json();
      if (isStale()) return;
      if (!Array.isArray(distractors)) {
        setQuizMode('typing');
        return;
      }

      const correctAnswer = { text: item.hint, correct: true };
      const correctLower = item.hint.toLowerCase();

      // Deduplicate distractors by meaning text
      const seenMeanings = new Set([correctLower]);
      const wrongAnswers = distractors
        .filter(d => {
          if (!d.meaning) return false;
          const dLower = d.meaning.toLowerCase();
          if (seenMeanings.has(dLower)) return false;
          // Filter out semantically similar meanings (substring check)
          const pass = dLower !== correctLower
            && !dLower.includes(correctLower)
            && !correctLower.includes(dLower);
          if (pass) seenMeanings.add(dLower);
          return pass;
        })
        .map(d => ({ text: d.meaning, correct: false }))
        .slice(0, 3);

      if (wrongAnswers.length < 2) {
        setQuizMode('typing');
        return;
      }
      // Fisher-Yates shuffle (proper, unlike sort + random)
      const allChoices = [correctAnswer, ...wrongAnswers];
      for (let i = allChoices.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [allChoices[i], allChoices[j]] = [allChoices[j], allChoices[i]];
      }
      // Defensive: ensure correct answer is present (should ALWAYS be true)
      if (!allChoices.some(c => c.correct)) {
        console.error('[Quiz BUG] correct missing after shuffle', { item, allChoices });
        setQuizMode('typing');
        return;
      }
      // Final stale check before applying state
      if (isStale()) return;
      console.log('[Quiz] setChoices', item.display, '→', allChoices.map(c => `${c.text}${c.correct ? '✓' : ''}`));
      setChoices(allChoices);
      setChoicesReady(true);
    } catch (err) {
      console.error('[Quiz] generateChoices error', err);
      if (!isStale()) setQuizMode('typing');
    }
  };

  const checkAnswer = (userAnswer) => {
    const item = quizItems[currentIndex];
    const correct = item.display.toLowerCase().trim();
    const input = userAnswer.toLowerCase().trim();
    const isCorrect = input === correct || fuzzyMatch(input, correct);

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

  const handleTypingSubmit = (e) => {
    e.preventDefault();
    if (!answer.trim() || result) return;
    checkAnswer(answer);
  };

  const handleChoiceSelect = (choice) => {
    if (result) return;
    const isCorrect = choice.correct;
    setResult(isCorrect ? 'correct' : 'wrong');
    setScore(s => ({
      correct: s.correct + (isCorrect ? 1 : 0),
      wrong: s.wrong + (isCorrect ? 0 : 1)
    }));

    const item = quizItems[currentIndex];
    postApi('/quiz/submit', {
      itemType: item.item_type,
      itemId: item.id,
      isCorrect
    });
  };

  const handleNext = () => {
    if (currentIndex < quizItems.length - 1) {
      // Invalidate any in-flight generateChoices from the previous question
      activeItemKeyRef.current = null;
      setCurrentIndex(i => i + 1);
      setAnswer('');
      setResult(null);
      setChoices([]);
      setChoicesReady(false);
    } else {
      setFinished(true);
      // Mark daily session as complete when quiz finishes
      postApi('/daily/complete', {}).catch(() => {});
    }
  };

  if (loading) return <div className="loading">載入測驗...</div>;

  if (!data || quizItems.length === 0) {
    return (
      <div className="quiz-page">
        <div className="quiz-empty">
          <h2>尚無測驗題目</h2>
          <p>請先完成「今日學習」，學過的單字才會出現在測驗中。</p>
        </div>
      </div>
    );
  }

  if (finished) {
    const total = score.correct + score.wrong;
    const pct = total > 0 ? Math.round((score.correct / total) * 100) : 0;
    return (
      <div className="quiz-page">
        <div className="quiz-result-summary">
          <h2>測驗完成！</h2>
          <div className="score-circle">
            <span className="score-pct">{pct}%</span>
          </div>
          <div className="score-details">
            <span className="correct-score">正確：{score.correct}</span>
            <span className="wrong-score">錯誤：{score.wrong}</span>
          </div>
          <p className="quiz-info">本次測驗 {total} 題（學習天數：{data.totalDays}，已學 {data.totalLearned} 個詞彙）</p>
          <button className="restart-btn" onClick={() => window.location.reload()}>再測一次</button>
        </div>
      </div>
    );
  }

  const item = quizItems[currentIndex];

  return (
    <div className="quiz-page">
      <div className="quiz-header">
        <h2>單字測驗</h2>
        <span className="quiz-progress">{currentIndex + 1} / {quizItems.length}</span>
      </div>

      <div className="quiz-info-bar">
        <span className="quiz-info-text">測驗範圍：所有學過的單字與片語（共 {data.totalLearned} 個）</span>
      </div>

      <div className="quiz-score-bar">
        <span className="correct-count">&#10003; {score.correct}</span>
        <span className="wrong-count">&#10007; {score.wrong}</span>
      </div>

      <div className={`quiz-card ${item.hasError ? 'has-error' : ''}`}>
        {item.hasError && <span className="error-badge">易錯字</span>}

        {quizMode === 'typing' ? (
          <>
            <p className="quiz-prompt">請輸入這個中文意思對應的英文：</p>
            <h3 className="quiz-hint">{item.hint}</h3>
            {item.part_of_speech && <span className="quiz-pos">{item.part_of_speech}</span>}
            <form onSubmit={handleTypingSubmit}>
              <input
                ref={inputRef}
                type="text"
                className={`quiz-input ${result === 'correct' ? 'input-correct' : result === 'wrong' ? 'input-wrong' : ''}`}
                value={answer}
                onChange={e => setAnswer(e.target.value)}
                placeholder="輸入英文..."
                disabled={result !== null}
                autoComplete="off"
              />
              {!result && <button type="submit" className="submit-btn">確認</button>}
            </form>
          </>
        ) : quizMode === 'choice' && choicesReady && choices.length > 0 && choices.some(c => c.correct) ? (
          <>
            <p className="quiz-prompt">請選擇正確的中文意思：</p>
            <h3 className="quiz-word-display">{item.display}</h3>
            <div className="choices">
              {choices.map((c, i) => (
                <button
                  key={i}
                  className={`choice-btn ${
                    result && c.correct ? 'choice-correct' :
                    result && !c.correct ? 'choice-dim' : ''
                  }`}
                  onClick={() => handleChoiceSelect(c)}
                  disabled={result !== null}
                >
                  {c.text}
                </button>
              ))}
            </div>
          </>
        ) : (
          <>
            <p className="quiz-prompt">載入選項中...</p>
            <h3 className="quiz-word-display">{item.display}</h3>
          </>
        )}

        {result && (
          <div className={`result-feedback ${result}`}>
            <p>{result === 'correct' ? '正確！' : `錯誤！正確答案：${item.display}`}</p>
            {item.example && <p className="result-example">例句：{item.example}</p>}
            <button className="speak-btn-inline" onClick={() => speak(item.display)}>&#128264; 聽發音</button>
            <button className="next-btn" onClick={handleNext}>
              {currentIndex < quizItems.length - 1 ? '下一題' : '查看結果'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// Fuzzy matching: single word allows 1 typo, phrase checks each word individually
function fuzzyMatch(input, correct) {
  const inputWords = input.split(/\s+/);
  const correctWords = correct.split(/\s+/);

  // Word count must match
  if (inputWords.length !== correctWords.length) return false;

  // For single short word: allow levenshtein <= 1
  if (correctWords.length === 1) {
    return correct.length > 3 && levenshtein(input, correct) <= 1;
  }

  // For phrases: each word must be exact match
  // (user needs to spell every word correctly)
  return false;
}

function levenshtein(a, b) {
  const m = a.length, n = b.length;
  const dp = Array.from({ length: m + 1 }, () => Array(n + 1).fill(0));
  for (let i = 0; i <= m; i++) dp[i][0] = i;
  for (let j = 0; j <= n; j++) dp[0][j] = j;
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      dp[i][j] = a[i-1] === b[j-1]
        ? dp[i-1][j-1]
        : 1 + Math.min(dp[i-1][j], dp[i][j-1], dp[i-1][j-1]);
    }
  }
  return dp[m][n];
}

export default QuizPage;
