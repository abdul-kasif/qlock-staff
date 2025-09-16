// src/components/dashboard/DashboardHeader.jsx
import { Button } from "@/components/ui/button";
import { useAuthContext } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function DashboardHeader() {
  const { logout } = useAuthContext();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/", { replace: true });
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background border-b p-4 flex justify-between items-center shadow-sm">
      <h1 className="text-xl font-bold">QLock Staff Portal</h1>
      <Button variant="ghost" onClick={handleLogout}>
        Logout
      </Button>
    </header>
  );
}
