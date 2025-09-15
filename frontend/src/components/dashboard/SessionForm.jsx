// src/components/dashboard/SessionForm.jsx
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useSessions } from "@/hooks/useSessions";
import { toast } from "sonner";

const sessionSchema = z.object({
  title: z.string().min(1, "Title is required"),
  google_form_url: z.string().url("Must be a valid URL"),
  test_duration_minutes: z
    .number()
    .min(1, "Duration must be at least 1 minute")
    .int("Must be a whole number"),
});

export default function SessionForm({ fetchSessions }) { 
  const { createSession, isLoading } = useSessions();
  const form = useForm({
    resolver: zodResolver(sessionSchema),
    defaultValues: {
      title: "",
      google_form_url: "",
      test_duration_minutes: 30,
    },
  });

  const onSubmit = async (data) => {
    const success = await createSession(data, fetchSessions);;
    if (success) {
      form.reset();
      toast.success("Session started successfully!");
    } else {
      toast.error("Failed to start session");
    }
  };

  return (
    <Card className="w-full h-full">
      <CardHeader>
        <CardTitle>Start New Assessment Session</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Session Title</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. Math Quiz Test - 3" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="google_form_url"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Google Form URL</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="https://forms.gle/..."
                      {...field}
                      onChange={(e) => field.onChange(e.target.value)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="test_duration_minutes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Test Duration (minutes)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min="1"
                      {...field}
                      onChange={(e) =>
                        field.onChange(parseInt(e.target.value) || "")
                      }
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Starting..." : "Start Session"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
