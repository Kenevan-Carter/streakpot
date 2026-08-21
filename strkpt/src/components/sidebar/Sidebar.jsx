// src/components/sidebar/Sidebar.jsx

import { useState } from "react";
import "./Sidebar.css";

import {
  useLocation,
  useNavigate,
} from "react-router-dom";

import { supabase } from "../../lib/supabase";

function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();

  const [showLogoutConfirm, setShowLogoutConfirm] =
    useState(false);

  const [loggingOut, setLoggingOut] =
    useState(false);

  const handleLogout = async () => {
    setLoggingOut(true);

    const { error } =
      await supabase.auth.signOut();

    if (error) {
      console.error(
        "Logout error:",
        error.message
      );

      setLoggingOut(false);
      return;
    }

    navigate("/");
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <>
      <aside className="sidebar">

        <div className="sidebar-logo">
          Streak<span>Pick</span>
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
            className="sidebar-link"
            onClick={() =>
              setShowLogoutConfirm(true)
            }
          >
            Logout
          </button>

        </div>

      </aside>

      {showLogoutConfirm && (
        <div className="logout-modal-overlay">

          <div className="logout-modal">

            <p className="logout-modal-label">
              LOG OUT
            </p>

            <h2>
              Are you sure?
            </h2>

            <div className="logout-modal-buttons">

              <button
                className="logout-cancel-button"
                onClick={() =>
                  setShowLogoutConfirm(false)
                }
                disabled={loggingOut}
              >
                No, Cancel
              </button>

              <button
                className="logout-confirm-button"
                onClick={handleLogout}
                disabled={loggingOut}
              >
                {loggingOut
                  ? "Logging out..."
                  : "Yes, Log Out"}
              </button>

            </div>

          </div>

        </div>
      )}
    </>
  );
}

export default Sidebar;