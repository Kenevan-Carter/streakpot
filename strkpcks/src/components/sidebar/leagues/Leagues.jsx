import { useNavigate } from "react-router-dom";
import Sidebar from "../Sidebar";
import "./Leagues.css";

function Leagues() {
  const navigate = useNavigate();

  return (
    <div className="leagues-page">
      <Sidebar />

      <main className="leagues-main">
        <div className="leagues-header">
          <h1>Leagues</h1>

          <p className="leagues-description">
            Create, discover, and manage custom prediction leagues.
          </p>
        </div>

        <div className="league-options-grid">

          <button
            className="league-option-card"
            onClick={() => navigate("/leagues/view")}
          >
            <div className="league-option-icon">◫</div>

            <div>
              <h2>View Leagues</h2>
            </div>
          </button>


          <button
            className="league-option-card"
            onClick={() => navigate("/leagues/create")}
          >
            <div className="league-option-icon">＋</div>

            <div>
              <h2>Create a League</h2>
            </div>
          </button>


          <button
            className="league-option-card"
            onClick={() => navigate("/leagues/search")}
          >
            <div className="league-option-icon">⌕</div>

            <div>
              <h2>Search Leagues</h2>

            </div>
          </button>


          <button
            className="league-option-card"
            onClick={() => navigate("/leagues/manage")}
          >
            <div className="league-option-icon">⚙</div>

            <div>
              <h2>Manage Leagues</h2>
            </div>
          </button>

        </div>
      </main>
    </div>
  );
}

export default Leagues;