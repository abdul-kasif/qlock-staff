// src/pages/ProfilePage.jsx
import { useAuthContext } from "@/context/AuthContext";
import { Toaster } from "sonner";
import ProfileForm from "@/components/profile/ProfileForm";

export default function ProfilePage() {
  const { loading } = useAuthContext();
  
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
