import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { supabase } from "../../lib/supabase";

import "./CreateAccount.css";

function CreateAccount() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");
  const [creatingAccount, setCreatingAccount] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();

    setMessage("");
    setMessageType("");

    const cleanedEmail = email.trim();
    const cleanedUsername = username.trim();

    if (!cleanedUsername) {
      setMessage("Please enter a username.");
      setMessageType("error");
      return;
    }

    if (password !== confirmPassword) {
      setMessage("Passwords do not match.");
      setMessageType("error");
      return;
    }

    setCreatingAccount(true);

    try {
      const { data, error } = await supabase.auth.signUp({
        email: cleanedEmail,
        password,

        options: {
          data: {
            username: cleanedUsername,
          },
        },
      });

      if (error) {
        console.error("Signup error:", error);
        setMessage(error.message);
        setMessageType("error");
        return;
      }

      if (!data.user) {
        console.error("No user returned from signup:", data);

        setMessage(
          "Account could not be created. Please try again."
        );
        setMessageType("error");
        return;
      }

      console.log("Account created:", data.user);
      console.log("Session:", data.session);

      setMessage("Account created successfully!");
      setMessageType("success");

      setTimeout(() => {
        navigate("/");
      }, 1200);

    } catch (error) {
      console.error("Unexpected signup error:", error);

      setMessage(
        "Something went wrong while creating your account."
      );
      setMessageType("error");

    } finally {
      setCreatingAccount(false);
    }
  };

  return (
    <div className="signup-page">
      <h1 className="signup-logo">
  <span className="logo-streak">Streak</span>
  <span className="logo-picks">Picks</span>
</h1>

      <main className="signup-content">
        <h2>Sign Up and Start Picking!</h2>

        <form
          className="signup-form"
          onSubmit={handleSubmit}
        >
          <div className="signup-field">
            <label htmlFor="username">
              Username
            </label>

            <input
              id="username"
              type="text"
              value={username}
              onChange={(event) =>
                setUsername(event.target.value)
              }
              required
            />
          </div>

          <div className="signup-field">
            <label htmlFor="email">
              Email
            </label>

            <input
              id="email"
              type="email"
              value={email}
              onChange={(event) =>
                setEmail(event.target.value)
              }
              required
            />
          </div>

          <div className="signup-field">
            <label htmlFor="password">
              Password
            </label>

            <input
              id="password"
              type="password"
              value={password}
              onChange={(event) =>
                setPassword(event.target.value)
              }
              required
            />
          </div>

          <div className="signup-field">
            <label htmlFor="confirmPassword">
              Confirm Password
            </label>

            <input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(event) =>
                setConfirmPassword(event.target.value)
              }
              required
            />
          </div>

          {message && (
            <div
              className={`account-message ${messageType}`}
            >
              {message}
            </div>
          )}

          <button
            className="signup-button"
            type="submit"
            disabled={creatingAccount}
          >
            {creatingAccount
              ? "Creating Account..."
              : "Create Account"}
          </button>

          <button
            className="return-button"
            type="button"
            onClick={() => navigate("/")}
            disabled={creatingAccount}
          >
            Return to Login
          </button>
        </form>
      </main>
    </div>
  );
}

export default CreateAccount;