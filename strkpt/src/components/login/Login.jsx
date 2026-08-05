// src/components/login/Login.jsx

import { useState } from "react";
import "./Login.css";

function Login() {
  const [emailOrUsername, setEmailOrUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    console.log({
      emailOrUsername,
      password,
    });
  };

  return (
    <div className="login-page">
      <header className="login-header">
        <h1>Streak Bet</h1>
      </header>

      <main className="login-content">
        <h2>Log In</h2>

        <p className="login-subtitle">
          Continue Your StreakPot Experience
        </p>

        <form className="login-form" onSubmit={handleSubmit}>
          <div className="login-field">
            <label htmlFor="email">Email or Username</label>

            <input
              id="email"
              type="text"
              value={emailOrUsername}
              onChange={(e) => setEmailOrUsername(e.target.value)}
            />

            <button
              className="forgot-link"
              type="button"
              onClick={() => console.log("Forgot email")}
            >
              Forgot Email?
            </button>
          </div>

          <div className="login-field">
            <label htmlFor="password">Password</label>

            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <button
              className="forgot-link"
              type="button"
              onClick={() => console.log("Forgot password")}
            >
              Forgot Password?
            </button>
          </div>

          <button className="login-button" type="submit">
            Log In
          </button>
        </form>
      </main>
    </div>
  );
}

export default Login;