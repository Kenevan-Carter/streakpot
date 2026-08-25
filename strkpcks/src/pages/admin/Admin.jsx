import "./Admin.css";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../lib/supabase";

const checkUser = async () => {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  console.log("Logged in user ID:", user?.id);
};
console.log("ADMIN FILE LOADED");
function Admin() {
  const navigate = useNavigate();

  useEffect(() => {
    checkUser();
  }, []);

  return (
    <div className="admin-page">
      <header className="admin-header">
        <p className="admin-label">StreakPicks ADMIN Home Page</p>
      </header>

      <section className="admin-grid">
        <button
          className="admin-card"
          onClick={() => navigate("/admin/createcontest")}
        >
          <span className="admin-card-label">CONTESTS</span>
          <h2>Create and Manage Contests</h2>
        </button>

        <button
          className="admin-card"
          onClick={() => navigate("/admin/games")}
        >
          <span className="admin-card-label">GAMES</span>
          <h2>View Games</h2>


        </button>

        <button
          className="admin-card"
          onClick={() => navigate("/admin/usertable")}
        >
          <span className="admin-card-label">USERS</span>
          <h2>View Users in The Database</h2>


        </button>

        <button
          className="admin-card"
          onClick={() => navigate("/admin/results")}
        >
          <span className="admin-card-label">RESULTS</span>
          <h2>Contest Results and Stats</h2>

        </button>
      </section>
    </div>
  );
}

export default Admin;