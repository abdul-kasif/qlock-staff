import EmailInput from "@/components/auth/EmailInput";
import OtpInput from "@/components/auth/OtpInput";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useState } from "react";
import { Toaster } from "sonner";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [otpSent, setOtpSent] = useState(false);

  const handleOtpSent = () => {
    setOtpSent(true);
  };

  const handleVerifySuccess = (result) => {
    console.log("Login success:", result);
    if (result.is_new_staff) {
      alert("New staff — redirect to profile setup");
    } else {
      alert("Existing staff — redirect to dashboard");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Toaster position="top-center" richColors />
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">
            QLock Staff Portal
          </CardTitle>
        </CardHeader>
        <CardContent>
          {!otpSent ? (
            <EmailInput
              email={email}
              setEmail={setEmail}
              onOtpSent={handleOtpSent}
            />
          ) : (
            <OtpInput email={email} onVerifySuccess={handleVerifySuccess} />
          )}
        </CardContent>
      </Card>
    </div>
  );
}
