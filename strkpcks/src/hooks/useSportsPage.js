import { useEffect, useState } from "react";

import { supabase } from "../lib/supabase";

import {
  selectPick,
  allGamesHavePicks,
  loadPickPercentages,
  confirmPicks,
} from "../utils/picks";

import {
  isContestClosed,
  getEntryFee,
  getCurrentPot,
} from "../utils/contests";

import {
  formatGameTime,
  formatCountdown,
} from "../utils/formatters";

import {
  getSportDisplayName,
} from "../utils/games";

import {
  getRandomFortune,
} from "../pages/sports/fortune/Fortunes";

export function useSportsPage(sport) {
  // --------------------------------------------------
  // SPORT
  // --------------------------------------------------

  const selectedSport =
    sport?.toUpperCase();

  // --------------------------------------------------
  // STATE
  // --------------------------------------------------

  const [contests, setContests] =
    useState([]);

  const [
    selectedContestId,
    setSelectedContestId,
  ] =
    useState(null);

  const [games, setGames] =
    useState([]);

  const [
    selections,
    setSelections,
  ] =
    useState({});

  const [
    pickPercentages,
    setPickPercentages,
  ] =
    useState({});

  const [
    currentEntries,
    setCurrentEntries,
  ] =
    useState(0);

  const [
    loadingContests,
    setLoadingContests,
  ] =
    useState(true);

  const [
    loadingGames,
    setLoadingGames,
  ] =
    useState(false);

  const [
    errorMessage,
    setErrorMessage,
  ] =
    useState("");

  const [
    timeRemaining,
    setTimeRemaining,
  ] =
    useState("");

  const [
    fortune,
    setFortune,
  ] =
    useState("");

  // --------------------------------------------------
  // CURRENT CONTEST
  // --------------------------------------------------

  const selectedContest =
    contests.find(
      (contest) =>
        contest.id ===
        selectedContestId
    ) || null;

  // --------------------------------------------------
  // DERIVED VALUES
  // --------------------------------------------------

  const allGamesPicked =
    allGamesHavePicks(
      games,
      selections
    );

  const entryFee =
    getEntryFee(
      selectedContest
    );

  const currentPot =
    getCurrentPot(
      currentEntries,
      entryFee
    );

  const contestClosed =
    isContestClosed(
      selectedContest
    );

  const sportDisplayName =
    getSportDisplayName(
      selectedSport
    );

  // --------------------------------------------------
  // LOAD CONTESTS
  // --------------------------------------------------

  useEffect(() => {
    if (!selectedSport) {
      return;
    }

    const loadContests =
      async () => {
        try {
          setLoadingContests(
            true
          );

          setErrorMessage(
            ""
          );

          setContests(
            []
          );

          setGames(
            []
          );

          setSelections(
            {}
          );

          setPickPercentages(
            {}
          );

          setSelectedContestId(
            null
          );

          setFortune(
            ""
          );

          // ------------------------------------------
          // LOAD ALL CONTESTS FOR THIS SPORT
          // ------------------------------------------

          const {
            data,
            error,
          } =
            await supabase
              .from("contests")
              .select("*")
              .eq(
                "sport",
                selectedSport
              );

          if (error) {
            throw error;
          }

          const now =
            Date.now();

          const allContests =
            data || [];

          // ------------------------------------------
          // OPEN CONTESTS
          // ------------------------------------------

          const openContests =
            allContests
              .filter(
                (contest) => {
                  const closeTime =
                    contest.closes_at
                      ? new Date(
                          contest.closes_at
                        ).getTime()
                      : Infinity;

                  return (
                    contest.status === "open" &&
                    closeTime > now
                  );
                }
              )
              .sort(
                (a, b) => {
                  const aTime =
                    a.closes_at
                      ? new Date(
                          a.closes_at
                        ).getTime()
                      : Infinity;

                  const bTime =
                    b.closes_at
                      ? new Date(
                          b.closes_at
                        ).getTime()
                      : Infinity;

                  return (
                    aTime -
                    bTime
                  );
                }
              );

          // ------------------------------------------
          // CLOSED CONTESTS
          // ------------------------------------------

          const closedContests =
            allContests
              .filter(
                (contest) => {
                  const closeTime =
                    contest.closes_at
                      ? new Date(
                          contest.closes_at
                        ).getTime()
                      : Infinity;

                  return (
                    contest.status !== "open" ||
                    closeTime <= now
                  );
                }
              )
              .sort(
                (a, b) => {
                  const aTime =
                    a.closes_at
                      ? new Date(
                          a.closes_at
                        ).getTime()
                      : 0;

                  const bTime =
                    b.closes_at
                      ? new Date(
                          b.closes_at
                        ).getTime()
                      : 0;

                  return (
                    bTime -
                    aTime
                  );
                }
              );

          // ------------------------------------------
          // OPEN FIRST, CLOSED AFTER
          // ------------------------------------------

          const contestData = [
            ...openContests,
            ...closedContests,
          ];

          setContests(
            contestData
          );

          // ------------------------------------------
          // SELECT FIRST OPEN CONTEST
          // ------------------------------------------

          if (
            openContests.length > 0
          ) {
            setSelectedContestId(
              openContests[0].id
            );
          } else if (
            contestData.length > 0
          ) {
            // If everything is closed,
            // select the most recently closed one.
            setSelectedContestId(
              contestData[0].id
            );
          }
        } catch (error) {
          console.error(
            "Contest loading error:",
            error
          );

          setErrorMessage(
            error.message
          );
        } finally {
          setLoadingContests(
            false
          );
        }
      };

    loadContests();
  }, [selectedSport]);

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

    const loadGames =
      async () => {
        try {
          setLoadingGames(
            true
          );

          setSelections(
            {}
          );

          setPickPercentages(
            {}
          );

          setFortune(
            ""
          );

          const {
            data,
            error,
          } =
            await supabase
              .from(
                "games"
              )
              .select(
                "*"
              )
              .eq(
                "contest_id",
                selectedContestId
              )
              .order(
                "starts_at",
                {
                  ascending:
                    true,
                }
              );

          if (error) {
            throw error;
          }

          setGames(
            data || []
          );
        } catch (error) {
          console.error(
            "Game loading error:",
            error
          );

          setErrorMessage(
            error.message
          );
        } finally {
          setLoadingGames(
            false
          );
        }
      };

    loadGames();
  }, [selectedContestId]);

  // --------------------------------------------------
  // LOAD PICK PERCENTAGES
  // --------------------------------------------------

  useEffect(() => {
    if (
      games.length === 0
    ) {
      setPickPercentages(
        {}
      );

      return;
    }

    const loadPercentages =
      async () => {
        try {
          const percentages =
            await loadPickPercentages(
              games
            );

          setPickPercentages(
            percentages
          );
        } catch (error) {
          console.error(
            "Pick percentage error:",
            error
          );
        }
      };

    loadPercentages();
  }, [games]);

  // --------------------------------------------------
  // LOAD ENTRY COUNT
  // --------------------------------------------------

  useEffect(() => {
    if (
      !selectedContestId
    ) {
      setCurrentEntries(
        0
      );

      return;
    }

    const loadEntries =
      async () => {
        const {
          count,
          error,
        } =
          await supabase
            .from(
              "contest_entries"
            )
            .select(
              "*",
              {
                count:
                  "exact",

                head:
                  true,
              }
            )
            .eq(
              "contest_id",
              selectedContestId
            );

        if (error) {
          console.error(
            "Entry count error:",
            error.message
          );

          setCurrentEntries(
            0
          );

          return;
        }

        setCurrentEntries(
          count || 0
        );
      };

    loadEntries();
  }, [selectedContestId]);

  // --------------------------------------------------
  // COUNTDOWN
  // --------------------------------------------------

  useEffect(() => {
    if (
      !selectedContest
        ?.closes_at
    ) {
      setTimeRemaining(
        ""
      );

      return;
    }

    const updateCountdown =
      () => {
        const closeTime =
          new Date(
            selectedContest
              .closes_at
          ).getTime();

        const difference =
          closeTime -
          Date.now();

        setTimeRemaining(
          formatCountdown(
            difference
          )
        );
      };

    updateCountdown();

    const interval =
      setInterval(
        updateCountdown,
        1000
      );

    return () =>
      clearInterval(
        interval
      );
  }, [
    selectedContest
      ?.closes_at,
  ]);

  // --------------------------------------------------
  // CHANGE CONTEST
  // --------------------------------------------------

  const handleContestChange = (
    contestId
  ) => {
    setSelectedContestId(
      contestId
    );
  };

  // --------------------------------------------------
  // SELECT PICK
  // --------------------------------------------------

  const handlePick = (
    gameId,
    team
  ) => {
    setSelections(
      (
        previousSelections
      ) =>
        selectPick(
          previousSelections,
          gameId,
          team
        )
    );
  };

  // --------------------------------------------------
  // CONFIRM PICKS
  // --------------------------------------------------

  const handleConfirmPicks =
    async () => {
      if (
        !selectedContest
      ) {
        return;
      }

      try {
        const result =
          await confirmPicks({
            games,
            selections,

            contestId:
              selectedContest.id,
          });

        setPickPercentages(
          result.percentages
        );

        setFortune(
          getRandomFortune()
        );
      } catch (error) {
        console.error(
          "Confirm picks error:",
          error
        );

        alert(
          error.message
        );
      }
    };

  // --------------------------------------------------
  // CLOSE FORTUNE
  // --------------------------------------------------

  const closeFortune = () => {
    setFortune("");
  };

  // --------------------------------------------------
  // RETURN EVERYTHING SPORTS.JSX NEEDS
  // --------------------------------------------------

  return {
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
  };
}