import React, { useState, useEffect } from 'react';
import { useTimer } from 'react-timer-hook';
import io from 'socket.io-client';
import { useParams, useNavigate } from 'react-router-dom';
import moment from 'moment';
import '../styles/WaitingRoom.css';

const socket = io('http://localhost:3000'); // Ensure this is the correct server URL

const WaitingRoom = () => {
  const { quizId } = useParams();
  const [quizStartTime, setQuizStartTime] = useState(null);
  const [quizStarted, setQuizStarted] = useState(false);
  const navigate = useNavigate();

  // Timer function
  function MyTimer({ expiryTimestamp }) {
    const { seconds, minutes, isRunning } = useTimer({
      expiryTimestamp,
      onExpire: () => {
        // Redirect to the quiz start page when timer expires
        navigate(`/quiz/${quizId}/start`);
      },
    });

    return (
      <div className="timer">
        {minutes}m : {seconds}s
      </div>
    );
  }

  // Listen for the 'quizStarted' event from the server
  useEffect(() => {
    console.log('Setting up socket listeners...');

    socket.on('connect', () => {
      console.log('Connected to Socket.IO server');
    });

    socket.on('disconnect', () => {
      console.log('Disconnected from Socket.IO server');
    });

    // Listen for 'quizStarted' event
    socket.on('quizStarted', (data) => {
      console.log('Received quizStarted event:', data);  // Ensure this log is showing up
      if (data.quizId === quizId) {
        const startTime = new Date(data.startTime);  // Official quiz start time from server
        console.log('Start time received:', startTime);  // Log the received start time
        setQuizStartTime(startTime);
        setQuizStarted(true);
      }
    });

    return () => {
      // Clean up socket listeners when component unmounts
      socket.off('connect');
      socket.off('disconnect');
      socket.off('quizStarted');
    };
  }, [quizId]);

  // Calculate the remaining time for the timer when the user joins
  const calculateRemainingTime = (quizStartTime) => {
    const now = new Date();
    const timeDiffInSeconds = Math.floor((quizStartTime.getTime() - now.getTime()) / 1000);

    // Ensure that time doesn't go below 0 (in case user joins too late)
    const remainingTimeInSeconds = Math.max(timeDiffInSeconds, 0);

    const remainingTime = new Date();
    remainingTime.setSeconds(remainingTime.getSeconds() + remainingTimeInSeconds); // Set the timer to the remaining seconds

    return remainingTime;
  };

  return (
    <div className="waiting-room-container">
      <h1>Waiting for the Quiz to Start</h1>
      {!quizStarted ? (
        <p>Waiting for the admin to start the quiz...</p>
      ) : (
        <div>
          <h2>The quiz is starting in:</h2>
          {quizStartTime && <MyTimer expiryTimestamp={calculateRemainingTime(quizStartTime)} />}
        </div>
      )}
    </div>
  );
};

export default WaitingRoom;
