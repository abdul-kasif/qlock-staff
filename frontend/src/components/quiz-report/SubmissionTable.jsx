import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Check, X } from "lucide-react";

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

  // Get all unique question IDs for column headers
  const questionIds = [
    ...new Set(
      report.submissions.flatMap((sub) =>
        sub.answers.map((ans) => ans.question_id)
      )
    ),
  ];

  // Get question text for each ID (from first submission)
  const getQuestionText = (questionId) => {
    const firstSub = report.submissions[0];
    const answer = firstSub.answers.find((a) => a.question_id === questionId);
    return answer ? answer.question_text : `Q${questionId}`;
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
                  <TableHead key={qid} className="whitespace-nowrap">
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
                    {new Date(submission.started_at).toLocaleString()}
                  </TableCell>
                  <TableCell>
                    {submission.submitted_at
                      ? new Date(submission.submitted_at).toLocaleString()
                      : "—"}
                  </TableCell>
                  <TableCell className="font-bold">
                    {submission.score}%
                  </TableCell>
                  {questionIds.map((qid) => {
                    const answer = submission.answers.find(
                      (a) => a.question_id === qid
                    );
                    return (
                      <TableCell key={qid} className="text-center">
                        {answer ? (
                          <div className="flex flex-col items-center">
                            <span className="text-xs mb-1">
                              {answer.selected_option_text}
                            </span>
                            {answer.correct ? (
                              <Check className="h-4 w-4 text-green-500" />
                            ) : (
                              <X className="h-4 w-4 text-red-500" />
                            )}
                          </div>
                        ) : (
                          "—"
                        )}
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