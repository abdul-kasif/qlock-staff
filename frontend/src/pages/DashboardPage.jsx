// src/pages/DashboardPage.jsx
import { Button } from "@/components/ui/button";
import { useAuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function DashboardPage() {
  const { user, logout } = useAuthContext();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/", { replace: true });
  };

  return (
    <div className="p-6 space-y-6">
      <header className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">QLock Staff Portal</h1>
        <Button variant="ghost" onClick={handleLogout}>
          Logout
        </Button>
      </header>

      <div className="bg-card p-4 rounded-lg border">
        <h2 className="text-lg font-semibold">Welcome, {user?.name || "Staff"}</h2>
        <p className="text-sm text-muted-foreground">ID: {user?.staff_personal_id}</p>
        <p className="text-sm text-muted-foreground">Dept: {user?.department}</p>
        <p className="text-sm text-muted-foreground">Email: {user?.email}</p>
      </div>

      <div>DASHBOARD CONTENT COMING NEXT...</div>
    </div>
  );
}