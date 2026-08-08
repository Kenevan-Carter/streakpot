
// src/components/sportselection/SportSelection.jsx
import "./SportSelection.css";

function SportSelection() {
  const sports = [
    { name: "NBA", icon: "🏀" },
    { name: "NFL", icon: "🏈" },
    { name: "MLB", icon: "⚾" },
    { name: "NHL", icon: "🏒" },
    { name: "Soccer", icon: "⚽" },
  ];

  return (
    <section className="sport-selection">
      <div className="sport-selection-header">
        <div>
          <p className="sport-selection-label">SPORTS</p>
          <h2>Choose a Sport</h2>
        </div>

        <span className="sport-selection-subtext">
          Select a league to view games
        </span>
      </div>

      <div className="sports-grid">
        {sports.map((sport) => (
          <button
            key={sport.name}
            className="sport-card"
            onClick={() => console.log(`${sport.name} selected`)}
          >
            <span className="sport-icon">{sport.icon}</span>
            <span className="sport-name">{sport.name}</span>
          </button>
        ))}
      </div>
    </section>
  );
}

export default SportSelection;
