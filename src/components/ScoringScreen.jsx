import React, { useState, useEffect } from 'react';
import './ScoringScreen.css';

function ScoringScreen({ 
  targetPlayer, 
  myAnswers, 
  duplicates, 
  letter, 
  categories,
  onSubmitScores 
}) {
  const [scores, setScores] = useState({});
  const [totalScore, setTotalScore] = useState(0);

  // Initialize scores to 0
  useEffect(() => {
    const initialScores = {};
    categories.forEach(cat => {
      initialScores[cat] = 0;
    });
    setScores(initialScores);
  }, [categories]);

  // Calculate total whenever scores change
  useEffect(() => {
    const total = Object.values(scores).reduce((sum, score) => sum + score, 0);
    setTotalScore(total);
  }, [scores]);

  const handleScoreChange = (category, newScore) => {
    // Ensure score is 0, 5, or 10
    const validScore = Math.max(0, Math.min(10, newScore));
    setScores(prev => ({
      ...prev,
      [category]: validScore
    }));
  };

  const incrementScore = (category) => {
    const currentScore = scores[category] || 0;
    if (currentScore < 10) {
      const newScore = currentScore + 5;
      handleScoreChange(category, newScore);
    }
  };

  const decrementScore = (category) => {
    const currentScore = scores[category] || 0;
    if (currentScore > 0) {
      const newScore = currentScore - 5;
      handleScoreChange(category, newScore);
    }
  };

  const handleSubmit = () => {
    onSubmitScores(scores);
  };

  // Check if this answer is a duplicate
  const isDuplicate = (category) => {
    if (!duplicates || !duplicates[category]) return false;
    
    const targetAnswer = targetPlayer.answers[category];
    if (!targetAnswer) return false;
    
    const normalizedTarget = targetAnswer.trim().toLowerCase();
    return duplicates[category][normalizedTarget] && 
           duplicates[category][normalizedTarget].length > 1;
  };

  return (
    <div className="scoring-screen card">
      <div className="scoring-header">
        <h2>You are scoring for: <span className="target-name">{targetPlayer.name}</span></h2>
        <div className="letter-badge">Letter: {letter}</div>
      </div>

      <div className="scoring-section">
        <h3>{targetPlayer.name}'s Answers</h3>
        
        <div className="score-list">
          {categories.map((category) => {
            const answer = targetPlayer.answers[category] || '-';
            const isDup = isDuplicate(category);
            
            return (
              <div key={category} className="score-item">
                {isDup && (
                  <div className="duplicate-warning">
                    ⚠️ {targetPlayer.name} and you both wrote "{answer}"
                  </div>
                )}
                
                <div className="score-row">
                  <div className="answer-info">
                    <label className="category-label">{category}:</label>
                    <span className={`answer-text ${!answer || answer === '-' ? 'empty' : ''}`}>
                      {answer}
                    </span>
                  </div>
                  
                  <div className="score-controls">
                    <button 
                      className="score-btn minus"
                      onClick={() => decrementScore(category)}
                      disabled={scores[category] === 0}
                    >
                      −
                    </button>
                    <input
                      type="number"
                      className="score-input"
                      value={scores[category] || 0}
                      readOnly
                      min="0"
                      max="10"
                      step="5"
                    />
                    <button 
                      className="score-btn plus"
                      onClick={() => incrementScore(category)}
                      disabled={scores[category] === 10}
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="total-score-section">
          <strong>Total Score:</strong> <span className="total-score">{totalScore}</span>
        </div>

        <button 
          className="button button-success"
          onClick={handleSubmit}
        >
          Submit Scores
        </button>
      </div>

      {myAnswers && (
        <div className="reference-section">
          <h3>Your Answers (Reference)</h3>
          <div className="reference-answers">
            {categories.map((category) => (
              <div key={category} className="reference-item">
                <span className="ref-category">{category}:</span>
                <span className="ref-answer">{myAnswers[category] || '-'}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default ScoringScreen;
