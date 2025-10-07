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
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Check, X, Minus } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useQuizReport } from "@/hooks/useQuizReport";

export default function SubmissionTable({ report, onAction }) {
  const [isSelecting, setIsSelecting] = useState(false);
  const [selectedIds, setSelectedIds] = useState(new Set());
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const { deleteBulkRecords, deleteSingleRecord } = useQuizReport();

  const toggleSelect = (id) => {
    const newSet = new Set(selectedIds);
    if (newSet.has(id)) {
      newSet.delete(id);
    } else {
      newSet.add(id);
    }
    setSelectedIds(newSet);
  };

  const toggleSelectAll = () => {
    if (selectedIds.size === report.submissions.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(report.submissions.map(s => s.id)));
    }
  };

  const handleDeleteRecords = () => {
    if (selectedIds.size === 0) return;
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    try {
      // await new Promise(resolve => setTimeout(resolve, 300)); // Simulate API
      if (selectedIds.size === 0) return;
      if (selectedIds.size === 1) {
        const id = Array.from(selectedIds)[0];
        await deleteSingleRecord(id);
      } else {
        await deleteBulkRecords(Array.from(selectedIds));
      }

      onAction(); // refetch
      setIsSelecting(false);
      setSelectedIds(new Set());
      setDeleteDialogOpen(false);
      toast.success(`${selectedIds.size} submission(s) deleted`);
    } catch (error) {

      toast.error("Failed to delete submissions");
      setDeleteDialogOpen(false);
    }
  };

  if (!report.submissions || report.submissions.length === 0) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <p className="text-muted-foreground">No submissions yet.</p>
        </CardContent>
      </Card>
    );
  }

  const questionList = report.questions
    ? [...report.questions].sort((a, b) => a.order - b.order)
    : [];
  const questionIds = questionList.map(q => q.id);

  const getQuestionText = (questionId) => {
    const q = questionList.find(q => q.id === questionId);
    return q ? q.text : `Q${questionId}`;
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between gap-3">
        <CardTitle>Submissions</CardTitle>
        {!isSelecting && report.submissions.length > 0 && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsSelecting(true)}
          >
            Delete Records
          </Button>
        )}
        {isSelecting && (
          <div className="flex gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setIsSelecting(false);
                setSelectedIds(new Set());
              }}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              size="sm"
              onClick={handleDeleteRecords}
              disabled={selectedIds.size === 0}
            >
              Confirm Delete ({selectedIds.size})
            </Button>
          </div>
        )}
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                {isSelecting && (
                  <TableHead className="text-center w-12">
                    <Checkbox
                      checked={selectedIds.size === report.submissions.length && report.submissions.length > 0}
                      onCheckedChange={toggleSelectAll}
                      aria-label="Select all"
                    />
                  </TableHead>
                )}
                <TableHead className="text-center whitespace-nowrap">Student</TableHead>
                <TableHead className="text-center whitespace-nowrap">Started</TableHead>
                <TableHead className="text-center whitespace-nowrap">Submitted</TableHead>
                <TableHead className="text-center whitespace-nowrap">Score</TableHead>
                {questionIds.map((qid) => (
                  <TableHead key={qid} className="text-center whitespace-nowrap min-w-[90px]">
                    <div className="max-w-[120px] truncate">{getQuestionText(qid)}</div>
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {report.submissions.map((submission) => (
                <TableRow key={submission.id} className="hover:bg-muted/50">
                  {isSelecting && (
                    <TableCell className="text-center">
                      <Checkbox
                        checked={selectedIds.has(submission.id)}
                        onCheckedChange={() => toggleSelect(submission.id)}
                        aria-label={`Select ${submission.student_name}`}
                      />
                    </TableCell>
                  )}
                  <TableCell className="font-medium text-center max-w-[120px] truncate">
                    {submission.student_name}
                  </TableCell>
                  <TableCell className="text-center text-xs">
                    {new Date(submission.started_at).toLocaleDateString("en-GB")}
                  </TableCell>
                  <TableCell className="text-center text-xs">
                    {submission.submitted_at
                      ? new Date(submission.submitted_at).toLocaleDateString("en-GB")
                      : "—"}
                  </TableCell>
                  <TableCell className="font-bold text-center">
                    {submission.score}%
                  </TableCell>
                  {questionIds.map((qid) => {
                    const answer = submission.answers.find(a => a.question_id === qid);
                    if (!answer) {
                      return <TableCell key={qid} className="text-center text-muted-foreground">—</TableCell>;
                    }

                    const isNotAttempted = answer.selected_option_id === null;
                    return (
                      <TableCell key={qid} className="text-center">
                        <div className="flex flex-col items-center">
                          <span className="text-[10px] mb-0.5 max-w-[80px] truncate">
                            {answer.selected_option_text || "—"}
                          </span>
                          {isNotAttempted ? (
                            <Minus className="h-3 w-3 text-gray-400" />
                          ) : answer.correct ? (
                            <Check className="h-3 w-3 text-green-500" />
                          ) : (
                            <X className="h-3 w-3 text-red-500" />
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

      {/* DELETE CONFIRMATION DIALOG */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Submissions?</AlertDialogTitle>
            <AlertDialogDescription>
              You are about to delete <strong>{selectedIds.size}</strong> student submission(s).
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-destructive text-primary-foreground hover:bg-destructive/70"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  );
}