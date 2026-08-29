import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import Login from "./components/login/Login";
import CreateAccount from "./components/createAccount/CreateAccount";

import Home from "./pages/home/Home";
import Sports from "./pages/sports/Sports";

import Admin from "./pages/admin/Admin";
import UserTable from "./pages/admin/usertable/UserTable";
import CreateContest from "./pages/admin/createcontest/CreateContest";

import MyBets from "./components/sidebar/mybets/MyBets";
import Leagues from "./components/sidebar/leagues/Leagues";
import Profile from "./components/sidebar/profile/Profile";

import AdminRoute from "./components/adminroute/AdminRoute";
import ProtectedRoute from "./components/protectedroute/ProtectedRoute";


// ==========================================================
// ROUTE THAT ALLOWS:
// - LOGGED IN USERS
// - GUEST USERS
// ==========================================================

function GuestAccessibleRoute({ children }) {
  const isGuest =
    localStorage.getItem("isGuest") === "true";

  // Guests can access this page
  if (isGuest) {
    return children;
  }

  // Normal users still need authentication
  return (
    <ProtectedRoute>
      {children}
    </ProtectedRoute>
  );
}


// ==========================================================
// ROUTE THAT BLOCKS GUESTS
// ==========================================================

function GuestBlockedRoute({ children }) {
  const isGuest =
    localStorage.getItem("isGuest") === "true";

  if (isGuest) {
    return (
      <Navigate
        to="/home"
        replace
      />
    );
  }

  return children;
}


// ==========================================================
// APP
// ==========================================================

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* ==================================================
            PUBLIC ROUTES
        ================================================== */}

        <Route
          path="/"
          element={
            <Login />
          }
        />

        <Route
          path="/create-account"
          element={
            <CreateAccount />
          }
        />


        {/* ==================================================
            HOME
            NORMAL USERS + GUESTS
        ================================================== */}

        <Route
          path="/home"
          element={
            <GuestAccessibleRoute>
              <Home />
            </GuestAccessibleRoute>
          }
        />


        {/* ==================================================
            MY BETS
            NORMAL USERS + GUESTS
        ================================================== */}

        <Route
          path="/mybets"
          element={
            <GuestAccessibleRoute>
              <MyBets />
            </GuestAccessibleRoute>
          }
        />


        {/* ==================================================
            LEAGUES
            NORMAL USERS + GUESTS
        ================================================== */}

        <Route
          path="/leagues"
          element={
            <GuestAccessibleRoute>
              <Leagues />
            </GuestAccessibleRoute>
          }
        />


        {/* ==================================================
            SPORTS
            NORMAL USERS + GUESTS
        ================================================== */}

        <Route
          path="/sports/:sport"
          element={
            <GuestAccessibleRoute>
              <Sports />
            </GuestAccessibleRoute>
          }
        />


        {/* ==================================================
            PROFILE
            LOGGED-IN USERS ONLY
        ================================================== */}

        <Route
          path="/profile"
          element={
            <GuestBlockedRoute>
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            </GuestBlockedRoute>
          }
        />


        {/* ==================================================
            ADMIN HOME
            ADMIN ONLY
            GUESTS BLOCKED
        ================================================== */}

        <Route
          path="/admin"
          element={
            <GuestBlockedRoute>
              <AdminRoute>
                <Admin />
              </AdminRoute>
            </GuestBlockedRoute>
          }
        />


        {/* ==================================================
            ADMIN USER TABLE
        ================================================== */}

        <Route
          path="/admin/usertable"
          element={
            <GuestBlockedRoute>
              <AdminRoute>
                <UserTable />
              </AdminRoute>
            </GuestBlockedRoute>
          }
        />


        {/* ==================================================
            ADMIN CREATE CONTEST
        ================================================== */}

        <Route
          path="/admin/createcontest"
          element={
            <GuestBlockedRoute>
              <AdminRoute>
                <CreateContest />
              </AdminRoute>
            </GuestBlockedRoute>
          }
        />


        {/* ==================================================
            UNKNOWN ROUTES
        ================================================== */}

        <Route
          path="*"
          element={
            <Navigate
              to="/"
              replace
            />
          }
        />

      </Routes>
    </BrowserRouter>
  );
}

export default App;