// src/components/quiz-report/ExportToExcelButton.jsx
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import * as XLSX from "xlsx";

export default function ExportToExcelButton({ report }) {
  const handleExport = () => {
    if (!report || !report.submissions) return;

    // Use report.questions for correct order and completeness
    const questionList = report.questions
      ? [...report.questions].sort((a, b) => a.order - b.order)
      : [];

    const questionIds = questionList.map(q => q.id);

    // Create header row
    const headers = [
      "Student Name",
      "Started At",
      "Submitted At",
      "Score (%)",
      ...questionList.map(q => q.text),
    ];

    // Create data rows
    const data = report.submissions.map((submission) => {
      const row = [
        submission.student_name,
        new Date(submission.started_at).toLocaleString("en-GB"),
        submission.submitted_at
          ? new Date(submission.submitted_at).toLocaleString("en-GB")
          : "—",
        `${submission.score}%`,
      ];

      // Add answers for each question in correct order
      questionIds.forEach((qid) => {
        const answer = submission.answers.find(a => a.question_id === qid);
        if (!answer) {
          row.push("—");
          return;
        }

        const isNotAttempted = answer.selected_option_id === null;
        if (isNotAttempted) {
          row.push("Not Attempted");
        } else if (answer.correct === true) {
          row.push(`${answer.selected_option_text} (✓)`);
        } else if (answer.correct === false) {
          row.push(`${answer.selected_option_text} (✗)`);
        } else {
          row.push(answer.selected_option_text || "—");
        }
      });

      return row;
    });

    // Generate worksheet
    const worksheet = XLSX.utils.aoa_to_sheet([headers, ...data]);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Quiz Report");

    // Sanitize filename
    const filename = `${(report.quiz_title || "Quiz_Report").replace(/[^a-z0-9]/gi, '_')}_Report.xlsx`;

    XLSX.writeFile(workbook, filename);
  };

  return (
    <Button onClick={handleExport} size="sm" className="gap-2">
      <Download className="h-4 w-4" />
      Export to Excel
    </Button>
  );
}