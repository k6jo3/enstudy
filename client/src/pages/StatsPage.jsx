import { useState } from 'react';
import ProgressBar from '../components/ProgressBar';
import { useApi } from '../hooks/useApi';
import { useTTS } from '../hooks/useTTS';
import './StatsPage.css';

function StatsPage() {
  const { data: stats, loading } = useApi('/stats');
  const { data: errors, loading: errLoading } = useApi('/stats/errors');
  const { data: learned } = useApi('/stats/learned');
  const [showLearned, setShowLearned] = useState(false);
  const [learnedFilter, setLearnedFilter] = useState('all');

  if (loading) return <div className="loading">載入統計資料...</div>;
  if (!stats) return null;

  return (
    <div className="stats-page">
      <h2>學習統計</h2>

      <div className="stats-grid">
        <div className="stat-card">
          <h3>單字</h3>
          <ProgressBar current={stats.learnedWords} total={stats.totalWords} label="學習進度" />
          <p className="stat-remaining">剩餘：{stats.totalWords - stats.learnedWords} 個</p>
          <p className="stat-days">預計：{Math.ceil((stats.totalWords - stats.learnedWords) / 20)} 天完成</p>
        </div>

        <div className="stat-card">
          <h3>片語</h3>
          <ProgressBar current={stats.learnedPhrases} total={stats.totalPhrases} label="學習進度" />
          <p className="stat-remaining">剩餘：{stats.totalPhrases - stats.learnedPhrases} 個</p>
          <p className="stat-days">預計：{Math.ceil((stats.totalPhrases - stats.learnedPhrases) / 10)} 天完成</p>
        </div>
      </div>

      {errors && errors.length > 0 && (
        <div className="error-list-section">
          <h3>錯誤單字記錄</h3>
          <p className="error-subtitle">這些是你曾經答錯的單字和片語，會在複習中優先出現</p>
          <div className="error-table">
            <div className="error-table-header">
              <span>單字/片語</span>
              <span>中文</span>
              <span>類型</span>
              <span>錯誤次數</span>
            </div>
            {errors.map((e, i) => (
              <div key={i} className="error-table-row">
                <span className="error-word">{e.detail?.word || e.detail?.phrase}</span>
                <span className="error-meaning">{e.detail?.meaning}</span>
                <span className="error-type">{e.item_type === 'word' ? '單字' : '片語'}</span>
                <span className="error-total">{e.total_errors}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {stats.masteryStats && stats.masteryStats.totalLearned > 0 && (
        <div className="mastery-section">
          <h3>熟練度分布</h3>
          <p className="mastery-summary">
            已學：{stats.masteryStats.totalLearned} 個詞彙 | 已測驗：{stats.masteryStats.totalTracked} 個 | 滿分暫停：{stats.masteryStats.pausedCount} 個
          </p>
          <div className="mastery-distribution">
            {stats.masteryStats.scoreTiers.map(tier => {
              const total = stats.masteryStats.totalLearned;
              const pct = total > 0 ? Math.round((tier.count / total) * 100) : 0;
              return (
                <div key={tier.name} className="mastery-row">
                  <span className="mastery-label">{tier.label}</span>
                  <div className="mastery-bar-bg">
                    <div className={`mastery-bar-fill score-fill-${tier.name}`} style={{ width: `${pct}%` }} />
                  </div>
                  <span className="mastery-count">{tier.count}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {learned && (learned.words?.length > 0 || learned.phrases?.length > 0) && (
        <div className="learned-section">
          <h3 className="learned-toggle" onClick={() => setShowLearned(!showLearned)}>
            已學詞彙 ({(learned.words?.length || 0) + (learned.phrases?.length || 0)} 個)
            {showLearned ? ' ▼' : ' ▶'}
          </h3>
          {showLearned && (
            <LearnedWordsList
              words={learned.words || []}
              phrases={learned.phrases || []}
              filter={learnedFilter}
              setFilter={setLearnedFilter}
            />
          )}
        </div>
      )}

      {stats.recentSessions?.length > 0 && (
        <div className="session-history">
          <h3>學習歷史</h3>
          <div className="session-table">
            <div className="session-header">
              <span>日期</span>
              <span>新單字</span>
              <span>新片語</span>
              <span>複習</span>
              <span>錯誤</span>
              <span>狀態</span>
            </div>
            {stats.recentSessions.map(s => (
              <div key={s.session_date} className="session-row">
                <span>{s.session_date}</span>
                <span>{s.new_words}</span>
                <span>{s.new_phrases}</span>
                <span>{s.review_count}</span>
                <span className={s.errors_count > 0 ? 'error-highlight' : ''}>{s.errors_count}</span>
                <span className={s.completed ? 'status-done' : 'status-pending'}>
                  {s.completed ? '完成' : '進行中'}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default StatsPage;

function getScoreClass(score, paused) {
  if (paused) return 'score-paused';
  if (score < 0) return 'score-untested';
  if (score === 0) return 'score-zero';
  if (score < 4) return 'score-weak';
  if (score < 8) return 'score-medium';
  return 'score-strong';
}

function LearnedWordsList({ words, phrases, filter, setFilter }) {
  const { speak } = useTTS();

  const items = filter === 'word'
    ? words.map(w => ({ ...w, display: w.word }))
    : filter === 'phrase'
    ? phrases.map(p => ({ ...p, display: p.phrase }))
    : [
        ...words.map(w => ({ ...w, display: w.word })),
        ...phrases.map(p => ({ ...p, display: p.phrase }))
      ];

  return (
    <div className="learned-list">
      <div className="learned-filters">
        <button className={filter === 'all' ? 'active' : ''} onClick={() => setFilter('all')}>全部</button>
        <button className={filter === 'word' ? 'active' : ''} onClick={() => setFilter('word')}>單字 ({words.length})</button>
        <button className={filter === 'phrase' ? 'active' : ''} onClick={() => setFilter('phrase')}>片語 ({phrases.length})</button>
      </div>
      <div className="learned-table">
        {items.map((item) => {
          const errorRate = item.review_count >= 4
            ? (item.total_wrong / item.review_count) * 100
            : null;
          const errClass = errorRate === null ? 'err-rate-na'
            : errorRate >= 30 ? 'err-rate-high'
            : errorRate >= 15 ? 'err-rate-mid'
            : 'err-rate-low';
          return (
            <div key={`${item.item_type}-${item.id}`} className="learned-row">
              <button className="speak-btn-sm" onClick={() => speak(item.display)}>&#128264;</button>
              <span className="learned-word">{item.display}</span>
              <span className="learned-meaning">{item.meaning}</span>
              <span className={`learned-mastery ${getScoreClass(item.score, item.paused)}`}>
                {item.paused ? `暫停 ${item.score}分` : item.score < 0 ? '未計分' : `${item.score} 分`}
              </span>
              <span className={`learned-error-rate ${errClass}`}>
                {errorRate === null ? '-' : `${errorRate.toFixed(1)}%`}
              </span>
              <span className="learned-date">{item.learn_date}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
