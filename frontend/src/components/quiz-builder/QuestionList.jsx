// src/components/quiz-builder/QuestionList.jsx
import { Plus, Upload } from "lucide-react";
import QuestionEditor from "./QuestionEditor";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import * as XLSX from "xlsx";

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

  // Handle Excel file upload
  const handleFileUpload = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: "array" });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

        if (jsonData.length < 2) {
          toast.error("Excel must contain at least one question row.");
          return;
        }

        // Remove header row if exists (optional)
        const rows = Array.isArray(jsonData[0]) && jsonData[0].length === 7 && 
                     typeof jsonData[0][0] === 'string' && 
                     jsonData[0][0].toLowerCase().includes('question') 
          ? jsonData.slice(1) 
          : jsonData;

        // Validate and parse questions
        const parsedQuestions = [];
        for (let i = 1; i < rows.length; i++) {
          const row = rows[i];
          if (row.length !== 7) {
            toast.error(`Row ${i + 1}: Must have exactly 7 columns.`);
            return;
          }

          const [, questionText, choiceA, choiceB, choiceC, choiceD, correctChoice] = row;

          // Validate non-empty
          if (!questionText || !choiceA || !choiceB || !choiceC || !choiceD) {
            toast.error(`Row ${i + 1}: All fields must be filled.`);
            return;
          }

          // Validate correct choice
          const correctMap = { 'A': 0, 'B': 1, 'C': 2, 'D': 3 };
          const correctIndex = correctMap[correctChoice?.toString().trim().toUpperCase()];
          if (correctIndex === undefined) {
            toast.error(`Row ${i + 1}: Correct choice must be A, B, C, or D.`);
            return;
          }

          const options = [
            { text: choiceA, is_correct: correctIndex === 0, order: 1 },
            { text: choiceB, is_correct: correctIndex === 1, order: 2 },
            { text: choiceC, is_correct: correctIndex === 2, order: 3 },
            { text: choiceD, is_correct: correctIndex === 3, order: 4 },
          ];

          parsedQuestions.push({
            text: questionText,
            options,
          });
        }

        // Add to draft
        saveDraft({
          ...draft,
          questions: [...draft.questions, ...parsedQuestions],
        });

        toast.success(`Successfully imported ${parsedQuestions.length} questions!`);
      } catch (error) {
        console.error("Excel parsing error:", error);
        toast.error("Failed to parse Excel file. Please check the format.");
      }
    };

    reader.readAsArrayBuffer(file);
  };

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>Questions</CardTitle>
      </CardHeader>
      <CardContent>
        {draft.questions.length === 0 ? (
          <div className="text-center py-8 space-y-6">
            <p className="text-muted-foreground">
              No questions yet. Add manually or upload from Excel.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              {/* Manual Add */}
              <button
                onClick={addQuestion}
                className="inline-flex flex-col items-center justify-center w-24 h-24 rounded-xl bg-primary/10 text-primary hover:bg-primary/20 transition-colors p-3"
                aria-label="Add question manually"
              >
                <Plus className="h-6 w-6 mb-1" />
                <span className="text-xs font-medium">Add Question</span>
              </button>

              {/* Excel Upload */}
              <label
                htmlFor="excel-upload"
                className="inline-flex flex-col items-center justify-center w-24 h-24 rounded-xl bg-secondary text-secondary-foreground hover:bg-secondary/80 cursor-pointer transition-colors p-3"
              >
                <Upload className="h-6 w-6 mb-1" />
                <span className="text-xs font-medium">Upload Excel</span>
                <input
                  id="excel-upload"
                  type="file"
                  accept=".xlsx,.xls"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>
            </div>

            {/* Format Guide */}
            <div className="text-xs text-muted-foreground max-w-md mx-auto">
              <p className="font-medium mb-1">Excel Format:</p>
              <p>Columns: Q.No | Question | Choice A | Choice B | Choice C | Choice D | Correct (A/B/C/D)</p>
            </div>
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
                onAddQuestion={addQuestion}
                isLast={index === draft.questions.length - 1}
              />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}