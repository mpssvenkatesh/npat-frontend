import React from 'react';
import './Header.css';

function Header({ connected }) {
  return (
    <header className="header">
      <h1>Name Place Animal Thing</h1>
      <div className="subtitle">Online Multiplayer! 🌐</div>
      <div className="connection-status">
        <div className={`status-dot ${connected ? 'connected' : ''}`}></div>
        <span>{connected ? 'Connected' : 'Connecting...'}</span>
      </div>
    </header>
  );
}

export default Header;
