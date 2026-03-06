import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FiMail, FiLock, FiEye, FiEyeOff, FiUser } from "react-icons/fi";
import axios from 'axios';
import "./Login.css"; // Make sure this CSS file exists
// import Loader from "../Loader/Loader"; // Uncomment if you have this component

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("freelancer"); // Default to freelancer
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    // Validation for role
    if (!role || role === 'role') { // Check for placeholder value
        setError("Please select your role.");
        return;
    }

    setLoading(true);

    try {
      const config = {
        headers: {
          'Content-Type': 'application/json',
        },
      };

      // Determine the correct API endpoint based on the selected role
      let apiEndpoint = '';
      if (role === 'freelancer') {
        apiEndpoint = '/api/auth/freelancer/login';
      } else if (role === 'client') {
        apiEndpoint = '/api/auth/client/login';
      } else if (role === 'student') {
        // --- THIS LINE IS UPDATED ---
        apiEndpoint = '/api/auth/student/login'; // Enable student login
      } else {
        setError("Invalid role selected.");
        setLoading(false);
        return;
      }

      // Call the dynamically chosen endpoint
      const { data } = await axios.post(
        `http://localhost:5000${apiEndpoint}`,
        { email, password },
        config
      );

      // --- SUCCESS HANDLING ---
      console.log("Login successful:", data);
      localStorage.setItem('token', data.token);
      localStorage.setItem('userRole', data.role.toLowerCase()); // Use role from backend
      localStorage.setItem('userName', data.firstName);
      localStorage.setItem('userEmail', data.email);

      setLoading(false);

      // Navigate all roles to the Landing Page
      navigate("/");

    } catch (err) {
      console.error("Login error:", err);
      setError(
        err.response && err.response.data.message
            ? err.response.data.message
            : "Login failed. Please check credentials."
      );
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      {/* {loading && <Loader />} */}
      <div className="auth-nav">
        <Link to="/" className="logo">CareerLaunchPad</Link>
        <div className="nav-actions">
          <Link to="/signup" className="signup-btn">Sign Up</Link>
        </div>
      </div>

      <div className="auth-container">
        <div className="auth-card">
          <h2>Login to Your Account</h2>

          <form onSubmit={handleLogin}>
            {error && <p className="error-message">{error}</p>}

            {/* --- Role Selector Dropdown --- */}
            <div className="input-group icon-input">
              <FiUser className="input-icon" />
              <select
                name="role"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                required
                className='role-select' // Use class from signup
              >
                {/* <option value="role">Select Your Role</option> /} {/ Optional placeholder */}
                <option value="freelancer">Login as Freelancer</option>
                <option value="client">Login as Client</option>
                <option value="student">Login as Student</option>
              </select>
            </div>
            {/* --- End Role Selector Dropdown --- */}

            <div className="input-group icon-input">
              <FiMail className="input-icon" />
              <input
                type="email"
                placeholder="Email Address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="input-group icon-input password-input">
              <FiLock className="input-icon" />
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)} // Corrected typo
                required
              />
              <span
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <FiEyeOff /> : <FiEye />}
              </span>
            </div>

            <button type="submit" className="auth-btn" disabled={loading}>
              {loading ? 'Logging In...' : 'Login'}
            </button>

            <div className="auth-links">
              <p>
                Don't have an account? <Link to="/signup">Sign Up</Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;