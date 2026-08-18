import { useEffect, useMemo, useState } from "react";
import { getGamesForDates } from "../../../services/sportsApi";
import { supabase } from "../../../lib/supabase";
import "./CreateContest.css";

function CreateContest() {
  const [selectedSport, setSelectedSport] = useState("NBA");
  const [selectedGames, setSelectedGames] = useState([]);

  const [entryFee, setEntryFee] = useState(3);

  const [closeDay, setCloseDay] = useState("");
  const [closeHour, setCloseHour] = useState("12");
  const [closeMinute, setCloseMinute] = useState("00");
  const [closePeriod, setClosePeriod] = useState("PM");

  const [games, setGames] = useState([]);
  const [loadingGames, setLoadingGames] = useState(false);
  const [gameError, setGameError] = useState("");

  const [creatingContest, setCreatingContest] = useState(false);
  const [contestMessage, setContestMessage] = useState("");

  const sports = ["NBA", "NFL", "MLB", "NHL", "EPL"];

  // -----------------------------------------
  // FORMAT DATE FOR BALLDONTLIE API
  // -----------------------------------------

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

  // -----------------------------------------
  // GET DATES TO LOAD GAMES FOR
  // -----------------------------------------

  const getContestDates = () => {
    const dates = [];
  
    const today = new Date();
  
    for (let i = 0; i < 7; i++) {
      const date = new Date(today);
  
      date.setDate(today.getDate() + i);
  
      dates.push(
        formatDateForAPI(date)
      );
    }
  
    return dates;
  };

  // -----------------------------------------
  // FORMAT DATE HEADING
  // -----------------------------------------

  const formatDateHeading = (dateString) => {
    const date = new Date(
      `${dateString}T12:00:00`
    );

    return date
      .toLocaleDateString("en-US", {
        weekday: "short",
        month: "long",
        day: "numeric",
      })
      .replace(",", "");
  };

  // -----------------------------------------
  // FORMAT GAME TIME
  // -----------------------------------------

  const formatGameTime = (startsAt) => {
    if (!startsAt) {
      return "TBD";
    }

    return new Date(
      startsAt
    ).toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
    });
  };

  // -----------------------------------------
  // LOAD SPORTS API GAMES
  // -----------------------------------------

  useEffect(() => {
    const loadGames = async () => {
      setLoadingGames(true);
      setGameError("");
      setContestMessage("");
      setSelectedGames([]);

      try {
        const dates = getContestDates();

        const gameData =
          await getGamesForDates(
            selectedSport,
            dates
          );

        setGames(gameData);
      } catch (error) {
        console.error(
          "Game API error:",
          error
        );

        setGameError(error.message);
        setGames([]);
      } finally {
        setLoadingGames(false);
      }
    };

    loadGames();
  }, [selectedSport]);

  // -----------------------------------------
  // GROUP GAMES BY DATE
  // -----------------------------------------

  const gamesByDate = useMemo(() => {
    return games.reduce(
      (groups, game) => {
        if (!groups[game.date]) {
          groups[game.date] = [];
        }

        groups[game.date].push(game);

        return groups;
      },
      {}
    );
  }, [games]);

  // -----------------------------------------
  // CHANGE SPORT
  // -----------------------------------------

  const handleSportChange = (sport) => {
    setSelectedSport(sport);
    setCloseDay("");
  };

  // -----------------------------------------
  // SELECT / DESELECT GAME
  // -----------------------------------------

  const handleGameSelect = (game) => {
    setSelectedGames(
      (previousGames) => {
        const alreadySelected =
          previousGames.some(
            (selectedGame) =>
              selectedGame.id === game.id
          );

        if (alreadySelected) {
          return previousGames.filter(
            (selectedGame) =>
              selectedGame.id !== game.id
          );
        }

        return [
          ...previousGames,
          game,
        ];
      }
    );
  };

  const isSelected = (gameId) => {
    return selectedGames.some(
      (game) => game.id === gameId
    );
  };

  // -----------------------------------------
  // CREATE CONTEST
  // -----------------------------------------

  const handleCreateContest =
    async () => {
      if (selectedGames.length === 0) {
        setContestMessage(
          "Select at least one game."
        );

        return;
      }

      if (
        !entryFee ||
        Number(entryFee) <= 0
      ) {
        setContestMessage(
          "Enter a valid entry fee."
        );

        return;
      }

      if (!closeDay) {
        setContestMessage(
          "Select a closing day."
        );

        return;
      }

      setCreatingContest(true);
      setContestMessage("");

      try {
        // -----------------------------------
        // CONVERT 12-HOUR TIME TO 24-HOUR
        // -----------------------------------

        let hour =
          Number(closeHour);

        if (
          closePeriod === "AM" &&
          hour === 12
        ) {
          hour = 0;
        }

        if (
          closePeriod === "PM" &&
          hour !== 12
        ) {
          hour += 12;
        }

        // -----------------------------------
        // BUILD CLOSING DATE
        // -----------------------------------

        const [
          year,
          month,
          day,
        ] = closeDay
          .split("-")
          .map(Number);

        const closesAt = new Date(
          year,
          month - 1,
          day,
          hour,
          Number(closeMinute),
          0
        );

        if (
          Number.isNaN(
            closesAt.getTime()
          )
        ) {
          throw new Error(
            "Invalid contest closing time."
          );
        }

        // -----------------------------------
        // CONTEST OPENS EXACTLY 3 DAYS EARLIER
        // -----------------------------------

        const opensAt = new Date(
          closesAt.getTime() -
            3 *
              24 *
              60 *
              60 *
              1000
        );

        console.log(
          "Contest opens:",
          opensAt
        );

        console.log(
          "Contest closes:",
          closesAt
        );

        // -----------------------------------
        // CREATE CONTEST
        // -----------------------------------

        const {
          data: contest,
          error: contestError,
        } = await supabase
          .from("contests")
          .insert({
            sport: selectedSport,

            title:
              `${selectedSport} Daily Contest`,

            entry_fee_cents:
              Number(entryFee) * 100,

            opens_at:
              opensAt.toISOString(),

            closes_at:
              closesAt.toISOString(),
          })
          .select()
          .single();

        if (contestError) {
          throw new Error(
            `Contest creation failed: ${contestError.message}`
          );
        }

        // -----------------------------------
        // PREPARE GAMES FOR DATABASE
        // -----------------------------------

        const gamesToInsert =
          selectedGames.map(
            (game) => ({
              contest_id:
                contest.id,

              provider_game_id:
                game.providerId != null
                  ? String(
                      game.providerId
                    )
                  : null,

              league:
                selectedSport,

              away_team:
                game.away,

              home_team:
                game.home,

              starts_at:
                game.startsAt ||
                null,

              status:
                "scheduled",
            })
          );

        // -----------------------------------
        // INSERT GAMES
        // -----------------------------------

        const {
          error: gamesError,
        } = await supabase
          .from("games")
          .insert(
            gamesToInsert
          );

        if (gamesError) {
          throw new Error(
            `Contest created, but games failed: ${gamesError.message}`
          );
        }

        // -----------------------------------
        // SUCCESS
        // -----------------------------------

        setContestMessage(
          `${selectedSport} contest created successfully with ${selectedGames.length} games!`
        );

        setSelectedGames([]);

        setEntryFee(3);

        setCloseHour("12");
        setCloseMinute("00");
        setClosePeriod("PM");
      } catch (error) {
        console.error(
          "Create contest error:",
          error
        );

        setContestMessage(
          error.message
        );
      } finally {
        setCreatingContest(false);
      }
    };

  // -----------------------------------------
  // JSX
  // -----------------------------------------

  return (
    <div className="create-contest-page">

      {/* SPORT TABS */}

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
              handleSportChange(
                sport
              )
            }
          >
            {sport}
          </button>
        ))}
      </div>

      {/* GAME LIST */}

      <div className="contest-game-panel">
        <div className="game-scroll-area">

          {loadingGames && (
            <p className="game-loading">
              Loading{" "}
              {selectedSport}{" "}
              games...
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
                No{" "}
                {selectedSport}{" "}
                games found for
                the next week
              </p>
            )}

          {!loadingGames &&
            !gameError &&
            Object.entries(
              gamesByDate
            ).map(
              ([
                date,
                dateGames,
              ]) => (
                <div
                  className="date-group"
                  key={date}
                >

                  <div className="date-heading">
                    {formatDateHeading(
                      date
                    )}
                  </div>

                  <div className="date-games">

                    {dateGames.map(
                      (game) => (
                        <label
                          key={
                            game.id
                          }
                          className={`game-row ${
                            isSelected(
                              game.id
                            )
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
                              handleGameSelect(
                                game
                              )
                            }
                          />

                          <div className="game-info">

                            <div className="game-teams">

                              <span>
                                {
                                  game.away
                                }
                              </span>

                              <span className="game-at">
                                @
                              </span>

                              <span>
                                {
                                  game.home
                                }
                              </span>

                            </div>

                            <span className="game-time">
                              {formatGameTime(
                                game.startsAt
                              )}
                            </span>

                          </div>

                        </label>
                      )
                    )}

                  </div>

                </div>
              )
            )}

        </div>
      </div>

      {/* CONTEST SETTINGS */}

      <div className="contest-footer">

        {/* GAMES SELECTED */}

        <div className="footer-stat">
          <span className="footer-label">
            GAMES SELECTED
          </span>

          <span className="footer-value">
            {selectedGames.length}
          </span>
        </div>

        {/* ENTRY FEE */}

        <div className="footer-entry">

          <label
            className="footer-label"
            htmlFor="entry-fee"
          >
            ENTRY FEE
          </label>

          <div className="entry-fee-input-wrapper">

            <span>$</span>

            <input
              id="entry-fee"
              type="number"
              min="1"
              step="1"
              value={entryFee}
              onChange={(
                event
              ) =>
                setEntryFee(
                  event.target
                    .value
                )
              }
            />

          </div>

        </div>

        {/* CLOSE DAY */}

        <div className="footer-entry">
        <label
          className="footer-label"
          htmlFor="close-day"
        >
          CLOSE DAY
        </label>

        <input
          id="close-day"
          type="date"
          value={closeDay}
          onChange={(event) =>
            setCloseDay(
              event.target.value
            )
          }
        />
        </div>

        {/* CLOSE TIME */}

        <div className="footer-entry">

          <label className="footer-label">
            CLOSE TIME
          </label>

          <div className="contest-time-selectors">

            {/* HOUR */}

            <select
              value={closeHour}
              onChange={(
                event
              ) =>
                setCloseHour(
                  event.target
                    .value
                )
              }
            >
              {Array.from(
                { length: 12 },
                (_, index) =>
                  index + 1
              ).map(
                (hour) => (
                  <option
                    key={hour}
                    value={String(
                      hour
                    )}
                  >
                    {hour}
                  </option>
                )
              )}
            </select>

            <span className="time-colon">
              :
            </span>

            {/* MINUTE */}

            <select
              value={closeMinute}
              onChange={(
                event
              ) =>
                setCloseMinute(
                  event.target
                    .value
                )
              }
            >
              <option value="00">
                00
              </option>

              <option value="05">
                05
              </option>

              <option value="10">
                10
              </option>

              <option value="15">
                15
              </option>

              <option value="20">
                20
              </option>

              <option value="25">
                25
              </option>

              <option value="30">
                30
              </option>

              <option value="35">
                35
              </option>

              <option value="40">
                40
              </option>

              <option value="45">
                45
              </option>

              <option value="50">
                50
              </option>

              <option value="55">
                55
              </option>
            </select>

            {/* AM / PM */}

            <select
              value={closePeriod}
              onChange={(
                event
              ) =>
                setClosePeriod(
                  event.target
                    .value
                )
              }
            >
              <option value="AM">
                AM
              </option>

              <option value="PM">
                PM
              </option>
            </select>

          </div>

        </div>

        {/* CREATE BUTTON */}

        <div className="contest-create-section">

          <button
            className="create-contest-button"
            onClick={
              handleCreateContest
            }
            disabled={
              creatingContest
            }
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