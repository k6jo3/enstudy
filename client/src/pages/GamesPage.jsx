import { useState } from 'react';
import MatchGame from '../components/MatchGame';
import RDrill from '../components/RDrill';
import SpellingGame from '../components/SpellingGame';
import TimedChallenge from '../components/TimedChallenge';
import WordChain from '../components/WordChain';
import './GamesPage.css';

const GAMES = [
  { id: 'match', name: 'Match Pairs', icon: '\u{1F3B4}', desc: 'Flip and match English-Chinese pairs', color: '#f472b6' },
  { id: 'spelling', name: 'Spelling Bee', icon: '\u{1F4DD}', desc: 'See the meaning, spell the word', color: '#a78bfa' },
  { id: 'timed', name: 'Speed Quiz', icon: '\u{23F1}', desc: '60 seconds — how many can you answer?', color: '#f59e0b' },
  { id: 'wordchain', name: 'Word Chain', icon: '\u{1F517}', desc: 'Last letter starts the next word', color: '#34d399' },
  { id: 'rdrill', name: 'R Position', icon: '\u{1F3AF}', desc: '聽發音判斷 r 在母音前還是後', color: '#38bdf8' },
];

function GamesPage() {
  const [activeGame, setActiveGame] = useState(null);

  if (activeGame === 'match') return <MatchGame onExit={() => setActiveGame(null)} />;
  if (activeGame === 'spelling') return <SpellingGame onExit={() => setActiveGame(null)} />;
  if (activeGame === 'timed') return <TimedChallenge onExit={() => setActiveGame(null)} />;
  if (activeGame === 'wordchain') return <WordChain onExit={() => setActiveGame(null)} />;
  if (activeGame === 'rdrill') return <RDrill onExit={() => setActiveGame(null)} />;

  return (
    <div className="games-page">
      <h2>English Games</h2>
      <p className="games-subtitle">Practice vocabulary through fun games</p>
      <div className="game-cards">
        {GAMES.map(g => (
          <div key={g.id} className="game-card" style={{ borderLeftColor: g.color }} onClick={() => setActiveGame(g.id)}>
            <div className="game-icon">{g.icon}</div>
            <h3>{g.name}</h3>
            <p>{g.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default GamesPage;
