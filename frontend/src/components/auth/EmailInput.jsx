import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";

export default function EmailInput({ onOtpSent, email, setEmail }) {
  const { sendOtp, isLoading } = useAuth();
  const [error, setError] = useState("");

  const handleSendOtp = async () => {
    if (!email.trim()) {
      setError("Please enter your college email");
      return;
    }

    // if (!email.endsWith("@college.edu")) {
    //   // Adjust domain as needed for your campus
    //   setError("Only college emails are allowed");
    //   return;
    // }

    setError("");
    const success = await sendOtp(email);
    if (success) {
      onOtpSent();
    }
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <label htmlFor="email" className="text-sm font-medium">
          College Email
        </label>
        <Input
          id="email"
          type="email"
          placeholder="staff@tcarts.in"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={isLoading}
          className="w-full"
        />
        {error && <p className="text-sm text-destructive">{error}</p>}
      </div>
      <Button onClick={handleSendOtp} disabled={isLoading} className="w-full">
        {isLoading ? "Sending..." : "Send OTP"}
      </Button>
    </div>
  );
}
