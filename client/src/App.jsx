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
import GradedReadingPage from './pages/GradedReadingPage';
import RootsPage from './pages/RootsPage';

const NAV_ITEMS = [
  { path: '/', label: '首頁' },
  { path: '/learn', label: '學習' },
  { path: '/reading', label: '閱讀' },
  { path: '/graded-reading', label: '分級閱讀' },
  { path: '/quiz', label: '測驗' },
  { path: '/grammar', label: '文法' },
  { path: '/listen', label: '聽寫' },
  { path: '/playback', label: '播放' },
  { path: '/games', label: '遊戲' },
  { path: '/roots', label: '詞根' },
  { path: '/stats', label: '統計' },
];

function App() {
  const location = useLocation();

  return (
    <div className="app">
      <nav className="navbar">
        <Link to="/" className="logo">enStudy</Link>
        <div className="nav-links">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={location.pathname === item.path ? 'active' : ''}
            >
              {item.label}
            </Link>
          ))}
        </div>
      </nav>
      <main className="main-content">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/learn" element={<LearnPage />} />
          <Route path="/reading" element={<ReadingPage />} />
          <Route path="/graded-reading" element={<GradedReadingPage />} />
          <Route path="/quiz" element={<QuizPage />} />
          <Route path="/grammar" element={<GrammarPage />} />
          <Route path="/listen" element={<ListenPage />} />
          <Route path="/playback" element={<PlaybackPage />} />
          <Route path="/games" element={<GamesPage />} />
          <Route path="/roots" element={<RootsPage />} />
          <Route path="/stats" element={<StatsPage />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
