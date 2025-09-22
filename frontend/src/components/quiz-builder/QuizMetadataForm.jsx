import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

const metadataSchema = z.object({
  title: z.string().min(1, "Title is required"),
  degree: z.string().min(1, "Degree is required"),
  semester: z.string().min(1, "Semester is required"),
  subject_code: z.string().min(1, "Subject code is required"),
  subject_name: z.string().min(1, "Subject name is required"),
  time_limit_minutes: z.number().min(1, "Time limit must be at least 1 minute"),
});

export default function QuizMetadataForm({ draft, saveDraft }) {
  const form = useForm({
    resolver: zodResolver(metadataSchema),
    defaultValues: draft,
  });

  const handleFieldChange = (field, value) => {
    saveDraft({
      ...draft,
      [field]: value,
    });
  };

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>Quiz Information</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Quiz Title</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="e.g. Database Quiz"
                      {...field}
                      onChange={(e) => {
                        field.onChange(e);
                        handleFieldChange("title", e.target.value);
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="degree"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Degree</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="e.g. B.Tech"
                      {...field}
                      onChange={(e) => {
                        field.onChange(e);
                        handleFieldChange("degree", e.target.value);
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="semester"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Semester</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="e.g. 4"
                      {...field}
                      onChange={(e) => {
                        field.onChange(e);
                        handleFieldChange("semester", e.target.value);
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="subject_code"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Subject Code</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="e.g. CS204"
                      {...field}
                      onChange={(e) => {
                        field.onChange(e);
                        handleFieldChange("subject_code", e.target.value);
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="subject_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Subject Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="e.g. Database Systems"
                      {...field}
                      onChange={(e) => {
                        field.onChange(e);
                        handleFieldChange("subject_name", e.target.value);
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="time_limit_minutes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Time Limit (minutes)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min="1"
                      {...field}
                      onChange={(e) => {
                        const val = parseInt(e.target.value) || "";
                        field.onChange(val);
                        handleFieldChange("time_limit_minutes", val);
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </Form>
      </CardContent>
    </Card>
  );
}