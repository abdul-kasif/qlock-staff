import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Trash2, Plus } from "lucide-react";

export default function QuestionEditor({ 
  question, 
  index, 
  onUpdate, 
  onDelete, 
  onAddQuestion, 
  isLast 
}) {
  const updateQuestionText = (text) => {
    onUpdate({
      ...question,
      text,
    });
  };

  const updateOption = (optionIndex, field, value) => {
    const newOptions = [...question.options];
    newOptions[optionIndex] = {
      ...newOptions[optionIndex],
      [field]: value,
    };
    onUpdate({
      ...question,
      options: newOptions,
    });
  };

  const markCorrect = (optionIndex) => {
    const newOptions = question.options.map((opt, i) => ({
      ...opt,
      is_correct: i === optionIndex,
    }));
    onUpdate({
      ...question,
      options: newOptions,
    });
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Question {index + 1}</CardTitle>
        <Button
          variant="ghost"
          size="icon"
          onClick={onDelete}
          className="text-destructive hover:text-destructive hover:bg-destructive/10"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <Label>Question Text</Label>
            <Input
              value={question.text}
              onChange={(e) => updateQuestionText(e.target.value)}
              placeholder="e.g. What is SQL?"
              className="mt-1"
            />
          </div>

          <div className="space-y-3">
            <Label>Options (Mark one as correct)</Label>
            {question.options.map((option, optIndex) => (
              <div key={optIndex} className="flex items-center gap-3">
                <span className="font-medium w-8">
                  {String.fromCharCode(65 + optIndex)}.
                </span>
                <Input
                  value={option.text}
                  onChange={(e) =>
                    updateOption(optIndex, "text", e.target.value)
                  }
                  placeholder={`Option ${String.fromCharCode(65 + optIndex)}`}
                  className="flex-1"
                />
                <Button
                  type="button"
                  variant={option.is_correct ? "default" : "outline"}
                  size="sm"
                  onClick={() => markCorrect(optIndex)}
                  className="whitespace-nowrap"
                >
                  {option.is_correct ? "Correct" : "Mark Correct"}
                </Button>
              </div>
            ))}
          </div>

          {isLast && (
            <div className="flex justify-center mt-6">
              <button
                onClick={onAddQuestion}
                className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary text-primary-foreground shadow-md hover:bg-primary/90 transition-all duration-200 hover:animate-gentle-bounce"
                aria-label="Add next question"
              >
                <Plus className="h-6 w-6" />
              </button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}