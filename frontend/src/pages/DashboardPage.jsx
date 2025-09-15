// src/pages/DashboardPage.jsx
import { useEffect, useState } from "react";
import { useAuthContext } from "@/context/AuthContext";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import StaffInfoCard from "@/components/dashboard/StaffInfoCard";
import SessionForm from "@/components/dashboard/SessionForm";
import SessionTable from "@/components/dashboard/SessionTable";
import { useCallback } from "react";
import { Toaster } from "sonner";
import { useSessions } from "@/hooks/useSessions";

export default function DashboardPage() {
  const { user, token } = useAuthContext();
  const { fetchCurrentSessions } = useSessions();
  const [activeSessions, setActiveSessions] = useState([]);
  const [historySessions, setHistorySessions] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchSessions = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    try {
      const data = await fetchCurrentSessions();
      setActiveSessions(data.active_sessions || []);
      setHistorySessions(data.history_sessions || []);
      setLoading(false);
    } catch (error) {
      console.error("Failed to fetch sessions:", error);
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchSessions();
  }, [token]);

  return (
    <div className="min-h-screen bg-background pb-8">
      <Toaster position="top-center" richColors />
      <DashboardHeader />
      <main className="max-w-6xl mx-auto p-4 pt-28">
        {" "}
        {/* pt-28 to offset fixed header */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <StaffInfoCard user={user} />
          <SessionForm fetchSessions={fetchSessions} />
        </div>
        <SessionTable
          activeSessions={activeSessions}
          historySessions={historySessions}
          fetchSessions={fetchSessions}
        />
      </main>
    </div>
  );
}
