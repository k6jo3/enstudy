import ProgressBar from '../components/ProgressBar';
import { useApi } from '../hooks/useApi';
import './StatsPage.css';

function StatsPage() {
  const { data: stats, loading } = useApi('/stats');
  const { data: errors, loading: errLoading } = useApi('/stats/errors');

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

      {stats.masteryStats && stats.masteryStats.totalTracked > 0 && (
        <div className="mastery-section">
          <h3>間隔重複熟練度</h3>
          <p className="mastery-summary">
            追蹤中：{stats.masteryStats.totalTracked} 個詞彙 | 已精通（Lv.5）：{stats.masteryStats.totalMastered} 個
          </p>
          <div className="mastery-distribution">
            {[0, 1, 2, 3, 4, 5].map(level => {
              const item = stats.masteryStats.distribution.find(d => d.mastery_level === level);
              const count = item ? item.count : 0;
              const pct = stats.masteryStats.totalTracked > 0
                ? Math.round((count / stats.masteryStats.totalTracked) * 100) : 0;
              return (
                <div key={level} className="mastery-row">
                  <span className="mastery-label">
                    Lv.{level} {'★'.repeat(level)}{'☆'.repeat(5 - level)}
                  </span>
                  <div className="mastery-bar-bg">
                    <div className={`mastery-bar-fill mastery-fill-${level}`} style={{ width: `${pct}%` }} />
                  </div>
                  <span className="mastery-count">{count}</span>
                </div>
              );
            })}
          </div>
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
