"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import portfolioData from "@/data/portfolio.json";
import { useRouter } from "next/navigation";

type DraftState = typeof portfolioData;

interface AdminContextType {
  draft: DraftState;
  updateSection: (section: keyof DraftState, data: any) => void;
  publishAll: () => Promise<boolean>;
  isPublishing: boolean;
  hasUnpublishedChanges: boolean;
  discardChanges: () => void;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export function AdminProvider({ children }: { children: React.ReactNode }) {
  const [draft, setDraft] = useState<DraftState>(portfolioData as DraftState);
  const [isPublishing, setIsPublishing] = useState(false);
  const [hasUnpublishedChanges, setHasUnpublishedChanges] = useState(false);
  const router = useRouter();

  // Load draft from localStorage on mount
  useEffect(() => {
    const savedDraft = localStorage.getItem("portfolio_draft");
    if (savedDraft) {
      try {
        const parsed = JSON.parse(savedDraft);
        // Only use if it has changes compared to current live data
        if (JSON.stringify(parsed) !== JSON.stringify(portfolioData)) {
          setDraft(parsed);
          setHasUnpublishedChanges(true);
        } else {
          localStorage.removeItem("portfolio_draft");
        }
      } catch (e) {
        console.error("Failed to parse draft", e);
      }
    }
  }, []);

  const updateSection = (section: keyof DraftState, data: any) => {
    setDraft((prev) => {
      const newDraft = { ...prev, [section]: data };
      localStorage.setItem("portfolio_draft", JSON.stringify(newDraft));
      setHasUnpublishedChanges(true);
      return newDraft;
    });
  };

  const publishAll = async () => {
    setIsPublishing(true);
    try {
      const res = await fetch("/api/admin/publish", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          data: draft,
          message: "Update portfolio content from Admin Panel",
        }),
      });

      const result = await res.json();
      if (result.success) {
        setHasUnpublishedChanges(false);
        localStorage.removeItem("portfolio_draft");
        router.refresh();
        return true;
      }
      return false;
    } catch (err) {
      console.error(err);
      return false;
    } finally {
      setIsPublishing(false);
    }
  };

  const discardChanges = () => {
    setDraft(portfolioData as DraftState);
    setHasUnpublishedChanges(false);
    localStorage.removeItem("portfolio_draft");
  };

  return (
    <AdminContext.Provider
      value={{
        draft,
        updateSection,
        publishAll,
        isPublishing,
        hasUnpublishedChanges,
        discardChanges,
      }}
    >
      {children}
    </AdminContext.Provider>
  );
}

export function useAdmin() {
  const context = useContext(AdminContext);
  if (!context) {
    throw new Error("useAdmin must be used within an AdminProvider");
  }
  return context;
}
