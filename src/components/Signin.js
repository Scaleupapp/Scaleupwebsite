import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../styles/Signin.css';
import scaleUpLogo from '../assets/images/ScaleUp.png';

const SignIn = () => {
  const [loginMethod, setLoginMethod] = useState('password');
  const [formData, setFormData] = useState({
    loginIdentifier: '',
    password: '',
    otp: '',
    phoneNumber: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handleToggleLoginMethod = (method) => {
    setLoginMethod(method);
    setError('');
    setSuccess('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      const url = loginMethod === 'password' ? 'http://localhost:3000/api/auth/login' : 'http://localhost:3000/api/auth/otp-verify';
      const response = await axios.post(url, formData);

      // Store the token in localStorage
      localStorage.setItem('token', response.data.token);

      setSuccess('Login successful!');
      
      // Check if it's the user's first time login
      if (response.data.isFirstTimeLogin) {
        navigate('/update-profile');
      } else {
        navigate('/profile'); // Go to profile page
      }
    } catch (error) {
      setError(error.response?.data.message || 'An error occurred');
    }
  };

  return (
    <div className="signin-container">
      <div className="logo-container">
        <img src={scaleUpLogo} alt="ScaleUp Logo" />
        <h1>Welcome to ScaleUp</h1>
      </div>

      <div className="form-container">
        <h2>Sign In</h2>

        <div className="auth-toggle">
          <button className={loginMethod === 'password' ? 'active' : ''} onClick={() => handleToggleLoginMethod('password')}>
            Login with Username/Password
          </button>
          <button className={loginMethod === 'otp' ? 'active' : ''} onClick={() => handleToggleLoginMethod('otp')}>
            Login via Mobile (OTP)
          </button>
        </div>

        {error && <p className="error-message">{error}</p>}
        {success && <p className="success-message">{success}</p>}

        <form onSubmit={handleSubmit}>
          {loginMethod === 'password' ? (
            <>
              <input
                name="loginIdentifier"
                placeholder="Username or Email"
                value={formData.loginIdentifier}
                onChange={(e) => setFormData({ ...formData, loginIdentifier: e.target.value })}
              />
              <input
                name="password"
                type="password"
                placeholder="Password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              />
            </>
          ) : (
            <>
              <input
                name="phoneNumber"
                placeholder="Phone Number"
                value={formData.phoneNumber}
                onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
              />
              <input
                name="otp"
                placeholder="Enter OTP"
                value={formData.otp}
                onChange={(e) => setFormData({ ...formData, otp: e.target.value })}
              />
            </>
          )}
          <button type="submit">Sign In</button>
        </form>

        <div className="additional-options">
          <button className="link-button" onClick={() => navigate('/signup')}>
            Sign Up Now
          </button>
          <button className="link-button" onClick={() => navigate('/forgot-password')}>
            Forgot Password?
          </button>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
