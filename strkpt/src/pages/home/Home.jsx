// src/pages/Home.jsx

import "./Home.css";

import Sidebar from "../../components/sidebar/Sidebar";
import Header from "../../components/header/Header";
import SportSelection from "../../components/sportselection/SportSelection";
import FeaturedContests from "../../components/featuredContests/FeaturedContests";



function Home() {
  const user = {
    name: "Kenevan",
    activecontests: 2,
  };

  return (
    <div className="home-page">
      <Sidebar />

      <main className="home-main">
        <Header
          name={user.name}
          coins={user.activecontests}
        />

        <SportSelection />
        <FeaturedContests />
      </main>
    </div>
  );
}

export default Home;