import React, { useState, useEffect } from 'react';
import './GameScreen.css';

const CATEGORIES = ['Name', 'Place', 'Animal', 'Thing'];

function GameScreen({ letter, timerDuration, onSubmitAnswers }) {
  const [answers, setAnswers] = useState({
    Name: '',
    Place: '',
    Animal: '',
    Thing: ''
  });
  const [timeLeft, setTimeLeft] = useState(timerDuration);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleSubmit = () => {
    onSubmitAnswers(answers);
  };

  const handleChange = (category, value) => {
    setAnswers(prev => ({ ...prev, [category]: value }));
  };

  const progress = (timeLeft / timerDuration) * 100;
  const isUrgent = timeLeft <= 10;

  return (
    <div className="game-screen card">
      <div className="timer-section">
        <div className={`timer ${isUrgent ? 'urgent' : ''}`}>
          {timeLeft}s
        </div>
        <div className="timer-bar">
          <div 
            className={`timer-fill ${isUrgent ? 'urgent' : ''}`}
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <div className="letter-display">
        <div className="letter-label">Your Letter</div>
        <div className="letter">{letter}</div>
        <div className="letter-hint">All answers must start with this letter!</div>
      </div>

      <form className="answers-form" onSubmit={(e) => { e.preventDefault(); handleSubmit(); }}>
        {CATEGORIES.map((category) => (
          <div key={category} className="answer-group">
            <label>{category}</label>
            <input
              type="text"
              className="input"
              placeholder={`Enter a ${category.toLowerCase()}...`}
              value={answers[category]}
              onChange={(e) => handleChange(category, e.target.value)}
              autoComplete="off"
            />
          </div>
        ))}

        <button 
          type="submit" 
          className="button button-success"
          disabled={timeLeft === 0}
        >
          Submit Answers
        </button>
      </form>
    </div>
  );
}

export default GameScreen;
