// src/components/stats/Stats.jsx
import "./Stats.css";

function Stats({ coins, streak }) {
  return (
    <section className="stats-panel">
      <div className="stats-heading">
        <div>
          <p className="stats-label">YOUR STATS</p>
          <h2>Season Overview</h2>
        </div>

        <span className="stats-period">All Time</span>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <p>Coin Balance</p>

          <h3>
            {coins.toLocaleString()}
          </h3>

          <span>Available Coins</span>
        </div>

        <div className="stat-card">
          <p>Current Streak</p>

          <h3>
            {streak}
          </h3>

          <span>Wins in a row</span>
        </div>

        <div className="stat-card">
          <p>Total Picks</p>

          <h3>42</h3>

          <span>This season</span>
        </div>

        <div className="stat-card">
          <p>Win Rate</p>

          <h3>71%</h3>

          <span>30 wins</span>
        </div>
      </div>
    </section>
  );
}

export default Stats;