// src/components/dashboard/SessionTable.jsx
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
import { useSessions } from "@/hooks/useSessions";
import { toast } from "sonner";
import { useState } from "react";

export default function SessionTable({ activeSessions, historySessions, fetchSessions }) {
  const { stopSession, isLoading } = useSessions();
  const [activeTab, setActiveTab] = useState("active");

  const handleStopSession = async (id) => {
    const success = await stopSession(id, fetchSessions);
    if (success) {
      toast.success("Session ended successfully");
    } else {
      toast.error("Failed to end session");
    }
  };

  const EmptyState = ({ message }) => (
    <div className="py-8 text-center text-muted-foreground">
      <p>{message}</p>
    </div>
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>Assessment Sessions</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="active">Active Sessions</TabsTrigger>
            <TabsTrigger value="history">History</TabsTrigger>
          </TabsList>

          {/* Active Sessions Tab */}
          <TabsContent value="active">
            {activeSessions.length === 0 ? (
              <EmptyState message="No active sessions yet. Start one above!" />
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead>Access Code</TableHead>
                    <TableHead>Duration</TableHead>
                    <TableHead>Started At</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {activeSessions.map((session) => (
                    <TableRow key={session.id}>
                      <TableCell>{session.title}</TableCell>
                      <TableCell className="font-mono">
                        {session.access_code}
                      </TableCell>
                      <TableCell>{session.test_duration_minutes} min</TableCell>
                      <TableCell>
                        {new Date(session.started_at).toLocaleString()}
                      </TableCell>
                      <TableCell>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleStopSession(session.id)}
                          disabled={isLoading}
                        >
                          End Session
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </TabsContent>

          {/* History Sessions Tab */}
          <TabsContent value="history">
            {historySessions.length === 0 ? (
              <EmptyState message="No completed sessions yet." />
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead>Duration</TableHead>
                    <TableHead>Started</TableHead>
                    <TableHead>Ended</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {historySessions.map((session) => (
                    <TableRow key={session.id}>
                      <TableCell>{session.title}</TableCell>
                      <TableCell>{session.test_duration_minutes} min</TableCell>
                      <TableCell>
                        {new Date(session.started_at).toLocaleString()}
                      </TableCell>
                      <TableCell>
                        {session.ended_at
                          ? new Date(session.ended_at).toLocaleString()
                          : "—"}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
