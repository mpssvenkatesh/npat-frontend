import React from 'react';
import './Alert.css';

function Alert({ message, type = 'error' }) {
  return (
    <div className={`alert alert-${type}`}>
      <span className="alert-icon">
        {type === 'error' ? '⚠️' : type === 'success' ? '✅' : 'ℹ️'}
      </span>
      <span className="alert-message">{message}</span>
    </div>
  );
}

export default Alert;
