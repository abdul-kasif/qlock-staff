// src/pages/LoginPage.jsx
import { useNavigate } from "react-router-dom";
import { useAuthContext } from "@/context/AuthContext";
import LoginCard from "@/components/auth/LoginCard";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";


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
      toast.error("Login failed. Please try again.");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-12 h-12 border-4 border-t-transparent border-primary rounded-full animate-spin"></div>
      </div>
    );
  }

  return <LoginCard onVerifySuccess={handleVerifySuccess} />;
}