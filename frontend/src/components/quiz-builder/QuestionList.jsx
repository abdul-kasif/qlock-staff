import { Plus } from "lucide-react";
import QuestionEditor from "./QuestionEditor";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function QuestionList({ draft, saveDraft }) {
  const addQuestion = () => {
    const newQuestion = {
      text: "",
      options: [
        { text: "", is_correct: false, order: 1 },
        { text: "", is_correct: false, order: 2 },
        { text: "", is_correct: false, order: 3 },
        { text: "", is_correct: false, order: 4 },
      ],
    };

    saveDraft({
      ...draft,
      questions: [...draft.questions, newQuestion],
    });
  };

  const updateQuestion = (index, updatedQuestion) => {
    const newQuestions = [...draft.questions];
    newQuestions[index] = updatedQuestion;
    saveDraft({
      ...draft,
      questions: newQuestions,
    });
  };

  const deleteQuestion = (index) => {
    const newQuestions = draft.questions.filter((_, i) => i !== index);
    saveDraft({
      ...draft,
      questions: newQuestions,
    });
  };

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>Questions</CardTitle>
      </CardHeader>
      <CardContent>
        {draft.questions.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-muted-foreground mb-4">
              No questions yet. Add your first question below.
            </p>
            <button
              onClick={addQuestion}
              className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary text-primary-foreground shadow-md hover:bg-primary/90 transition-all duration-200"
              aria-label="Add first question"
            >
              <Plus className="h-6 w-6" />
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {draft.questions.map((question, index) => (
              <QuestionEditor
                key={index}
                question={question}
                index={index}
                onUpdate={(updated) => updateQuestion(index, updated)}
                onDelete={() => deleteQuestion(index)}
                onAddQuestion={addQuestion} // Pass add function down
                isLast={index === draft.questions.length - 1} // For conditional rendering
              />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}