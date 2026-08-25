import {
  BrowserRouter,
  Routes,
  Route,
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

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* PUBLIC ROUTES */}

        <Route
          path="/"
          element={<Login />}
        />

        <Route
          path="/create-account"
          element={<CreateAccount />}
        />


        {/* PROTECTED ROUTES */}

        <Route
          path="/home"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />

        <Route
          path="/mybets"
          element={
            <ProtectedRoute>
              <MyBets />
            </ProtectedRoute>
          }
        />
                <Route
          path="/leagues"
          element={
            <ProtectedRoute>
              <Leagues />
            </ProtectedRoute>
          }
        />

        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />

        {/* ONE ROUTE FOR ALL SPORTS */}

        <Route
          path="/sports/:sport"
          element={
            <ProtectedRoute>
              <Sports />
            </ProtectedRoute>
          }
        />


        {/* ADMIN ROUTES */}

        <Route path="/admin" element={<Admin />} />

        <Route
          path="/admin/usertable"
          element={
            <AdminRoute>
              <UserTable />
            </AdminRoute>
          }
        />

        <Route
          path="/admin/createcontest"
          element={
            <AdminRoute>
              <CreateContest />
            </AdminRoute>
          }
        />

      </Routes>
    </BrowserRouter>
  );
}

export default App;