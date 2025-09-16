// src/hooks/useProfile.js
import { useState } from "react";
import api from "@/lib/api";
import { toast } from "sonner";

export function useProfile() {
  const [isLoading, setIsLoading] = useState(false);

  const submitProfile = async (data) => {
    setIsLoading(true);
    try {
      const response = await api.post("/profile", data);
      toast.success("Profile saved successfully!");
      setIsLoading(false);
      return { success: true, user: response.data.user };
    } catch (error) {
      const message = "Failed to save profile, Please check your details";
      toast.error(message);
      setIsLoading(false);
      return { success: false, message };
    }
  };

  return {
    submitProfile,
    isLoading,
  };
}