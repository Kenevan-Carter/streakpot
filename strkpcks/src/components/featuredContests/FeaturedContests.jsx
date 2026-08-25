import "./FeaturedContests.css";

function FeaturedContests() {
  const contests = [
    {
      id: 1,
      sport: "NBA",
      title: "NBA Weekend",
      games: 13,
      entryFee: 3,
      pot: 5023454,
      close: "16:10:02"
    },
    {
      id: 2,
      sport: "NFL",
      title: "NFL Week 1",
      games: 12,
      entryFee: 5,
      pot: 127453,
      close: "24:40:29"
    },
    {
      id: 3,
      sport: "EPL",
      title: "Gameweek 2",
      games: 10,
      entryFee: 1,
      pot:468274,
      close: "48:16:52"
    },
  ];

  return (
    <section className="featured-contests">
      <div className="featured-contests-header">
        <div>
          <p className="featured-contests-label">
            FEATURED 
          </p>

          <h2>View This Weeks Featured Contests</h2>
        </div>
      </div>

      <div className="featured-contests-grid">
        {contests.map((contest) => (
          <div
            className="featured-contest-card"
            key={contest.id}
          >
            <div className="featured-contest-top">
              <span className="featured-contest-sport">
                {contest.sport}
              </span>

              <span className="featured-badge">
                {contest.close}
              </span>
            </div>

            <h3>{contest.title}</h3>

            <div className="featured-contest-info">
              <div>
                <span className="contest-info-label">
                  GAMES
                </span>

                <span className="contest-info-value">
                  {contest.games}
                </span>
              </div>

              <div>
                <span className="contest-info-label">
                  ENTRY
                </span>

                <span className="contest-info-value">
                  ${contest.entryFee}
                </span>
              </div>

              <div>
                <span className="contest-info-label">
                  Current Pot
                </span>

                <span className="contest-info-value">
                  ${contest.pot}
                </span>
              </div>
            </div>

            <button className="view-contest-button">
              View Contest
            </button>
          </div>
        ))}
      </div>
    </section>
  );
}

export default FeaturedContests;