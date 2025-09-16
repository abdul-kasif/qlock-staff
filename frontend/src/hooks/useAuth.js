// src/hooks/useAuth.js

import { useState } from "react";
import api from "@/lib/api";

export function useAuth() {
  const [isLoading, setIsLoading] = useState(false);

  const sendOtp = async (email) => {
    setIsLoading(true);
    try {
      const response = await api.post("/auth/send_otp", { email });
      setIsLoading(false);
      return true;
    } catch (error) {
      console.error("OTP Error:", error.response?.data || error.message);
      setIsLoading(false);
      return false;
    }
  };

  const verifyOtp = async (email, code, role) => {
    setIsLoading(true);
    try {
      const response = await api.post("/auth/verify_otp", { email, code , role});
      const { token, is_new_user, user_id } = response.data;
      setIsLoading(false);
      return {
        success: true,
        is_new_user,
        user_id,
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

  // 👇 NEW: Fetch full user data after login
  const fetchUser = async (token) => {
    try {
      const response = await api.get("/dashboard");
      return response.data.user; // contains profile_complete, name, etc.
    } catch (error) {
      console.error("Failed to fetch user data:", error);
      throw error;
    }
  };

  return {
    sendOtp,
    verifyOtp,
    fetchUser, // 👈 expose it
    isLoading,
  };
}