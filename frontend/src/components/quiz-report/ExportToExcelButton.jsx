// src/components/quiz-report/ExportToExcelButton.jsx
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import * as XLSX from "xlsx";

export default function ExportToExcelButton({ report }) {
  const handleExport = () => {
    if (!report || !report.submissions) return;

    // Prepare data for Excel
    const questionIds = [
      ...new Set(
        report.submissions.flatMap((sub) =>
          sub.answers.map((ans) => ans.question_id)
        )
      ),
    ];

    const getQuestionText = (questionId) => {
      const firstSub = report.submissions[0];
      const answer = firstSub.answers.find((a) => a.question_id === questionId);
      return answer ? answer.question_text : `Q${questionId}`;
    };

    // Create header row
    const headers = [
      "Student Name",
      "Started At",
      "Submitted At",
      "Score (%)",
      ...questionIds.map(getQuestionText),
    ];

    // Create data rows
    const data = report.submissions.map((submission) => {
      const row = [
        submission.student_name,
        new Date(submission.started_at).toLocaleString(),
        submission.submitted_at
          ? new Date(submission.submitted_at).toLocaleString()
          : "—",
        submission.score,
      ];

      // Add answers for each question
      questionIds.forEach((qid) => {
        const answer = submission.answers.find(
          (a) => a.question_id === qid
        );
        row.push(
          answer
            ? `${answer.selected_option_text} ${
                answer.correct ? "(✓)" : "(✗)"
              }`
            : "—"
        );
      });

      return row;
    });

    // Combine headers + data
    const worksheetData = [headers, ...data];

    // Create worksheet and workbook
    const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Quiz Report");

    // Generate and download file
    XLSX.writeFile(
      workbook,
      `${report.quiz_title.replace(/\s+/g, "_")}_Report.xlsx`
    );
  };

  return (
    <Button onClick={handleExport} size="sm" className="gap-2">
      <Download className="h-4 w-4" />
      Export to Excel
    </Button>
  );
}