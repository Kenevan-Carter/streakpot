import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";

import Login from "./components/login/Login";
import CreateAccount from "./components/createAccount/CreateAccount";

import Home from "./pages/home/Home";
import NBA from "./pages/sports/nba/NBA";
import NFL from "./pages/sports/nfl/NFL";

import ProtectedRoute from "./components/protectedroute/ProtectedRoute";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* Public routes */}

        <Route
          path="/"
          element={<Login />}
        />

        <Route
          path="/create-account"
          element={<CreateAccount />}
        />


        {/* Protected routes */}

        <Route
          path="/home"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />

        <Route
          path="/games/nba"
          element={
            <ProtectedRoute>
              <NBA />
            </ProtectedRoute>
          }
        />

        <Route
          path="/sports/nfl"
          element={
            <ProtectedRoute>
              <NFL />
            </ProtectedRoute>
          }
        />

      </Routes>
    </BrowserRouter>
  );
}

export default App;