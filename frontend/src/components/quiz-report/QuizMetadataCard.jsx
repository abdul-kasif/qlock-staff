import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function QuizMetadataCard({ report }) {
  const quiz = report;

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
          <span className="text-muted-foreground">Degree</span>
          <p className="font-medium">{quiz.degree}</p>
        </div>
        <div>
          <span className="text-muted-foreground">Semester</span>
          <p className="font-medium">{quiz.semester}</p>
        </div>
        <div>
          <span className="text-muted-foreground">Time Limit</span>
          <p className="font-medium">{quiz.time_limit_minutes} minutes</p>
        </div>
        <div>
          <span className="text-muted-foreground">Total Students</span>
          <p className="font-medium">{quiz.total_students}</p>
        </div>
      </CardContent>
    </Card>
  );
}