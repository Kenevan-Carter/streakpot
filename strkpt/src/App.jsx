import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./components/login/Login";
import CreateAccount from "./components/createAccount/CreateAccount";
import Home from "./pages/Home";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/create-account" element={<CreateAccount />} />
        <Route path="/home" element={<Home />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;