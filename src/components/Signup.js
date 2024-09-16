import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // Import useNavigate for redirection
import '../styles/Signup.css';
import scaleUpLogo from '../assets/images/ScaleUp.png';

const Signup = () => {
  const [formData, setFormData] = useState({
    username: '',
    firstname: '',
    lastname: '',
    email: '',
    password: '',
    phoneNumber: ''
  });

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate(); // Hook to navigate to different routes

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    try {
      const response = await axios.post('http://ec2-54-211-127-150.compute-1.amazonaws.com:3000/api/auth/register', formData);
      setSuccess('Account created successfully! Redirecting to login...');
      
      // After 2 seconds, redirect to the login page
      setTimeout(() => {
        navigate('/'); // Redirect to sign-in page
      }, 2000);
    } catch (error) {
      setError(error.response?.data.message || 'An error occurred');
    }
  };

  return (
    <div className="signup-container">
      <div className="logo-container">
        <img src={scaleUpLogo} alt="ScaleUp Logo" />
        <h1>Create an Account</h1>
      </div>

      {error && <p className="error-message">{error}</p>} {/* Display error */}
      {success && <p className="success-message">{success}</p>} {/* Display success */}
      
      <form onSubmit={handleSubmit}>
        <input
          name="username"
          placeholder="Username"
          value={formData.username}
          onChange={(e) => setFormData({ ...formData, username: e.target.value })}
        />
        <input
          name="firstname"
          placeholder="First Name"
          value={formData.firstname}
          onChange={(e) => setFormData({ ...formData, firstname: e.target.value })}
        />
        <input
          name="lastname"
          placeholder="Last Name"
          value={formData.lastname}
          onChange={(e) => setFormData({ ...formData, lastname: e.target.value })}
        />
        <input
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
        />
        <input
          name="phoneNumber"
          placeholder="Phone Number"
          value={formData.phoneNumber}
          onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
        />
        <input
          name="password"
          type="password"
          placeholder="Password"
          value={formData.password}
          onChange={(e) => setFormData({ ...formData, password: e.target.value })}
        />
        <button type="submit">Sign Up</button>
      </form>
    </div>
  );
};

export default Signup;
