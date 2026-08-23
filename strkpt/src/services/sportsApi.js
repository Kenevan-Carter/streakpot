
const API_KEY = "beb3b323-b9e5-461e-b88b-c605c41a2fa9";
const EPL_API_KEY = "c6cdd91b1d6945d18427afb0afcd8d6a";

const BALLDONTLIE_BASE = "https://api.balldontlie.io";
const EPL_API_BASE = "https://api.football-data.org/v4";

const leagueEndpoints = {
  NBA: "/v1/games",
  NFL: "/nfl/v1/games",
  MLB: "/mlb/v1/games",
};

// ----------------------------------------------------
// BALLDONTLIE REQUEST
// ----------------------------------------------------

async function requestBallDontLie(url) {
  const response = await fetch(url, {
    headers: {
      Authorization: API_KEY,
    },
  });

  if (!response.ok) {
    const message = await response.text();

    throw new Error(
      `BALLDONTLIE error ${response.status}: ${message}`
    );
  }

  return response.json();
}

// ----------------------------------------------------
// FOOTBALL-DATA.ORG REQUEST
// ----------------------------------------------------

async function requestEPL(url) {
  console.log("EPL URL:", url);

  try {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "X-Auth-Token": EPL_API_KEY,
      },
    });

    console.log("EPL response:", response);

    if (!response.ok) {
      const message = await response.text();

      console.error(
        "Football-data error:",
        response.status,
        message
      );

      throw new Error(
        `football-data.org error ${response.status}: ${message}`
      );
    }

    return await response.json();
  } catch (error) {
    console.error("EPL FETCH FAILED:", error);
    throw error;
  }
}

// ----------------------------------------------------
// NORMALIZERS
// ----------------------------------------------------

function normalizeMLB(game) {
  return {
    id: `MLB-${game.id}`,
    providerId: game.id,
    sport: "MLB",

    away:
      game.away_team?.display_name ||
      game.away_team_name ||
      "Away Team",

    home:
      game.home_team?.display_name ||
      game.home_team_name ||
      "Home Team",

    startsAt: game.date,

    date: new Date(game.date)
      .toISOString()
      .split("T")[0],

    status: game.status,
  };
}

function normalizeNBA(game) {
  return {
    id: `NBA-${game.id}`,
    providerId: game.id,
    sport: "NBA",

    away:
      game.visitor_team?.full_name ||
      "Away Team",

    home:
      game.home_team?.full_name ||
      "Home Team",

    startsAt: game.datetime,
    date: game.date,

    status: game.status,
  };
}

function normalizeNFL(game) {
  return {
    id: `NFL-${game.id}`,
    providerId: game.id,
    sport: "NFL",

    away:
      game.visitor_team?.full_name ||
      "Away Team",

    home:
      game.home_team?.full_name ||
      "Home Team",

    startsAt: game.date,

    date: new Date(game.date)
      .toISOString()
      .split("T")[0],

    status: game.status,
  };
}

// ----------------------------------------------------
// EPL NORMALIZER
// football-data.org
// ----------------------------------------------------

function normalizeEPL(game) {
  return {
    id: `EPL-${game.id}`,
    providerId: game.id,
    sport: "EPL",

    away:
      game.awayTeam?.name ||
      game.awayTeam?.shortName ||
      "Away Team",

    home:
      game.homeTeam?.name ||
      game.homeTeam?.shortName ||
      "Home Team",

    startsAt: game.utcDate,

    date: new Date(game.utcDate)
      .toISOString()
      .split("T")[0],

    status: game.status,
  };
}

// ----------------------------------------------------
// NORMALIZE BALLDONTLIE SPORTS
// ----------------------------------------------------

function normalizeGames(sport, games) {
  switch (sport) {
    case "NBA":
      return games.map(normalizeNBA);

    case "NFL":
      return games.map(normalizeNFL);

    case "MLB":
      return games.map(normalizeMLB);

    default:
      return [];
  }
}

// ----------------------------------------------------
// DATE HELPERS
// Searches from 7 days away → 21 days away
// ----------------------------------------------------

function formatDate(date) {
  return date.toISOString().split("T")[0];
} 

function getSearchWindow() {
  const today = new Date();

  const startDate = new Date(today);

  const endDate = new Date(today);
  endDate.setDate(today.getDate() + 20);

  return {
    dateFrom: formatDate(startDate),
    dateTo: formatDate(endDate),
  };
}

// ----------------------------------------------------
// EPL
// ----------------------------------------------------

function chunkDateRange(dateFrom, dateTo, maxDays = 9) {
  const chunks = [];
  let start = new Date(dateFrom);
  const end = new Date(dateTo);

  while (start <= end) {
    const chunkEnd = new Date(start);
    chunkEnd.setDate(chunkEnd.getDate() + (maxDays - 1));
    if (chunkEnd > end) chunkEnd.setTime(end.getTime());

    chunks.push({
      dateFrom: formatDate(start),
      dateTo: formatDate(chunkEnd),
    });

    start = new Date(chunkEnd);
    start.setDate(start.getDate() + 1);
  }

  return chunks;
}

async function getEPLGames() {
  const { dateFrom, dateTo } = getSearchWindow();
  const windows = chunkDateRange(dateFrom, dateTo, 10);

  const results = await Promise.all(
    windows.map(async ({ dateFrom, dateTo }) => {
      const params = new URLSearchParams({ dateFrom, dateTo });
      const url = `${EPL_API_BASE}/competitions/PL/matches?${params.toString()}`;
      const result = await requestEPL(url);
      return (result.matches || []).map(normalizeEPL);
    })
  );

  return results.flat();
}

// ----------------------------------------------------
// MAIN FUNCTION
// ----------------------------------------------------

export async function getGamesForDates(sport, dates) {
  // ------------------------------------------------
  // NHL
  // Leave blank for now
  // ------------------------------------------------

  if (sport === "NHL") {
    return [];
  }

  // ------------------------------------------------
  // EPL
  // football-data.org
  // ------------------------------------------------

  if (sport === "EPL") {
    return getEPLGames();
  }

  // ------------------------------------------------
  // NBA / NFL / MLB
  // BALLDONTLIE
  // ------------------------------------------------

  if (!leagueEndpoints[sport]) {
    throw new Error(`Unsupported sport: ${sport}`);
  }

  const params = new URLSearchParams();

  dates.forEach((date) => {
    params.append("dates[]", date);
  });

  params.append("per_page", "100");

  const url =
    `${BALLDONTLIE_BASE}${leagueEndpoints[sport]}?${params.toString()}`;

  const result = await requestBallDontLie(url);

  return normalizeGames(
    sport,
    result.data || []
  );
}