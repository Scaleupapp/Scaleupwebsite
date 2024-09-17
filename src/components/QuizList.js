import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import moment from "moment";
import { useNavigate } from "react-router-dom";
import SocketContext from './SocketContext';
import "../styles/QuizList.css";

const QuizList = () => {
  const socket = useContext(SocketContext);
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [quizStarted, setQuizStarted] = useState(null);
  const [quizTimers, setQuizTimers] = useState({});
  const [currentTime, setCurrentTime] = useState(new Date());
  const navigate = useNavigate();

  useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        const response = await axios.get("https://scaleupapp.club/api/quiz/list", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        const sortedQuizzes = response.data.quizzes
          .map((quiz) => ({
            ...quiz,
            registered: quiz.isRegistered,
            joined: false,
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

    // Listen for the 'quizStarted' event from the server
    socket.on("quizStarted", (data) => {
      console.log("Quiz has started for quiz ID:", data);
      setQuizStarted(data.quizId);
      setQuizTimers((prevTimers) => ({
        ...prevTimers,
        [data.quizId]: new Date(data.startTime).getTime(),
      }));
    });

    return () => {
      socket.off("quizStarted");
    };
  }, [socket]);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const getTimeRemaining = (startTime) => {
    const duration = moment.duration(moment(startTime).diff(currentTime));
    return {
      days: Math.floor(duration.asDays()),
      hours: duration.hours(),
      minutes: duration.minutes(),
      seconds: duration.seconds(),
    };
  };

  const getQuizCountdown = (quizId) => {
    const startTime = quizTimers[quizId];
    if (!startTime) return null;

    const now = new Date().getTime();
    const timeDiffInSeconds = Math.floor((startTime - now) / 1000);

    if (timeDiffInSeconds <= 0) {
      alert("The quiz is about to start!");
      navigate(`/quiz/${quizId}/start`);
      return "Starting...";
    }

    const minutes = Math.floor(timeDiffInSeconds / 60);
    const seconds = timeDiffInSeconds % 60;
    return `${minutes}m : ${seconds}s`;
  };

  const handleRegister = async (quizId) => {
    try {
      await axios.post(
        "https://scaleupapp.club/api/quiz/join",
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
      socket.emit("joinRoom", { quizId });
    } catch (error) {
      alert("Failed to register for the quiz");
    }
  };

  const handleJoinWaitingRoom = async (quizId) => {
    try {
      await axios.post(
        "https://scaleupapp.club/api/quiz/initiate",
        { quizId },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      setQuizzes(
        quizzes.map((quiz) =>
          quiz._id === quizId ? { ...quiz, joined: true } : quiz
        )
      );
    } catch (error) {
      alert("Failed to join the waiting room");
    }
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
          const countdown = getQuizCountdown(quiz._id);

          return (
            <div key={quiz._id} className="quiz-item">
              <h3>{quiz.topic}</h3>
              <p className="quiz-scheduled">Scheduled Time: {new Date(quiz.startTime).toLocaleString()}</p>
              <p className="quiz-timer">
                Starts in {days} days, {hours} hours, {minutes} minutes, {seconds} seconds
              </p>

              {quiz.registered ? (
                quizStarted === quiz._id ? (
                  <div className="quiz-action">
                    <button
                      onClick={() => handleJoinWaitingRoom(quiz._id)}
                      className={`quiz-button ${quiz.joined ? 'joined' : ''}`}
                      disabled={quiz.joined}
                    >
                      {quiz.joined ? "Joined" : "Join Waiting Room"}
                    </button>
                    {countdown && (
                      <div className="countdown-container">
                        <h4 className="countdown-heading">Quiz Starts In:</h4>
                        <p className="quiz-countdown">{countdown}</p>
                      </div>
                    )}
                  </div>
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
