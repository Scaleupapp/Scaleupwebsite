import React, { useState } from 'react';
import '../styles/QuizPage.css';

const QuizPage = () => {
  const [selectedOption, setSelectedOption] = useState(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  
  const handleOptionSelect = (option) => {
    setSelectedOption(option);
  };

  const handleSubmit = () => {
    setIsSubmitted(true);
    // Logic to handle answer submission
  };

  return (
    <div className="quiz-page">
      <div className="question-card">
        <h2>What is the capital of France?</h2>
        
        <button 
          className={selectedOption === 'A' ? 'selected' : ''} 
          onClick={() => handleOptionSelect('A')}
          disabled={isSubmitted}
        >
          A. Paris
        </button>
        
        <button 
          className={selectedOption === 'B' ? 'selected' : ''} 
          onClick={() => handleOptionSelect('B')}
          disabled={isSubmitted}
        >
          B. London
        </button>
        
        <button 
          className={selectedOption === 'C' ? 'selected' : ''} 
          onClick={() => handleOptionSelect('C')}
          disabled={isSubmitted}
        >
          C. Rome
        </button>
        
        <button 
          className={selectedOption === 'D' ? 'selected' : ''} 
          onClick={() => handleOptionSelect('D')}
          disabled={isSubmitted}
        >
          D. Berlin
        </button>

        <button 
          className="submit-button" 
          onClick={handleSubmit}
          disabled={isSubmitted || selectedOption === null}
        >
          Submit Answer
        </button>
      </div>

      {/* Timer and feedback section */}
      <div className="timer">Time Remaining: 1m 30s</div>
      {isSubmitted && <div className="feedback">Your answer has been submitted!</div>}
    </div>
  );
};

export default QuizPage;
