import "./Home.css";

import Sidebar from "../components/sidebar/Sidebar";
import Header from "../components/header/Header";
import SportSelection from "../components/sportselection/SportSelection";
import Stats from "../components/stats/Stats";
import FeaturedGames from "../components/games/FeaturedGames";

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

        <TopBar
          name={user.name}
          coins={user.coins}
          streak={user.streak}
        />

        <SportSelection />

        <section className="home-middle-row">
          <DailyChallenge />
          <StatsPanel />
        </section>

        <FeaturedGames />

      </main>

    </div>
  );
}

export default Home;