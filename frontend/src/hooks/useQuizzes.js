// src/hooks/useQuizzes.js
import { useState } from "react";
import api from "@/lib/api";
import { toast } from "sonner";

export function useQuizzes() {
  const [isLoading, setIsLoading] = useState(false);

  const endQuiz = async (id, onSuccess) => {
    setIsLoading(true);
    try {
      await api.patch(`/quizzes/${id}/stop`);
      toast.success("Quiz ended successfully");
      if (onSuccess && typeof onSuccess === "function") onSuccess();
      setIsLoading(false);
      return true;
    } catch (error) {
      console.error("End quiz error:", error);
      toast.error("Failed to end quiz");
      setIsLoading(false);
      return false;
    }
  };

    const fetchAllQuizzes = async (token) => {
    try {
      const response = await api.get("/dashboard");
      return response.data;
    } catch (error) {
      console.error("Failed to fetch user data:", error);
      throw error;
    }
  };


  return {
    endQuiz,
    fetchAllQuizzes,
    isLoading,
  };
}