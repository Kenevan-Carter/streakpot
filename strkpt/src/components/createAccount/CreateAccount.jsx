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

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      console.error("Passwords do not match");
      return;
    }

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      console.error("Signup error:", error.message);
      return;
    }

    const user = data.user;

    if (!user) {
      console.error("No user returned from signup");
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
      console.error("Profile creation error:", profileError.message);
      return;
    }

    console.log("Account created:", user);
  };

  return (
    <div className="signup-page">
      <header className="signup-header">
        <h1>Streak Bet</h1>
      </header>

      <main className="signup-content">
        <h2>Sign Up</h2>

        <p className="signup-subtitle">
          Welcome!
        </p>

        <form className="signup-form" onSubmit={handleSubmit}>
          <div className="signup-field">
            <label htmlFor="username">Username</label>

            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>

          <div className="signup-field">
            <label htmlFor="email">Email</label>

            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="signup-field">
            <label htmlFor="password">Password</label>

            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
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
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>

          <button className="signup-button" type="submit">
            Create Account
          </button>
          <button className="return-button " type="button" 
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