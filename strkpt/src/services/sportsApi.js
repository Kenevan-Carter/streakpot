const API_KEY = 'beb3b323-b9e5-461e-b88b-c605c41a2fa9';

const API_BASE = "https://api.balldontlie.io";

const leagueEndpoints = {
    NBA: "/v1/games",
    NFL: "/nfl/v1/games",
    MLB: "/mlb/v1/games",
    NHL: "/nhl/v1/games",
    EPL: "/epl/v2/matches",
  };

async function request(url) {
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

    away: game.visitor_team.full_name,
    home: game.home_team.full_name,

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

    away: game.visitor_team.full_name,
    home: game.home_team.full_name,

    startsAt: game.date,

    date: new Date(game.date)
      .toISOString()
      .split("T")[0],

    status: game.status,
  };
}

function normalizeNHL(game) {
  return {
    id: `NHL-${game.id}`,
    providerId: game.id,
    sport: "NHL",

    away: game.away_team.full_name,
    home: game.home_team.full_name,

    startsAt: game.start_time_utc,
    date: game.game_date,

    status: game.game_state,
  };
}

function normalizeEPL(game) {
  return {
    id: `EPL-${game.id}`,
    providerId: game.id,
    sport: "EPL",

    /*
      EPL returns team IDs plus names such as:
      "Newcastle United at Arsenal".

      We'll parse the name for display.
    */
    away: game.name?.split(" at ")[0] || "Away Team",
    home: game.name?.split(" at ")[1] || "Home Team",

    startsAt: game.date,

    date: new Date(game.date)
      .toISOString()
      .split("T")[0],

    status: game.status,
  };
}

function normalizeGames(sport, games) {
    switch (sport) {
      case "NBA":
        return games.map(normalizeNBA);
  
      case "NFL":
        return games.map(normalizeNFL);
  
      case "MLB":
        return games.map(normalizeMLB);
  
      case "NHL":
        return games.map(normalizeNHL);
  
      case "EPL":
        return games.map(normalizeEPL);
  
      default:
        return [];
    }
  }

export async function getGamesForDates(sport, dates) {
  if (!leagueEndpoints[sport]) {
    throw new Error(`Unsupported sport: ${sport}`);
  }

  const params = new URLSearchParams();

  dates.forEach((date) => {
    params.append("dates[]", date);
  });

  params.append("per_page", "100");

  const url =
    `${API_BASE}${leagueEndpoints[sport]}?${params.toString()}`;

  const result = await request(url);

  return normalizeGames(sport, result.data || []);
}