// src/components/dashboard/CreateQuizButton.jsx
import { Button } from "@/components/ui/button";
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
        Create New Quiz
      </Button>
    </div>
  );
}
