"use client";

import React, { useState } from "react";
import { useAdmin } from "@/components/admin/AdminProvider";
import { Code2, Trophy, Layers3, Terminal, BookOpen, Search } from "lucide-react";

export default function PlatformsAdmin() {
  const { draft, updateSection } = useAdmin();
  const [platforms, setPlatforms] = useState(draft.platforms);

  const handlePlatformChange = (index: number, field: string, value: string) => {
    const updated = [...platforms];
    updated[index] = { ...updated[index], [field]: value };
    setPlatforms(updated);
    updateSection("platforms", updated);
  };

  const platformIcons: Record<string, React.ReactNode> = {
    leetcode: <Trophy size={18} className="text-[#FFA116]" />,
    codeforces: <Layers3 size={18} className="text-[#1F1C3F]" />,
    codechef: <Terminal size={18} className="text-[#5B4638]" />,
    hackerrank: <BookOpen size={18} className="text-[#2EC866]" />,
    gfg: <Code2 size={18} className="text-[#2F8D46]" />,
    atcoder: <Search size={18} className="text-[#222222]" />,
    github: <Code2 size={18} className="text-[#24292E]" />
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-slate-900">Coding Platforms</h2>
        <p className="text-slate-500">Update your usernames for the Live Analytics Dashboard.</p>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
        <div className="divide-y divide-slate-100">
          {platforms.map((platform, index) => (
            <div key={platform.id} className="p-6 sm:p-8 flex flex-col sm:flex-row gap-4 sm:items-center sm:justify-between transition-colors hover:bg-slate-50">
              <div className="flex items-center gap-4">
                <div className="h-10 w-10 flex items-center justify-center rounded-full bg-white border border-slate-200 shadow-sm">
                  {platformIcons[platform.id] || <Code2 size={18} className="text-slate-500" />}
                </div>
                <div>
                  <h3 className={`text-sm font-semibold ${
                    ["text-blue-600", "text-emerald-600", "text-purple-600", "text-amber-600", "text-rose-600", "text-indigo-600", "text-cyan-600"][index % 7]
                  }`}>{platform.name}</h3>
                  <p className="text-xs text-slate-500">ID: {platform.id}</p>
                </div>
              </div>
              
              <div className="sm:w-64">
                <label className="sr-only">Username for {platform.name}</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span className="text-slate-400 sm:text-sm">@</span>
                  </div>
                  <input
                    type="text"
                    value={platform.username}
                    onChange={(e) => handlePlatformChange(index, "username", e.target.value)}
                    className="w-full rounded-xl border border-slate-200 pl-8 pr-4 py-2.5 text-sm outline-none transition-all focus:border-sky-500 focus:ring-4 focus:ring-sky-500/10"
                    placeholder="Username"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
