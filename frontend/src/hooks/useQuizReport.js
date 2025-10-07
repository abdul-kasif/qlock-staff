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

  const deleteSingleRecord = async (id) => {
    setLoading(true);
    try {
      await api.delete(`/quiz_submissions/${id}`);
      setLoading(false);
      return (true);
    } catch (error) {
      setLoading(false);
      return false;
    }
  }

  const deleteBulkRecords = async (ids) => {
    try {
      await api.delete('/quiz_submissions/bulk', {
        data: { submission_ids: ids },
      });
      toast.success("Records deleted successfully");
      return true;
    } catch (error) {
      console.error("Bulk delete failed:", error);
      toast.error("Failed to delete records");
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    report,
    loading,
    error,
    deleteSingleRecord,
    deleteBulkRecords,
    refetch: fetchReport,
  };
}