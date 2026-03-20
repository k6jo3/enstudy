import React from 'react';
import { Link } from 'react-router-dom';
import { useApi } from '../hooks/useApi';
import ProgressBar from '../components/ProgressBar';
import './Dashboard.css';

function Dashboard() {
  const { data: stats, loading } = useApi('/stats');

  if (loading) return <div className="loading">載入中...</div>;

  return (
    <div className="dashboard">
      <h1>每日英文練習</h1>
      <p className="subtitle">每天學習 20 個單字、10 個片語，穩步提升英文能力</p>

      {stats && (
        <div className="stats-overview">
          <ProgressBar
            current={stats.learnedWords}
            total={stats.totalWords}
            label="單字進度"
          />
          <ProgressBar
            current={stats.learnedPhrases}
            total={stats.totalPhrases}
            label="片語進度"
          />
        </div>
      )}

      <div className="action-cards">
        <Link to="/learn" className="action-card learn">
          <div className="card-icon">&#128214;</div>
          <h3>今日學習</h3>
          <p>學習新的單字和片語，搭配例句理解用法</p>
        </Link>

        <Link to="/quiz" className="action-card quiz">
          <div className="card-icon">&#9999;&#65039;</div>
          <h3>單字測驗</h3>
          <p>測試今日所學，包含選擇題和填空題</p>
        </Link>

        <Link to="/listen" className="action-card listen">
          <div className="card-icon">&#127911;</div>
          <h3>英聽練習</h3>
          <p>聽發音寫出單字，訓練聽力辨識能力</p>
        </Link>

        <Link to="/stats" className="action-card stats-card">
          <div className="card-icon">&#128200;</div>
          <h3>學習統計</h3>
          <p>查看學習進度、錯誤記錄和歷史紀錄</p>
        </Link>
      </div>

      {stats?.recentSessions?.length > 0 && (
        <div className="recent-sessions">
          <h3>最近學習紀錄</h3>
          <table>
            <thead>
              <tr>
                <th>日期</th>
                <th>新單字</th>
                <th>新片語</th>
                <th>複習</th>
                <th>錯誤</th>
              </tr>
            </thead>
            <tbody>
              {stats.recentSessions.map(s => (
                <tr key={s.session_date}>
                  <td>{s.session_date}</td>
                  <td>{s.new_words}</td>
                  <td>{s.new_phrases}</td>
                  <td>{s.review_count}</td>
                  <td className={s.errors_count > 0 ? 'error-count' : ''}>{s.errors_count}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default Dashboard;
