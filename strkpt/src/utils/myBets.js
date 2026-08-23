import { supabase } from "../lib/supabase";

// --------------------------------------------------
// GET CURRENT USER
// --------------------------------------------------

export async function getMyBetsUser() {
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error) {
    throw error;
  }

  if (!user) {
    throw new Error(
      "You must be logged in."
    );
  }

  return user;
}

// --------------------------------------------------
// LOAD USER PICKS
// --------------------------------------------------

async function loadUserPicks(userId) {
  const {
    data,
    error,
  } =
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
      .eq(
        "user_id",
        userId
      );

  if (error) {
    throw error;
  }

  return data || [];
}

// --------------------------------------------------
// LOAD GAMES FOR CONTESTS
// --------------------------------------------------

async function loadContestGames(
  contestIds
) {
  if (
    contestIds.length === 0
  ) {
    return [];
  }

  const {
    data,
    error,
  } =
    await supabase
      .from("games")
      .select("*")
      .in(
        "contest_id",
        contestIds
      )
      .order(
        "starts_at",
        {
          ascending: true,
        }
      );

  if (error) {
    throw error;
  }

  return data || [];
}

// --------------------------------------------------
// GROUP PICKS + GAMES BY CONTEST
// --------------------------------------------------

export function groupBetsByContest(
  picks,
  games
) {
  const grouped = {};

  // --------------------------------------------
  // ADD PICKS
  // --------------------------------------------

  picks.forEach((pick) => {
    if (!pick.contest) {
      return;
    }

    const contestId =
      pick.contest.id;

    if (!grouped[contestId]) {
      grouped[contestId] = {
        ...pick.contest,
        picks: [],
        games: [],
      };
    }

    grouped[
      contestId
    ].picks.push({
      id:
        pick.id,

      game_id:
        pick.game_id,

      selected_team:
        pick.selected_team,

      is_correct:
        pick.is_correct,
    });
  });

  // --------------------------------------------
  // ADD GAMES
  // --------------------------------------------

  games.forEach((game) => {
    if (
      grouped[
        game.contest_id
      ]
    ) {
      grouped[
        game.contest_id
      ].games.push(
        game
      );
    }
  });

  return Object.values(
    grouped
  );
}

// --------------------------------------------------
// SPLIT ACTIVE / PAST CONTESTS
// --------------------------------------------------

export function splitBetsByStatus(
  contests
) {
  const now =
    Date.now();

  const active = [];
  const past = [];

  contests.forEach(
    (contest) => {
      if (
        !contest.closes_at
      ) {
        active.push(
          contest
        );

        return;
      }

      const closesAt =
        new Date(
          contest.closes_at
        ).getTime();

      // Keep contest in Active Bets
      // for 24 hours after it closes.
      const activeUntil =
        closesAt +
        24 *
          60 *
          60 *
          1000;

      if (
        now < activeUntil
      ) {
        active.push(
          contest
        );
      } else {
        past.push(
          contest
        );
      }
    }
  );

  // --------------------------------------------
  // ACTIVE: CLOSEST FIRST
  // --------------------------------------------

  active.sort(
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

  // --------------------------------------------
  // PAST: MOST RECENT FIRST
  // --------------------------------------------

  past.sort(
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

  return {
    active,
    past,
  };
}

// --------------------------------------------------
// LOAD EVERYTHING FOR MY BETS PAGE
// --------------------------------------------------

export async function loadMyBets() {
  const user =
    await getMyBetsUser();

  const picks =
    await loadUserPicks(
      user.id
    );

  if (
    picks.length === 0
  ) {
    return {
      activeBets: [],
      pastBets: [],
    };
  }

  const contestIds = [
    ...new Set(
      picks.map(
        (pick) =>
          pick.contest_id
      )
    ),
  ];

  const games =
    await loadContestGames(
      contestIds
    );

  const contests =
    groupBetsByContest(
      picks,
      games
    );

  const {
    active,
    past,
  } =
    splitBetsByStatus(
      contests
    );

  return {
    activeBets:
      active,

    pastBets:
      past,
  };
}

// --------------------------------------------------
// FORMAT GAME TIME
// --------------------------------------------------

export function formatMyBetGameTime(
  startsAt
) {
  if (!startsAt) {
    return "TBD";
  }

  return new Date(
    startsAt
  ).toLocaleTimeString(
    "en-US",
    {
      hour:
        "numeric",

      minute:
        "2-digit",
    }
  );
}

// --------------------------------------------------
// FORMAT DATE
// --------------------------------------------------

export function formatMyBetDate(
  date
) {
  if (!date) {
    return "TBD";
  }

  return new Date(
    date
  ).toLocaleDateString(
    "en-US",
    {
      month:
        "short",

      day:
        "numeric",

      year:
        "numeric",
    }
  );
}

// --------------------------------------------------
// COUNTDOWN
// --------------------------------------------------

export function getMyBetCountdown(
  closesAt,
  currentTime
) {
  if (!closesAt) {
    return "TBD";
  }

  const closeTime =
    new Date(
      closesAt
    ).getTime();

  const difference =
    closeTime -
    currentTime;

  if (
    difference <= 0
  ) {
    return "Contest ended";
  }

  const days =
    Math.floor(
      difference /
        (
          1000 *
          60 *
          60 *
          24
        )
    );

  const hours =
    Math.floor(
      (
        difference %
        (
          1000 *
          60 *
          60 *
          24
        )
      ) /
        (
          1000 *
          60 *
          60
        )
    );

  const minutes =
    Math.floor(
      (
        difference %
        (
          1000 *
          60 *
          60
        )
      ) /
        (
          1000 *
          60
        )
    );

  const seconds =
    Math.floor(
      (
        difference %
        (
          1000 *
          60
        )
      ) /
        1000
    );

  if (
    days > 0
  ) {
    return (
      `${days}d ` +
      `${hours}h ` +
      `${minutes}m`
    );
  }

  return (
    `${hours}h ` +
    `${minutes}m ` +
    `${seconds}s`
  );
}

// --------------------------------------------------
// FIND USER PICK FOR GAME
// --------------------------------------------------

export function getPickForGame(
  contest,
  gameId
) {
  return (
    contest.picks.find(
      (pick) =>
        pick.game_id ===
        gameId
    ) || null
  );
}

// --------------------------------------------------
// GET SELECTED PAST CONTEST
// --------------------------------------------------

export function getSelectedPastContest(
  pastBets,
  selectedId
) {
  return (
    pastBets.find(
      (contest) =>
        String(
          contest.id
        ) ===
        String(
          selectedId
        )
    ) || null
  );
}

// --------------------------------------------------
// COUNT CORRECT PICKS
// --------------------------------------------------

export function countCorrectPicks(
  contest
) {
  return contest.picks.filter(
    (pick) =>
      pick.is_correct === true
  ).length;
}