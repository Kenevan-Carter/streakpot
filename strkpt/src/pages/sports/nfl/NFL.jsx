import { useState } from "react";
import Sidebar from "../../../components/sidebar/Sidebar";
import "./NFL.css";

function NFL() {
  const games = [
    {
      id: 1,
      away: "Vikings",
      home: "Rams",
      awayPercent: 49,
      homePercent: 51,
      time: "Thu • 7:20 PM",
    },
    {
      id: 2,
      away: "Cowboys",
      home: "Eagles",
      awayPercent: 44,
      homePercent: 56,
      time: "Sun • 12:00 PM",
    },
    {
      id: 3,
      away: "Chiefs",
      home: "Chargers",
      awayPercent: 67,
      homePercent: 33,
      time: "Sun • 12:00 PM",
    },
    {
      id: 4,
      away: "Packers",
      home: "Lions",
      awayPercent: 46,
      homePercent: 54,
      time: "Sun • 12:00 PM",
    },
    {
      id: 5,
      away: "Bills",
      home: "Ravens",
      awayPercent: 52,
      homePercent: 48,
      time: "Sun • 12:00 PM",
    },
    {
      id: 6,
      away: "49ers",
      home: "Seahawks",
      awayPercent: 61,
      homePercent: 39,
      time: "Sun • 3:05 PM",
    },
    {
      id: 7,
      away: "Bengals",
      home: "Browns",
      awayPercent: 58,
      homePercent: 42,
      time: "Sun • 3:25 PM",
    },
    {
      id: 8,
      away: "Steelers",
      home: "Jets",
      awayPercent: 48,
      homePercent: 52,
      time: "Sun • 3:25 PM",
    },
    {
      id: 9,
      away: "Dolphins",
      home: "Patriots",
      awayPercent: 64,
      homePercent: 36,
      time: "Sun • 7:20 PM",
    },
    {
      id: 10,
      away: "Broncos",
      home: "Raiders",
      awayPercent: 45,
      homePercent: 55,
      time: "Mon • 6:00 PM",
    },
    {
      id: 11,
      away: "Bears",
      home: "Commanders",
      awayPercent: 41,
      homePercent: 59,
      time: "Mon • 7:15 PM",
    },
  ];

  // Stores selections like:
  // {
  //   1: "Vikings",
  //   4: "Lions"
  // }
  const [selections, setSelections] = useState({});

  const handlePick = (gameId, team) => {
    setSelections((previousSelections) => ({
      ...previousSelections,
      [gameId]: team,
    }));
  };

  return (
    <div className="nfl-page">
      <Sidebar />

      <main className="nfl-main">
        <div className="nfl-page-header">
          <p className="nfl-small-title">NFL</p>
          <h1>Week 1</h1>

          <p>
            Pick one winner from each matchup.
          </p>
        </div>

        <div className="games-list">
          {games.map((game) => {
            const selectedTeam = selections[game.id];

            return (
              <div className="game-row" key={game.id}>
                <div className="game-info">
                  <span className="game-week">
                    WEEK 1
                  </span>

                  <span className="game-time">
                    {game.time}
                  </span>
                </div>

                <div className="game-picks">
                  <button
                    className={`pick-button ${
                      selectedTeam === game.away
                        ? "selected"
                        : ""
                    }`}
                    onClick={() =>
                      handlePick(game.id, game.away)
                    }
                  >
                    <span className="team-name">
                      {game.away}
                    </span>

                    <span className="team-percent">
                      {game.awayPercent}%
                    </span>
                  </button>

                  <div className="vs">
                    VS
                  </div>

                  <button
                    className={`pick-button ${
                      selectedTeam === game.home
                        ? "selected"
                        : ""
                    }`}
                    onClick={() =>
                      handlePick(game.id, game.home)
                    }
                  >
                    <span className="team-name">
                      {game.home}
                    </span>

                    <span className="team-percent">
                      {game.homePercent}%
                    </span>
                  </button>
                </div>

                <div className="selection-status">
                  {selectedTeam ? (
                    <>
                      Pick:
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

export default NFL;