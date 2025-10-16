// src/components/admin/SignIn.js
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import loginImage from '../../assets/login.webp';
import logoImage from '../../assets/logo.webp';
import loginBg from '../../assets/login-bg.webp';
import './SignIn.css';

function SignIn() {
  /* ----- state / auth ----- */
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const { login, currentUser, role } = useAuth();
  const navigate = useNavigate();

  /* ----- submit ----- */
  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      await login(email, password, rememberMe);
    } catch (err) {
      setError('Failed to log in: ' + err.message);
      setSubmitting(false);
    }
  }

  /* ----- redirect once authenticated ----- */
  useEffect(() => {
    if (!submitting) return;
    if (currentUser && role) {
      role === 'admin' ? navigate('/admin') : navigate('/student-dashboard');
    }
  }, [currentUser, role, submitting, navigate]);

  /* ------------------------------------------------------------------ */
  return (
    <>
      {/* ─── Thin grey bar with the SAME links used in Navbar ─── */}
      <div className="thin-top-bar">
        <div className="thin-bar-content">
          <div className="right-links">
            <Link to="/undergraduate">Undergraduate</Link>
            <Link to="/graduate">Graduate</Link>
            <Link to="/our-university">About</Link>
            <Link to="/student-life">Student&nbsp;Life</Link>
            <Link to="https://apply.aum.edu.mt" className="apply-btn-inline">
              APPLY&nbsp;NOW
            </Link>
          </div>
        </div>
      </div>

      {/* ─── Main sign-in layout (unchanged) ─── */}
      <div className="signInContainer">
        <div
          className="loginBgContainer"
          style={{ backgroundImage: `url(${loginBg})` }}
        />

        <div className="bottomLeftWidget">
          <button className="whiteButtonBlueText">Read More</button>

          <p className="copyRightText">© 2025 by the American University of Malta</p>
        </div>

        <div className="signInCard">
          <img src={loginImage} alt="Login" className="loginImage" />

          <h2>WELCOME</h2>
          <p className="welcomeText">
            And Congratulations for joining us at AUM. Your future starts NOW!
          </p>

          {error && <div className="errorAlert">{error}</div>}

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
            <div className="formGroup">
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <div className="forgotPasswordSection">
              <Link to="/forgot-password" className="forgotPasswordLink">
                Forgot Password?
              </Link>
            </div>

            <div className="saveLogin">
              <label>
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                />
                Remember me for 30 days
              </label>
            </div>

            <button type="submit" disabled={submitting} className="signInButton">
              {submitting ? 'Signing In...' : 'Sign In'}
            </button>
          </form>

          <p className="contactText">
            Don't have an account yet? Contact us at{' '}
            <a href="mailto:it@aum.edu.mt">it@aum.edu.mt</a>
          </p>

          <div className="logoContainer">
            <img src={logoImage} alt="AUM Logo" className="aumLogo" />
          </div>
        </div>
      </div>
    </>
  );
}

export default SignIn;
