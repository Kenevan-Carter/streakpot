import "./Admin.css";
import { useNavigate } from "react-router-dom";

function Admin() {
  const navigate = useNavigate();

  return (
    <div className="admin-page">
      <header className="admin-header">
        <p className="admin-label">STREAKBET ADMIN</p>
        <h1>Admin Dashboard</h1>

        <p>
          Manage contests, games, users, and results.
        </p>
      </header>

      <section className="admin-grid">
        <button
          className="admin-card"
          onClick={() => navigate("/admin/createcontest")}
        >
          <span className="admin-card-label">
            CONTESTS
          </span>

          <h2>Manage Contests</h2>

          <p>
            Create contests, set entry fees, open or close entries,
            and view current pots.
          </p>
        </button>

        <button
          className="admin-card"
          onClick={() => navigate("/admin/games")}
        >
          <span className="admin-card-label">
            GAMES
          </span>

          <h2>Manage Games</h2>

          <p>
            Add games to contests and manage start times and results.
          </p>
        </button>

        <button
          className="admin-card"
          onClick={() => navigate("/admin/usertable")}
        >
          <span className="admin-card-label">
            USERS
          </span>

          <h2>View Users</h2>

          <p>
            Review registered accounts and contest participation.
          </p>
        </button>

        <button
          className="admin-card"
          onClick={() => navigate("/admin/results")}
        >
          <span className="admin-card-label">
            RESULTS
          </span>

          <h2>Game Results</h2>

          <p>
            Record winners and grade contest picks.
          </p>
        </button>
      </section>
    </div>
  );
}

export default Admin;