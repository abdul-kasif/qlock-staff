// src/routes/ProtectedRoute.jsx
import { Navigate, useLocation } from "react-router-dom";
import { useAuthContext } from "@/context/AuthContext";

export default function ProtectedRoute({ children, requireProfile = true }) {
  const { user, loading, token } = useAuthContext();
  const location = useLocation();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-12 h-12 border-4 border-t-transparent border-primary rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!token) {
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  // If profile is required but not complete → redirect to /profile
  if (requireProfile && user && !user.profile_complete) {
    return <Navigate to="/profile" state={{ from: location }} replace />;
  }

  return children;
}
