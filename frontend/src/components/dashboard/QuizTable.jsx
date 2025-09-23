import { useNavigate } from "react-router-dom";
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
import { Eye, Square } from "lucide-react";

const EmptyState = ({ message, icon: Icon }) => (
    <div className="py-12 text-center">
        {Icon && <Icon className="mx-auto h-12 w-12 text-muted-foreground mb-4" />}
        <p className="text-muted-foreground text-lg">{message}</p>
    </div>
);

export default function QuizTable({ activeQuizzes, completedQuizzes, onQuizAction }) {
    const { endQuiz, isLoading } = useQuizzes();
    const [activeTab, setActiveTab] = useState("active");
    const navigate = useNavigate()

    const handleEndQuiz = async (id) => {
        if (isLoading) return;
        const success = await endQuiz(id, onQuizAction);
        if (success) {
            toast.success("Quiz ended successfully");
        } else {
            toast.error("Failed to end quiz");
        }
    };

    const handleViewReport = (id) => {
        navigate(`/quiz-reports/${id}`);
        console.log(`/quiz-reports/${id}`)
     };

    return (
        <Card>
            <CardHeader>
                <CardTitle>Manage Quizzes</CardTitle>
            </CardHeader>
            <CardContent>
                <Tabs value={activeTab} onValueChange={setActiveTab}>
                    <TabsList className="grid w-full grid-cols-2 mb-6">
                        <TabsTrigger value="active" className="flex items-center justify-center gap-2">
                            <Square className="h-4 w-4" />
                            Active Quizzes
                        </TabsTrigger>
                        <TabsTrigger value="completed" className="flex items-center justify-center gap-2">
                            <Eye className="h-4 w-4" />
                            Completed Quizzes
                        </TabsTrigger>
                    </TabsList>
                    {/* Active Quizzes Tab */}
                    <TabsContent value="active">
                        {activeQuizzes.length === 0 ? (
                            <EmptyState
                                message="No active quizzes yet. Create one to get started!"
                                icon={Square}
                            />
                        ) : (
                            <div className="rounded-md border">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Title</TableHead>
                                            <TableHead>Access Code</TableHead>
                                            <TableHead>Subject</TableHead>
                                            <TableHead>Time Limit</TableHead>
                                            <TableHead>Started At</TableHead>
                                            <TableHead className="text-center">Actions</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {activeQuizzes.map((quiz) => (
                                            <TableRow key={quiz.id} className="hover:bg-muted/50">
                                                <TableCell className="font-medium">{quiz.title}</TableCell>
                                                <TableCell className="font-mono font-semibold text-primary">
                                                    {quiz.access_code}
                                                </TableCell>
                                                <TableCell>{quiz.subject_code}</TableCell>
                                                <TableCell>{quiz.time_limit_minutes} min</TableCell>
                                                <TableCell>
                                                    {new Date(quiz.started_at).toLocaleString()}
                                                </TableCell>
                                                <TableCell className="text-center">
                                                    <Button
                                                        size="sm"
                                                        variant="destructive"
                                                        onClick={() => handleEndQuiz(quiz.id)}
                                                        disabled={isLoading}
                                                        className="transition-all duration-200"
                                                    >
                                                        {isLoading ? "Ending..." : "End Quiz"}
                                                    </Button>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>
                        )}
                    </TabsContent>

                    {/* Completed Quizzes Tab */}
                    <TabsContent value="completed">
                        {completedQuizzes.length === 0 ? (
                            <EmptyState
                                message="No completed quizzes yet."
                                icon={Eye}
                            />
                        ) : (
                            <div className="rounded-md border">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Title</TableHead>
                                            <TableHead>Subject</TableHead>
                                            <TableHead>Time Limit</TableHead>
                                            <TableHead>Started</TableHead>
                                            <TableHead>Ended</TableHead>
                                            <TableHead className="text-center">Actions</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {completedQuizzes.map((quiz) => (
                                            <TableRow key={quiz.id} className="hover:bg-muted/50">
                                                <TableCell className="font-medium">{quiz.title}</TableCell>
                                                <TableCell>{quiz.subject_code}</TableCell>
                                                <TableCell>{quiz.time_limit_minutes} min</TableCell>
                                                <TableCell>
                                                    {new Date(quiz.started_at).toLocaleString()}
                                                </TableCell>
                                                <TableCell>
                                                    {quiz.ended_at
                                                        ? new Date(quiz.ended_at).toLocaleString()
                                                        : "—"}
                                                </TableCell>
                                                <TableCell className="text-center">
                                                    <Button
                                                        size="sm"
                                                        variant="outline"
                                                        onClick={() => handleViewReport(quiz.id)}
                                                        className="transition-all duration-200"
                                                    >
                                                        View Report
                                                    </Button>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>
                        )}
                    </TabsContent>
                </Tabs>
            </CardContent>
        </Card>
    );
}