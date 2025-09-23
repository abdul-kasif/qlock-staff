// src/pages/QuizReportPage.jsx
import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Toaster } from "sonner";
import { useQuizReport } from "@/hooks/useQuizReport";
import QuizMetadataCard from "@/components/quiz-report/QuizMetadataCard";
import SubmissionTable from "@/components/quiz-report/SubmissionTable";
import ExportToExcelButton from "@/components/quiz-report/ExportToExcelButton";

export default function QuizReportPage() {
  const { id } = useParams(); // quiz_id from URL
  const navigate = useNavigate();
  const { report, loading, error } = useQuizReport(id);

  useEffect(() => {
    if (error) {
      navigate("/dashboard");
    }
  }, [error, navigate]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-12 h-12 border-4 border-t-transparent border-primary rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!report) {
    return (
      <div className="pt-20 text-center">
        <p className="text-muted-foreground">No report found.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-8">
      <Toaster position="top-center" richColors />
      <header className="fixed top-0 left-0 right-0 z-50 bg-background border-b p-4 flex justify-between items-center shadow-sm">
        <h1 className="text-xl font-bold">Quiz Report</h1>
        <div className="flex gap-2">
          <ExportToExcelButton report={report} />
          <button
            onClick={() => navigate("/dashboard")}
            className="text-sm text-muted-foreground hover:underline"
          >
            Back to Dashboard
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-4 pt-28">
        <QuizMetadataCard report={report} />
        <SubmissionTable report={report} />
      </main>
    </div>
  );
}