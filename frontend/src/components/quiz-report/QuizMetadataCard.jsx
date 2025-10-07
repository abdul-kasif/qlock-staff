import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function QuizMetadataCard({ report }) {
  const quiz = report;

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

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>Quiz Information</CardTitle>
      </CardHeader>
      <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
        <div>
          <span className="text-muted-foreground">Title</span>
          <p className="font-medium">{quiz.quiz_title}</p>
        </div>
        <div>
          <span className="text-muted-foreground">Subject</span>
          <p className="font-medium">
            {quiz.subject_code} - {quiz.subject_name}
          </p>
        </div>
        <div>
          <span className="text-muted-foreground">Degree & Semester</span>
          <p className="font-medium">{quiz.semester}, {quiz.degree}</p>
        </div>
        <div>
          <span className="text-muted-foreground">Time Limit</span>
          <p className="font-medium">{quiz.time_limit_minutes} minutes</p>
        </div>
        <div>
          <span className="text-muted-foreground">Status</span>
          <p>  <StatusBadge status={quiz.status} /></p>
        </div>
        <div>
          <span className="text-muted-foreground">Total Students</span>
          <p className="font-medium">{quiz.total_students}</p>
        </div>
      </CardContent>
    </Card>
  );
}