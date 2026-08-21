// src/pages/Home.jsx

import "./Home.css";

import Sidebar from "../../components/sidebar/Sidebar";
import Header from "../../components/header/Header";
import SportSelection from "../../components/sportselection/SportSelection";
import Stats from "../../components/stats/Stats";
import FeaturedContests from "../../components/featuredcontests/FeaturedContests";



function Home() {
  const user = {
    name: "Kenevan",
    coins: 12450,
    streak: 8,
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
        <FeaturedContests />
      </main>
    </div>
  );
}

export default Home;