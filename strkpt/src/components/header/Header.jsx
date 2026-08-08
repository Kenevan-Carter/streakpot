// src/components/header/Header.jsx
import "./Header.css";

function Header({ name, coins, streak }) {
  return (
    <header className="home-header">
      <div className="header-welcome">
        <p className="header-label">WELCOME BACK</p>
        <h1>Hey, {name}</h1>
        <p className="header-subtitle">
          Pick a sport and keep your streak alive.
        </p>
      </div>

      <div className="header-account">
        <div className="header-stat">
          <span className="header-stat-label">Coins</span>
          <span className="header-stat-value">
            {coins.toLocaleString()}
          </span>
        </div>

        <div className="header-divider" />

        <div className="header-stat">
          <span className="header-stat-label">Streak</span>
          <span className="header-stat-value">
            {streak} 🔥
          </span>
        </div>

        <button className="profile-button">
          {name.charAt(0).toUpperCase()}
        </button>
      </div>
    </header>
  );
}

export default Header;