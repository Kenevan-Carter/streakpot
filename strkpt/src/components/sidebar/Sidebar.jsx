
// src/components/sidebar/Sidebar.jsx
import "./Sidebar.css";
import { useNavigate } from "react-router-dom";

function Sidebar() {
  const navigate = useNavigate();

  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        Streak<span>Bet</span>
      </div>

      <nav className="sidebar-nav">
        <button
          className="sidebar-link active"
          onClick={() => navigate("/home")}
        >
          Home
        </button>

        <button className="sidebar-link">
          Sports
        </button>

        <button className="sidebar-link">
          My Bets
        </button>

        <button className="sidebar-link">
          Leaderboard
        </button>
      </nav>

      <div className="sidebar-bottom">
        <button className="sidebar-link">
          Profile
        </button>

        <button className="sidebar-link">
          Settings
        </button>
      </div>
    </aside>
  );
}

export default Sidebar;


