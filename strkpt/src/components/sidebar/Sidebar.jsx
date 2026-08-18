// src/components/sidebar/Sidebar.jsx

import "./Sidebar.css";
import {
  useLocation,
  useNavigate,
} from "react-router-dom";
import { supabase } from "../../lib/supabase";

function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    const { error } =
      await supabase.auth.signOut();

    if (error) {
      console.error(
        "Logout error:",
        error.message
      );
      return;
    }

    navigate("/");
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        Streak<span>Bet</span>
      </div>

      <nav className="sidebar-nav">

        <button
          className={`sidebar-link ${
            isActive("/home")
              ? "active"
              : ""
          }`}
          onClick={() =>
            navigate("/home")
          }
        >
          Home
        </button>

        <button
          className={`sidebar-link ${
            location.pathname.startsWith(
              "/sports"
            ) ||
            location.pathname.startsWith(
              "/games"
            )
              ? "active"
              : ""
          }`}
          onClick={() =>
            navigate("/sports")
          }
        >
          Sports
        </button>

        <button
          className={`sidebar-link ${
            location.pathname.startsWith(
              "/mybets"
            )
              ? "active"
              : ""
          }`}
          onClick={() =>
            navigate("/mybets")
          }
        >
          My Bets
        </button>

        <button
          className={`sidebar-link ${
            location.pathname.startsWith(
              "/leaderboard"
            )
              ? "active"
              : ""
          }`}
          onClick={() =>
            navigate("/leaderboard")
          }
        >
          Leaderboard
        </button>

      </nav>

      <div className="sidebar-bottom">

        <button
          className={`sidebar-link ${
            location.pathname.startsWith(
              "/profile"
            )
              ? "active"
              : ""
          }`}
          onClick={() =>
            navigate("/profile")
          }
        >
          Profile
        </button>

        <button
          className={`sidebar-link ${
            location.pathname.startsWith(
              "/settings"
            )
              ? "active"
              : ""
          }`}
          onClick={() =>
            navigate("/settings")
          }
        >
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