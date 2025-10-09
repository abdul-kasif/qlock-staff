import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useState } from "react";
import EmailInput from "./EmailInput";
import OtpInput from "./OtpInput";
import { Toaster } from "sonner";

export default function LoginCard({ onVerifySuccess }) {
  const [email, setEmail] = useState("");
  const [otpSent, setOtpSent] = useState(false);

  const handleOtpSent = () => {
    setOtpSent(true);
  };

  // Pass success handler from LoginPage
  const handleVerifySuccessLocal = (result) => {
    if (onVerifySuccess && typeof onVerifySuccess === "function") {
      onVerifySuccess(result);
    } else {
      console.warn("No onVerifySuccess handler provided");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Toaster position="top-center" richColors />
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">
            CampQ Staff Portal
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
            <OtpInput
              email={email}
              onVerifySuccess={handleVerifySuccessLocal}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}