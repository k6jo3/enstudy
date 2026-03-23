import { useState } from 'react';
import { postApi, useApi } from '../hooks/useApi';
import './ReadingPage.css';

function ReadingPage() {
  const { data, loading, error, refetch } = useApi('/reading');
  const [showMeanings, setShowMeanings] = useState({});
  const [quizMode, setQuizMode] = useState(false);
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);

  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div className="loading">Error: {error}</div>;
  if (!data?.story) return (
    <div className="reading-page">
      <h2>Every Day Reading</h2>
      <div className="all-done-card">
        <p>All stories have been completed! New stories coming soon.</p>
      </div>
    </div>
  );

  const { story } = data;

  function toggleMeaning(word) {
    setShowMeanings(prev => ({ ...prev, [word]: !prev[word] }));
  }

  function highlightContent(content) {
    if (!story.vocabulary?.length) return content;
    const regex = new RegExp(`\\b(${story.vocabulary.join('|')})\\b`, 'gi');
    const parts = content.split(regex);
    return parts.map((part, i) => {
      const lower = part.toLowerCase();
      const isVocab = story.vocabulary.some(v => v.toLowerCase() === lower);
      if (isVocab) {
        return (
          <span key={i} className="vocab-highlight" onClick={() => toggleMeaning(lower)}>
            {part}
            {showMeanings[lower] && story.vocab_meanings[lower] && (
              <span className="vocab-tooltip">{story.vocab_meanings[lower]}</span>
            )}
          </span>
        );
      }
      return part;
    });
  }

  function handleAnswer(qIdx, optIdx) {
    if (submitted) return;
    setAnswers(prev => ({ ...prev, [qIdx]: optIdx }));
  }

  async function handleSubmitQuiz() {
    setSubmitted(true);
    const correct = story.questions.filter((q, i) => answers[i] === q.answer).length;
    const score = Math.round((correct / story.questions.length) * 100);
    await postApi('/reading/complete', { storyId: story.id || story.story_id, quizScore: score });
  }

  const quizScore = submitted
    ? story.questions.filter((q, i) => answers[i] === q.answer).length
    : 0;

  return (
    <div className="reading-page">
      <div className="story-header">
        <div className="series-badge">{story.series_name} - Episode {story.episode}</div>
        <h2>{story.title}</h2>
      </div>

      <div className="story-card">
        <div className="story-content">
          {story.content.split('\n').map((para, i) => (
            <p key={i}>{highlightContent(para)}</p>
          ))}
        </div>
        <div className="vocab-hint">Click highlighted words to see meanings</div>
      </div>

      {!quizMode ? (
        <button className="quiz-start-btn" onClick={() => setQuizMode(true)}>
          Reading Comprehension Quiz
        </button>
      ) : (
        <div className="quiz-section">
          <h3>Comprehension Questions</h3>
          {story.questions.map((q, qIdx) => (
            <div key={qIdx} className="reading-question">
              <p className="q-text">{qIdx + 1}. {q.question}</p>
              <div className="q-options">
                {q.options.map((opt, oIdx) => {
                  let cls = 'q-option';
                  if (submitted) {
                    if (oIdx === q.answer) cls += ' correct';
                    else if (answers[qIdx] === oIdx) cls += ' wrong';
                  } else if (answers[qIdx] === oIdx) {
                    cls += ' selected';
                  }
                  return (
                    <button key={oIdx} className={cls} onClick={() => handleAnswer(qIdx, oIdx)}>
                      {opt}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
          {!submitted ? (
            <button
              className="quiz-submit-btn"
              onClick={handleSubmitQuiz}
              disabled={Object.keys(answers).length < story.questions.length}
            >Submit</button>
          ) : (
            <div className="quiz-result">
              <p>Score: {quizScore}/{story.questions.length} correct</p>
              <button className="next-story-btn" onClick={() => { refetch(); setQuizMode(false); setAnswers({}); setSubmitted(false); }}>
                Next Story
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default ReadingPage;
