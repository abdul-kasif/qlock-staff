import { useState, useEffect } from "react";

const STORAGE_KEY = "quiz_draft";

export function useLocalStorageDraft() {
  const [draft, setDraft] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : null;
  });

  const saveDraft = (data) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    setDraft(data);
  };

  const clearDraft = () => {
    localStorage.removeItem(STORAGE_KEY);
    setDraft(null);
  };

  // Auto-save to localStorage on draft change
  useEffect(() => {
    if (draft) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(draft));
    }
  }, [draft]);

  return {
    draft,
    saveDraft,
    clearDraft,
  };
}