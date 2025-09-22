import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Toaster } from "sonner";
import QuizMetadataForm from "@/components/quiz-builder/QuizMetadataForm";
import QuestionList from "@/components/quiz-builder/QuestionList";
import SaveQuizButton from "@/components/quiz-builder/SaveQuizButton";
import { useLocalStorageDraft } from "@/hooks/useLocalStorageDraft";
import { useQuizzes } from "@/hooks/useQuizzes";

export default function QuizBuilderPage() {
  const navigate = useNavigate();
  const { draft, saveDraft, clearDraft } = useLocalStorageDraft();
  const { createQuiz, isLoading } = useQuizzes();

  // Initialize draft if none exists
  useEffect(() => {
    if (!draft) {
      saveDraft({
        title: "",
        degree: "",
        semester: "",
        subject_code: "",
        subject_name: "",
        time_limit_minutes: 30,
        questions: [],
      });
    }
  }, [draft, saveDraft]);

  const handleSaveQuiz = async () => {
    if (!draft) return;

    // Validate: at least 1 question, each with 4 options + 1 correct
    const isValid = validateQuiz(draft);
    if (!isValid) {
      alert("Please complete all questions and mark correct answers.");
      return;
    }

    const success = await createQuiz(draft);
    if (success) {
      clearDraft();
      navigate("/dashboard", { replace: true });
    }
  };

    if (!draft) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-12 h-12 border-4 border-t-transparent border-primary rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-24">
      <Toaster position="top-center" richColors />
      <header className="fixed top-0 left-0 right-0 z-50 bg-background border-b p-4 flex justify-between items-center shadow-sm">
        <h1 className="text-xl font-bold">Create New Quiz</h1>
        <button
          onClick={() => navigate("/dashboard")}
          className="text-sm text-muted-foreground hover:underline"
        >
          Back to Dashboard
        </button>
      </header>

      <main className="max-w-4xl mx-auto p-4 pt-28">
        <QuizMetadataForm draft={draft} saveDraft={saveDraft} />
        <QuestionList draft={draft} saveDraft={saveDraft} />
        <SaveQuizButton onClick={handleSaveQuiz} isLoading={isLoading} />
      </main>
    </div>
  );
}

// Simple validation helper
function validateQuiz(quiz) {
  if (!quiz.title.trim()) return false;
  if (quiz.questions.length === 0) return false;

  return quiz.questions.every((q) => {
    if (!q.text.trim()) return false;
    if (q.options.length !== 4) return false;
    const correctCount = q.options.filter((opt) => opt.is_correct).length;
    return correctCount === 1;
  });
}