// src/components/login/Login.jsx

import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { supabase } from "../../lib/supabase";

import "./Login.css";

function Login() {
  const navigate = useNavigate();

  const [emailOrUsername, setEmailOrUsername] = useState("");
  const [password, setPassword] = useState("");

  // --------------------------------------------------
  // NORMAL LOGIN
  // --------------------------------------------------

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Make sure normal users are not treated as guests
      localStorage.removeItem("isGuest");

      const { data, error } =
        await supabase.auth.signInWithPassword({
          email: emailOrUsername,
          password,
        });

      if (error) {
        console.error("LOGIN ERROR:");
        console.error(error);
        console.error("Message:", error.message);
        console.error("Status:", error.status);
        console.error("Code:", error.code);
        return;
      }

      if (!data?.user) {
        console.error(
          "LOGIN ERROR: Supabase returned no user."
        );
        return;
      }

      const userId = data.user.id;

      const {
        data: profile,
        error: profileError,
      } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .single();

      if (profileError) {
        console.error("PROFILE ERROR:");
        console.error(profileError);
        console.error(
          "Message:",
          profileError.message
        );
        console.error(
          "Details:",
          profileError.details
        );
        console.error(
          "Hint:",
          profileError.hint
        );
        console.error(
          "Code:",
          profileError.code
        );

        return;
      }

      console.log("Logged in user:", data.user);
      console.log("Session:", data.session);
      console.log("Profile:", profile);

      navigate("/home");
    } catch (error) {
      console.error(
        "UNEXPECTED LOGIN ERROR:",
        error
      );
    }
  };

  // --------------------------------------------------
  // GUEST LOGIN
  // --------------------------------------------------

  const handleGuestLogin = () => {
    localStorage.setItem("isGuest", "true");

    navigate("/home");
  };

  return (
    <div className="login-page">
      <h1 className="login-logo">
        <span className="logo-streak">
          Streak
        </span>

        <span className="logo-picks">
          Picks
        </span>
      </h1>

      <main className="login-content">
        <h2>Log In</h2>

        <p className="login-subtitle">
          Continue Your Experience
        </p>

        <form
          className="login-form"
          onSubmit={handleSubmit}
        >
          <div className="login-field">
            <label htmlFor="email">
              Email or Username
            </label>

            <input
              id="email"
              type="text"
              value={emailOrUsername}
              onChange={(e) =>
                setEmailOrUsername(
                  e.target.value
                )
              }
            />

            <button
              className="forgot-link"
              type="button"
              onClick={() =>
                console.log(
                  "Forgot email"
                )
              }
            >
              Forgot Email?
            </button>
          </div>

          <div className="login-field">
            <label htmlFor="password">
              Password
            </label>

            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) =>
                setPassword(
                  e.target.value
                )
              }
            />

            <button
              className="forgot-link"
              type="button"
              onClick={() =>
                console.log(
                  "Forgot password"
                )
              }
            >
              Forgot Password?
            </button>
          </div>

          <button
            className="login-button"
            type="submit"
          >
            Log In
          </button>

          <button
            className="forgot-link create-account-link"
            type="button"
            onClick={() =>
              navigate(
                "/create-account"
              )
            }
          >
            Create Account
          </button>
        </form>

        <div className="guest-divider">
          <span>OR</span>
        </div>

        <button
          className="guest-button"
          type="button"
          onClick={handleGuestLogin}
        >
          Explore as Guest
        </button>
      </main>
    </div>
  );
}

export default Login;