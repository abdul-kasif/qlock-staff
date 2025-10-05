// src/components/dashboard/QuizTable.jsx
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuizzes } from "@/hooks/useQuizzes";
import { toast } from "sonner";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const EmptyState = ({ message }) => (
  <div className="py-12 text-center">
    <p className="text-muted-foreground text-lg">{message}</p>
  </div>
);

const StatusBadge = ({ status }) => {
  const styles = {
    active: "bg-green-100 text-green-800",
    paused: "bg-amber-100 text-amber-800",
    completed: "bg-gray-100 text-gray-800",
  };

  const display = {
    active: "Active",
    paused: "Paused",
    completed: "Completed",
  };

  return (
    <span className={`px-2 py-1 text-xs font-medium rounded-full ${styles[status]}`}>
      {display[status] || status}
    </span>
  );
};

export default function QuizTable({ 
  activeQuizzes, 
  pausedQuizzes, 
  completedQuizzes, 
  onQuizAction 
}) {
  const { pauseQuiz, resumeQuiz, completeQuiz, isLoading } = useQuizzes();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("active");

  const handlePause = async (id) => {
    if (isLoading) return;
    const success = await pauseQuiz(id, onQuizAction);
    if (success) toast.success("Quiz paused");
  };

  const handleResume = async (id) => {
    if (isLoading) return;
    const success = await resumeQuiz(id, onQuizAction);
    if (success) toast.success("Quiz resumed");
  };

  const handleComplete = async (id) => {
    if (isLoading) return;
    const success = await completeQuiz(id, onQuizAction);
    if (success) toast.success("Quiz completed");
  };

  const handleViewReport = (id) => {
    navigate(`/quiz-reports/${id}`);
  };

  const renderTable = (quizzes, status) => {
    if (quizzes.length === 0) {
      return (
        <EmptyState 
          message={
            status === "active" ? "No active quizzes." :
            status === "paused" ? "No paused quizzes." :
            "No completed quizzes."
          } 
        />
      );
    }

    return (
      <div className="rounded-md border overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-center">Title</TableHead>
              {status !== "completed" && <TableHead className="text-center">Access Code</TableHead>}
              <TableHead className="text-center">Subject</TableHead>
              <TableHead className="text-center">Time Limit</TableHead>
              <TableHead className="text-center">Started At</TableHead>
              {status === "completed" && <TableHead className="text-center">Ended At</TableHead>}
              <TableHead className="text-center">Status</TableHead>
              <TableHead className="text-center">Report</TableHead>
              {status !== "completed" && <TableHead className="text-center">Actions</TableHead>}
            </TableRow>
          </TableHeader>
          <TableBody>
            {quizzes.map((quiz) => (
              <TableRow key={quiz.id} className="hover:bg-muted/50">
                <TableCell className="font-medium max-w-xs break-words text-center">
                  {quiz.title}
                </TableCell>
                {status !== "completed" && (
                  <TableCell className="font-mono font-semibold text-primary break-words text-center">
                    {quiz.access_code}
                  </TableCell>
                )}
                <TableCell className="break-words text-center">
                  {quiz.subject_code}
                </TableCell>
                <TableCell className="text-center">
                  {quiz.time_limit_minutes} min
                </TableCell>
                <TableCell className="text-center">
                  {new Date(quiz.started_at).toLocaleString("en-GB")}
                </TableCell>
                {status === "completed" && (
                  <TableCell className="text-center">
                    {quiz.ended_at ? new Date(quiz.ended_at).toLocaleString("en-GB") : "—"}
                  </TableCell>
                )}
                <TableCell className="text-center">
                  <StatusBadge status={quiz.status} />
                </TableCell>
                <TableCell className="text-center">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleViewReport(quiz.id)}
                  >
                    Report
                  </Button>
                </TableCell>
                {status !== "completed" && (
                  <TableCell className="text-center space-x-2">
                    {quiz.status === "active" && (
                      <>
                        <Button
                          size="sm"
                          variant="secondary"
                          onClick={() => handlePause(quiz.id)}
                          disabled={isLoading}
                        >
                          Pause
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleComplete(quiz.id)}
                          disabled={isLoading}
                        >
                          Complete
                        </Button>
                      </>
                    )}
                    {quiz.status === "paused" && (
                      <>
                        <Button
                          size="sm"
                          variant="default"
                          onClick={() => handleResume(quiz.id)}
                          disabled={isLoading}
                        >
                          Resume
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleComplete(quiz.id)}
                          disabled={isLoading}
                        >
                          Complete
                        </Button>
                      </>
                    )}
                  </TableCell>
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Manage Quizzes</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3 mb-6">
            <TabsTrigger value="active">Active</TabsTrigger>
            <TabsTrigger value="paused">Paused</TabsTrigger>
            <TabsTrigger value="completed">Completed</TabsTrigger>
          </TabsList>

          <TabsContent value="active">
            {renderTable(activeQuizzes, "active")}
          </TabsContent>

          <TabsContent value="paused">
            {renderTable(pausedQuizzes, "paused")}
          </TabsContent>

          <TabsContent value="completed">
            {renderTable(completedQuizzes, "completed")}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}