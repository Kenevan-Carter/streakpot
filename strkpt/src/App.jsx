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
import Admin from "./pages/admin/Admin";
import AdminRoute from "./components/adminroute/AdminRoute";
import UserTable from "./pages/admin/usertable/UserTable";
import CreateTable from "./pages/admin/createcontest/CreateContest";

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
          path="/sports/nba"
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
        
          {/* Admin routes */}
          <Route
              path="/admin"
              element={
                <AdminRoute>
                  <Admin />
          </AdminRoute>
  }
            />
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
              <CreateTable />
        </AdminRoute>
        }
/>
      </Routes>
    </BrowserRouter>
    
  );
}

export default App;