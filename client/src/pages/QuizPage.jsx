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
  const [finished, setFinished] = useState(false);
  const inputRef = useRef(null);
  const { speak } = useTTS();

  // Lock quizItems on first successful load (StrictMode safety)
  const loadedRef = useRef(false);
  useEffect(() => {
    if (data?.items && !loadedRef.current) {
      loadedRef.current = true;
      setQuizItems(data.items.map(item => ({
        ...item,
        item_type: item.item_type || (item.word ? 'word' : 'phrase'),
        display: item.word || item.phrase,
        hint: item.meaning,
        hasError: (item.error_count || 0) > 0
      })));
    }
  }, [data]);

  const item = quizItems[currentIndex] || null;
  // Server decides quizMode based on score; fallback to typing
  const quizMode = item?.quizMode || 'typing';

  useEffect(() => {
    if ((quizMode === 'typing' || quizMode === 'hint') && inputRef.current) {
      inputRef.current.focus();
    }
  }, [quizMode, currentIndex]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Enter' && result) {
        e.preventDefault();
        handleNext();
        return;
      }
      // Choice mode: press 1~4 to select
      if (quizMode === 'choice' && !result && item?.choices) {
        const num = parseInt(e.key);
        if (num >= 1 && num <= item.choices.length) {
          e.preventDefault();
          handleChoiceSelect(item.choices[num - 1]);
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [result, currentIndex, quizItems.length, quizMode, item]);

  const checkAnswer = (userAnswer, mode) => {
    const correct = normalizeForCompare(item.display);
    const input = normalizeForCompare(userAnswer);
    const isCorrect = input === correct || fuzzyMatch(input, correct);

    setResult(isCorrect ? 'correct' : 'wrong');
    setScore(s => ({
      correct: s.correct + (isCorrect ? 1 : 0),
      wrong: s.wrong + (isCorrect ? 0 : 1)
    }));

    postApi('/quiz/submit', {
      itemType: item.item_type,
      itemId: item.id,
      isCorrect,
      questionMode: mode
    });
  };

  const handleTypingSubmit = (e) => {
    e.preventDefault();
    if (!answer.trim() || result) return;
    checkAnswer(answer, quizMode === 'hint' ? 'hint' : 'typing');
  };

  const handleChoiceSelect = (choice) => {
    if (result) return;
    const isCorrect = choice.correct;
    setResult(isCorrect ? 'correct' : 'wrong');
    setScore(s => ({
      correct: s.correct + (isCorrect ? 1 : 0),
      wrong: s.wrong + (isCorrect ? 0 : 1)
    }));

    postApi('/quiz/submit', {
      itemType: item.item_type,
      itemId: item.id,
      isCorrect,
      questionMode: 'choice'
    });
  };

  const handleNext = () => {
    if (currentIndex < quizItems.length - 1) {
      setCurrentIndex(i => i + 1);
      setAnswer('');
      setResult(null);
    } else {
      setFinished(true);
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

        {quizMode === 'choice' && item.choices ? (
          <>
            <p className="quiz-prompt">請選擇正確的中文意思：</p>
            <h3 className="quiz-word-display">{item.display}</h3>
            <div className="choices">
              {item.choices.map((c, i) => (
                <button
                  key={i}
                  className={`choice-btn ${
                    result && c.correct ? 'choice-correct' :
                    result && !c.correct ? 'choice-dim' : ''
                  }`}
                  onClick={() => handleChoiceSelect(c)}
                  disabled={result !== null}
                >
                  <span className="choice-number">{i + 1}</span>{c.text}
                </button>
              ))}
            </div>
          </>
        ) : (
          <>
            <p className="quiz-prompt">
              {quizMode === 'hint' ? '根據提示輸入完整英文：' : '請輸入這個中文意思對應的英文：'}
            </p>
            <h3 className="quiz-hint">{item.hint}</h3>
            {item.context && (
              <div className="quiz-context-hint">
                <span className="context-icon">💡</span>
                {item.context.split(/\s+/).map((word, i) => {
                  const cleanWord = word.replace(/[.,!?;:()]/g, '').toLowerCase();
                  const targetWord = item.display.toLowerCase();
                  const isMatch = cleanWord === targetWord || (targetWord.length > 3 && cleanWord.includes(targetWord));
                  return isMatch ? ' ____ ' : word + ' ';
                })}
              </div>
            )}
            {item.part_of_speech && <span className="quiz-pos">{item.part_of_speech}</span>}
            {quizMode === 'hint' && item.hintDisplay && (
              <div className="quiz-hint-letters">{item.hintDisplay}</div>
            )}
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
        )}

        {result && (
          <div className={`result-feedback ${result}`}>
            <p>{result === 'correct' ? '正確！' : `錯誤！正確答案：${item.display}`}</p>
            {item.context && <p className="result-context"><span className="context-label">語境：</span>{item.context}</p>}
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

// Fuzzy matching:
// - Single word: allows 1 typo (levenshtein ≤ 1)
// Normalize input/answer for comparison:
// - Lowercase, trim
// - Strip common punctuation (? ! . , ; :) so user doesn't need to type "?" in "what's wrong?"
// - Keep apostrophes and hyphens (they distinguish words, e.g. "deal-breaker", "what's")
function normalizeForCompare(str) {
  if (!str) return '';
  return str.toLowerCase().trim().replace(/[?!.,;:]/g, '').replace(/\s+/g, ' ').trim();
}

// - Phrase: accepts if all correct words appear in order in input
//   (allows extra words like "so", "really", e.g. "I'm so stressed out" matches "I'm stressed out")
function fuzzyMatch(input, correct) {
  const inputWords = input.split(/\s+/);
  const correctWords = correct.split(/\s+/);
  if (correctWords.length === 1) {
    if (inputWords.length !== 1) return false;
    return correct.length > 3 && levenshtein(input, correct) <= 1;
  }
  // Phrase: subsequence match — all correct words must appear in order
  if (inputWords.length < correctWords.length) return false;
  if (inputWords.length > correctWords.length + 2) return false; // at most 2 extra words
  let ci = 0;
  for (let ii = 0; ii < inputWords.length && ci < correctWords.length; ii++) {
    if (inputWords[ii] === correctWords[ci]) ci++;
  }
  return ci === correctWords.length;
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
