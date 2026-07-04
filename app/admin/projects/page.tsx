"use client";

import React, { useState, useRef } from "react";
import { useAdmin } from "@/components/admin/AdminProvider";
import { Plus, Trash2, Edit2, Check, X, GripVertical, Image as ImageIcon } from "lucide-react";

export default function ProjectsAdmin() {
  const { draft, updateSection } = useAdmin();
  const [projects, setProjects] = useState(draft.projects || []);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUpdate = (index: number, field: string, value: any) => {
    const updated = [...projects];
    updated[index] = { ...updated[index], [field]: value };
    setProjects(updated);
    updateSection("projects", updated);
  };

  const handleAddProject = () => {
    const newProject = {
      id: `project-${Date.now()}`,
      title: "New Project",
      description: "",
      overview: "",
      category: "Full Stack",
      techStack: [],
      image: "",
      images: [],
      github: "",
      demo: "",
      featured: false
    };
    const updated = [...projects, newProject];
    setProjects(updated);
    updateSection("projects", updated);
    setEditingIndex(updated.length - 1);
  };

  const [deletedMessage, setDeletedMessage] = useState<string | null>(null);

  const handleDeleteProject = (index: number) => {
    const updated = projects.filter((_, i) => i !== index);
    setProjects(updated);
    updateSection("projects", updated);
    if (editingIndex === index) setEditingIndex(null);
    
    setDeletedMessage("Project deleted successfully.");
    setTimeout(() => setDeletedMessage(null), 3000);
  };

  const handleTechStackChange = (index: number, val: string) => {
    const techs = val.split(",").map(t => t.trim()).filter(Boolean);
    handleUpdate(index, "techStack", techs);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("type", "image");

      const res = await fetch("/api/admin/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (data.success) {
        handleUpdate(index, "image", data.url);
        handleUpdate(index, "images", [data.url]);
      } else {
        alert("Upload failed: " + data.error);
      }
    } catch (error) {
      console.error("Upload error", error);
      alert("Failed to upload image.");
    } finally {
      setUploadingImage(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 relative">
      {deletedMessage && (
        <div className="fixed bottom-6 right-6 bg-slate-900 text-white px-5 py-3 rounded-xl shadow-2xl flex items-center gap-3 z-50 animate-in slide-in-from-bottom-5">
          <div className="h-6 w-6 rounded-full bg-emerald-500/20 flex items-center justify-center">
            <Check size={14} className="text-emerald-400" />
          </div>
          <span className="text-sm font-medium">{deletedMessage}</span>
        </div>
      )}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900">Projects</h2>
          <p className="text-slate-500">Manage your portfolio projects and case studies.</p>
        </div>
        <button
          onClick={handleAddProject}
          className="inline-flex items-center gap-2 rounded-full bg-slate-900 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-slate-800 transition-colors"
        >
          <Plus size={16} /> Add Project
        </button>
      </div>

      <div className="grid gap-6 lg:grid-cols-12">
        {/* Project List */}
        <div className="lg:col-span-4 space-y-3">
          {projects.map((project: any, index: number) => (
            <div
              key={project.id || index}
              className={`flex items-center justify-between rounded-xl border p-4 transition-all cursor-pointer ${
                editingIndex === index
                  ? "border-sky-500 bg-sky-50 shadow-sm"
                  : "border-slate-200 bg-white hover:border-slate-300"
              }`}
              onClick={() => setEditingIndex(index)}
            >
              <div className="flex flex-col min-w-0">
                <p className={`text-sm font-semibold truncate ${
                  ["text-blue-600", "text-emerald-600", "text-purple-600", "text-amber-600", "text-rose-600", "text-indigo-600", "text-cyan-600"][index % 7]
                }`}>
                  {project.title || "Untitled Project"}
                </p>
                <div className="flex items-center gap-2 mt-1">
                  {project.featured && (
                    <span className="inline-block rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-medium text-emerald-700">
                      Featured
                    </span>
                  )}
                  <span className="text-[11px] text-slate-500">{project.category}</span>
                </div>
              </div>
              
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleDeleteProject(index);
                }}
                className="text-slate-400 hover:text-rose-500 p-1"
                title="Delete project"
              >
                <Trash2 size={16} />
              </button>
            </div>
          ))}
          {projects.length === 0 && (
            <div className="p-8 text-center text-sm text-slate-500 border border-dashed border-slate-300 rounded-xl">
              No projects added yet.
            </div>
          )}
        </div>

        {/* Edit Form */}
        <div className="lg:col-span-8">
          {editingIndex !== null && projects[editingIndex] ? (
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-slate-900 mb-6 flex items-center gap-2">
                <Edit2 size={18} className="text-sky-500" /> 
                Editing: {projects[editingIndex].title}
              </h3>

              <div className="grid gap-5 sm:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">Project Title</label>
                  <input
                    type="text"
                    value={projects[editingIndex].title}
                    onChange={(e) => handleUpdate(editingIndex, "title", e.target.value)}
                    className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none transition-all focus:border-sky-500 focus:ring-4 focus:ring-sky-500/10"
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">Category</label>
                  <input
                    type="text"
                    value={projects[editingIndex].category}
                    onChange={(e) => handleUpdate(editingIndex, "category", e.target.value)}
                    placeholder="e.g. Full Stack, AI, Backend"
                    className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none transition-all focus:border-sky-500 focus:ring-4 focus:ring-sky-500/10"
                  />
                </div>

                <div className="space-y-2 sm:col-span-2">
                  <label className="text-sm font-medium text-slate-700">Short Description</label>
                  <textarea
                    rows={2}
                    value={projects[editingIndex].description}
                    onChange={(e) => handleUpdate(editingIndex, "description", e.target.value)}
                    className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none transition-all focus:border-sky-500 focus:ring-4 focus:ring-sky-500/10"
                  />
                </div>

                <div className="space-y-2 sm:col-span-2">
                  <label className="text-sm font-medium text-slate-700">Detailed Overview</label>
                  <textarea
                    rows={3}
                    value={projects[editingIndex].overview}
                    onChange={(e) => handleUpdate(editingIndex, "overview", e.target.value)}
                    className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none transition-all focus:border-sky-500 focus:ring-4 focus:ring-sky-500/10"
                  />
                </div>

                <div className="space-y-2 sm:col-span-2">
                  <label className="text-sm font-medium text-slate-700">Tech Stack (comma separated)</label>
                  <input
                    type="text"
                    value={(projects[editingIndex].techStack || []).join(", ")}
                    onChange={(e) => handleTechStackChange(editingIndex, e.target.value)}
                    placeholder="React, Next.js, Tailwind CSS"
                    className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none transition-all focus:border-sky-500 focus:ring-4 focus:ring-sky-500/10"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">GitHub URL</label>
                  <input
                    type="url"
                    value={projects[editingIndex].github}
                    onChange={(e) => handleUpdate(editingIndex, "github", e.target.value)}
                    className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none transition-all focus:border-sky-500 focus:ring-4 focus:ring-sky-500/10"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">Live Demo URL</label>
                  <input
                    type="text"
                    value={projects[editingIndex].demo}
                    onChange={(e) => handleUpdate(editingIndex, "demo", e.target.value)}
                    className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none transition-all focus:border-sky-500 focus:ring-4 focus:ring-sky-500/10"
                  />
                </div>

                <div className="space-y-2 sm:col-span-2">
                  <label className="text-sm font-medium text-slate-700">Project Image</label>
                  <div className="flex items-center gap-4">
                    {projects[editingIndex].image && (
                      <div className="relative h-20 w-32 rounded-lg overflow-hidden border border-slate-200 bg-slate-50">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={projects[editingIndex].image} alt="Preview" className="h-full w-full object-cover" />
                      </div>
                    )}
                    <div className="flex-1 space-y-2">
                      <input
                        type="text"
                        value={projects[editingIndex].image}
                        onChange={(e) => {
                          handleUpdate(editingIndex, "image", e.target.value);
                          handleUpdate(editingIndex, "images", [e.target.value]);
                        }}
                        placeholder="Image URL or upload below"
                        className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none transition-all focus:border-sky-500 focus:ring-4 focus:ring-sky-500/10"
                      />
                      <div>
                        <input
                          type="file"
                          accept="image/*"
                          ref={fileInputRef}
                          onChange={(e) => handleImageUpload(e, editingIndex)}
                          className="hidden"
                          id="image-upload"
                        />
                        <label
                          htmlFor="image-upload"
                          className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 shadow-sm hover:bg-slate-50 transition-colors"
                        >
                          <ImageIcon size={14} />
                          {uploadingImage ? "Uploading..." : "Upload Image"}
                        </label>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 sm:col-span-2 mt-4 pt-4 border-t border-slate-100">
                  <input
                    type="checkbox"
                    id="featured"
                    checked={projects[editingIndex].featured}
                    onChange={(e) => handleUpdate(editingIndex, "featured", e.target.checked)}
                    className="h-5 w-5 rounded border-slate-300 text-sky-600 focus:ring-sky-500/20"
                  />
                  <label htmlFor="featured" className="text-sm font-medium text-slate-700">
                    Mark as Featured Project (Displays on Hero & prominently on Projects page)
                  </label>
                </div>
              </div>
            </div>
          ) : (
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-12 text-center text-slate-500 flex flex-col items-center justify-center h-full">
              <div className="h-12 w-12 rounded-full bg-white border border-slate-200 flex items-center justify-center mb-4">
                <Edit2 size={20} className="text-slate-400" />
              </div>
              <p>Select a project from the left to edit, or add a new one.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
