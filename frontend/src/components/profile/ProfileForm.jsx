// src/components/profile/ProfileForm.jsx
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useProfile } from "@/hooks/useProfile";
import { useNavigate } from "react-router-dom";
import { useAuthContext } from "@/context/AuthContext";

// Zod Schema
const profileSchema = z.object({
  staff_personal_id: z.string().min(1, "Staff ID is required"),
  name: z.string().min(1, "Name is required"),
  department: z.string().min(1, "Department is required"),
});

export default function ProfileForm() {
  const { submitProfile, isLoading } = useProfile();
  const navigate = useNavigate();
  const { login, user } = useAuthContext();

  const form = useForm({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      staff_personal_id: "",
      name: "",
      department: "",
    },
  });

  const onSubmit = async (data) => {
    const result = await submitProfile(data);
    if (result.success) {
      // Update global auth context with completed profile
      login(localStorage.getItem("token"), {
        ...user,
        ...data,
        profile_complete: true,
      });
      navigate("/dashboard", { replace: true });
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-center">
          Complete Your Profile
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="staff_personal_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Staff Personal ID</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. S123" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Full Name</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. John Doe" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="department"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Department</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select department" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Information Technology">
                        Information Technology
                      </SelectItem>
                      <SelectItem value="Computer Science">
                        Computer Science
                      </SelectItem>
                      <SelectItem value="Electronics">Electronics</SelectItem>
                      <SelectItem value="Mechanical">Mechanical</SelectItem>
                      <SelectItem value="Civil">Civil</SelectItem>
                      <SelectItem value="Mathematics">Mathematics</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Saving..." : "Save & Continue to Dashboard"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
