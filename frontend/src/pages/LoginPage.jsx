// src/pages/LoginPage.jsx
import LoginCard from "../components/auth/LoginCard";
import { useNavigate } from "react-router-dom";
import { useAuthContext } from "../context/AuthContext";

export default function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuthContext();

  const handleVerifySuccess = (result) => {
    login(result.token, {
      id: result.staff_id,
      is_new_staff: result.is_new_staff,
      profile_complete: !result.is_new_staff, // if existing, profile_complete = true
    });

    if (result.is_new_staff) {
      navigate("/profile");
    } else {
      navigate("/dashboard");
    }
  };

  return <LoginCard onVerifySuccess={handleVerifySuccess} />;
}