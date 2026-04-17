import React from 'react';
import './Lobby.css';

function Lobby({ roomCode, players, isHost, onStartGame, onLeaveRoom }) {
  const canStart = players.length >= 2;

  return (
    <div className="lobby card">
      <h2>Room Lobby</h2>
      
      <div className="room-code-section">
        <p>Room Code</p>
        <div className="room-code-display">{roomCode}</div>
        <p className="room-hint">Share this code with your friends!</p>
      </div>

      <div className="players-section">
        <h3>Players ({players.length}/8)</h3>
        <div className="players-list">
          {players.map((player, index) => (
            <div key={player.id} className="player-item">
              <div className="player-avatar" style={{
                background: `linear-gradient(135deg, ${getPlayerColor(index)}, ${getPlayerColor(index + 1)})`
              }}>
                {player.name.charAt(0).toUpperCase()}
              </div>
              <div className="player-info">
                <div className="player-name">
                  {player.name}
                  {player.host && <span className="host-badge">👑 Host</span>}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="lobby-actions">
        {isHost ? (
          <button 
            className="button button-success"
            onClick={onStartGame}
            disabled={!canStart}
          >
            {canStart ? 'Start Game' : 'Need at least 2 players'}
          </button>
        ) : (
          <div className="waiting-message">
            Waiting for host to start the game...
          </div>
        )}
        
        <button 
          className="button button-outline"
          onClick={onLeaveRoom}
        >
          Leave Room
        </button>
      </div>
    </div>
  );
}

const colors = [
  '#FF6B9D', '#FEC84D', '#4ECDC4', '#9B59B6',
  '#FF6348', '#1DD1A1', '#48dbfb', '#ee5a6f'
];

function getPlayerColor(index) {
  return colors[index % colors.length];
}

export default Lobby;
