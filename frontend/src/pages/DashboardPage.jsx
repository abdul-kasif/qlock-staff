import { useEffect, useState, useCallback } from "react";
import { useAuthContext } from "@/context/AuthContext";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import StaffInfoCard from "@/components/dashboard/StaffInfoCard";
import CreateQuizButton from "@/components/dashboard/CreateQuizButton";
import QuizTable from "@/components/dashboard/QuizTable";
import { Toaster } from "sonner";
import { useQuizzes } from "@/hooks/useQuizzes";


export default function DashboardPage() {
  const { user, token } = useAuthContext();
  const [activeQuizzes, setActiveQuizzes] = useState([]);
  const [pausedQuizzes, setPausedQuizzes] = useState([]);
  const [completedQuizzes, setCompletedQuizzes] = useState([]);
  const { fetchAllQuizzes } = useQuizzes();
  const [ loading , setLoading ] = useState();

  const fetchQuizzes = useCallback(async () => {
    if (!token) return;
    setLoading(true)
    try {
      const data = await fetchAllQuizzes();
      setActiveQuizzes(data.active_quizzes || []);
      setPausedQuizzes(data.paused_quizzes || []);
      setCompletedQuizzes(data.completed_quizzes|| []);
      setLoading(false)
    } catch (error) {
      console.error("Failed to fetch sessions:", error);
      setLoading(false)
    }
  }, [token]);

  useEffect(() => {
    fetchQuizzes();
  }, [token]);

   if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-12 h-12 border-4 border-t-transparent border-primary rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-8">
      <Toaster position="top-center" richColors />
      <DashboardHeader />
      <main className="max-w-6xl mx-auto p-4 pt-28">
        <StaffInfoCard user={user} />
        <CreateQuizButton />
        <QuizTable
          activeQuizzes={activeQuizzes}
          pausedQuizzes={pausedQuizzes}
          completedQuizzes={completedQuizzes}
          onQuizAction={fetchQuizzes} // Real-time update after end quiz
        />
      </main>
    </div>
  );
}