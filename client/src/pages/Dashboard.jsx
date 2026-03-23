import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import ProgressBar from '../components/ProgressBar';
import RoundPaceModal from '../components/RoundPaceModal';
import { useApi, postApi } from '../hooks/useApi';
import './Dashboard.css';

function Dashboard() {
  const { data: stats, loading } = useApi('/stats');
  const { data: roundData, refetch: refetchRound } = useApi('/rounds/current');
  const [showPaceModal, setShowPaceModal] = useState(false);

  if (loading) return <div className="loading">載入中...</div>;

  async function handleStartRound(wordPace, phrasePace) {
    await postApi('/rounds/start', { wordPace, phrasePace });
    setShowPaceModal(false);
    refetchRound();
  }

  const round = roundData?.round;
  const progress = roundData?.progress;
  const isRoundComplete = roundData?.isComplete;

  return (
    <div className="dashboard">
      <h1>每日英文練習</h1>
      <p className="subtitle">每天學習單字和片語，穩步提升英文能力</p>

      {round && progress && (
        <div className="round-progress">
          <div className="round-header">
            <h3>第 {round.round_number} 輪</h3>
            {isRoundComplete && (
              <button className="start-round-btn" onClick={() => setShowPaceModal(true)}>
                開始第 {round.round_number + 1} 輪
              </button>
            )}
          </div>
          <ProgressBar current={progress.learnedWords} total={progress.totalWords} label="單字進度" />
          <ProgressBar current={progress.learnedPhrases} total={progress.totalPhrases} label="片語進度" />
          {round.round_number >= 2 && round.word_pace > 0 && (
            <p className="pace-info">每日節奏：{round.word_pace} 字 / {round.phrase_pace} 片語</p>
          )}
        </div>
      )}

      {!round && stats && (
        <div className="stats-overview">
          <ProgressBar current={stats.learnedWords} total={stats.totalWords} label="單字進度" />
          <ProgressBar current={stats.learnedPhrases} total={stats.totalPhrases} label="片語進度" />
        </div>
      )}

      {stats?.recentSessions?.[0] && !stats.recentSessions[0].completed && (
        <div className="active-session-banner">
          <p>進行中的學習：{stats.recentSessions[0].session_date}</p>
          <Link to="/learn">繼續學習</Link>
        </div>
      )}

      <div className="action-cards">
        <Link to="/learn" className="action-card learn">
          <div className="card-icon">&#128214;</div>
          <h3>今日學習</h3>
          <p>學習新的單字和片語</p>
        </Link>

        <Link to="/reading" className="action-card reading">
          <div className="card-icon">&#128218;</div>
          <h3>每日閱讀</h3>
          <p>閱讀短篇故事</p>
        </Link>

        <Link to="/quiz" className="action-card quiz">
          <div className="card-icon">&#9999;&#65039;</div>
          <h3>單字測驗</h3>
          <p>選擇題和填空題</p>
        </Link>

        <Link to="/grammar" className="action-card grammar-card">
          <div className="card-icon">&#128221;</div>
          <h3>文法練習</h3>
          <p>TOEIC Part 5 題型</p>
        </Link>

        <Link to="/listen" className="action-card listen">
          <div className="card-icon">&#127911;</div>
          <h3>英聽練習</h3>
          <p>聽發音寫出單字</p>
        </Link>

        <Link to="/playback" className="action-card playback">
          <div className="card-icon">&#127925;</div>
          <h3>單字播放</h3>
          <p>聽讀 100 個單字</p>
        </Link>

        <Link to="/games" className="action-card games">
          <div className="card-icon">&#127918;</div>
          <h3>英文遊戲</h3>
          <p>配對、拼字、限時挑戰</p>
        </Link>

        <Link to="/stats" className="action-card stats-card">
          <div className="card-icon">&#128200;</div>
          <h3>學習統計</h3>
          <p>進度與錯誤紀錄</p>
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

      {showPaceModal && (
        <RoundPaceModal
          currentPace={{ wordPace: 20, phrasePace: 10 }}
          onStart={handleStartRound}
          onClose={() => setShowPaceModal(false)}
        />
      )}
    </div>
  );
}

export default Dashboard;
