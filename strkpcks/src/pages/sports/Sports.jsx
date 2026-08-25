import { useParams } from "react-router-dom";

import Sidebar from "../../components/sidebar/Sidebar";

import Fortune from "./fortune/Fortune";

import {
  useSportsPage,
} from "../../hooks/useSportsPage";

import "./Sports.css";

function Sport() {
  const { sport } =
    useParams();

  const {
    selectedSport,
    sportDisplayName,

    contests,
    selectedContest,
    selectedContestId,

    games,
    selections,
    pickPercentages,

    currentEntries,
    entryFee,
    currentPot,

    loadingContests,
    loadingGames,
    errorMessage,

    timeRemaining,
    contestClosed,
    allGamesPicked,

    fortune,

    formatGameTime,

    handleContestChange,
    handlePick,
    handleConfirmPicks,
    closeFortune,
  } =
    useSportsPage(
      sport
    );

  // --------------------------------------------------
  // LOADING
  // --------------------------------------------------

  if (loadingContests) {
    return (
      <div className="sport-page">
        <Sidebar />

        <main className="sport-main">
          <p>
            Loading{" "}
            {selectedSport}{" "}
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
          <p>
            {errorMessage}
          </p>
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
            No{" "}
            {selectedSport}{" "}
            contests are currently
            available.
          </p>
        </main>
      </div>
    );
  }

  // --------------------------------------------------
  // PAGE
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
              (contest) => (
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
                    handleContestChange(
                      contest.id
                    )
                  }
                >

                  <span className="sport-contest-button-title">
                    {
                      contest.title
                    }
                  </span>

                  <span className="sport-contest-button-info">
                    $
                    {(
                      contest
                        .entry_fee_cents /
                      100
                    ).toFixed(0)}
                  </span>

                </button>
              )
            )}

          </div>

        </div>

        {/* HEADER */}

        <div className="sport-page-header">

          <div className="sport-header-left">

            <p className="sport-small-title">
              {sportDisplayName}
            </p>

            <h1>
              {
                selectedContest
                  ?.title ||
                `${selectedSport} Contest`
              }
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
                {
                  currentEntries
                    .toLocaleString()
                }
              </span>

            </div>

            <div className="sport-header-divider" />

            <div className="sport-contest-stat">

              <span className="contest-stat-label">
                Current Pot
              </span>

              <span className="contest-stat-value pot-highlight">
                $
                {
                  currentPot
                    .toLocaleString()
                }
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
                No games were added to this contest.
              </p>
            )}

          {!loadingGames &&
            games.map(
              (game) => {

                const selectedTeam =
                  selections[
                    game.id
                  ];

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
                    key={
                      game.id
                    }
                  >

                    <div className="sport-game-info">

                      <span className="league-label">
                        {
                          selectedSport
                        }
                      </span>

                      <span className="sport-game-time">
                        {
                          formatGameTime(
                            game.starts_at
                          )
                        }
                      </span>

                      <span className="community-picks-label">
                        {
                          percentages
                            .total
                        }{" "}
                        picks
                      </span>

                    </div>

                    <div className="sport-game-picks">

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

                      </button>

                      <div className="sport-vs">
                        VS
                      </div>

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

                      </button>

                    </div>

                  </div>
                );
              }
            )}

        </div>

        {/* CONFIRM */}

        <div className="sport-confirm-section">

          <div className="sport-pick-progress">

            {
              Object.keys(
                selections
              ).length
            }

            {" / "}

            {games.length}

            {" picks made"}

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

            {
              contestClosed
                ? "Contest Closed"
                : "Confirm Picks"
            }

          </button>

        </div>

      </main>

      <Fortune
        fortune={
          fortune
        }

        onClose={
          closeFortune
        }
      />

    </div>
  );
}

export default Sport;