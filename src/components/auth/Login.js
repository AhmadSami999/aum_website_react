// src/components/Login.js
import React from 'react';
import { Link } from 'react-router-dom';
import loginImage from '../../assets/login.webp';
import logoImage from '../../assets/logo.webp';
import loginBg from '../../assets/login-bg.webp';
import './Login.css';

function Login() {
  return (
    <>


      {/* ─── Main login layout ─── */}
      <div className="loginContainer">
        <div
          className="loginBgContainer"
          style={{ backgroundImage: `url(${loginBg})` }}
        />

        <div className="bottomLeftWidget">
          <button className="whiteButtonBlueText">Read More</button>
          <p className="copyRightText">© 2025 by the American University of Malta</p>
        </div>

        <div className="loginCard">
          <img src={loginImage} alt="Login" className="loginImage" />

          <h2>STUDENT LOGIN</h2>
          <p className="welcomeText">
            Access your student portal and university resources
          </p>

          <div className="loginBoxes">
            <a 
              href="https://login.microsoftonline.com/common/oauth2/authorize?client_id=4345a7b9-9a63-4910-a426-35363201d503&redirect_uri=https%3A%2F%2Fwww.office.com%2Flanding&response_type=code%20id_token&scope=openid%20profile&response_mode=form_post&nonce=637491002407104881.YmI0ZjIyMmUtN2JlMS00NjNlLTk2ZjMtMjk0NGNlYjJmODkxM2M4NTc3NzUtOWIyYi00YmY3LTg4OWYtZmU4MTVkNDAwY2Qy&ui_locales=en-US&mkt=en-US&client-request-id=1e2212b8-7fc8-4ab2-8cce-2331a723535f&state=qd4LupXJGGIg6DVje4F2TDdtLkihtwtVtBSfwisrV6qNq49P9s4u0Dtf2LQCYTy3a2acIZzQYoxgES4R1Xu_E8roE3I4VD3hawcxceAhvPcE5F4d3SLiTVx4VcTfEgiffiLXVY4qxHTElqCVJDrqA1GMV6PHaE20_RhYca7wYs0yEFucq0FoMEe5J_0L8Upztf4A1Gb7N3EQDNAdI_iCYTE5lKeDEpVA5DlvyyDK9kTXHfY-1mXROeef6ml8aLAmpRnepx--7QL6XZosW4pvjw&x-client-SKU=ID_NETSTANDARD2_0&x-client-ver=6.8.0.0&sso_reload=true"
              className="loginBox" 
              target="_blank" 
              rel="noopener noreferrer"
            >
              <div className="loginBoxContent">
                <h3>Email</h3>
                <p>Access your university email account</p>
              </div>
            </a>

            <a 
              href="https://ois.aum.edu.mt/auth/login" 
              className="loginBox" 
              target="_blank" 
              rel="noopener noreferrer"
            >
              <div className="loginBoxContent">
                <h3>OIS</h3>
                <p>Student Information System</p>
              </div>
            </a>

            <a 
              href="https://moodle.aum.edu.mt/" 
              className="loginBox" 
              target="_blank" 
              rel="noopener noreferrer"
            >
              <div className="loginBoxContent">
                <h3>Moodle</h3>
                <p>Learning Management System</p>
              </div>
            </a>
          </div>

          <p className="loginHelpText">
            Need help accessing your accounts? Contact us at{' '}
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

export default Login;