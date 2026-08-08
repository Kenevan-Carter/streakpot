// src/pages/Home.jsx

import "./Home.css";

import Sidebar from "../components/sidebar/Sidebar";
import Header from "../components/header/Header";
import SportSelection from "../components/sportselection/SportSelection";
import Stats from "../components/stats/Stats";

function Home() {
  const user = {
    name: "Kenevan",
    coins: 12450,
    streak: 7,
  };

  return (
    <div className="home-page">
      <Sidebar />

      <main className="home-main">
        <Header
          name={user.name}
          coins={user.coins}
          streak={user.streak}
        />

        <SportSelection />

        <section className="home-middle-row">
          <div className="daily-challenge">
            <p className="section-label">DAILY CHALLENGE</p>

            <h2>Build Your Streak</h2>

            <p>
              Win your next pick to keep your streak alive and earn bonus coins.
            </p>

            <div className="challenge-progress">
              <div className="challenge-progress-fill"></div>
            </div>

            <div className="challenge-footer">
              <span>{user.streak} Day Streak</span>
              <span>+500 Coins</span>
            </div>
          </div>

          <Stats
            coins={user.coins}
            streak={user.streak}
          />
        </section>
      </main>
    </div>
  );
}

export default Home;