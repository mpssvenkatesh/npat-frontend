import React, { useState } from 'react';
import './StartScreen.css';

function StartScreen({ onCreateRoom, onJoinRoom }) {
  const [mode, setMode] = useState(null); // null, 'create', 'join'
  const [playerName, setPlayerName] = useState('');
  const [roomCode, setRoomCode] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (mode === 'create') {
      onCreateRoom(playerName);
    } else if (mode === 'join') {
      onJoinRoom(roomCode, playerName);
    }
  };

  if (!mode) {
    return (
      <div className="start-screen card">
        <div className="emoji-header">🎮</div>
        <h2>Ready to Play?</h2>
        <p className="description">
          Choose your mode to start playing with friends!
        </p>
        <div className="mode-buttons">
          <button 
            className="button button-primary"
            onClick={() => setMode('create')}
          >
            Create Room
          </button>
          <button 
            className="button button-secondary"
            onClick={() => setMode('join')}
          >
            Join Room
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="start-screen card">
      <button 
        className="back-button"
        onClick={() => setMode(null)}
      >
        ← Back
      </button>

      <div className="emoji-header">
        {mode === 'create' ? '🎨' : '🚪'}
      </div>

      <h2>{mode === 'create' ? 'Create a Room' : 'Join a Room'}</h2>
      
      <form onSubmit={handleSubmit} className="start-form">
        <div className="form-group">
          <label>Your Name</label>
          <input
            type="text"
            className="input"
            placeholder="Enter your name"
            value={playerName}
            onChange={(e) => setPlayerName(e.target.value)}
            maxLength={20}
            autoFocus
          />
        </div>

        {mode === 'join' && (
          <div className="form-group">
            <label>Room Code</label>
            <input
              type="text"
              className="input room-code-input"
              placeholder="ABCD"
              value={roomCode}
              onChange={(e) => setRoomCode(e.target.value.toUpperCase())}
              maxLength={4}
            />
          </div>
        )}

        <button 
          type="submit" 
          className="button button-success"
          disabled={!playerName.trim() || (mode === 'join' && roomCode.length !== 4)}
        >
          {mode === 'create' ? 'Create Room' : 'Join Room'}
        </button>
      </form>
    </div>
  );
}

export default StartScreen;
