// src/pages/LoginPage.jsx
import { useNavigate } from "react-router-dom";
import { useAuthContext } from "@/context/AuthContext";
import LoginCard from "@/components/auth/LoginCard";
import api from "@/lib/api";
import { useAuth } from "@/hooks/useAuth";


export default function LoginPage() {
  const { loading, login } = useAuthContext(); // Only for loading state
  const { fetchUser } = useAuth();
  const navigate = useNavigate();

  const handleVerifySuccess = async (result) => {
    localStorage.setItem("token", result.token);

    try {
      const userData = await fetchUser(result.token)
      login(result.token, userData)
      if (userData.profile_complete) {
        navigate("/dashboard", { replace: true });
      } else {
        navigate("/profile", { replace: true });
      }
    } catch (error) {
      alert("Login failed. Please try again.");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        Loading...
      </div>
    );
  }

  return <LoginCard onVerifySuccess={handleVerifySuccess} />;
}