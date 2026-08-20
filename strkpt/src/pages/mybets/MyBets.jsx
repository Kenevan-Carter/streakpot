import { useEffect, useState } from "react";
import Sidebar from "../../components/sidebar/Sidebar";
import { supabase } from "../../lib/supabase";
import "./MyBets.css";

function MyBets() {
  const [view, setView] = useState("active");

  const [activeBets, setActiveBets] = useState([]);
  const [pastBets, setPastBets] = useState([]);

  const [selectedPastContestId, setSelectedPastContestId] =
    useState("");

  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  const [currentTime, setCurrentTime] = useState(Date.now());

  // --------------------------------------------------
  // UPDATE COUNTDOWN EVERY SECOND
  // --------------------------------------------------

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(Date.now());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // --------------------------------------------------
  // LOAD BETS
  // --------------------------------------------------

  useEffect(() => {
    const loadBets = async () => {
      setLoading(true);
      setErrorMessage("");

      try {
        // GET LOGGED IN USER

        const {
          data: { user },
          error: userError,
        } = await supabase.auth.getUser();

        if (userError) {
          throw userError;
        }

        if (!user) {
          throw new Error("You must be logged in.");
        }

        // ------------------------------------------
        // GET USER PICKS + CONTEST
        // ------------------------------------------

        const { data: picksData, error: picksError } =
          await supabase
            .from("picks")
            .select(`
              id,
              contest_id,
              game_id,
              selected_team,
              is_correct,

              contest:contests (
                id,
                title,
                sport,
                entry_fee_cents,
                opens_at,
                closes_at
              )
            `)
            .eq("user_id", user.id);

        if (picksError) {
          throw picksError;
        }

        const picks = picksData || [];

        // NO PICKS AT ALL

        if (picks.length === 0) {
          setActiveBets([]);
          setPastBets([]);
          setLoading(false);
          return;
        }

        // ------------------------------------------
        // GET UNIQUE CONTEST IDS
        // ------------------------------------------

        const contestIds = [
          ...new Set(
            picks.map((pick) => pick.contest_id)
          ),
        ];

        // ------------------------------------------
        // GET EVERY GAME FROM THESE CONTESTS
        // ------------------------------------------

        const { data: gamesData, error: gamesError } =
          await supabase
            .from("games")
            .select("*")
            .in("contest_id", contestIds)
            .order("starts_at", {
              ascending: true,
            });

        if (gamesError) {
          throw gamesError;
        }

        const allGames = gamesData || [];

        // ------------------------------------------
        // BUILD CONTEST OBJECTS
        // ------------------------------------------

        const grouped = {};

        picks.forEach((pick) => {
          if (!pick.contest) {
            return;
          }

          const contestId = pick.contest.id;

          if (!grouped[contestId]) {
            grouped[contestId] = {
              ...pick.contest,
              picks: [],
              games: [],
            };
          }

          grouped[contestId].picks.push({
            id: pick.id,
            game_id: pick.game_id,
            selected_team: pick.selected_team,
            is_correct: pick.is_correct,
          });
        });

        // ADD EVERY GAME TO ITS CONTEST

        allGames.forEach((game) => {
          if (grouped[game.contest_id]) {
            grouped[game.contest_id].games.push(game);
          }
        });

        const userContests = Object.values(grouped);

        // ------------------------------------------
        // ACTIVE / PAST
        //
        // ACTIVE UNTIL 24 HOURS AFTER CLOSE
        // ------------------------------------------

        const now = Date.now();

        const active = [];
        const past = [];

        userContests.forEach((contest) => {
          if (!contest.closes_at) {
            active.push(contest);
            return;
          }

          const closesAt = new Date(
            contest.closes_at
          ).getTime();

          const activeUntil =
            closesAt +
            24 * 60 * 60 * 1000;

          if (now < activeUntil) {
            active.push(contest);
          } else {
            past.push(contest);
          }
        });

        // ACTIVE: CLOSEST FIRST

        active.sort((a, b) => {
          return (
            new Date(a.closes_at).getTime() -
            new Date(b.closes_at).getTime()
          );
        });

        // PAST: MOST RECENT FIRST

        past.sort((a, b) => {
          return (
            new Date(b.closes_at).getTime() -
            new Date(a.closes_at).getTime()
          );
        });

        setActiveBets(active);
        setPastBets(past);

        if (past.length > 0) {
          setSelectedPastContestId(
            String(past[0].id)
          );
        }
      } catch (error) {
        console.error(
          "My Bets loading error:",
          error
        );

        setErrorMessage(error.message);
      } finally {
        setLoading(false);
      }
    };

    loadBets();
  }, []);

  // --------------------------------------------------
  // FORMAT GAME TIME
  // --------------------------------------------------

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

  // --------------------------------------------------
  // FORMAT DATE
  // --------------------------------------------------

  const formatDate = (date) => {
    if (!date) {
      return "TBD";
    }

    return new Date(date).toLocaleDateString(
      "en-US",
      {
        month: "short",
        day: "numeric",
        year: "numeric",
      }
    );
  };

  // --------------------------------------------------
  // COUNTDOWN
  // --------------------------------------------------

  const getCountdown = (closesAt) => {
    if (!closesAt) {
      return "TBD";
    }

    const closeTime = new Date(
      closesAt
    ).getTime();

    const difference =
      closeTime - currentTime;

    if (difference <= 0) {
      return "Contest ended";
    }

    const days = Math.floor(
      difference /
        (1000 * 60 * 60 * 24)
    );

    const hours = Math.floor(
      (difference %
        (1000 * 60 * 60 * 24)) /
        (1000 * 60 * 60)
    );

    const minutes = Math.floor(
      (difference %
        (1000 * 60 * 60)) /
        (1000 * 60)
    );

    const seconds = Math.floor(
      (difference %
        (1000 * 60)) /
        1000
    );

    if (days > 0) {
      return `${days}d ${hours}h ${minutes}m`;
    }

    return `${hours}h ${minutes}m ${seconds}s`;
  };

  // --------------------------------------------------
  // FIND PICK FOR GAME
  // --------------------------------------------------

  const getPickForGame = (
    contest,
    gameId
  ) => {
    return contest.picks.find(
      (pick) =>
        pick.game_id === gameId
    );
  };

  // --------------------------------------------------
  // PAST CONTEST
  // --------------------------------------------------

  const selectedPastContest =
    pastBets.find(
      (contest) =>
        String(contest.id) ===
        selectedPastContestId
    );

  // --------------------------------------------------
  // CONTEST DISPLAY
  // --------------------------------------------------

  const renderContest = (
    contest,
    isPast = false
  ) => {
    return (
      <div
        className="mybets-contest"
        key={contest.id}
      >
        {/* CONTEST HEADER */}

        <div className="mybets-contest-header">

          <div className="contest-title-area">

            <span className="contest-sport">
              {contest.sport}
            </span>
            <h2>
              {contest.title}
            </h2>
            <p>
              {formatDate(
                contest.closes_at
              )}
            </p>

          </div>

          <div className="contest-header-stats">

            <div className="contest-header-stat">
              <span>
                SPORT
              </span>

              <strong>
                {contest.sport}
              </strong>
            </div>

            <div className="contest-stat-divider" />

            <div className="contest-header-stat">
              <span>
                ENTRY FEE
              </span>

              <strong>
                $
                {(
                  contest.entry_fee_cents /
                  100
                ).toFixed(0)}
              </strong>
            </div>

            <div className="contest-stat-divider" />

            <div className="contest-header-stat">
              <span>
                CORRECT PICKS
              </span>

              <strong>
                {contest.picks.length}
                {" / "}
                {contest.games.length}
              </strong>
            </div>

            <div className="contest-stat-divider" />

            <div className="contest-header-stat">
              <span>
                {isPast
                  ? "STATUS"
                  : "CONTEST CLOSES IN"}
              </span>

              <strong
                className={
                  isPast
                    ? ""
                    : "pink-value"
                }
              >
                {isPast
                  ? "FINISHED"
                  : getCountdown(
                      contest.closes_at
                    )}
              </strong>
            </div>

          </div>

        </div>

        {/* GAME LIST */}

        <div className="mybets-game-list">

          {contest.games.map((game) => {
            const pick =
              getPickForGame(
                contest,
                game.id
              );

            const selectedTeam =
              pick?.selected_team;

            return (
              <div
                className="mybets-game-row"
                key={game.id}
              >

                {/* GAME TIME */}

                <div className="mybets-game-meta">

                  <span>
                    {game.league ||
                      contest.sport}
                  </span>

                  <p>
                    {formatGameTime(
                      game.starts_at
                    )}
                  </p>

                </div>

                {/* TEAMS */}

                <div className="mybets-game-teams">

                  <button
                    className={`locked-team-button ${
                      selectedTeam ===
                      game.away_team
                        ? "picked"
                        : ""
                    }`}
                    disabled
                  >
                    {game.away_team}
                  </button>

                  <span className="mybets-vs">
                    VS
                  </span>

                  <button
                    className={`locked-team-button ${
                      selectedTeam ===
                      game.home_team
                        ? "picked"
                        : ""
                    }`}
                    disabled
                  >
                    {game.home_team}
                  </button>

                </div>

                {/* LOCK */}

                <div className="mybets-locked">

                  <span className="lock-icon">
                    ◉
                  </span>

                  {selectedTeam
                    ? "Locked Pick"
                    : "No Pick"}

                </div>

              </div>
            );
          })}

        </div>

      </div>
    );
  };

  // --------------------------------------------------
  // PAGE
  // --------------------------------------------------

  return (
    <div className="mybets-page">

      <Sidebar />

      <main className="mybets-main">

        {/* PAGE HEADER */}

        <div className="mybets-page-header">

          <span>
            YOUR BETS
          </span>

          <h1>
            My Bets
          </h1>

          <p>
            Track your active contests and
            previous picks.
          </p>

        </div>

        {/* TABS */}

        <div className="mybets-tabs">

          <button
            className={
              view === "active"
                ? "active"
                : ""
            }
            onClick={() =>
              setView("active")
            }
          >
            ACTIVE BETS
          </button>

          <button
            className={
              view === "past"
                ? "active"
                : ""
            }
            onClick={() =>
              setView("past")
            }
          >
            PAST BETS
          </button>

        </div>

        {/* LOADING */}

        {loading && (
          <div className="mybets-empty">
            Loading your bets...
          </div>
        )}

        {/* ERROR */}

        {!loading &&
          errorMessage && (
            <div className="mybets-empty error">
              {errorMessage}
            </div>
          )}

        {/* ACTIVE */}

        {!loading &&
          !errorMessage &&
          view === "active" && (
            <div className="mybets-contests">

              {activeBets.length === 0 ? (
                <div className="mybets-empty">

                  <div className="empty-icon">
                    ◉
                  </div>

                  <h2>
                    No current active bets
                  </h2>

                  <p>
                    Once you confirm your picks,
                    your active contests will
                    appear here.
                  </p>

                </div>
              ) : (
                activeBets.map(
                  (contest) =>
                    renderContest(
                      contest
                    )
                )
              )}

            </div>
          )}

        {/* PAST */}

        {!loading &&
          !errorMessage &&
          view === "past" && (
            <div className="mybets-past">

              {pastBets.length === 0 ? (
                <div className="mybets-empty">

                  <h2>
                    No past bets
                  </h2>

                  <p>
                    Completed contests will
                    appear here.
                  </p>

                </div>
              ) : (
                <>
                  {/* DROPDOWN */}

                  <div className="past-bet-selector">

                    <label>
                      PAST CONTEST
                    </label>

                    <select
                      value={
                        selectedPastContestId
                      }
                      onChange={(event) =>
                        setSelectedPastContestId(
                          event.target.value
                        )
                      }
                    >

                      {pastBets.map(
                        (contest) => (
                          <option
                            key={
                              contest.id
                            }
                            value={
                              contest.id
                            }
                          >
                            {
                              contest.title
                            }
                            {" — "}
                            {formatDate(
                              contest.closes_at
                            )}
                          </option>
                        )
                      )}

                    </select>

                  </div>

                  {selectedPastContest &&
                    renderContest(
                      selectedPastContest,
                      true
                    )}

                </>
              )}

            </div>
          )}

      </main>
    </div>
  );
}

export default MyBets;