import { useState } from "react";
import Sidebar from "../../../components/sidebar/Sidebar";
import "./NBA.css";

function NBA() {
    const entryFee = 3;
    const currentEntries = 50000;
  
    const currentPot = currentEntries * entryFee;
  
    const games = [
    {
      id: 1,
      league: "NBA",
      away: "Timberwolves",
      home: "Nuggets",
      awayPercent: 53,
      homePercent: 47,
      time: "6:00 PM",
    },
    {
      id: 2,
      league: "NBA",
      away: "Celtics",
      home: "Knicks",
      awayPercent: 59,
      homePercent: 41,
      time: "6:30 PM",
    },
    {
      id: 3,
      league: "G LEAGUE",
      away: "Iowa Wolves",
      home: "Sioux Falls Skyforce",
      awayPercent: 48,
      homePercent: 52,
      time: "6:30 PM",
    },
    {
      id: 4,
      league: "NBA",
      away: "Bucks",
      home: "Cavaliers",
      awayPercent: 46,
      homePercent: 54,
      time: "7:00 PM",
    },
    {
      id: 5,
      league: "NBA",
      away: "Lakers",
      home: "Warriors",
      awayPercent: 51,
      homePercent: 49,
      time: "7:00 PM",
    },
    {
      id: 6,
      league: "G LEAGUE",
      away: "South Bay Lakers",
      home: "Santa Cruz Warriors",
      awayPercent: 44,
      homePercent: 56,
      time: "7:30 PM",
    },
    {
      id: 7,
      league: "NBA",
      away: "Thunder",
      home: "Mavericks",
      awayPercent: 62,
      homePercent: 38,
      time: "7:30 PM",
    },
    {
      id: 8,
      league: "NBA",
      away: "Suns",
      home: "Kings",
      awayPercent: 49,
      homePercent: 51,
      time: "8:00 PM",
    },
    {
      id: 9,
      league: "NBA",
      away: "Clippers",
      home: "Rockets",
      awayPercent: 43,
      homePercent: 57,
      time: "8:00 PM",
    },
    {
      id: 10,
      league: "G LEAGUE",
      away: "Austin Spurs",
      home: "Texas Legends",
      awayPercent: 55,
      homePercent: 45,
      time: "8:30 PM",
    },
    {
      id: 11,
      league: "NBA",
      away: "Heat",
      home: "Trail Blazers",
      awayPercent: 58,
      homePercent: 42,
      time: "9:00 PM",
    },
  ];

  const [selections, setSelections] = useState({});

  const handlePick = (gameId, team) => {
    setSelections((previousSelections) => ({
      ...previousSelections,
      [gameId]: team,
    }));
  };

  return (
    <div className="nba-page">
      <Sidebar />

      <main className="nba-main">

        <div className="nba-page-header">
  <div className="nba-header-left">
    <p className="nba-small-title">
      BASKETBALL
    </p>

    <h1>Today's Games</h1>

    <p className="nba-header-description">
      Pick one winner from each matchup.
    </p>
  </div>

  <div className="nba-contest-info">

    <div className="nba-contest-stat">
      <span className="contest-stat-label">
        Entry
      </span>

      <span className="contest-stat-value">
        ${entryFee}
      </span>
    </div>

    <div className="nba-header-divider"></div>

    <div className="nba-contest-stat">
      <span className="contest-stat-label">
        Current Entries
      </span>

      <span className="contest-stat-value">
        {currentEntries.toLocaleString()}
      </span>
    </div>

    <div className="nba-header-divider"></div>

    <div className="nba-contest-stat">
      <span className="contest-stat-label">
        Current Pot
      </span>

      <span className="contest-stat-value pot-highlight">
        ${currentPot.toLocaleString()}
      </span>
    </div>

  </div>
</div>

        <div className="nba-games-list">

          {games.map((game) => {
            const selectedTeam = selections[game.id];

            return (
              <div
                className={`nba-game-row ${
                  game.league === "G LEAGUE"
                    ? "g-league-game"
                    : ""
                }`}
                key={game.id}
              >

                <div className="nba-game-info">

                  <span
                    className={
                      game.league === "G LEAGUE"
                        ? "league-label g-league-label"
                        : "league-label"
                    }
                  >
                    {game.league}
                  </span>

                  <span className="nba-game-time">
                    {game.time}
                  </span>

                </div>

                <div className="nba-game-picks">

                  <button
                    className={`nba-pick-button ${
                      selectedTeam === game.away
                        ? "selected"
                        : ""
                    }`}
                    onClick={() =>
                      handlePick(game.id, game.away)
                    }
                  >
                    <span className="nba-team-name">
                      {game.away}
                    </span>

                    <span className="nba-team-percent">
                      {game.awayPercent}%
                    </span>
                  </button>

                  <div className="nba-vs">
                    VS
                  </div>

                  <button
                    className={`nba-pick-button ${
                      selectedTeam === game.home
                        ? "selected"
                        : ""
                    }`}
                    onClick={() =>
                      handlePick(game.id, game.home)
                    }
                  >
                    <span className="nba-team-name">
                      {game.home}
                    </span>

                    <span className="nba-team-percent">
                      {game.homePercent}%
                    </span>
                  </button>

                </div>

                <div className="nba-selection-status">

                  {selectedTeam ? (
                    <>
                      Pick
                      <span>
                        {selectedTeam}
                      </span>
                    </>
                  ) : (
                    "No pick"
                  )}

                </div>

              </div>
            );
          })}

        </div>

      </main>
    </div>
  );
}

export default NBA;