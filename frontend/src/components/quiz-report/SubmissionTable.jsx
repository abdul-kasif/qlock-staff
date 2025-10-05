// src/components/quiz-report/SubmissionTable.jsx
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Check, X, Minus } from "lucide-react";

export default function SubmissionTable({ report }) {
  if (!report.submissions || report.submissions.length === 0) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <p className="text-muted-foreground">No submissions yet.</p>
        </CardContent>
      </Card>
    );
  }

  // Extract questions from report (more reliable than from submissions)
  const questionMap = {};
  if (report.questions) {
    report.questions.forEach((q) => {
      questionMap[q.id] = q.text;
    });
  }

  // Get question IDs in order
  const questionIds = report.questions
    ? report.questions.map((q) => q.id)
    : [
        ...new Set(
          report.submissions.flatMap((sub) =>
            sub.answers.map((ans) => ans.question_id)
          )
        ),
      ];

  // Get question text safely
  const getQuestionText = (questionId) => {
    return questionMap[questionId] || `Question ${questionId}`;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Student Submissions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Student Name</TableHead>
                <TableHead>Started At</TableHead>
                <TableHead>Submitted At</TableHead>
                <TableHead>Score</TableHead>
                {questionIds.map((qid) => (
                  <TableHead key={qid} className="whitespace-nowrap min-w-[120px]">
                    {getQuestionText(qid)}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {report.submissions.map((submission) => (
                <TableRow key={submission.id} className="hover:bg-muted/50">
                  <TableCell className="font-medium">
                    {submission.student_name}
                  </TableCell>
                  <TableCell>
                    {new Date(submission.started_at).toLocaleString("en-GB")}
                  </TableCell>
                  <TableCell>
                    {submission.submitted_at
                      ? new Date(submission.submitted_at).toLocaleString("en-GB")
                      : "—"}
                  </TableCell>
                  <TableCell className="font-bold">
                    {submission.score}%
                  </TableCell>
                  {questionIds.map((qid) => {
                    const answer = submission.answers.find(
                      (a) => a.question_id === qid
                    );

                    if (!answer) {
                      return (
                        <TableCell key={qid} className="text-center text-muted-foreground">
                          —
                        </TableCell>
                      );
                    }

                    const isNotAttempted = answer.selected_option_id === null;
                    const isSelected = answer.selected_option_text && !isNotAttempted;

                    return (
                      <TableCell key={qid} className="text-center">
                        <div className="flex flex-col items-center">
                          <span className="text-xs mb-1 max-w-[100px] truncate">
                            {answer.selected_option_text || "—"}
                          </span>
                          {isNotAttempted ? (
                            <Minus className="h-4 w-4 text-gray-400" />
                          ) : answer.correct === true ? (
                            <Check className="h-4 w-4 text-green-500" />
                          ) : answer.correct === false ? (
                            <X className="h-4 w-4 text-red-500" />
                          ) : (
                            <Minus className="h-4 w-4 text-gray-400" />
                          )}
                        </div>
                      </TableCell>
                    );
                  })}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}