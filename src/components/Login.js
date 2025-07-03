"use client";

import { useState } from "react";
import { setStoredData } from "../utils/localStorage";

const Login = ({ onLogin }) => {
  const [username, setUsername] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (username.trim()) {
      setStoredData("username", username.trim());
      onLogin(username.trim());
      setError("");
    } else {
      setError("Please enter a username");
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h1>Personal Task Tracker</h1>
        <p>Welcome! Please enter your username to continue.</p>

        <form onSubmit={handleSubmit} className="login-form">
          <div className="input-group">
            <input
              type="text"
              placeholder="Enter your username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="login-input"
              autoFocus
            />
          </div>

          {error && <div className="error-message">{error}</div>}

          <button type="submit" className="login-button">
            Get Started
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
