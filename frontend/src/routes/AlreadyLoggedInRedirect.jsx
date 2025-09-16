// src/routes/AlreadyLoggedInRedirect.jsx
import { Navigate } from "react-router-dom";
import { useAuthContext } from "@/context/AuthContext";

export default function AlreadyLoggedInRedirect({ children }) {
  const { user, token, loading } = useAuthContext();

  // While loading — show nothing
  if (loading) {
    return null;
  }

  // If logged in AND profile complete → redirect to dashboard
  if (token && user?.profile_complete) {
    return <Navigate to="/dashboard" replace />;
  }

  // Otherwise, render the intended page (Login or Profile)
  return children;
}