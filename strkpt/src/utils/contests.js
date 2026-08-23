export function isContestClosed(contest) {
    if (!contest) {
      return true;
    }
  
    if (contest.status !== "open") {
      return true;
    }
  
    if (!contest.closes_at) {
      return false;
    }
  
    return (
      Date.now() >=
      new Date(
        contest.closes_at
      ).getTime()
    );
  }
  
  export function getEntryFee(contest) {
    if (!contest) {
      return 0;
    }
  
    return (
      contest.entry_fee_cents /
      100
    );
  }
  
  export function getCurrentPot(
    currentEntries,
    entryFee
  ) {
    return (
      currentEntries *
      entryFee
    );
  }