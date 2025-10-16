// src/components/admin/ForgotPassword.js

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '../../firebase/config';        // <-- Adjust if your config is elsewhere
import loginImage from '../../assets/login.webp';    // <-- Same path as SignIn
import logoImage from '../../assets/logo.webp';      // <-- Same path as SignIn
import './SignIn.css';                               // <-- Reuse the SAME CSS as SignIn for identical styling

function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [submitting, setSubmitting] = useState(false);
  
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setSubmitting(true);

    try {
      await sendPasswordResetEmail(auth, email);
      setSuccess('Password reset email sent! Please check your inbox.');
    } catch (err) {
      setError('Failed to send password reset email: ' + err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="signInContainer">
      {/* Bottom-left widget (same layout as SignIn) */}
      <div className="bottomLeftWidget">
        <button className="whiteButtonBlueText">Read More</button>
        <p className="poweredByText">Powered By ______</p>
        <p className="copyRightText">© 2025 by the American University of Malta</p>
      </div>

      <div className="signInCard">
        <img src={loginImage} alt="Forgot Password" className="loginImage" />

        {/* Heading and subtext, styled identically to SignIn */}
        <h2>RESET PASSWORD</h2>
        <p className="welcomeText">
          Please enter your email. We’ll send you a link to reset your password.
        </p>

        {/* Error/Success alerts */}
        {error && <div className="errorAlert">{error}</div>}
        {success && (
          <div
            className="errorAlert"
            style={{ backgroundColor: '#d4edda', color: '#155724' }}
          >
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="formGroup">
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          {/* Submit button: uses the same class as Sign In for the identical look */}
          <button
            type="submit"
            disabled={submitting}
            className="signInButton"
          >
            {submitting ? 'Processing...' : 'Send Reset Link'}
          </button>
        </form>

        {/* Link back to Sign In */}
        <p className="contactText">
          Remembered your password?{' '}
          <span
            style={{ cursor: 'pointer', color: '#5c80a5' }}
            onClick={() => navigate('/signin')}
          >
            Sign In
          </span>
        </p>

        <div className="logoContainer">
          <img src={logoImage} alt="AUM Logo" className="aumLogo" />
        </div>
      </div>
    </div>
  );
}

export default ForgotPassword;
