// src/components/dashboard/StaffInfoCard.jsx
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function StaffInfoCard({ user }) {
  return (
    <Card className="w-full h-full">
      <CardHeader>
        <CardTitle>Staff Information</CardTitle>
      </CardHeader>
      <CardContent className="text-sm">
        <div>
          <span className="text-muted-foreground">Roll No</span>
          <p className="font-medium">{user.user_personal_id || "—"} </p>
        </div>
        <div className="mt-6">
          <span className="text-muted-foreground">Name</span>
          <p className="font-medium">{user.name || "—"}</p>
        </div>
        <div className="mt-6">
          <span className="text-muted-foreground">Email</span>
          <p className="font-medium">{user.email}</p>
        </div>
        <div className="mt-6">
          <span className="text-muted-foreground">Department</span>
          <p className="font-medium">{user.department || "—"}</p>
        </div>
      </CardContent>
    </Card>
  );
}
