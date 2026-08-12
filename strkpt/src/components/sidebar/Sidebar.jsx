// src/components/sidebar/Sidebar.jsx

import "./Sidebar.css";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../lib/supabase";

function Sidebar() {
  const navigate = useNavigate();

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();

    if (error) {
      console.error("Logout error:", error.message);
      return;
    }

    navigate("/");
  };

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

        <button
          className="sidebar-link logout-button"
          onClick={handleLogout}
        >
          Log Out
        </button>
      </div>
    </aside>
  );
}

export default Sidebar;