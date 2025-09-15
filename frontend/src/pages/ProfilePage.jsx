// src/pages/ProfilePage.jsx
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthContext } from "@/context/AuthContext";
import { Toaster } from "sonner";
import ProfileForm from "@/components/profile/ProfileForm";

export default function ProfilePage() {
  const { user, token, loading } = useAuthContext();
  const navigate = useNavigate();

  // 👇 Redirect if profile is already complete
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-12 h-12 border-4 border-t-transparent border-primary rounded-full animate-spin"></div>
      </div>
    );
  }
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-background">
      <Toaster position="top-center" richColors />
      <ProfileForm />
    </div>
  );
}
