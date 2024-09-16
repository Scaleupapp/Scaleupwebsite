// QuizPage.js

import React, { useState, useEffect, useContext, useRef } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; 
import SocketContext from './SocketContext';
import '../styles/QuizPage.css';

const QuizPage = () => {
  const socket = useContext(SocketContext);
  const navigate = useNavigate();
  const [question, setQuestion] = useState(null);
  const [selectedOption, setSelectedOption] = useState(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [feedback, setFeedback] = useState('');
  const [timer, setTimer] = useState(10);
  const [isQuizActive, setIsQuizActive] = useState(false);
  const [quizId, setQuizId] = useState(null);
  const [startTime, setStartTime] = useState(null);
  const quizIdRef = useRef(null);

  useEffect(() => {
    // Listen for the next question from the server
    socket.on('nextQuestion', (data) => {
      console.log('Received question:', data);
      setQuestion(data.question);
      setQuizId(data.quizId);
      quizIdRef.current = data.quizId;
      setSelectedOption(null);
      setIsSubmitted(false); // Reset submission state for the next question
      setFeedback('');
      setTimer(10);
      setIsQuizActive(true);
      setStartTime(Date.now());
    });

    // Listen for the quiz end
    socket.on('showLeaderboard', () => {
      if (quizIdRef.current) {
        navigate(`/quiz/${quizIdRef.current}/results`, { replace: true });
      } else {
        console.error('Quiz ID is not set, cannot navigate to results page.');
      }
    });

    return () => {
      socket.off('nextQuestion');
      socket.off('showLeaderboard');
    };
  }, [socket, navigate]);

  useEffect(() => {
    let interval;
    if (isQuizActive && timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    } else if (timer === 0) {
      handleSubmit(true);
    }

    return () => clearInterval(interval);
  }, [isQuizActive, timer]);

  const handleOptionSelect = (option) => {
    setSelectedOption(option);
  };

  const handleSubmit = async (autoSubmit = false) => {
    setIsSubmitted(true);

    const selectedAnswer = autoSubmit && !selectedOption ? null : selectedOption;
    const timeTaken = (Date.now() - startTime) / 1000;

    try {
        // Make the POST request and store the response
        const response = await axios.post('http://ec2-54-211-127-150.compute-1.amazonaws.com:3000/api/quiz/submit-answer', {
            quizId: quizIdRef.current,
            questionId: question._id,
            selectedOption: selectedAnswer,
            timeTaken: timeTaken.toFixed(3),
        }, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
        });

        // Check the response and set feedback based on points awarded
        if (selectedAnswer === null) {
            setFeedback('No answer submitted.');
        } else if (response.data.pointsAwarded > 0) {
            setFeedback('Correct!');
        } else {
            setFeedback('Incorrect!');
        }
    } catch (error) {
        console.error('Error submitting answer:', error);
        setFeedback('Error submitting answer');
    }
};


  if (!question) {
    return <div>Waiting for the quiz to start...</div>;
  }

  return (
    <div className="quiz-page">
      <div className="question-card">
        <h2>{question.text}</h2>
        {question.options.map((option, index) => (
          <button
            key={index}
            className={selectedOption === option ? 'selected' : ''}
            onClick={() => handleOptionSelect(option)}
            disabled={isSubmitted} // Disable buttons after submission
          >
            {option}
          </button>
        ))}
        <button
          className="submit-button"
          onClick={handleSubmit}
          disabled={isSubmitted || !selectedOption} // Disable submit button if already submitted
        >
          Submit Answer
        </button>
      </div>

      <div className="timer">Next Question in: {timer}s</div>
      {isSubmitted && <div className="feedback">{feedback}</div>}
    </div>
  );
};

export default QuizPage;
