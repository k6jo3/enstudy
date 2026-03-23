import { useState } from 'react';

function RoundPaceModal({ currentPace, onStart, onClose }) {
  const [wordPace, setWordPace] = useState(currentPace?.wordPace || 20);
  const [phrasePace, setPhrasePace] = useState(currentPace?.phrasePace || 10);

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <h3>Start New Round</h3>
        <p className="modal-subtitle">Set your daily learning pace</p>

        <div className="pace-setting">
          <label>Words per day: <strong>{wordPace}</strong></label>
          <input type="range" min="10" max="50" value={wordPace} onChange={e => setWordPace(Number(e.target.value))} />
        </div>

        <div className="pace-setting">
          <label>Phrases per day: <strong>{phrasePace}</strong></label>
          <input type="range" min="3" max="20" value={phrasePace} onChange={e => setPhrasePace(Number(e.target.value))} />
        </div>

        <div className="modal-btns">
          <button className="modal-btn primary" onClick={() => onStart(wordPace, phrasePace)}>Start Round</button>
          <button className="modal-btn secondary" onClick={onClose}>Cancel</button>
        </div>
      </div>
    </div>
  );
}

export default RoundPaceModal;
