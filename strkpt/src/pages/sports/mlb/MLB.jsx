import { useEffect, useState } from "react";
import Sidebar from "../../../components/sidebar/Sidebar";
import { supabase } from "../../../lib/supabase";
import "./MLB.css";

function MLB() {
    const [contests, setContests] = useState([]);
    const [selectedContestId, setSelectedContestId] = useState(null);
    const [games, setGames] = useState([]);
    const [selections, setSelections] = useState({});

    const [currentEntries, setCurrentEntries] = useState(0);

    const [loadingContests, setLoadingContests] = useState(true);
    const [loadingGames, setLoadingGames] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    
    const [timeRemaining, setTimeRemaining] = useState("");
    const allGamesPicked = games.length > 0 && games.every((game) => selections[game.id]);

  // Load all MLB contests
  useEffect(() => {
    const loadContests = async () => {
      setLoadingContests(true);
      setErrorMessage("");

      const { data, error } = await supabase
        .from("contests")
        .select("*")
        .eq("sport", "MLB")
        .order("closes_at", { ascending: true });

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

      // Automatically select first available contest
      if (contestData.length > 0) {
        setSelectedContestId(contestData[0].id);
      }

      setLoadingContests(false);
    };

    loadContests();
  }, []);

  // Current contest object
  const selectedContest = contests.find(
    (contest) => contest.id === selectedContestId
  );

  // Load games when contest changes
  useEffect(() => {
    if (!selectedContestId) {
      setGames([]);
      return;
    }

    const loadGames = async () => {
      setLoadingGames(true);
      setSelections({});

      const { data, error } = await supabase
        .from("games")
        .select("*")
        .eq("contest_id", selectedContestId)
        .order("starts_at", { ascending: true });

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

  // Load number of entries for currently selected contest
  useEffect(() => {
    if (!selectedContestId) {
      setCurrentEntries(0);
      return;
    }

    const loadEntries = async () => {
      const { count, error } = await supabase
        .from("contest_entries")
        .select("*", {
          count: "exact",
          head: true,
        })
        .eq("contest_id", selectedContestId);

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
  useEffect(() => {
    if (!selectedContest?.closes_at) {
      setTimeRemaining("");
      return;
    }
  
    const updateCountdown = () => {
      const now = new Date().getTime();
  
      const closeTime = new Date(
        selectedContest.closes_at
      ).getTime();
  
      const difference = closeTime - now;
  
      if (difference <= 0) {
        setTimeRemaining("Contest Closed");
        return;
      }
  
      const days = Math.floor(
        difference / (1000 * 60 * 60 * 24)
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
  
      if (hours > 0 || days > 0) {
        countdown += `${hours}h `;
      }
  
      countdown += `${minutes}m ${seconds}s`;
  
      setTimeRemaining(countdown);
    };
  
    // Run immediately
    updateCountdown();
  
    // Then update every second
    const interval = setInterval(
      updateCountdown,
      1000
    );
  
    return () => {
      clearInterval(interval);
    };
  }, [selectedContest?.closes_at]);

  const handlePick = (gameId, team) => {
    setSelections((previousSelections) => ({
      ...previousSelections,
      [gameId]: team,
    }));
  };

  const formatGameTime = (startsAt) => {
    if (!startsAt) {
      return "TBD";
    }

    return new Date(startsAt).toLocaleTimeString(
      "en-US",
      {
        day: "numeric",
        hour: "numeric",
        minute: "2-digit",
      }
    );
  };

  const formatCloseTime = (closesAt) => {
    if (!closesAt) {
      return "TBD";
    }

    return new Date(closesAt).toLocaleTimeString(
      "en-US",
      {
        hour: "numeric",
        minute: "2-digit",
      }
    );
  };

  const isContestClosed = (contest) => {
    if (!contest) {
      return true;
    }
  
    if (contest.status !== "open") {
      return true;
    }
  
    if (!contest.closes_at) {
      return false;
    }
  
    const now = new Date();
    const closeTime = new Date(contest.closes_at);
  
    return now.getTime() >= closeTime.getTime();
  };

  if (loadingContests) {
    return (
      <div className="mlb-page">
        <Sidebar />

        <main className="mlb-main">
          <p>Loading MLB contests...</p>
        </main>
      </div>
    );
  }

  if (errorMessage && contests.length === 0) {
    return (
      <div className="mlb-page">
        <Sidebar />

        <main className="mlb-main">
          <p>{errorMessage}</p>
        </main>
      </div>
    );
  }

  if (contests.length === 0) {
    return (
      <div className="mlb-page">
        <Sidebar />

        <main className="mlb-main">
          <p>No MLB contests are currently available.</p>
        </main>
      </div>
    );
  }

  const entryFee = selectedContest
    ? selectedContest.entry_fee_cents / 100
    : 0;

  const currentPot =
    currentEntries * entryFee;

  const contestClosed =
    isContestClosed(selectedContest);
    //handle confirm
    const handleConfirmPicks = async () => {
        if (!selectedContest) {
          return;
        }
      
        if (!allGamesPicked) {
          alert("Please make a pick for every game.");
          return;
        }
      
        try {
          const {
            data: { user },
          } = await supabase.auth.getUser();
      
          if (!user) {
            alert("You must be logged in.");
            return;
          }
      
          const picksToSave = games.map((game) => ({
            user_id: user.id,
            contest_id: selectedContest.id,
            game_id: game.id,
            selected_team: selections[game.id],
          }));
      
          const { error } = await supabase
            .from("picks")
            .upsert(picksToSave, {
              onConflict: "user_id,game_id",
            });
      
          if (error) {
            throw error;
          }
      
          alert("Picks confirmed!");
        } catch (error) {
          console.error("Confirm picks error:", error);
      
          alert(
            `Could not confirm picks: ${error.message}`
          );
        }
      };

  return (
    <div className="mlb-page">
      <Sidebar />

      <main className="mlb-main">

        {/* CONTEST SELECTOR */}
        <div className="mlb-contest-selector">
          <div className="mlb-contest-selector-label">
            MLB CONTESTS
          </div>

          <div className="mlb-contest-buttons">
            {contests.map((contest) => {
              const closed =
                isContestClosed(contest);

              return (
                <button
                  key={contest.id}
                  className={`mlb-contest-button ${
                    selectedContestId === contest.id
                      ? "active"
                      : ""
                  }`}
                  onClick={() =>
                    setSelectedContestId(
                      contest.id
                    )
                  }
                >
                  <span className="mlb-contest-button-title">
                    {contest.title}
                  </span>

                  <span className="mlb-contest-button-info">
                    $
                    {(
                      contest.entry_fee_cents /
                      100
                    ).toFixed(0)}
                  </span>

                  {closed && (
                    <span className="mlb-contest-closed">
                      CLOSED
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* MAIN MLB FRAME */}
        <div className="mlb-page-header">

          <div className="mlb-header-left">

            <p className="mlb-small-title">
              BASEBALL
            </p>

            {/* CONTEST TITLE */}
            <h1>
              {selectedContest?.title ||
                "MLB Contest"}
            </h1>

            <p className="mlb-header-description">
              Pick one winner from each matchup.
            </p>

            <p
            className={`mlb-contest-close-time ${
                contestClosed ? "closed" : ""
            }`}
            >
            {timeRemaining}
            </p>

          </div>

          <div className="mlb-contest-info">

            <div className="mlb-contest-stat">
              <span className="contest-stat-label">
                Entry
              </span>

              <span className="contest-stat-value">
                ${entryFee}
              </span>
            </div>

            <div className="mlb-header-divider"></div>

            <div className="mlb-contest-stat">
              <span className="contest-stat-label">
                Current Entries
              </span>

              <span className="contest-stat-value">
                {currentEntries.toLocaleString()}
              </span>
            </div>

            <div className="mlb-header-divider"></div>

            <div className="mlb-contest-stat">
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

        <div className="mlb-games-list">

          {loadingGames && (
            <p className="mlb-loading">
              Loading games...
            </p>
          )}

          {!loadingGames &&
            games.length === 0 && (
              <p className="mlb-no-games">
                No games were added to this
                contest.
              </p>
            )}

          {!loadingGames &&
            games.map((game) => {
              const selectedTeam =
                selections[game.id];

              return (
                <div
                  className="mlb-game-row"
                  key={game.id}
                >

                  <div className="mlb-game-info">

                    <span className="league-label">
                      MLB
                    </span>

                    <span className="mlb-game-time">
                      {formatGameTime(
                        game.starts_at
                      )}
                    </span>

                  </div>

                  <div className="mlb-game-picks">

                    <button
                      className={`mlb-pick-button ${
                        selectedTeam ===
                        game.away_team
                          ? "selected"
                          : ""
                      }`}
                      disabled={contestClosed}
                      onClick={() =>
                        handlePick(
                          game.id,
                          game.away_team
                        )
                      }
                    >
                      <span className="mlb-team-name">
                        {game.away_team}
                      </span>
                    </button>

                    <div className="mlb-vs">
                      VS
                    </div>

                    <button
                      className={`mlb-pick-button ${
                        selectedTeam ===
                        game.home_team
                          ? "selected"
                          : ""
                      }`}
                      disabled={contestClosed}
                      onClick={() =>
                        handlePick(
                          game.id,
                          game.home_team
                        )
                      }
                    >
                      <span className="mlb-team-name">
                        {game.home_team}
                      </span>
                    </button>

                  </div>

                  <div className="mlb-selection-status">

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
            <div className="mlb-confirm-section">
            <div className="mlb-pick-progress">
                {Object.keys(selections).length} / {games.length} picks made
            </div>

            <button
                className="mlb-confirm-button"
                onClick={handleConfirmPicks}
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

export default MLB;