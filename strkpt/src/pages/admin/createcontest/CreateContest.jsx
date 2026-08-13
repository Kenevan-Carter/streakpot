import { useMemo, useState } from "react";
import "./CreateContest.css";

function CreateContest() {
  const [selectedSport, setSelectedSport] = useState("NBA");
  const [selectedGames, setSelectedGames] = useState([]);
  const [entryFee, setEntryFee] = useState(3);

  const sports = ["NBA", "NFL", "MLB", "NHL", "EPL"];

  const games = {
    NBA: [
      {
        id: "nba-1",
        date: "2026-08-12",
        dateLabel: "Wed August 12th",
        away: "Minnesota Timberwolves",
        home: "Denver Nuggets",
        time: "6:00 PM",
      },
      {
        id: "nba-2",
        date: "2026-08-12",
        dateLabel: "Wed August 12th",
        away: "Boston Celtics",
        home: "New York Knicks",
        time: "6:30 PM",
      },
      {
        id: "nba-3",
        date: "2026-08-12",
        dateLabel: "Wed August 12th",
        away: "Los Angeles Lakers",
        home: "Golden State Warriors",
        time: "9:00 PM",
      },
      {
        id: "nba-4",
        date: "2026-08-12",
        dateLabel: "Wed August 12th",
        away: "Milwaukee Bucks",
        home: "Cleveland Cavaliers",
        time: "7:00 PM",
      },

      {
        id: "nba-5",
        date: "2026-08-13",
        dateLabel: "Thu August 13th",
        away: "Phoenix Suns",
        home: "Sacramento Kings",
        time: "9:30 PM",
      },
      {
        id: "nba-6",
        date: "2026-08-13",
        dateLabel: "Thu August 13th",
        away: "Dallas Mavericks",
        home: "Houston Rockets",
        time: "8:00 PM",
      },
      {
        id: "nba-7",
        date: "2026-08-13",
        dateLabel: "Thu August 13th",
        away: "Miami Heat",
        home: "Orlando Magic",
        time: "6:00 PM",
      },
      {
        id: "nba-8",
        date: "2026-08-13",
        dateLabel: "Thu August 13th",
        away: "San Antonio Spurs",
        home: "Memphis Grizzlies",
        time: "7:30 PM",
      },
    ],

    NFL: [
      {
        id: "nfl-1",
        date: "2026-08-12",
        dateLabel: "Wed August 12th",
        away: "Minnesota Vikings",
        home: "Green Bay Packers",
        time: "7:00 PM",
      },
      {
        id: "nfl-2",
        date: "2026-08-13",
        dateLabel: "Thu August 13th",
        away: "Detroit Lions",
        home: "Chicago Bears",
        time: "7:00 PM",
      },
    ],

    MLB: [
      {
        id: "mlb-1",
        date: "2026-08-12",
        dateLabel: "Wed August 12th",
        away: "Minnesota Twins",
        home: "Detroit Tigers",
        time: "12:10 PM",
      },
      {
        id: "mlb-2",
        date: "2026-08-13",
        dateLabel: "Thu August 13th",
        away: "New York Yankees",
        home: "Boston Red Sox",
        time: "6:10 PM",
      },
    ],

    NHL: [
      {
        id: "nhl-1",
        date: "2026-08-12",
        dateLabel: "Wed August 12th",
        away: "Minnesota Wild",
        home: "Colorado Avalanche",
        time: "7:00 PM",
      },
      {
        id: "nhl-2",
        date: "2026-08-13",
        dateLabel: "Thu August 13th",
        away: "Toronto Maple Leafs",
        home: "Boston Bruins",
        time: "6:00 PM",
      },
    ],

    EPL: [
      {
        id: "epl-1",
        date: "2026-08-12",
        dateLabel: "Wed August 12th",
        away: "Arsenal",
        home: "Chelsea",
        time: "10:00 AM",
      },
      {
        id: "epl-2",
        date: "2026-08-13",
        dateLabel: "Thu August 13th",
        away: "Liverpool",
        home: "Manchester City",
        time: "12:30 PM",
      },
    ],
  };

  const currentGames = games[selectedSport] || [];

  const gamesByDate = useMemo(() => {
    return currentGames.reduce((groups, game) => {
      if (!groups[game.date]) {
        groups[game.date] = {
          label: game.dateLabel,
          games: [],
        };
      }

      groups[game.date].games.push(game);

      return groups;
    }, {});
  }, [currentGames]);

  const handleSportChange = (sport) => {
    setSelectedSport(sport);
    setSelectedGames([]);
  };

  const handleGameSelect = (game) => {
    setSelectedGames((previousGames) => {
      const alreadySelected = previousGames.some(
        (selectedGame) => selectedGame.id === game.id
      );

      if (alreadySelected) {
        return previousGames.filter(
          (selectedGame) => selectedGame.id !== game.id
        );
      }

      return [...previousGames, game];
    });
  };

  const isSelected = (gameId) => {
    return selectedGames.some((game) => game.id === gameId);
  };

  const handleCreateContest = () => {
    if (selectedGames.length === 0) {
      alert("Select at least one game.");
      return;
    }

    console.log({
      sport: selectedSport,
      entryFee,
      selectedGames,
    });
  };

  return (
    <div className="create-contest-page">
      <div className="sport-tabs">
        {sports.map((sport) => (
          <button
            key={sport}
            className={`sport-tab ${
              selectedSport === sport ? "active" : ""
            }`}
            onClick={() => handleSportChange(sport)}
          >
            {sport}
          </button>
        ))}
      </div>

      <div className="contest-game-panel">
        <div className="game-scroll-area">
          {Object.entries(gamesByDate).map(
            ([date, dateGroup]) => (
              <div className="date-group" key={date}>
                <div className="date-heading">
                  {dateGroup.label}
                </div>

                <div className="date-games">
                  {dateGroup.games.map((game) => (
                    <label
                      key={game.id}
                      className={`game-row ${
                        isSelected(game.id)
                          ? "selected"
                          : ""
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={isSelected(game.id)}
                        onChange={() =>
                          handleGameSelect(game)
                        }
                      />

                      <div className="game-info">
                        <div className="game-teams">
                          <span>{game.away}</span>

                          <span className="game-at">
                            @
                          </span>

                          <span>{game.home}</span>
                        </div>

                        <span className="game-time">
                          {game.time}
                        </span>
                      </div>
                    </label>
                  ))}
                </div>
              </div>
            )
          )}
        </div>
      </div>

      <div className="contest-footer">
        <div className="footer-stat">
          <span className="footer-label">
            GAMES SELECTED
          </span>

          <span className="footer-value">
            {selectedGames.length}
          </span>
        </div>

        <div className="footer-entry">
          <label
            className="footer-label"
            htmlFor="entry-fee"
          >
            ENTRY FEE
          </label>

          <select
            id="entry-fee"
            value={entryFee}
            onChange={(event) =>
              setEntryFee(
                Number(event.target.value)
              )
            }
          >
            <option value={1}>$1</option>
            <option value={3}>$3</option>
            <option value={5}>$5</option>
            <option value={10}>$10</option>
            <option value={20}>$20</option>
          </select>
        </div>

        <button
          className="create-contest-button"
          onClick={handleCreateContest}
        >
          Create Contest
        </button>
      </div>
    </div>
  );
}

export default CreateContest;