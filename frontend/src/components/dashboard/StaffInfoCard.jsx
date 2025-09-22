import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function StaffInfoCard({ user }) {
  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>Staff Information</CardTitle>
      </CardHeader>
      <CardContent className="grid grid-cols-1 gap-4 text-sm md:grid-cols-2">
        {/* Name */}
        <div>
          <span className="text-muted-foreground">Name</span>
          <p className="font-medium">{user.name || "—"}</p>
        </div>

        {/* Roll No */}
        <div>
          <span className="text-muted-foreground">Roll No</span>
          <p className="font-medium">{user.user_personal_id || "—"}</p>
        </div>

        {/* Email - No longer spans 2 columns on desktop */}
        <div>
          <span className="text-muted-foreground">Email</span>
          {/* Ensure long email addresses wrap on mobile */}
          <p className="font-medium break-words">{user.email}</p>
        </div>

        {/* Department */}
        <div>
          <span className="text-muted-foreground">Department</span>
          <p className="font-medium">{user.department || "—"}</p>
        </div>
      </CardContent>
    </Card>
  );
}
