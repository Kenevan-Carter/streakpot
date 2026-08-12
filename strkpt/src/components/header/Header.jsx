// src/components/header/Header.jsx

import "./Header.css";
import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";

function Header({ coins, streak }) {
  const [username, setUsername] = useState("");

  useEffect(() => {
    const loadUsername = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        return;
      }

      const { data, error } = await supabase
        .from("profiles")
        .select("username")
        .eq("id", user.id)
        .single();

      if (error) {
        console.error("Profile error:", error.message);
        return;
      }

      setUsername(data.username);
    };

    loadUsername();
  }, []);

  return (
    <header className="home-header">
      <div className="header-welcome">
        <p className="header-label">WELCOME BACK</p>

        <h1>
          Hey, {username || "User"}
        </h1>

        <p className="header-subtitle">
          Pick a sport and keep your streak alive.
        </p>
      </div>

      <div className="header-account">
        <div className="header-stat">
          <span className="header-stat-label">
            Coins
          </span>

          <span className="header-stat-value">
            {coins.toLocaleString()}
          </span>
        </div>

        <div className="header-divider" />

        <div className="header-stat">
          <span className="header-stat-label">
            Streak
          </span>

          <span className="header-stat-value">
            {streak} 🔥
          </span>
        </div>

        <button className="profile-button">
          {username
            ? username.charAt(0).toUpperCase()
            : "U"}
        </button>
      </div>
    </header>
  );
}

export default Header;