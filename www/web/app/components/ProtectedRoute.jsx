import { Navigate, useLocation } from "react-router";
import { useAuth } from "../context/AuthContext";

export function ProtectedRoute({ children }) {
  const { token } = useAuth();
  const location = useLocation();
  if (!token) {
    return <Navigate to={`/login?next=${encodeURIComponent(location.pathname + location.search)}`} replace />;
  }
  return children;
}
