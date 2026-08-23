import { supabase } from "../lib/supabase";

export async function savePicks({
  games,
  selections,
  contestId,
}) {
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError) {
    throw userError;
  }

  if (!user) {
    throw new Error("User is not logged in.");
  }

  const picks = games.map((game) => ({
    user_id: user.id,
    contest_id: contestId,
    game_id: game.id,
    selected_team: selections[game.id],
  }));

  const { error } = await supabase
    .from("picks")
    .upsert(picks, {
      onConflict: "user_id,game_id",
    });

  if (error) {
    throw error;
  }

  return picks;
}
