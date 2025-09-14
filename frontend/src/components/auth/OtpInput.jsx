import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";

export default function OtpInput({ email, onVerifySuccess }) {
  const { verifyOtp, isLoading } = useAuth();
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");

  const handleVerify = async () => {
    if (otp.length !== 6) {
      setError("OTP must be 6 characters");
      return;
    }

    setError("");
    const result = await verifyOtp(email, otp);
    if (result.success) {
      toast.success("OTP verified!");
      onVerifySuccess(result);
    } else {
      toast.error(result.message || "Invalid OTP");
    }
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <label htmlFor="otp" className="text-sm font-medium">
          Enter OTP sent to <span className="font-bold">{email}</span>
        </label>
        <Input
          id="otp"
          placeholder="A1B2C3"
          value={otp}
          onChange={(e) => setOtp(e.target.value.toUpperCase())}
          maxLength={6}
          disabled={isLoading}
          className="w-full font-mono text-center tracking-widest"
        />
        {error && <p className="text-sm text-destructive">{error}</p>}
      </div>
      <Button onClick={handleVerify} disabled={isLoading} className="w-full">
        {isLoading ? "Verifying..." : "Verify OTP"}
      </Button>
    </div>
  );
}
