import { useState } from "react";
import api from "@/lib/api";

export function useAuth() {
  const [isLoading, setIsLoading] = useState(false);

  const sendOtp = async (email) => {
    setIsLoading(true);
    try {
      const response = await api.post("/auth/send_otp", { email });
      console.log("OTP Sent:", response.data);
      setIsLoading(false);
      return true;
    } catch (error) {
      console.error("OTP Error:", error.response?.data || error.message);
      setIsLoading(false);
      return false;
    }
  };

  const verifyOtp = async (email, code) => {
    setIsLoading(true);
    try {
      const response = await api.post("/auth/verify_otp", { email, code });
      const { token, is_new_staff, staff_id } = response.data;
      localStorage.setItem("token", token);
      localStorage.setItem("staff_id", staff_id);
      setIsLoading(false);
      return {
        success: true,
        is_new_staff,
        staff_id,
        token,
      };
    } catch (error) {
      setIsLoading(false);
      return {
        success: false,
        message: error.response?.data?.error || "Verification failed",
      };
    }
  };

  return {
    sendOtp,
    verifyOtp,
    isLoading,
  };
}
