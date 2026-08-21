import { supabase } from "../../lib/supabase";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./CreateAccount.css";

function CreateAccount() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();

    // Clear old message
    setMessage("");
    setMessageType("");

    if (password !== confirmPassword) {
      setMessage("Passwords do not match.");
      setMessageType("error");
      return;
    }

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      setMessage(error.message);
      setMessageType("error");
      return;
    }

    const user = data.user;

    if (!user) {
      setMessage("Account could not be created. Please try again.");
      setMessageType("error");
      return;
    }

    const { error: profileError } = await supabase
      .from("profiles")
      .insert([
        {
          id: user.id,
          username: username,
        },
      ]);

    if (profileError) {
      setMessage(profileError.message);
      setMessageType("error");
      return;
    }

    setMessage("Account created successfully!");
    setMessageType("success");

    // Optional: wait a little so the user can see the success message
    setTimeout(() => {
      navigate("/");
    }, 1200);
  };

  return (
    <div className="signup-page">
      <h1>StreakPicks</h1>

      <main className="signup-content">
        <h2>Sign Up and Start Picking!</h2>

        <form className="signup-form" onSubmit={handleSubmit}>
          <div className="signup-field">
            <label htmlFor="username">Username</label>

            <input
              id="username"
              type="text"
              value={username}
              onChange={(event) => setUsername(event.target.value)}
              required
            />
          </div>

          <div className="signup-field">
            <label htmlFor="email">Email</label>

            <input
              id="email"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
            />
          </div>

          <div className="signup-field">
            <label htmlFor="password">Password</label>

            <input
              id="password"
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
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
              onChange={(event) => setConfirmPassword(event.target.value)}
              required
            />
          </div>

          {message && (
            <div className={`account-message ${messageType}`}>
              {message}
            </div>
          )}

          <button className="signup-button" type="submit">
            Create Account
          </button>

          <button
            className="return-button"
            type="button"
            onClick={() => navigate("/")}
          >
            Return to Login
          </button>
        </form>
      </main>
    </div>
  );
}

export default CreateAccount;