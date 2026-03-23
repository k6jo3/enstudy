import { Link, Route, Routes, useLocation } from 'react-router-dom';
import './App.css';
import Dashboard from './pages/Dashboard';
import GrammarPage from './pages/GrammarPage';
import LearnPage from './pages/LearnPage';
import ListenPage from './pages/ListenPage';
import QuizPage from './pages/QuizPage';
import StatsPage from './pages/StatsPage';
import ReadingPage from './pages/ReadingPage';
import PlaybackPage from './pages/PlaybackPage';
import GamesPage from './pages/GamesPage';

function App() {
  const location = useLocation();

  return (
    <div className="app">
      <nav className="navbar">
        <Link to="/" className="logo">enStudy</Link>
        <div className="nav-links">
          <Link to="/" className={location.pathname === '/' ? 'active' : ''}>首頁</Link>
          <Link to="/learn" className={location.pathname === '/learn' ? 'active' : ''}>學習</Link>
          <Link to="/reading" className={location.pathname === '/reading' ? 'active' : ''}>閱讀</Link>
          <Link to="/quiz" className={location.pathname === '/quiz' ? 'active' : ''}>測驗</Link>
          <Link to="/grammar" className={location.pathname === '/grammar' ? 'active' : ''}>文法</Link>
          <Link to="/listen" className={location.pathname === '/listen' ? 'active' : ''}>英聽</Link>
          <Link to="/playback" className={location.pathname === '/playback' ? 'active' : ''}>播放</Link>
          <Link to="/games" className={location.pathname === '/games' ? 'active' : ''}>遊戲</Link>
          <Link to="/stats" className={location.pathname === '/stats' ? 'active' : ''}>統計</Link>
        </div>
      </nav>
      <main className="main-content">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/learn" element={<LearnPage />} />
          <Route path="/reading" element={<ReadingPage />} />
          <Route path="/quiz" element={<QuizPage />} />
          <Route path="/grammar" element={<GrammarPage />} />
          <Route path="/listen" element={<ListenPage />} />
          <Route path="/playback" element={<PlaybackPage />} />
          <Route path="/games" element={<GamesPage />} />
          <Route path="/stats" element={<StatsPage />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
