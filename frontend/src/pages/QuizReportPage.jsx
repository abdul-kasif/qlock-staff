// src/pages/QuizReportPage.jsx
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Toaster } from "sonner";
import { useQuizReport } from "@/hooks/useQuizReport";
import QuizMetadataCard from "@/components/quiz-report/QuizMetadataCard";
import SubmissionTable from "@/components/quiz-report/SubmissionTable";
import { Button } from "@/components/ui/button";
import ExportToExcelButton from "@/components/quiz-report/ExportToExcelButton";
import { useQuizzes } from "@/hooks/useQuizzes";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export default function QuizReportPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { report, loading, error, refetch } = useQuizReport(id);
  const { deleteQuiz } = useQuizzes();
  const [isDeletingQuiz, setIsDeletingQuiz] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  useEffect(() => {
    if (error) navigate("/dashboard");
  }, [error, navigate]);

  const handleDeleteQuiz = async () => {
    if (!report) return;
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    setIsDeletingQuiz(true);
    try {
      const success = await deleteQuiz(id);
      if (success) {
        navigate("/dashboard");
      }
    } catch (err) {
      // Error handled in hook
    } finally {
      setIsDeletingQuiz(false);
      setDeleteDialogOpen(false);
    }
  };

  if (loading) {
    return (
      <div className="pt-20 flex items-center justify-center min-h-screen">
        <div className="flex items-center justify-center min-h-screen">
          <div className="w-12 h-12 border-4 border-t-transparent border-primary rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }

  if (!report) return null;

  const canDeleteQuiz =
    report.status === "completed" &&
    report.total_students === 0;

  return (
    <div className="min-h-screen bg-background pb-8">
      <Toaster position="top-center" richColors />

      {/* FIXED HEADER — MOBILE OPTIMIZED */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-background border-b p-4 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          {/* Quiz Title — Truncated on mobile */}
          <h1 className="text-xl font-bold truncate max-w-[200px] sm:max-w-none">
            Quiz Report
          </h1>

          {/* Action Buttons — Wrap on mobile */}
          <div className="flex flex-wrap gap-2 justify-end">
            {canDeleteQuiz ? (
              <Button
                variant="destructive"
                size="sm"
                onClick={handleDeleteQuiz}
                disabled={isDeletingQuiz}
              >
                {isDeletingQuiz ? "Deleting..." : "Delete Quiz"}
              </Button>
            ) : (
              <Button
                variant="destructive"
                size="sm"
                disabled
                title="Quiz must be completed with no submissions to delete"
              >
                Delete Quiz
              </Button>
            )}
            <ExportToExcelButton report={report} />
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate("/dashboard")}
            >
              Back
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-4 pt-28">
        <QuizMetadataCard report={report} />
        <SubmissionTable report={report} onAction={refetch} />
      </main>

      {/* DELETE QUIZ CONFIRMATION DIALOG */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action will permanently delete the quiz &quot;{report.quiz_title}&quot;.
              This cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              disabled={isDeletingQuiz}
              className="bg-destructive text-primary-foreground hover:bg-destructive/90"
            >
              {isDeletingQuiz ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}