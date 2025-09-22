// src/components/dashboard/CreateQuizButton.jsx
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function CreateQuizButton() {
  const navigate = useNavigate();

  const handleCreateQuiz = () => {
    navigate("/quiz-builder");
  };

  return (
    <div className="mb-8">
      <Button
        onClick={handleCreateQuiz}
        className="w-full py-6 text-lg font-semibold bg-primary text-primary-foreground hover:bg-primary/90 transition-all duration-200 transform hover:scale-[1.02] shadow-md"
      >
        <Plus className="mr-2 h-5 w-5" />
        Create New Quiz
      </Button>
    </div>
  );
}