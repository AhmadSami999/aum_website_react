// src/components/ApplyNow.js
import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { FiClock, FiHelpCircle } from 'react-icons/fi';
import { FaDollarSign, FaSchool } from 'react-icons/fa';
import './ApplyNow.css';

// 🔖 Unsplash placeholder (replace with your asset later)
const PLACEHOLDER_IMG =
  'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=1200&q=80';

function InfoBox({ icon: Icon, title, children }) {
  return (
    <div className="apply-now-info-box">
      <Icon className="icon" />
      <h3>{title}</h3>
      <p>{children}</p>
    </div>
  );
}

function GuestApply() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPass, setLoginPass] = useState('');
  const [loginError, setLoginError] = useState('');
  const [submittingLogin, setSubmittingLogin] = useState(false);

  async function handleLogin(e) {
    e.preventDefault();
    setLoginError('');
    setSubmittingLogin(true);
    try {
      await login(loginEmail, loginPass, true);
      navigate('/apply');
    } catch (err) {
      setLoginError(err.message);
      setSubmittingLogin(false);
    }
  }

  const [regData, setRegData] = useState({
    firstName: '',
    preferredName: '',
    middleName: '',
    lastName: '',
    suffix: '',
    dobMonth: '',
    dobDay: '',
    dobYear: '',
  });
  const handleRegChange = (e) => {
    const { name, value } = e.target;
    setRegData((prev) => ({ ...prev, [name]: value }));
  };
  const handleRegister = (e) => {
    e.preventDefault();
    alert('Registration placeholder');
  };

  return (
    <div className="apply-guest">
      <section className="apply-banner">
        <div className="banner-left">
          <h1>
            Your Graduate Journey
            <br />
            Starts With This Application
          </h1>
        </div>
        <div className="banner-right">
          <img src={PLACEHOLDER_IMG} alt="Apply" />
        </div>
      </section>

      <section className="apply-info-boxes">
        <InfoBox icon={FiClock} title="Time">Lorem ipsum.</InfoBox>
        <InfoBox icon={FaDollarSign} title="Application Fee">Lorem ipsum.</InfoBox>
        <InfoBox icon={FaSchool} title="School Info">Lorem ipsum.</InfoBox>
        <InfoBox icon={FiHelpCircle} title="Help">Lorem ipsum.</InfoBox>
      </section>

      <section className="apply-auth-section">
        {/* Register */}
        <div className="register-column">
          <h2>Create an Account</h2>
          <form onSubmit={handleRegister}>
            {[
              { label: 'First Name', name: 'firstName', req: true },
              { label: 'Preferred First Name (optional)', name: 'preferredName' },
              { label: 'Middle Name (optional)', name: 'middleName' },
              { label: 'Last / Family Name', name: 'lastName', req: true },
              { label: 'Suffix (Mr / Mrs / Ms)', name: 'suffix' },
            ].map(({ label, name, req }) => (
              <div className="form-row" key={name}>
                <label>{label}</label>
                <input
                  name={name}
                  value={regData[name]}
                  onChange={handleRegChange}
                  required={req}
                />
              </div>
            ))}
            <div className="form-row dob-row">
              <label>Date of Birth</label>
              <div className="dob-inputs">
                {[
                  { ph: 'MM', name: 'dobMonth', max: 2 },
                  { ph: 'DD', name: 'dobDay', max: 2 },
                  { ph: 'YYYY', name: 'dobYear', max: 4 },
                ].map(({ ph, name, max }) => (
                  <input
                    key={name}
                    name={name}
                    placeholder={ph}
                    maxLength={max}
                    value={regData[name]}
                    onChange={handleRegChange}
                    required
                  />
                ))}
              </div>
            </div>
            <button className="apply-btn">Register</button>
          </form>
        </div>

        {/* Login */}
        <div className="login-column">
          <h2>Already have an account?</h2>
          {loginError && <div className="error-msg">{loginError}</div>}
          <form onSubmit={handleLogin}>
            <div className="form-row">
              <label>Email</label>
              <input
                type="email"
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                required
              />
            </div>
            <div className="form-row">
              <label>Password</label>
              <input
                type="password"
                value={loginPass}
                onChange={(e) => setLoginPass(e.target.value)}
                required
              />
            </div>
            <button className="apply-btn" disabled={submittingLogin}>
              {submittingLogin ? 'Signing In…' : 'Log In'}
            </button>
          </form>
          <Link to="/forgot-password" className="forgot-link">Forgot Password?</Link>
        </div>
      </section>
    </div>
  );
}

function ApplyNow() {
  const { currentUser } = useAuth();
  const [step, setStep] = useState(0);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    program: '',
    term: '',
  });
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
  const next = () => setStep((s) => Math.min(s + 1, 2));
  const back = () => setStep((s) => Math.max(s - 1, 0));
  const submit = (e) => {
    e.preventDefault();
    alert('Application submitted');
  };

  if (!currentUser) return <GuestApply />;

  return (
    <div className="apply-wrapper">
      <h1 className="apply-title">Apply Now</h1>
      <div className="progress-bar">
        <div className={`dot ${step >= 0 ? 'active' : ''}`} />
        <div className={`dot ${step >= 1 ? 'active' : ''}`} />
        <div className={`dot ${step >= 2 ? 'active' : ''}`} />
      </div>
      <form onSubmit={submit} className="apply-form">
        {step === 0 && (
          <>
            {['firstName', 'lastName'].map((f) => (
              <div className="form-row" key={f}>
                <label>{f === 'firstName' ? 'First Name' : 'Last Name'}</label>
                <input name={f} value={formData[f]} onChange={handleChange} required />
              </div>
            ))}
            <div className="step-actions">
              <button type="button" className="apply-btn next" onClick={next}>Next</button>
            </div>
          </>
        )}
        {step === 1 && (
          <>
            <div className="form-row">
              <label>Email</label>
              <input type="email" name="email" value={formData.email} onChange={handleChange} required />
            </div>
            <div className="form-row">
              <label>Phone</label>
              <input name="phone" value={formData.phone} onChange={handleChange} />
            </div>
            <div className="form-row">
              <label>Intended Program</label>
              <input name="program" value={formData.program} onChange={handleChange} />
            </div>
            <div className="form-row">
              <label>Start Term</label>
              <select name="term" value={formData.term} onChange={handleChange}>
                <option value="">Select term…</option>
                <option>Fall 2025</option>
                <option>Spring 2026</option>
              </select>
            </div>
            <div className="step-actions two-btn">
              <button type="button" className="apply-btn back" onClick={back}>Back</button>
              <button type="button" className="apply-btn next" onClick={next}>Next</button>
            </div>
          </>
        )}
        {step === 2 && (
          <>
            <p className="review-note"><strong>Review placeholder:</strong></p>
            <div className="summary">
              {Object.entries(formData).map(([k, v]) => (
                <div key={k} className="summary-row">
                  <span className="label">{k.replace(/([A-Z])/g, ' $1')}</span>
                  <span className="value">{v || '—'}</span>
                </div>
              ))}
            </div>
            <div className="step-actions two-btn">
              <button type="button" className="apply-btn back" onClick={back}>Back</button>
              <button type="submit" className="apply-btn submit">Submit</button>
            </div>
          </>
        )}
      </form>
    </div>
  );
}

export default ApplyNow;
