import React from 'react';
import './WaitingScreen.css';

function WaitingScreen() {
  return (
    <div className="waiting-screen card">
      <div className="spinner"></div>
      <h2>Answers Submitted!</h2>
      <p>Waiting for other players to finish...</p>
      <div className="waiting-dots">
        <div className="dot"></div>
        <div className="dot"></div>
        <div className="dot"></div>
      </div>
    </div>
  );
}

export default WaitingScreen;
