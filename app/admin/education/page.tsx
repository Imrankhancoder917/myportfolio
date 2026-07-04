"use client";

import React, { useState, useRef } from "react";
import { useAdmin } from "@/components/admin/AdminProvider";
import { UploadCloud } from "lucide-react";

export default function EducationAdmin() {
  const { draft, updateSection } = useAdmin();
  const [education, setEducation] = useState(draft.education || { cgpa: "", resume: "" });
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const updated = { ...education, [name]: value };
    setEducation(updated);
    updateSection("education", updated);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("type", "resume");

      const res = await fetch("/api/admin/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (data.success) {
        const updated = { ...education, resume: data.url };
        setEducation(updated);
        updateSection("education", updated);
      } else {
        alert("Upload failed: " + data.error);
      }
    } catch (error) {
      console.error("Upload error", error);
      alert("Failed to upload resume.");
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-slate-900">Resume & Education</h2>
        <p className="text-slate-500">Manage your CGPA and upload your resume.</p>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <div className="grid gap-6 sm:grid-cols-2">
          
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">CGPA</label>
            <input
              type="text"
              name="cgpa"
              value={education.cgpa || ""}
              onChange={handleChange}
              placeholder="e.g. 8.5/10"
              className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none transition-all focus:border-sky-500 focus:ring-4 focus:ring-sky-500/10"
            />
          </div>

          <div className="space-y-2 sm:col-span-2">
            <label className="text-sm font-medium text-slate-700">Resume URL or Upload</label>
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
              <input
                type="url"
                name="resume"
                value={education.resume || ""}
                onChange={handleChange}
                placeholder="Link to your resume (e.g., Google Drive or uploaded PDF link)"
                className="flex-1 w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none transition-all focus:border-sky-500 focus:ring-4 focus:ring-sky-500/10"
              />
              <div>
                <input
                  type="file"
                  accept="application/pdf"
                  ref={fileInputRef}
                  onChange={handleFileUpload}
                  className="hidden"
                  id="resume-upload"
                />
                <label
                  htmlFor="resume-upload"
                  className="inline-flex shrink-0 cursor-pointer items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 shadow-sm hover:bg-slate-50 transition-colors"
                >
                  <UploadCloud size={16} />
                  {uploading ? "Uploading..." : "Upload PDF"}
                </label>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
