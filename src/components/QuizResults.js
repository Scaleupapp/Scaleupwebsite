// QuizResults.js

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import '../styles/QuizResults.css';

const QuizResults = () => {
  const { quizId } = useParams();
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch the logged-in user's ID from local storage
  const loggedInUserId = localStorage.getItem('userId');

  useEffect(() => {
    const fetchResults = async () => {
      try {
        if (!quizId || quizId === 'null') {
          throw new Error('Quiz ID is invalid or undefined');
        }
        
        const response = await axios.get(`http://localhost:3000/api/quiz/quiz-results/${quizId}`);
        setResults(response.data.results);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching quiz results:', error);
        setError('Failed to load quiz results.');
        setLoading(false);
      }
    };

    fetchResults();
  }, [quizId]);

  if (loading) {
    return <div>Loading quiz results...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="quiz-results">
      <h2>Quiz Results</h2>
      <div className="results-list">
        {results.map((result) => (
          <div
            key={result.userId}
            className={`result-item ${result.userId === loggedInUserId ? 'highlight' : ''}`}
          >
            <img src={result.profilePicture} alt={`${result.username}'s profile`} className="profile-picture" />
            <div className="result-details">
              <h3>{result.username}</h3>
              <p>Rank: {result.rank}</p>
              <p>Total Points: {result.finalScore}</p>
              <p>Correct Answers: {result.totalCorrectAnswers}</p>
              <p>Total Time Taken: {result.totalTimeTaken.toFixed(2)} seconds</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default QuizResults;
