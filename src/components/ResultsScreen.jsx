import React from 'react';
import './ResultsScreen.css';

function ResultsScreen({ players, winner, letter, onPlayAgain, onBackToLobby, isHost }) {
  const sortedPlayers = [...players].sort((a, b) => b.score - a.score);

  return (
    <div className="results-screen card">
      <div className="winner-section">
        <div className="trophy">🏆</div>
        <h2>Game Over!</h2>
        {winner && (
          <div className="winner-name">
            {winner.name} Wins!
          </div>
        )}
        <div className="letter-used">Letter: <span>{letter}</span></div>
      </div>

      <div className="results-table">
        <h3>Final Scores</h3>
        {sortedPlayers.map((player, index) => (
          <div key={player.id} className={`result-row ${index === 0 ? 'winner-row' : ''}`}>
            <div className="rank">#{index + 1}</div>
            <div className="player-result">
              <div className="player-name">{player.name}</div>
              <div className="player-answers">
                {player.answers && (
                  <>
                    <span>Name: {player.answers.Name || '-'}</span>
                    <span>Place: {player.answers.Place || '-'}</span>
                    <span>Animal: {player.answers.Animal || '-'}</span>
                    <span>Thing: {player.answers.Thing || '-'}</span>
                  </>
                )}
              </div>
            </div>
            <div className="score">{player.score} pts</div>
          </div>
        ))}
      </div>

      <div className="results-actions">
        {isHost && (
          <button 
            className="button button-primary"
            onClick={onPlayAgain}
          >
            Play Again
          </button>
        )}
        <button 
          className="button button-outline"
          onClick={onBackToLobby}
        >
          Back to Lobby
        </button>
      </div>
    </div>
  );
}

export default ResultsScreen;
