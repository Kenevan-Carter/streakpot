import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import Sidebar from "../../components/sidebar/Sidebar";
import { supabase } from "../../lib/supabase";

import "./Sports.css";

function Sport() {
  const { sport } = useParams();

  // URL example:
  // /sports/nba
  //
  // sport = "nba"
  // selectedSport = "NBA"

  const selectedSport = sport?.toUpperCase();

  const [contests, setContests] = useState([]);
  const [selectedContestId, setSelectedContestId] =
    useState(null);

  const [games, setGames] = useState([]);
  const [selections, setSelections] = useState({});

  // Stores percentages for each game
  //
  // Example:
  // {
  //   gameId: {
  //     away: 63,
  //     home: 37,
  //     total: 100
  //   }
  // }
  const [pickPercentages, setPickPercentages] =
    useState({});

  const [currentEntries, setCurrentEntries] =
    useState(0);

  const [loadingContests, setLoadingContests] =
    useState(true);

  const [loadingGames, setLoadingGames] =
    useState(false);

  const [errorMessage, setErrorMessage] =
    useState("");

  const [timeRemaining, setTimeRemaining] =
    useState("");

  const allGamesPicked =
    games.length > 0 &&
    games.every(
      (game) => selections[game.id]
    );

  // --------------------------------------------------
  // SPORT DISPLAY NAME
  // --------------------------------------------------

  const getSportDisplayName = () => {
    switch (selectedSport) {
      case "NBA":
        return "BASKETBALL";

      case "NFL":
        return "FOOTBALL";

      case "MLB":
        return "BASEBALL";

      case "NHL":
        return "HOCKEY";

      case "EPL":
        return "SOCCER";

      default:
        return selectedSport;
    }
  };

  // --------------------------------------------------
  // LOAD CONTESTS FOR CURRENT SPORT
  // --------------------------------------------------

  useEffect(() => {
    if (!selectedSport) {
      return;
    }

    const loadContests = async () => {
      setLoadingContests(true);
      setErrorMessage("");
      setContests([]);
      setGames([]);
      setSelectedContestId(null);

      const { data, error } =
        await supabase
          .from("contests")
          .select("*")
          .eq("sport", selectedSport)
          .order("closes_at", {
            ascending: true,
          });

      if (error) {
        console.error(
          "Contest loading error:",
          error.message
        );

        setErrorMessage(error.message);
        setLoadingContests(false);
        return;
      }

      const contestData = data || [];

      setContests(contestData);

      // Automatically choose first contest
      if (contestData.length > 0) {
        setSelectedContestId(
          contestData[0].id
        );
      }

      setLoadingContests(false);
    };

    loadContests();
  }, [selectedSport]);

  // --------------------------------------------------
  // CURRENT CONTEST
  // --------------------------------------------------

  const selectedContest =
    contests.find(
      (contest) =>
        contest.id === selectedContestId
    );

  // --------------------------------------------------
  // LOAD GAMES
  // --------------------------------------------------

  useEffect(() => {
    if (!selectedContestId) {
      setGames([]);
      setSelections({});
      setPickPercentages({});
      return;
    }

    const loadGames = async () => {
      setLoadingGames(true);
      setSelections({});
      setPickPercentages({});

      const { data, error } =
        await supabase
          .from("games")
          .select("*")
          .eq(
            "contest_id",
            selectedContestId
          )
          .order("starts_at", {
            ascending: true,
          });

      if (error) {
        console.error(
          "Game loading error:",
          error.message
        );

        setErrorMessage(error.message);
        setLoadingGames(false);
        return;
      }

      setGames(data || []);
      setLoadingGames(false);
    };

    loadGames();
  }, [selectedContestId]);

  // --------------------------------------------------
  // LOAD COMMUNITY PICK PERCENTAGES
  // --------------------------------------------------

  useEffect(() => {
    if (games.length === 0) {
      setPickPercentages({});
      return;
    }

    const loadPickPercentages = async () => {
      const gameIds = games.map(
        (game) => game.id
      );

      const { data, error } =
        await supabase
          .from("picks")
          .select(
            "game_id, selected_team"
          )
          .in("game_id", gameIds);

      if (error) {
        console.error(
          "Pick percentage error:",
          error.message
        );

        return;
      }

      const percentages = {};

      games.forEach((game) => {
        const gamePicks =
          (data || []).filter(
            (pick) =>
              pick.game_id === game.id
          );

        const totalPicks =
          gamePicks.length;

        const awayVotes =
          gamePicks.filter(
            (pick) =>
              pick.selected_team ===
              game.away_team
          ).length;

        const homeVotes =
          gamePicks.filter(
            (pick) =>
              pick.selected_team ===
              game.home_team
          ).length;

        const awayPercentage =
          totalPicks > 0
            ? Math.round(
                (awayVotes /
                  totalPicks) *
                  100
              )
            : 0;

        const homePercentage =
          totalPicks > 0
            ? 100 - awayPercentage
            : 0;

        percentages[game.id] = {
          away: awayPercentage,
          home: homePercentage,
          total: totalPicks,
        };
      });

      setPickPercentages(
        percentages
      );
    };

    loadPickPercentages();
  }, [games]);

  // --------------------------------------------------
  // LOAD ENTRY COUNT
  // --------------------------------------------------

  useEffect(() => {
    if (!selectedContestId) {
      setCurrentEntries(0);
      return;
    }

    const loadEntries = async () => {
      const { count, error } =
        await supabase
          .from("contest_entries")
          .select("*", {
            count: "exact",
            head: true,
          })
          .eq(
            "contest_id",
            selectedContestId
          );

      if (error) {
        console.error(
          "Entry count error:",
          error.message
        );

        setCurrentEntries(0);
        return;
      }

      setCurrentEntries(count || 0);
    };

    loadEntries();
  }, [selectedContestId]);

  // --------------------------------------------------
  // COUNTDOWN
  // --------------------------------------------------

  useEffect(() => {
    if (!selectedContest?.closes_at) {
      setTimeRemaining("");
      return;
    }

    const updateCountdown = () => {
      const now =
        new Date().getTime();

      const closeTime =
        new Date(
          selectedContest.closes_at
        ).getTime();

      const difference =
        closeTime - now;

      if (difference <= 0) {
        setTimeRemaining(
          "Contest Closed"
        );
        return;
      }

      const days = Math.floor(
        difference /
          (1000 * 60 * 60 * 24)
      );

      const hours = Math.floor(
        (difference /
          (1000 * 60 * 60)) %
          24
      );

      const minutes = Math.floor(
        (difference /
          (1000 * 60)) %
          60
      );

      const seconds = Math.floor(
        (difference / 1000) % 60
      );

      let countdown = "Closes in ";

      if (days > 0) {
        countdown += `${days}d `;
      }

      if (
        hours > 0 ||
        days > 0
      ) {
        countdown += `${hours}h `;
      }

      countdown +=
        `${minutes}m ${seconds}s`;

      setTimeRemaining(countdown);
    };

    updateCountdown();

    const interval =
      setInterval(
        updateCountdown,
        1000
      );

    return () =>
      clearInterval(interval);

  }, [selectedContest?.closes_at]);

  // --------------------------------------------------
  // SELECT TEAM
  // --------------------------------------------------

  const handlePick = (
    gameId,
    team
  ) => {
    setSelections(
      (previousSelections) => ({
        ...previousSelections,
        [gameId]: team,
      })
    );
  };

  // --------------------------------------------------
  // FORMAT GAME TIME
  // --------------------------------------------------

  const formatGameTime = (
    startsAt
  ) => {
    if (!startsAt) {
      return "TBD";
    }

    return new Date(
      startsAt
    ).toLocaleTimeString(
      "en-US",
      {
        day: "numeric",
        hour: "numeric",
        minute: "2-digit",
      }
    );
  };

  // --------------------------------------------------
  // CHECK IF CONTEST CLOSED
  // --------------------------------------------------

  const isContestClosed = (
    contest
  ) => {
    if (!contest) {
      return true;
    }

    if (
      contest.status !== "open"
    ) {
      return true;
    }

    if (!contest.closes_at) {
      return false;
    }

    const now = new Date();

    const closeTime =
      new Date(
        contest.closes_at
      );

    return (
      now.getTime() >=
      closeTime.getTime()
    );
  };

  // --------------------------------------------------
  // CONFIRM PICKS
  // --------------------------------------------------

  const handleConfirmPicks =
    async () => {

      if (!selectedContest) {
        return;
      }

      if (!allGamesPicked) {
        alert(
          "Please make a pick for every game."
        );
        return;
      }

      try {
        const {
          data: { user },
        } =
          await supabase.auth.getUser();

        if (!user) {
          alert(
            "You must be logged in."
          );
          return;
        }

        const picksToSave =
          games.map((game) => ({
            user_id: user.id,

            contest_id:
              selectedContest.id,

            game_id:
              game.id,

            selected_team:
              selections[game.id],
          }));

        const { error } =
          await supabase
            .from("picks")
            .upsert(
              picksToSave,
              {
                onConflict:
                  "user_id,game_id",
              }
            );

        if (error) {
          throw error;
        }

        alert(
          "Picks confirmed!"
        );

        // Reload percentages after
        // this user submits their picks
        const gameIds =
          games.map(
            (game) => game.id
          );

        const {
          data: updatedPicks,
          error: percentageError,
        } =
          await supabase
            .from("picks")
            .select(
              "game_id, selected_team"
            )
            .in(
              "game_id",
              gameIds
            );

        if (!percentageError) {
          const updatedPercentages =
            {};

          games.forEach(
            (game) => {
              const gamePicks =
                (
                  updatedPicks || []
                ).filter(
                  (pick) =>
                    pick.game_id ===
                    game.id
                );

              const total =
                gamePicks.length;

              const away =
                gamePicks.filter(
                  (pick) =>
                    pick.selected_team ===
                    game.away_team
                ).length;

              const awayPercent =
                total > 0
                  ? Math.round(
                      (away /
                        total) *
                        100
                    )
                  : 0;

              updatedPercentages[
                game.id
              ] = {
                away:
                  awayPercent,

                home:
                  total > 0
                    ? 100 -
                      awayPercent
                    : 0,

                total,
              };
            }
          );

          setPickPercentages(
            updatedPercentages
          );
        }

      } catch (error) {
        console.error(
          "Confirm picks error:",
          error
        );

        alert(
          `Could not confirm picks: ${error.message}`
        );
      }
    };

  // --------------------------------------------------
  // LOADING
  // --------------------------------------------------

  if (loadingContests) {
    return (
      <div className="sport-page">
        <Sidebar />

        <main className="sport-main">
          <p>
            Loading {selectedSport}{" "}
            contests...
          </p>
        </main>
      </div>
    );
  }

  // --------------------------------------------------
  // ERROR
  // --------------------------------------------------

  if (
    errorMessage &&
    contests.length === 0
  ) {
    return (
      <div className="sport-page">
        <Sidebar />

        <main className="sport-main">
          <p>{errorMessage}</p>
        </main>
      </div>
    );
  }

  // --------------------------------------------------
  // NO CONTESTS
  // --------------------------------------------------

  if (
    contests.length === 0
  ) {
    return (
      <div className="sport-page">
        <Sidebar />

        <main className="sport-main">
          <p>
            No {selectedSport} contests
            are currently available.
          </p>
        </main>
      </div>
    );
  }

  // --------------------------------------------------
  // CONTEST VALUES
  // --------------------------------------------------

  const entryFee =
    selectedContest
      ? selectedContest
          .entry_fee_cents / 100
      : 0;

  const currentPot =
    currentEntries *
    entryFee;

  const contestClosed =
    isContestClosed(
      selectedContest
    );

  // --------------------------------------------------
  // JSX
  // --------------------------------------------------

  return (
    <div className="sport-page">

      <Sidebar />

      <main className="sport-main">

        {/* CONTEST SELECTOR */}

        <div className="sport-contest-selector">

          <div className="sport-contest-selector-label">
            {selectedSport} CONTESTS
          </div>

          <div className="sport-contest-buttons">

            {contests.map(
              (contest) => {

                const closed =
                  isContestClosed(
                    contest
                  );

                return (
                  <button
                    key={
                      contest.id
                    }
                    className={`sport-contest-button ${
                      selectedContestId ===
                      contest.id
                        ? "active"
                        : ""
                    }`}
                    onClick={() =>
                      setSelectedContestId(
                        contest.id
                      )
                    }
                  >

                    <span className="sport-contest-button-title">
                      {contest.title}
                    </span>

                    <span className="sport-contest-button-info">
                      $
                      {(
                        contest.entry_fee_cents /
                        100
                      ).toFixed(0)}
                    </span>

                    {closed && (
                      <span className="sport-contest-closed">
                        CLOSED
                      </span>
                    )}

                  </button>
                );
              }
            )}

          </div>
        </div>

        {/* HEADER */}

        <div className="sport-page-header">

          <div className="sport-header-left">

            <p className="sport-small-title">
              {getSportDisplayName()}
            </p>

            <h1>
              {selectedContest?.title ||
                `${selectedSport} Contest`}
            </h1>

            <p className="sport-header-description">
              Pick one winner from each matchup.
            </p>

            <p
              className={`sport-contest-close-time ${
                contestClosed
                  ? "closed"
                  : ""
              }`}
            >
              {timeRemaining}
            </p>

          </div>

          <div className="sport-contest-info">

            <div className="sport-contest-stat">

              <span className="contest-stat-label">
                Entry
              </span>

              <span className="contest-stat-value">
                ${entryFee}
              </span>

            </div>

            <div className="sport-header-divider" />

            <div className="sport-contest-stat">

              <span className="contest-stat-label">
                Current Entries
              </span>

              <span className="contest-stat-value">
                {currentEntries.toLocaleString()}
              </span>

            </div>

            <div className="sport-header-divider" />

            <div className="sport-contest-stat">

              <span className="contest-stat-label">
                Current Pot
              </span>

              <span className="contest-stat-value pot-highlight">
                $
                {currentPot.toLocaleString()}
              </span>

            </div>

          </div>
        </div>

        {/* GAMES */}

        <div className="sport-games-list">

          {loadingGames && (
            <p className="sport-loading">
              Loading games...
            </p>
          )}

          {!loadingGames &&
            games.length === 0 && (
              <p className="sport-no-games">
                No games were added to
                this contest.
              </p>
            )}

          {!loadingGames &&
            games.map((game) => {

              const selectedTeam =
                selections[game.id];

              const percentages =
                pickPercentages[
                  game.id
                ] || {
                  away: 0,
                  home: 0,
                  total: 0,
                };

              return (
                <div
                  className="sport-game-row"
                  key={game.id}
                >

                  {/* GAME INFO */}

                  <div className="sport-game-info">

                    <span className="league-label">
                      {selectedSport}
                    </span>

                    <span className="sport-game-time">
                      {formatGameTime(
                        game.starts_at
                      )}
                    </span>

                    <span className="community-picks-label">
                      {percentages.total}{" "}
                      picks
                    </span>

                  </div>

                  {/* PICKS */}

                  <div className="sport-game-picks">

                    {/* AWAY TEAM */}

                    <button
                      className={`sport-pick-button ${
                        selectedTeam ===
                        game.away_team
                          ? "selected"
                          : ""
                      }`}
                      disabled={
                        contestClosed
                      }
                      onClick={() =>
                        handlePick(
                          game.id,
                          game.away_team
                        )
                      }
                    >

                      <span className="sport-team-name">
                        {
                          game.away_team
                        }
                      </span>

                      <span className="pick-percentage">
                        {
                          percentages.away
                        }
                        %
                      </span>

                      <div className="percentage-bar">
                        <div
                          className="percentage-bar-fill"
                          style={{
                            width:
                              `${percentages.away}%`,
                          }}
                        />
                      </div>

                    </button>

                    <div className="sport-vs">
                      VS
                    </div>

                    {/* HOME TEAM */}

                    <button
                      className={`sport-pick-button ${
                        selectedTeam ===
                        game.home_team
                          ? "selected"
                          : ""
                      }`}
                      disabled={
                        contestClosed
                      }
                      onClick={() =>
                        handlePick(
                          game.id,
                          game.home_team
                        )
                      }
                    >

                      <span className="sport-team-name">
                        {
                          game.home_team
                        }
                      </span>

                      <span className="pick-percentage">
                        {
                          percentages.home
                        }
                        %
                      </span>

                      <div className="percentage-bar">
                        <div
                          className="percentage-bar-fill"
                          style={{
                            width:
                              `${percentages.home}%`,
                          }}
                        />
                      </div>

                    </button>

                  </div>

                  {/* USER PICK */}

                  <div className="sport-selection-status">

                    {selectedTeam ? (
                      <>
                        Pick{" "}
                        <span>
                          {selectedTeam}
                        </span>
                      </>
                    ) : contestClosed ? (
                      "Closed"
                    ) : (
                      "No pick"
                    )}

                  </div>

                </div>
              );
            })}

        </div>

        {/* CONFIRM */}

        <div className="sport-confirm-section">

          <div className="sport-pick-progress">
            {
              Object.keys(
                selections
              ).length
            }{" "}
            / {games.length} picks made
          </div>

          <button
            className="sport-confirm-button"
            onClick={
              handleConfirmPicks
            }
            disabled={
              !allGamesPicked ||
              contestClosed
            }
          >
            {contestClosed
              ? "Contest Closed"
              : "Confirm Picks"}
          </button>

        </div>

      </main>

    </div>
  );
}

export default Sport;