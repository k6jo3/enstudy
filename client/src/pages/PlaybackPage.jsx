import { useCallback, useEffect, useRef, useState } from 'react';
import { postApi } from '../hooks/useApi';
import './PlaybackPage.css';

function PlaybackPage() {
  const [items, setItems] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [loading, setLoading] = useState(true);
  const [phase, setPhase] = useState('idle'); // idle, word, spelling, repeat, meaning
  const queueRef = useRef([]);
  const queueIndexRef = useRef(0);
  const playingRef = useRef(false);
  const timerRef = useRef(null);
  const hasZhVoice = useRef(false);

  useEffect(() => {
    fetch('/api/playback/items?count=100')
      .then(r => r.json())
      .then(data => { setItems(data); setLoading(false); })
      .catch(() => setLoading(false));

    // Check zh-TW voice availability
    const checkVoices = () => {
      const voices = speechSynthesis.getVoices();
      hasZhVoice.current = voices.some(v => v.lang.startsWith('zh'));
    };
    checkVoices();
    speechSynthesis.onvoiceschanged = checkVoices;

    return () => {
      speechSynthesis.cancel();
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  const speakText = useCallback((text, lang = 'en-US', rate = 0.9) => {
    return new Promise((resolve) => {
      const u = new SpeechSynthesisUtterance(text);
      u.lang = lang;
      u.rate = rate;
      const voices = speechSynthesis.getVoices();
      const prefix = lang.split('-')[0];
      const voice = voices.find(v => v.lang.startsWith(prefix));
      if (voice) u.voice = voice;
      u.onend = () => resolve();
      u.onerror = () => resolve();
      speechSynthesis.speak(u);
    });
  }, []);

  const wait = useCallback((ms) => {
    return new Promise((resolve) => {
      timerRef.current = setTimeout(resolve, ms);
    });
  }, []);

  const playItem = useCallback(async (item, index) => {
    if (!playingRef.current) return;

    if (item.item_type === 'word' && item.word) {
      // Phase 1: Say the word
      setPhase('word');
      await speakText(item.word, 'en-US', 0.9);
      if (!playingRef.current) return;
      await wait(600);

      // Phase 2: Spell letters
      setPhase('spelling');
      for (const letter of item.word.toUpperCase()) {
        if (!playingRef.current) return;
        await speakText(letter, 'en-US', 0.8);
        await wait(400);
      }
      if (!playingRef.current) return;
      await wait(600);

      // Phase 3: Repeat word
      setPhase('repeat');
      await speakText(item.word, 'en-US', 0.85);
      if (!playingRef.current) return;
      await wait(800);

      // Phase 4: Chinese meaning
      setPhase('meaning');
      if (hasZhVoice.current && item.meaning) {
        await speakText(item.meaning, 'zh-TW', 0.9);
      }
      await wait(1000);
    } else if (item.phrase) {
      // Phrase: say twice + meaning
      setPhase('word');
      await speakText(item.phrase, 'en-US', 0.85);
      if (!playingRef.current) return;
      await wait(800);

      setPhase('repeat');
      await speakText(item.phrase, 'en-US', 0.75);
      if (!playingRef.current) return;
      await wait(800);

      setPhase('meaning');
      if (hasZhVoice.current && item.meaning) {
        await speakText(item.meaning, 'zh-TW', 0.9);
      }
      await wait(1000);
    }

    // Record play
    if (playingRef.current) {
      postApi('/playback/played', { itemType: item.item_type, itemId: item.id }).catch(() => {});
    }
  }, [speakText, wait]);

  const startPlayback = useCallback(async () => {
    playingRef.current = true;
    setIsPlaying(true);

    for (let i = currentIndex; i < items.length; i++) {
      if (!playingRef.current) break;
      setCurrentIndex(i);
      await playItem(items[i], i);
    }

    if (playingRef.current) {
      // Finished all items
      setPhase('idle');
      setIsPlaying(false);
      playingRef.current = false;
    }
  }, [currentIndex, items, playItem]);

  function handlePause() {
    playingRef.current = false;
    setIsPlaying(false);
    speechSynthesis.cancel();
    if (timerRef.current) clearTimeout(timerRef.current);
    setPhase('idle');
  }

  function handleSkip() {
    speechSynthesis.cancel();
    if (timerRef.current) clearTimeout(timerRef.current);
    if (currentIndex < items.length - 1) {
      setCurrentIndex(prev => prev + 1);
    }
  }

  function handlePrev() {
    speechSynthesis.cancel();
    if (timerRef.current) clearTimeout(timerRef.current);
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
    }
  }

  if (loading) return <div className="loading">Loading playback items...</div>;

  const item = items[currentIndex];
  const phaseLabel = { idle: '', word: 'Pronouncing', spelling: 'Spelling', repeat: 'Repeating', meaning: 'Meaning' };

  return (
    <div className="playback-page">
      <h2>Word Playback</h2>
      <p className="playback-subtitle">{items.length} items loaded</p>

      {item && (
        <div className="playback-display">
          <div className="playback-card">
            <div className="playback-word">
              {item.word || item.phrase}
            </div>
            {item.phonetic && <div className="playback-phonetic">{item.phonetic}</div>}
            <div className="playback-meaning">{item.meaning}</div>
            {item.part_of_speech && <div className="playback-pos">{item.part_of_speech}</div>}
            {phase !== 'idle' && (
              <div className="playback-phase">{phaseLabel[phase]}</div>
            )}
            {phase === 'spelling' && item.word && (
              <div className="spelling-display">
                {item.word.toUpperCase().split('').map((l, i) => (
                  <span key={i} className="spell-letter">{l}</span>
                ))}
              </div>
            )}
          </div>

          <div className="playback-progress">
            <div className="progress-bar-bg">
              <div className="progress-bar-fill" style={{ width: `${((currentIndex + 1) / items.length) * 100}%` }} />
            </div>
            <span className="progress-text">{currentIndex + 1} / {items.length}</span>
          </div>

          <div className="playback-controls">
            <button className="ctrl-btn" onClick={handlePrev} disabled={currentIndex === 0}>
              &#9664;&#9664;
            </button>
            {isPlaying ? (
              <button className="ctrl-btn play-btn" onClick={handlePause}>&#10074;&#10074;</button>
            ) : (
              <button className="ctrl-btn play-btn" onClick={startPlayback}>&#9654;</button>
            )}
            <button className="ctrl-btn" onClick={handleSkip} disabled={currentIndex >= items.length - 1}>
              &#9654;&#9654;
            </button>
          </div>
        </div>
      )}

      {items.length === 0 && (
        <div className="playback-empty">
          <p>No learned words yet. Start learning first!</p>
        </div>
      )}
    </div>
  );
}

export default PlaybackPage;
