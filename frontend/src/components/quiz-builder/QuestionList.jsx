// src/components/quiz-builder/QuestionList.jsx
import { Plus, Upload, Download } from "lucide-react";
import QuestionEditor from "./QuestionEditor";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import * as XLSX from "xlsx";
import React from "react";

// Generate and download Excel template
const downloadTemplate = () => {
  const templateData = [
    [
      "Q.No",
      "Question",
      "Choice A",
      "Choice B",
      "Choice C",
      "Choice D",
      "Correct",
    ],
    [
      1,
      "What is SQL?",
      "Structured Query Language",
      "Simple Query Language",
      "System Query Logic",
      "Standard Question Logic",
      "A",
    ],
    [2, "Which is NoSQL?", "MySQL", "PostgreSQL", "MongoDB", "SQLite", "C"],
  ];

  const worksheet = XLSX.utils.aoa_to_sheet(templateData);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Quiz_Template");
  XLSX.writeFile(workbook, "CampQ_Quiz_Template.xlsx");
};

export default function QuestionList({ draft, saveDraft }) {
  const fileInputRef = React.useRef(null);

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

        if (jsonData.length < 1) {
          toast.error("Excel file is empty.");
          return;
        }

        // Auto-detect and skip header if present
        const hasHeader =
          jsonData[0].length === 7 &&
          typeof jsonData[0][0] === "string" &&
          jsonData[0][0].toString().toLowerCase().includes("q.no");
        const rows = hasHeader ? jsonData.slice(1) : jsonData;

        if (rows.length === 0) {
          toast.error("No question rows found in Excel file.");
          return;
        }

        const parsedQuestions = [];
        for (let i = 0; i < rows.length; i++) {
          const row = rows[i];
          if (row.length !== 7) {
            toast.error(
              `Row ${i + 1 + (hasHeader ? 1 : 0)}: Must have exactly 7 columns.`
            );
            return;
          }

          const [
            ,
            questionText,
            choiceA,
            choiceB,
            choiceC,
            choiceD,
            correctChoice,
          ] = row;

          if (!questionText || !choiceA || !choiceB || !choiceC || !choiceD) {
            toast.error(
              `Row ${i + 1 + (hasHeader ? 1 : 0)}: All fields must be filled.`
            );
            return;
          }

          const correctMap = { A: 0, B: 1, C: 2, D: 3 };
          const correctIndex =
            correctMap[correctChoice?.toString().trim().toUpperCase()];
          if (correctIndex === undefined) {
            toast.error(
              `Row ${
                i + 1 + (hasHeader ? 1 : 0)
              }: Correct choice must be A, B, C, or D.`
            );
            return;
          }

          parsedQuestions.push({
            text: questionText.trim(),
            options: [
              {
                text: choiceA.trim(),
                is_correct: correctIndex === 0,
                order: 1,
              },
              {
                text: choiceB.trim(),
                is_correct: correctIndex === 1,
                order: 2,
              },
              {
                text: choiceC.trim(),
                is_correct: correctIndex === 2,
                order: 3,
              },
              {
                text: choiceD.trim(),
                is_correct: correctIndex === 3,
                order: 4,
              },
            ],
          });
        }

        saveDraft({
          ...draft,
          questions: [...draft.questions, ...parsedQuestions],
        });

        toast.success(
          `Successfully imported ${parsedQuestions.length} questions!`
        );
      } catch (error) {
        console.error("Excel parsing error:", error);
        toast.error(
          "Failed to parse Excel file. Please use the provided template."
        );
      }
    };

    reader.readAsArrayBuffer(file);
  };

  return (
    <Card className="mb-6">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Questions</CardTitle>
        <Button
          variant="outline"
          size="sm"
          onClick={downloadTemplate}
          className="gap-2 h-8"
        >
          <Download className="h-3 w-3" />
          <span className="text-xs">Template</span>
        </Button>
      </CardHeader>
      <CardContent>
        {draft.questions.length === 0 ? (
          <div className="py-10 text-center">
            <div className="max-w-md mx-auto space-y-6">
              <p className="text-muted-foreground">
                Start by adding questions manually or upload a batch via Excel.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  variant="outline"
                  size="lg"
                  onClick={addQuestion}
                  className="flex flex-col items-center justify-center gap-2 w-32 h-24"
                >
                  <Plus className="h-5 w-5" />
                  <span>Add Question</span>
                </Button>

                {/* 🔹 Replaced label+input with programmatic click */}
                <Button
                  variant="outline"
                  size="lg"
                  className="flex flex-col items-center justify-center gap-2 w-32 h-24"
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Upload className="h-5 w-5" />
                  <span>Upload Excel</span>
                </Button>
                <input
                  ref={fileInputRef}
                  id="excel-upload"
                  type="file"
                  accept=".xlsx,.xls"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </div>

              <p className="text-xs text-muted-foreground mt-4">
                Format: Q.No | Question | Choice A–D | Correct (A/B/C/D)
              </p>
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
