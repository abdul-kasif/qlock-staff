// src/hooks/useQuizzes.js
import { useState } from "react";
import api from "@/lib/api";
import { toast } from "sonner";

export function useQuizzes() {
  const [isLoading, setIsLoading] = useState(false);

  const pauseQuiz = async (id, onSuccess) => {
    setIsLoading(true);
    try {
      await api.patch(`/quizzes/${id}/pause`);
      if (onSuccess) onSuccess();
      setIsLoading(false);
      return true;
    } catch (error) {
      toast.error("Failed to pause quiz");
      setIsLoading(false);
      return false;
    }
  };

  const resumeQuiz = async (id, onSuccess) => {
    setIsLoading(true);
    try {
      await api.patch(`/quizzes/${id}/resume`);
      if (onSuccess) onSuccess();
      setIsLoading(false);
      return true;
    } catch (error) {
      toast.error("Failed to resume quiz");
      setIsLoading(false);
      return false;
    }
  };

  const completeQuiz = async (id, onSuccess) => {
    setIsLoading(true);
    try {
      await api.patch(`/quizzes/${id}/complete`);
      if (onSuccess) onSuccess();
      setIsLoading(false);
      return true;
    } catch (error) {
      toast.error("Failed to complete quiz");
      setIsLoading(false);
      return false;
    }
  };

  const deleteQuiz = async (id) => {
    setIsLoading(true);
    try {
      await api.delete(`/quizzes/${id}`);
      setIsLoading(false);
      return (true);
    } catch (error) {
      setIsLoading(false);
      return false;
    }
  }

  const fetchAllQuizzes = async (token) => {
    try {
      const response = await api.get("/dashboard");
      return response.data;
    } catch (error) {
      console.error("Failed to fetch user data:", error);
      throw error;
    }
  };

  const createQuiz = async (quizData) => {
    setIsLoading(true);
    try {
      await api.post("/quizzes", { quiz: quizData });
      toast.success("Quiz created successfully!");
      setIsLoading(false);
      return true;
    } catch (error) {
      console.error("Create quiz error:", error);
      toast.error("Failed to create quiz");
      setIsLoading(false);
      return false;
    }
  };


  return {
    completeQuiz,
    pauseQuiz,
    resumeQuiz,
    fetchAllQuizzes,
    createQuiz,
    deleteQuiz,
    isLoading,
  };
}