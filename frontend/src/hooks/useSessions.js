// src/hooks/useSessions.js
import { useState } from "react";
import api from "@/lib/api";
import { toast } from "sonner";

export function useSessions() {
  const [isLoading, setIsLoading] = useState(false);

  const createSession = async (data, onSuccess) => {
    setIsLoading(true);
    try {
      await api.post("/sessions", data);
      toast.success("Session started successfully!");
      if (onSuccess && typeof onSuccess === "function") onSuccess();
      setIsLoading(false);
      return true;
    } catch (error) {
      console.error("Create session error:", error);
      toast.error("Failed to start session");
      setIsLoading(false);
      return false;
    }
  };

  const stopSession = async (id, onSuccess) => {
    setIsLoading(true);
    try {
      await api.patch(`/sessions/${id}/stop`);
      toast.success("Session ended successfully");
      if (onSuccess && typeof onSuccess === "function") onSuccess();
      setIsLoading(false);
      return true;
    } catch (error) {
      console.error("Stop session error:", error);
      toast.error("Failed to end session");
      setIsLoading(false);
      return false;
    }
  };

  // Fetch full user data includes sessions
  const fetchCurrentSessions = async (token) => {
    try {
      const response = await api.get("/dashboard");
      return response.data;
    } catch (error) {
      console.error("Failed to fetch user data:", error);
      throw error;
    }
  };

  // Delete selected previous session
  const deleteSession = async (id, onSuccess) => {
    setIsLoading(true);
    try {
      await api.delete(`/sessions/${id}/delete`);
      toast.success("Session deleted successfully");
      if (onSuccess && typeof onSuccess === "function") onSuccess();
      setIsLoading(false);
      return true;
    } catch (error) {
      if (error.status == 400) {
        console.error("Delete session error:", error);
        toast.error(
          "Cannot delete session: it contains student submissions"
        );
      } else {
        console.error("Delete session error:", error);
        toast.error("Failed to delete session");
      }
      setIsLoading(false);
      return false;
    }
  };

  return {
    createSession,
    stopSession,
    deleteSession,
    fetchCurrentSessions,
    isLoading,
  };
}
