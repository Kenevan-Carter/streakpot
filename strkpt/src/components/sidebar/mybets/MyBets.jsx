import { useEffect, useState } from "react";

import Sidebar from "../Sidebar";

import {
  loadMyBets,
  formatMyBetGameTime,
  formatMyBetDate,
  getMyBetCountdown,
  getPickForGame,
  getSelectedPastContest,
  countCorrectPicks,
} from "../../../utils/myBets";

import "./MyBets.css";
  
  function MyBets() {
    // --------------------------------------------------
    // STATE
    // --------------------------------------------------
  
    const [
      view,
      setView,
    ] =
      useState(
        "active"
      );
  
    const [
      activeBets,
      setActiveBets,
    ] =
      useState([]);
  
    const [
      pastBets,
      setPastBets,
    ] =
      useState([]);
  
    const [
      selectedPastContestId,
      setSelectedPastContestId,
    ] =
      useState("");
  
    const [
      loading,
      setLoading,
    ] =
      useState(true);
  
    const [
      errorMessage,
      setErrorMessage,
    ] =
      useState("");
  
    const [
      currentTime,
      setCurrentTime,
    ] =
      useState(
        Date.now()
      );
  
    // --------------------------------------------------
    // COUNTDOWN TIMER
    // --------------------------------------------------
  
    useEffect(() => {
      const timer =
        setInterval(
          () => {
            setCurrentTime(
              Date.now()
            );
          },
          1000
        );
  
      return () =>
        clearInterval(
          timer
        );
    }, []);
  
    // --------------------------------------------------
    // LOAD BETS
    // --------------------------------------------------
  
    useEffect(() => {
      const getBets =
        async () => {
          try {
            setLoading(
              true
            );
  
            setErrorMessage(
              ""
            );
  
            const {
              activeBets:
                active,
  
              pastBets:
                past,
            } =
              await loadMyBets();
  
            setActiveBets(
              active
            );
  
            setPastBets(
              past
            );
  
            if (
              past.length > 0
            ) {
              setSelectedPastContestId(
                String(
                  past[0].id
                )
              );
            }
          } catch (error) {
            console.error(
              "My Bets loading error:",
              error
            );
  
            setErrorMessage(
              error.message
            );
          } finally {
            setLoading(
              false
            );
          }
        };
  
      getBets();
    }, []);
  
    // --------------------------------------------------
    // SELECTED PAST CONTEST
    // --------------------------------------------------
  
    const selectedPastContest =
      getSelectedPastContest(
        pastBets,
        selectedPastContestId
      );
  
    // --------------------------------------------------
    // CONTEST DISPLAY
    // --------------------------------------------------
  
    const renderContest = (
      contest,
      isPast = false
    ) => {
      const correctPicks =
        countCorrectPicks(
          contest
        );
  
      return (
        <div
          className="mybets-contest"
          key={
            contest.id
          }
        >
  
          {/* CONTEST HEADER */}
  
          <div className="mybets-contest-header">
  
            <div className="contest-title-area">
  
              <span className="contest-sport">
                {
                  contest.sport
                }
              </span>
  
              <h2>
                {
                  contest.title
                }
              </h2>
  
              <p>
                {
                  formatMyBetDate(
                    contest.closes_at
                  )
                }
              </p>
  
            </div>
  
            <div className="contest-header-stats">
  
              {/* SPORT */}
  
              <div className="contest-header-stat">
  
                <span>
                  SPORT
                </span>
  
                <strong>
                  {
                    contest.sport
                  }
                </strong>
  
              </div>
  
              <div className="contest-stat-divider" />
  
              {/* ENTRY FEE */}
  
              <div className="contest-header-stat">
  
                <span>
                  ENTRY FEE
                </span>
  
                <strong>
                  $
                  {(
                    contest
                      .entry_fee_cents /
                    100
                  ).toFixed(
                    0
                  )}
                </strong>
  
              </div>
  
              <div className="contest-stat-divider" />
  
              {/* CORRECT PICKS */}
  
              <div className="contest-header-stat">
  
                <span>
                  CORRECT PICKS
                </span>
  
                <strong>
  
                  {
                    correctPicks
                  }
  
                  {" / "}
  
                  {
                    contest
                      .games
                      .length
                  }
                </strong>
              </div>
              <div className="contest-stat-divider" />
              {/* STATUS */}
              <div className="contest-header-stat">
  
                <span>
                  {
                    isPast
                      ? "STATUS"
                      : "CONTEST CLOSES IN"
                  }
                </span>
  
                <strong
                  className={
                    isPast
                      ? ""
                      : "pink-value"
                  }
                >
                  {
                    isPast
                      ? "FINISHED"
  
                      : getMyBetCountdown(
                          contest.closes_at,
                          currentTime
                        )
                  }
                </strong>
  
              </div>
  
            </div>
  
          </div>
  
          {/* GAME LIST */}
  
          <div className="mybets-game-list">
  
            {
              contest.games.map(
                (game) => {
  
                  const pick =
                    getPickForGame(
                      contest,
                      game.id
                    );
  
                  const selectedTeam =
                    pick
                      ?.selected_team;
  
                  return (
                    <div
                      className="mybets-game-row"
                      key={
                        game.id
                      }
                    >
  
                      {/* GAME TIME */}
  
                      <div className="mybets-game-meta">
  
                        <span>
                          {
                            game.league ||
                            contest.sport
                          }
                        </span>
  
                        <p>
                          {
                            formatMyBetGameTime(
                              game.starts_at
                            )
                          }
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
                          {
                            game.away_team
                          }
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
                          {
                            game.home_team
                          }
                        </button>
  
                      </div>
  
                      {/* LOCK */}
  
                      <div className="mybets-locked">
  
                        <span className="lock-icon">
                          ◉
                        </span>
  
                        {
                          selectedTeam
                            ? "Locked Pick"
                            : "No Pick"
                        }
  
                      </div>
  
                    </div>
                  );
                }
              )
            }
  
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
  
            <h1>
              My Bets
            </h1>
  
            <p>
              Track your active and
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
                setView(
                  "active"
                )
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
                setView(
                  "past"
                )
              }
            >
              PAST BETS
            </button>
  
          </div>
  
          {/* LOADING */}
  
          {
            loading && (
              <div className="mybets-empty">
                Loading your bets...
              </div>
            )
          }
  
          {/* ERROR */}
  
          {
            !loading &&
            errorMessage && (
  
              <div className="mybets-empty error">
                {
                  errorMessage
                }
              </div>
  
            )
          }
  
          {/* ACTIVE */}
  
          {
            !loading &&
            !errorMessage &&
            view ===
              "active" && (
  
              <div className="mybets-contests">
  
                {
                  activeBets.length ===
                  0
                    ? (
  
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
  
                    )
  
                    : activeBets.map(
                        (contest) =>
                          renderContest(
                            contest
                          )
                      )
                }
  
              </div>
            )
          }
  
          {/* PAST */}
  
          {
            !loading &&
            !errorMessage &&
            view ===
              "past" && (
  
              <div className="mybets-past">
  
                {
                  pastBets.length ===
                  0
                    ? (
  
                      <div className="mybets-empty">
  
                        <h2>
                          No past bets
                        </h2>
  
                        <p>
                          Completed contests will
                          appear here.
                        </p>
  
                      </div>
  
                    )
  
                    : (
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
  
                            onChange={
                              (event) =>
                                setSelectedPastContestId(
                                  event.target.value
                                )
                            }
                          >
  
                            {
                              pastBets.map(
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
  
                                    {
                                      formatMyBetDate(
                                        contest.closes_at
                                      )
                                    }
  
                                  </option>
  
                                )
                              )
                            }
  
                          </select>
  
                        </div>
  
                        {
                          selectedPastContest &&
                          renderContest(
                            selectedPastContest,
                            true
                          )
                        }
  
                      </>
                    )
                }
  
              </div>
            )
          }
  
        </main>
  
      </div>
    );
  }
  
  export default MyBets;