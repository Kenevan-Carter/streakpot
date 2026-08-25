import { supabase } from "../lib/supabase";

// --------------------------------------------------
// SELECT A PICK
// --------------------------------------------------

export function selectPick(
  previousSelections,
  gameId,
  team
) {
  return {
    ...previousSelections,
    [gameId]: team,
  };
}

// --------------------------------------------------
// CHECK IF EVERY GAME HAS A PICK
// --------------------------------------------------

export function allGamesHavePicks(
  games,
  selections
) {
  if (games.length === 0) {
    return false;
  }

  return games.every(
    (game) => selections[game.id]
  );
}

// --------------------------------------------------
// BUILD PICK PERCENTAGES
// --------------------------------------------------

export function calculatePickPercentages(
  games,
  picks
) {
  const percentages = {};

  games.forEach((game) => {
    const gamePicks =
      picks.filter(
        (pick) =>
          pick.game_id === game.id
      );

    const total =
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
      total > 0
        ? Math.round(
            (awayVotes / total) * 100
          )
        : 0;

    const homePercentage =
      total > 0
        ? 100 - awayPercentage
        : 0;

    percentages[game.id] = {
      away: awayPercentage,
      home: homePercentage,
      total,
    };
  });

  return percentages;
}

// --------------------------------------------------
// LOAD COMMUNITY PICK PERCENTAGES
// --------------------------------------------------

export async function loadPickPercentages(
    games
  ) {
    if (games.length === 0) {
      return {};
    }
  
    const gameIds =
      games.map(
        (game) => game.id
      );
  
    const { data, error } =
      await supabase.rpc(
        "get_pick_percentages",
        {
          game_ids: gameIds,
        }
      );
  
    if (error) {
      throw error;
    }
  
    const percentages = {};
  
    games.forEach((game) => {
      const gameResults =
        (data || []).filter(
          (row) =>
            row.game_id === game.id
        );
  
      const awayVotes =
        Number(
          gameResults.find(
            (row) =>
              row.selected_team ===
              game.away_team
          )?.pick_count || 0
        );
  
      const homeVotes =
        Number(
          gameResults.find(
            (row) =>
              row.selected_team ===
              game.home_team
          )?.pick_count || 0
        );
  
      const total =
        awayVotes +
        homeVotes;
  
      const awayPercentage =
        total > 0
          ? Math.round(
              (awayVotes / total) * 100
            )
          : 0;
  
      const homePercentage =
        total > 0
          ? 100 - awayPercentage
          : 0;
  
      percentages[game.id] = {
        away: awayPercentage,
        home: homePercentage,
        total,
      };
    });
  
    return percentages;
  }
  
// --------------------------------------------------
// GET CURRENT USER
// --------------------------------------------------

export async function getCurrentPickUser() {
  const {
    data: { user },
    error,
  } =
    await supabase.auth.getUser();

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
// CHECK IF USER ALREADY ENTERED CONTEST
// --------------------------------------------------

export async function hasEnteredContest(
  userId,
  contestId
) {
  const { data, error } =
    await supabase
      .from("contest_entries")
      .select("id")
      .eq(
        "user_id",
        userId
      )
      .eq(
        "contest_id",
        contestId
      )
      .maybeSingle();

  if (error) {
    throw error;
  }

  return !!data;
}

// --------------------------------------------------
// CREATE CONTEST ENTRY
// --------------------------------------------------

export async function createContestEntry(
  userId,
  contestId
) {
  const { data, error } =
    await supabase
      .from("contest_entries")
      .insert({
        user_id: userId,
        contest_id: contestId,
      })
      .select()
      .single();

  if (error) {
    throw error;
  }

  return data;
}

// --------------------------------------------------
// BUILD PICKS FOR DATABASE
// --------------------------------------------------

export function buildPicks({
  games,
  selections,
  contestId,
  userId,
}) {
  return games.map(
    (game) => ({
      user_id: userId,
      contest_id: contestId,
      game_id: game.id,
      selected_team:
        selections[game.id],
    })
  );
}

// --------------------------------------------------
// SAVE PICKS
// --------------------------------------------------

export async function savePicks({
  games,
  selections,
  contestId,
}) {
  if (
    !allGamesHavePicks(
      games,
      selections
    )
  ) {
    throw new Error(
      "Please make a pick for every game."
    );
  }

  const user =
    await getCurrentPickUser();

  // Check whether user already entered
  const alreadyEntered =
    await hasEnteredContest(
      user.id,
      contestId
    );

  if (alreadyEntered) {
    throw new Error(
      "You have already entered this contest."
    );
  }

  // Create contest entry first
  await createContestEntry(
    user.id,
    contestId
  );

  const picksToSave =
    buildPicks({
      games,
      selections,
      contestId,
      userId: user.id,
    });

  const { error } =
    await supabase
      .from("picks")
      .insert(
        picksToSave
      );

  if (error) {
    throw error;
  }

  return picksToSave;
}

// --------------------------------------------------
// SAVE PICKS + RETURN UPDATED PERCENTAGES
// --------------------------------------------------

export async function confirmPicks({
  games,
  selections,
  contestId,
}) {
  await savePicks({
    games,
    selections,
    contestId,
  });

  const percentages =
    await loadPickPercentages(
      games
    );

  return {
    percentages,
  };
}