// src/routes/AppRouter.jsx
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "@/pages/LoginPage";
import ProfilePage from "@/pages/ProfilePage";
import DashboardPage from "@/pages/DashboardPage";
import ProtectedRoute from "./ProtectedRoute";
import AlreadyLoggedInRedirect from "./AlreadyLoggedInRedirect"; // 👈 new import

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        {/* 👇 Redirect away if already logged in + profile complete */}
        <Route
          path="/"
          element={
            <AlreadyLoggedInRedirect>
              <LoginPage />
            </AlreadyLoggedInRedirect>
          }
        />

        {/* 👇 Same for /profile — if profile_complete, redirect to dashboard */}
        <Route
          path="/profile"
          element={
            <AlreadyLoggedInRedirect>
              <ProtectedRoute requireProfile={false}>
                <ProfilePage />
              </ProtectedRoute>
            </AlreadyLoggedInRedirect>
          }
        />

        {/* 👇 Only accessible if logged in + profile complete */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute requireProfile={true}>
              <DashboardPage />
            </ProtectedRoute>
          }
        />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}