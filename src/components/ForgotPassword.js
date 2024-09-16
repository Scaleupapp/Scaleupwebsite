import React, { useState } from "react";
import axios from "axios";
import '../styles/ForgotPassword.css';
import scaleUpLogo from '../assets/images/ScaleUp.png';

const ForgotPassword = () => {
  const [loginIdentifier, setLoginIdentifier] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [step, setStep] = useState(1);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleRequestOTP = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://ec2-54-211-127-150.compute-1.amazonaws.com:3000/api/auth/password-gen", {
        loginIdentifier
      });
      setSuccess(response.data.message);
      setStep(2);
    } catch (error) {
      setError(error.response?.data.message || "An error occurred");
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://ec2-54-211-127-150.compute-1.amazonaws.com:3000/api/auth/resetpassword", {
        loginIdentifier,
        otp,
        newPassword
      });
      setSuccess(response.data.message);
      setError("");
    } catch (error) {
      setError(error.response?.data.message || "An error occurred");
    }
  };

  return (
    <div className="forgotpassword-container">
      <div className="logo-container">
        <img src={scaleUpLogo} alt="ScaleUp Logo" />
        <h1>Forgot Password</h1>
      </div>

      {error && <p style={{ color: "red" }}>{error}</p>}
      {success && <p style={{ color: "green" }}>{success}</p>}
      {step === 1 ? (
        <form onSubmit={handleRequestOTP}>
          <input
            name="loginIdentifier"
            placeholder="Username, Email, or Phone"
            value={loginIdentifier}
            onChange={(e) => setLoginIdentifier(e.target.value)}
          />
          <button type="submit">Request OTP</button>
        </form>
      ) : (
        <form onSubmit={handleResetPassword}>
          <input
            name="otp"
            placeholder="Enter OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
          />
          <input
            name="newPassword"
            type="password"
            placeholder="New Password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
          <button type="submit">Reset Password</button>
        </form>
      )}
    </div>
  );
};

export default ForgotPassword;
