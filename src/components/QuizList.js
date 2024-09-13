import React, { useState, useEffect } from "react";
import axios from "axios";
import io from "socket.io-client";
import moment from "moment";
import { useNavigate } from "react-router-dom";
import "../styles/QuizList.css";

// Initialize Socket.IO client
const socket = io("http://localhost:3000"); // Replace with your server URL

const QuizList = () => {
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [quizStarted, setQuizStarted] = useState(null); // Track started quiz
  const [currentTime, setCurrentTime] = useState(new Date());
  const navigate = useNavigate();

  // Fetch quizzes from server
  useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        const response = await axios.get("http://localhost:3000/api/quiz/list", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        const sortedQuizzes = response.data.quizzes
          .map((quiz) => ({
            ...quiz,
            registered: quiz.isRegistered,
          }))
          .sort((a, b) => new Date(a.startTime) - new Date(b.startTime));

        setQuizzes(sortedQuizzes);
        setLoading(false);
      } catch (error) {
        setError("Failed to fetch quizzes");
        setLoading(false);
      }
    };

    fetchQuizzes();

    // Listen for the quizStarted event from the server
    socket.on("quizStarted", (data) => {
        console.log("Quiz has started for quiz ID:", data.quizId);
      setQuizStarted(data.quizId);
    });

    return () => {
      socket.off("quizStarted");
    };
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleRegister = async (quizId) => {
    try {
      await axios.post(
        "http://localhost:3000/api/quiz/join",
        { quizId },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setQuizzes(
        quizzes.map((quiz) =>
          quiz._id === quizId ? { ...quiz, registered: true } : quiz
        )
      );
      // Join the Socket.IO room for this quiz
      socket.emit("joinRoom", { quizId });
    } catch (error) {
      alert("Failed to register for the quiz");
    }
  };

  const handleJoinWaitingRoom = async (quizId) => {
    try {
      await axios.post(
        "http://localhost:3000/api/quiz/initiate",
        { quizId },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      navigate(`/quiz/${quizId}/waiting-room`);
    } catch (error) {
      alert("Failed to join the waiting room");
    }
  };

  const getTimeRemaining = (startTime) => {
    const duration = moment.duration(moment(startTime).diff(currentTime));
    return {
      days: Math.floor(duration.asDays()),
      hours: duration.hours(),
      minutes: duration.minutes(),
      seconds: duration.seconds(),
    };
  };

  if (loading) {
    return <div>Loading quizzes...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="quiz-list-container">
      <h2>Upcoming Quizzes</h2>
      <div className="quiz-list">
        {quizzes.map((quiz) => {
          const { days, hours, minutes, seconds } = getTimeRemaining(quiz.startTime);

          return (
            <div key={quiz._id} className="quiz-item">
              <h3>{quiz.topic}</h3>
              <p className="quiz-scheduled">Scheduled Time: {new Date(quiz.startTime).toLocaleString()}</p>
              <p className="quiz-timer">
                Starts in {days} days, {hours} hours, {minutes} minutes, {seconds} seconds
              </p>

              {quiz.registered ? (
                quizStarted === quiz._id ? (
                  <button onClick={() => handleJoinWaitingRoom(quiz._id)} className="quiz-button">
                    Join Waiting Room
                  </button>
                ) : (
                  <button disabled className="quiz-button waiting-room-btn">
                    Waiting for quiz to start...
                  </button>
                )
              ) : (
                <button className="quiz-button register-btn" onClick={() => handleRegister(quiz._id)}>
                  Register
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default QuizList;
