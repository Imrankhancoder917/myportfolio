"use client";

import React from "react";
import { Menu, Save, Loader2, RefreshCw } from "lucide-react";
import { useAdmin } from "./AdminProvider";

export default function AdminTopbar({ onMenuClick }: { onMenuClick: () => void }) {
  const { hasUnpublishedChanges, isPublishing, publishAll, discardChanges } = useAdmin();

  const handlePublishAll = async () => {
    await publishAll();
  };

  return (
    <header className="flex h-16 shrink-0 items-center justify-between border-b border-slate-200 bg-white px-6">
      <div className="flex items-center gap-4">
        <button className="lg:hidden text-slate-500" onClick={onMenuClick}>
          <Menu size={20} />
        </button>
        <div className="hidden sm:block">
          <h1 className="text-sm font-medium text-slate-700">Dashboard Overview</h1>
        </div>
      </div>

      <div className="flex items-center gap-3">
        {hasUnpublishedChanges && (
          <span className="hidden sm:inline-block text-xs font-medium text-amber-600 bg-amber-50 px-3 py-1 rounded-full">
            Unpublished Changes
          </span>
        )}
        
        <button
          onClick={discardChanges}
          disabled={!hasUnpublishedChanges || isPublishing}
          className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-600 shadow-sm transition-colors hover:bg-slate-50 disabled:opacity-50"
        >
          <RefreshCw size={16} />
          <span className="hidden sm:inline">Discard</span>
        </button>

        <button
          onClick={handlePublishAll}
          disabled={!hasUnpublishedChanges || isPublishing}
          className="flex items-center gap-2 rounded-xl bg-slate-900 px-5 py-2 text-sm font-medium text-white shadow-sm transition-all hover:bg-slate-800 disabled:opacity-50"
        >
          {isPublishing ? (
            <Loader2 size={16} className="animate-spin" />
          ) : (
            <Save size={16} />
          )}
          Publish
        </button>
      </div>
    </header>
  );
}
