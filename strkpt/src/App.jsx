import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./components/login/Login";
import CreateAccount from "./components/createAccount/CreateAccount";
import Home from "./pages/home/Home";
import NFL from "./pages/sports/nfl/NFL";
import NBA from "./pages/sports/nba/NBA";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/create-account" element={<CreateAccount />} />
        <Route path="/home" element={<Home />} />
        <Route path="/sports/nfl" element={<NFL />} />
        <Route path="/sports/nba" element={<NBA />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;