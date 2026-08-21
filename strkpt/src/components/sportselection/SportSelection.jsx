// src/components/sportselection/SportSelection.jsx

import "./SportSelection.css";
import { useNavigate } from "react-router-dom";
import nbaLogo from "../../assets/images/nba.png";
import nflLogo from "../../assets/images/nfl.png";
import mlbLogo from "../../assets/images/mlb.jpeg";
import nhlLogo from "../../assets/images/nhl.png";
import eplLogo from "../../assets/images/epl.png";

function SportSelection() {
  const navigate = useNavigate();

  const sports = [
    {
      name: "NBA",
      icon: nbaLogo,
      isImage: true,
    },
    {
      name: "NFL",
      icon: nflLogo,
      isImage: true,
    },
    {
      name: "MLB",
      icon: mlbLogo,
      isImage: true,
    },
    {
      name: "NHL",
      icon: nhlLogo,
      isImage: true,
    },
    {
      name: "Soccer",
      icon: eplLogo,
      isImage: true,
    },
  ];

  const handleSportClick = (sportName) => {
    if (sportName === "NFL") {
      navigate("/sports/nfl");
    } else if (sportName === "NBA") {
      navigate("/sports/nba");
    } else if (sportName === "MLB") {
      navigate("/sports/mlb");
    } else if (sportName === "NHL") {
      navigate("/sports/nhl");
    } else if (sportName === "Soccer") {
      navigate("/sports/soccer");
    }
  };

  return (
    <section className="sport-selection">
      <div className="sport-selection-header">
        <div>
          <p className="sport-selection-label">
            SPORTS
          </p>

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
            onClick={() =>
              handleSportClick(sport.name)
            }
          >
            <span className="sport-icon">
              {sport.isImage ? (
                <img
                  src={sport.icon}
                  alt={`${sport.name} logo`}
                  className="sport-logo"
                />
              ) : (
                sport.icon
              )}
            </span>

            <span className="sport-name">
              {sport.name}
            </span>
          </button>
        ))}
      </div>
    </section>
  );
}

export default SportSelection;