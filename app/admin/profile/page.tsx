"use client";

import React, { useState } from "react";
import { useAdmin } from "@/components/admin/AdminProvider";

export default function ProfileAdmin() {
  const { draft, updateSection } = useAdmin();
  const [profile, setProfile] = useState(draft.profile);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    let finalValue: any = value;

    if (type === "checkbox") {
      finalValue = (e.target as HTMLInputElement).checked;
    }

    const updated = { ...profile, [name]: finalValue };
    setProfile(updated);
    updateSection("profile", updated);
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-slate-900">Profile Information</h2>
        <p className="text-slate-500">Update your hero section, summary, and current status.</p>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <div className="grid gap-6 sm:grid-cols-2">
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">Full Name</label>
            <input
              type="text"
              name="name"
              value={profile.name}
              onChange={handleChange}
              className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none transition-all focus:border-sky-500 focus:ring-4 focus:ring-sky-500/10"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">Job Title</label>
            <input
              type="text"
              name="title"
              value={profile.title}
              onChange={handleChange}
              className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none transition-all focus:border-sky-500 focus:ring-4 focus:ring-sky-500/10"
            />
          </div>

          <div className="space-y-2 sm:col-span-2">
            <label className="text-sm font-medium text-slate-700">Hero Summary (Short)</label>
            <textarea
              name="summary"
              rows={3}
              value={profile.summary}
              onChange={handleChange}
              className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none transition-all focus:border-sky-500 focus:ring-4 focus:ring-sky-500/10"
            />
          </div>

          <div className="space-y-2 sm:col-span-2">
            <label className="text-sm font-medium text-slate-700">About Me (Long)</label>
            <textarea
              name="about"
              rows={4}
              value={profile.about}
              onChange={handleChange}
              className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none transition-all focus:border-sky-500 focus:ring-4 focus:ring-sky-500/10"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">Location</label>
            <input
              type="text"
              name="location"
              value={profile.location}
              onChange={handleChange}
              className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none transition-all focus:border-sky-500 focus:ring-4 focus:ring-sky-500/10"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">Current Status (e.g. Open to Work)</label>
            <input
              type="text"
              name="status"
              value={profile.status}
              onChange={handleChange}
              className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none transition-all focus:border-sky-500 focus:ring-4 focus:ring-sky-500/10"
            />
          </div>

          <div className="flex items-center gap-3 sm:col-span-2 mt-2">
            <input
              type="checkbox"
              id="openToWork"
              name="openToWork"
              checked={profile.openToWork}
              onChange={handleChange}
              className="h-5 w-5 rounded border-slate-300 text-sky-600 focus:ring-sky-500/20"
            />
            <label htmlFor="openToWork" className="text-sm font-medium text-slate-700">
              Display "Open to Work" badge on Hero section
            </label>
          </div>
        </div>
      </div>
    </div>
  );
}
