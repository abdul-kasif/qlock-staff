import { useState, useEffect } from "react";
import api from "@/lib/api";
import { toast } from "sonner";

export function useQuizReport(quizId) {
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchReport = async () => {
    if (!quizId) return;
    setLoading(true);
    try {
      const response = await api.get(`/quiz_reports/${quizId}`);
      setReport(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Failed to fetch quiz report:", error);
      setError("Failed to load report");
      toast.error("Failed to load quiz report");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReport();
  }, [quizId]);

  return {
    report,
    loading,
    error,
    refetch: fetchReport,
  };
}