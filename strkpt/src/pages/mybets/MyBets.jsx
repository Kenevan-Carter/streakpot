import { useState } from "react";
import Sidebar from "../../components/sidebar/Sidebar";
import "./MyBets.css";

function MyBets() {
  const [view, setView] = useState("active");

  return (
    <div className="mybets-page">
      <Sidebar />

      <main className="mybets-main">

        {/* HEADER */}
        <div className="mybets-header">
          <div>
            <p className="mybets-small-title">
              YOUR BETS
            </p>

            <h1>My Bets</h1>

            <p className="mybets-subtitle">
              Track your contests and picks.
            </p>
          </div>

          {/* ACTIVE / PAST SWITCH */}
          <div className="mybets-view-tabs">
            <button
              className={`mybets-view-button ${
                view === "active"
                  ? "active"
                  : ""
              }`}
              onClick={() =>
                setView("active")
              }
            >
              Active Bets
            </button>

            <button
              className={`mybets-view-button ${
                view === "past"
                  ? "active"
                  : ""
              }`}
              onClick={() =>
                setView("past")
              }
            >
              Past Bets
            </button>
          </div>
        </div>

        {/* ACTIVE BETS */}
        {view === "active" && (
          <div className="mybets-content">

            <div className="mybets-section-heading">
              <div>
                <p className="mybets-section-label">
                  ACTIVE
                </p>

                <h2>Active Bets</h2>
              </div>
            </div>

            {/* Eventually map real active bets here */}

            <div className="bet-card">
              <div className="bet-card-top">

                <div>
                  <span className="bet-sport">
                    MLB
                  </span>

                  <h3>
                    MLB Daily Contest
                  </h3>
                </div>

                <span className="bet-status active">
                  ACTIVE
                </span>

              </div>

              <div className="bet-stats">

                <div className="bet-stat">
                  <span>
                    Entry
                  </span>

                  <strong>
                    $3
                  </strong>
                </div>

                <div className="bet-stat">
                  <span>
                    Picks
                  </span>

                  <strong>
                    6 / 6
                  </strong>
                </div>

                <div className="bet-stat">
                  <span>
                    Contest
                  </span>

                  <strong>
                    MLB
                  </strong>
                </div>

              </div>

              <div className="bet-card-bottom">
                <span>
                  Picks confirmed
                </span>

                <button>
                  View Picks
                </button>
              </div>

            </div>

          </div>
        )}

        {/* PAST BETS */}
        {view === "past" && (
          <div className="mybets-content">

            <div className="mybets-section-heading">
              <div>
                <p className="mybets-section-label">
                  HISTORY
                </p>

                <h2>Past Bets</h2>
              </div>
            </div>

            {/* Eventually map completed bets here */}

            <div className="bet-card">
              <div className="bet-card-top">

                <div>
                  <span className="bet-sport">
                    MLB
                  </span>

                  <h3>
                    MLB Daily Contest
                  </h3>
                </div>

                <span className="bet-status finished">
                  FINISHED
                </span>

              </div>

              <div className="bet-stats">

                <div className="bet-stat">
                  <span>
                    Entry
                  </span>

                  <strong>
                    $3
                  </strong>
                </div>

                <div className="bet-stat">
                  <span>
                    Correct
                  </span>

                  <strong>
                    5 / 6
                  </strong>
                </div>

                <div className="bet-stat">
                  <span>
                    Winnings
                  </span>

                  <strong>
                    $0
                  </strong>
                </div>

              </div>

              <div className="bet-card-bottom">
                <span>
                  Contest completed
                </span>

                <button>
                  View Results
                </button>
              </div>

            </div>

          </div>
        )}

      </main>
    </div>
  );
}

export default MyBets;