import "./FeaturedContests.css";

function FeaturedContests() {
  const contests = [
    {
      id: 1,
      sport: "NBA",
      title: "Friday Night Picks",
      games: 8,
      entryFee: 3,
    },
    {
      id: 2,
      sport: "NFL",
      title: "Week 1 Challenge",
      games: 12,
      entryFee: 5,
    },
    {
      id: 3,
      sport: "MLB",
      title: "Daily Picks",
      games: 6,
      entryFee: 3,
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
                FEATURED
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