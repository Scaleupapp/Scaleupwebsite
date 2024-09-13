import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import SignIn from './components/Signin';
import SignUp from './components/Signup';
import ForgotPassword from './components/ForgotPassword';
import UpdateProfile from './components/UpdateProfile'; // Import the UpdateProfile component
import UserProfile from './components/UserProfile';
import HomepageContent from './components/HomepageContent';
import Notifications from './components/Notifications';
import CreatePost from './components/CreatePost';
import QuizList from './components/QuizList';
import WaitingRoom from './components/WaitingRoom';
import 'bootstrap/dist/css/bootstrap.min.css';


function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/update-profile" element={<UpdateProfile />} /> 
          <Route path="/profile" element={<UserProfile />} />
          <Route path="/homepage" element={<HomepageContent />} />
          <Route path="/notifications" element={<Notifications />} />
          <Route path="/create-post" element={<CreatePost />} />
          <Route path="/quizzes" element={<QuizList />} />
          <Route path="/quiz/:quizId/waiting-room" element={<WaitingRoom />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
