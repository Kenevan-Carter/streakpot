import { useEffect, useMemo, useState } from "react";
import { getGamesForDates } from "../../../services/sportsApi";
import { supabase } from "../../../lib/supabase";
import "./CreateContest.css";

function CreateContest() {
  const [selectedSport, setSelectedSport] = useState("NBA");
  const [selectedGames, setSelectedGames] = useState([]);
  const [entryFee, setEntryFee] = useState(3);

  const [games, setGames] = useState([]);
  const [loadingGames, setLoadingGames] = useState(false);
  const [gameError, setGameError] = useState("");

  const [creatingContest, setCreatingContest] = useState(false);
  const [contestMessage, setContestMessage] = useState("");

  const sports = ["NBA", "NFL", "MLB", "NHL", "EPL"];

  const formatDateForAPI = (date) => {
    const year = date.getFullYear();

    const month = String(
      date.getMonth() + 1
    ).padStart(2, "0");

    const day = String(
      date.getDate()
    ).padStart(2, "0");

    return `${year}-${month}-${day}`;
  };

  const getContestDates = () => {
    const today = new Date();

    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);

    return [
      formatDateForAPI(today),
      formatDateForAPI(tomorrow),
    ];
  };

  const formatDateHeading = (dateString) => {
    const date = new Date(`${dateString}T12:00:00`);

    return date
      .toLocaleDateString("en-US", {
        weekday: "short",
        month: "long",
        day: "numeric",
      })
      .replace(",", "");
  };

  const formatGameTime = (startsAt) => {
    if (!startsAt) {
      return "TBD";
    }

    return new Date(startsAt).toLocaleTimeString(
      "en-US",
      {
        hour: "numeric",
        minute: "2-digit",
      }
    );
  };

  useEffect(() => {
    const loadGames = async () => {
      setLoadingGames(true);
      setGameError("");
      setContestMessage("");
      setSelectedGames([]);

      try {
        const dates = getContestDates();

        const gameData = await getGamesForDates(
          selectedSport,
          dates
        );

        setGames(gameData);
      } catch (error) {
        console.error("Game API error:", error);

        setGameError(error.message);
        setGames([]);
      } finally {
        setLoadingGames(false);
      }
    };

    loadGames();
  }, [selectedSport]);

  const gamesByDate = useMemo(() => {
    return games.reduce((groups, game) => {
      if (!groups[game.date]) {
        groups[game.date] = [];
      }

      groups[game.date].push(game);

      return groups;
    }, {});
  }, [games]);

  const handleSportChange = (sport) => {
    setSelectedSport(sport);
  };

  const handleGameSelect = (game) => {
    setSelectedGames((previousGames) => {
      const alreadySelected = previousGames.some(
        (selectedGame) =>
          selectedGame.id === game.id
      );

      if (alreadySelected) {
        return previousGames.filter(
          (selectedGame) =>
            selectedGame.id !== game.id
        );
      }

      return [...previousGames, game];
    });
  };

  const isSelected = (gameId) => {
    return selectedGames.some(
      (game) => game.id === gameId
    );
  };

  const handleCreateContest = async () => {
    if (selectedGames.length === 0) {
      setContestMessage(
        "Select at least one game."
      );
      return;
    }

    setCreatingContest(true);
    setContestMessage("");

    try {
      const startTimes = selectedGames
        .map((game) => game.startsAt)
        .filter(Boolean)
        .map((time) => new Date(time))
        .filter(
          (date) =>
            !Number.isNaN(date.getTime())
        );

      const earliestGame =
        startTimes.length > 0
          ? new Date(
              Math.min(
                ...startTimes.map((date) =>
                  date.getTime()
                )
              )
            )
          : null;

      // Create contest row
      const {
        data: contest,
        error: contestError,
      } = await supabase
        .from("contests")
        .insert({
          sport: selectedSport,
          title: `${selectedSport} Daily Contest`,
          entry_fee_cents: entryFee * 100,
          status: "open",
          starts_at: earliestGame
            ? earliestGame.toISOString()
            : null,
          closes_at: earliestGame
            ? earliestGame.toISOString()
            : null,
        })
        .select()
        .single();

      if (contestError) {
        throw new Error(
          `Contest creation failed: ${contestError.message}`
        );
      }

      // Convert selected API games into database rows
      const gamesToInsert = selectedGames.map(
        (game) => ({
          contest_id: contest.id,

          provider_game_id:
            game.providerId != null
              ? String(game.providerId)
              : null,

          league: selectedSport,

          away_team: game.away,
          home_team: game.home,

          starts_at: game.startsAt || null,

          status: "scheduled",
        })
      );

      // Insert selected games
      const { error: gamesError } =
        await supabase
          .from("games")
          .insert(gamesToInsert);

      if (gamesError) {
        throw new Error(
          `Contest created, but games failed: ${gamesError.message}`
        );
      }

      setContestMessage(
        `${selectedSport} contest created successfully with ${selectedGames.length} games!`
      );

      setSelectedGames([]);
      setEntryFee(3);
    } catch (error) {
      console.error(
        "Create contest error:",
        error
      );

      setContestMessage(error.message);
    } finally {
      setCreatingContest(false);
    }
  };

  return (
    <div className="create-contest-page">
      <div className="sport-tabs">
        {sports.map((sport) => (
          <button
            key={sport}
            className={`sport-tab ${
              selectedSport === sport
                ? "active"
                : ""
            }`}
            onClick={() =>
              handleSportChange(sport)
            }
          >
            {sport}
          </button>
        ))}
      </div>

      <div className="contest-game-panel">
        <div className="game-scroll-area">
          {loadingGames && (
            <p className="game-loading">
              Loading {selectedSport} games...
            </p>
          )}

          {gameError && (
            <p className="game-error">
              {gameError}
            </p>
          )}

          {!loadingGames &&
            !gameError &&
            games.length === 0 && (
              <p className="no-games">
                No {selectedSport} games found
                for today or tomorrow.
              </p>
            )}

          {!loadingGames &&
            !gameError &&
            Object.entries(gamesByDate).map(
              ([date, dateGames]) => (
                <div
                  className="date-group"
                  key={date}
                >
                  <div className="date-heading">
                    {formatDateHeading(date)}
                  </div>

                  <div className="date-games">
                    {dateGames.map((game) => (
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
                          checked={isSelected(
                            game.id
                          )}
                          onChange={() =>
                            handleGameSelect(game)
                          }
                        />

                        <div className="game-info">
                          <div className="game-teams">
                            <span>
                              {game.away}
                            </span>

                            <span className="game-at">
                              @
                            </span>

                            <span>
                              {game.home}
                            </span>
                          </div>

                          <span className="game-time">
                            {formatGameTime(
                              game.startsAt
                            )}
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

        <div className="contest-create-section">
          <button
            className="create-contest-button"
            onClick={handleCreateContest}
            disabled={creatingContest}
          >
            {creatingContest
              ? "Creating..."
              : "Create Contest"}
          </button>

          {contestMessage && (
            <p className="contest-message">
              {contestMessage}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export default CreateContest;