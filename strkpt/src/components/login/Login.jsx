
// src/components/login/Login.jsx
import { supabase } from "../../lib/supabase";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css";

function Login() {
  const navigate = useNavigate();

  const [emailOrUsername, setEmailOrUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { data, error } = await supabase.auth.signInWithPassword({
      email: emailOrUsername,
      password: password,
    });

    if (error) {
      console.error("Login error:", error.message);
      return;
    }

    const userId = data.user.id;

    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .single();

    if (profileError) {
      console.error("Profile error:", profileError.message);
      return;
    }

    console.log("Logged in user:", data.user);
    console.log("Profile:", profile);

    navigate("/home");
  };

  return (
    <div className="login-page">
      <h1>Streak Bet</h1>

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

          <button
            className="forgot-link create-account-link"
            type="button"
            onClick={() => navigate("/create-account")}
          >
            Create Account
          </button>
        </form>
      </main>
    </div>
  );
}

export default Login;

