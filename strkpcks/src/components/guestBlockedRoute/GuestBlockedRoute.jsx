import { Navigate } from "react-router-dom";

function GuestBlockedRoute({ children }) {
  const isGuest =
    localStorage.getItem("isGuest") === "true";

  if (isGuest) {
    return <Navigate to="/home" replace />;
  }

  return children;
}

export default GuestBlockedRoute;