"use client";

import React, { useState } from "react";
import { useAdmin } from "@/components/admin/AdminProvider";
import { Plus, Trash2, Edit2, ChevronDown, ChevronRight, Check } from "lucide-react";

export default function SkillsAdmin() {
  const { draft, updateSection } = useAdmin();
  const [skillSections, setSkillSections] = useState(draft.skills || []);
  const [expandedSection, setExpandedSection] = useState<number | null>(0);
  const [deletedMessage, setDeletedMessage] = useState<string | null>(null);

  const handleUpdateSection = (index: number, field: string, value: string) => {
    const updated = [...skillSections];
    updated[index] = { ...updated[index], [field]: value };
    setSkillSections(updated);
    updateSection("skills", updated);
  };

  const handleAddSection = () => {
    const newSection = {
      title: "New Category",
      description: "Description for this category",
      skills: []
    };
    const updated = [...skillSections, newSection];
    setSkillSections(updated);
    updateSection("skills", updated);
    setExpandedSection(updated.length - 1);
  };

  const handleDeleteSection = (index: number) => {
    const updated = skillSections.filter((_, i) => i !== index);
    setSkillSections(updated);
    updateSection("skills", updated);
    if (expandedSection === index) setExpandedSection(null);
    setDeletedMessage("Category deleted successfully.");
    setTimeout(() => setDeletedMessage(null), 3000);
  };

  const handleAddSkill = (sectionIndex: number) => {
    const updated = [...skillSections];
    updated[sectionIndex].skills.push({
      name: "New Skill",
      level: "intermediate",
      category: updated[sectionIndex].title
    });
    setSkillSections(updated);
    updateSection("skills", updated);
  };

  const handleUpdateSkill = (sectionIndex: number, skillIndex: number, field: string, value: string) => {
    const updated = [...skillSections];
    updated[sectionIndex].skills[skillIndex] = {
      ...updated[sectionIndex].skills[skillIndex],
      [field]: value
    };
    // Sync category if title changes (though not strictly needed in JSON if title matches)
    setSkillSections(updated);
    updateSection("skills", updated);
  };

  const handleDeleteSkill = (sectionIndex: number, skillIndex: number) => {
    const updated = [...skillSections];
    updated[sectionIndex].skills = updated[sectionIndex].skills.filter((_, i) => i !== skillIndex);
    setSkillSections(updated);
    updateSection("skills", updated);
    setDeletedMessage("Skill deleted successfully.");
    setTimeout(() => setDeletedMessage(null), 3000);
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
          <h2 className="text-2xl font-bold tracking-tight text-slate-900">Skills & Expertise</h2>
          <p className="text-slate-500">Manage your skill categories and individual skills.</p>
        </div>
        <button
          onClick={handleAddSection}
          className="inline-flex items-center gap-2 rounded-full bg-slate-900 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-slate-800 transition-colors"
        >
          <Plus size={16} /> Add Category
        </button>
      </div>

      <div className="space-y-4">
        {skillSections.map((section: any, sectionIndex: number) => (
          <div key={sectionIndex} className="rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-sm">
            <div 
              className="flex items-center justify-between bg-slate-50 p-4 cursor-pointer hover:bg-slate-100 transition-colors"
              onClick={() => setExpandedSection(expandedSection === sectionIndex ? null : sectionIndex)}
            >
              <div className="flex items-center gap-3">
                {expandedSection === sectionIndex ? (
                  <ChevronDown size={18} className="text-slate-400" />
                ) : (
                  <ChevronRight size={18} className="text-slate-400" />
                )}
                <div>
                  <h3 className={`font-semibold ${
                    ["text-blue-600", "text-emerald-600", "text-purple-600", "text-amber-600", "text-rose-600", "text-indigo-600", "text-cyan-600"][sectionIndex % 7]
                  }`}>{section.title}</h3>
                  <p className="text-xs text-slate-500">{section.skills.length} skills</p>
                </div>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleDeleteSection(sectionIndex);
                }}
                className="text-slate-400 hover:text-rose-500 p-2 rounded-full hover:bg-white"
                title="Delete Category"
              >
                <Trash2 size={16} />
              </button>
            </div>

            {expandedSection === sectionIndex && (
              <div className="p-6 border-t border-slate-100 space-y-6">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <label className="text-xs font-medium text-slate-700 uppercase tracking-wider">Category Title</label>
                    <input
                      type="text"
                      value={section.title}
                      onChange={(e) => handleUpdateSection(sectionIndex, "title", e.target.value)}
                      className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none transition-all focus:border-sky-500 focus:ring-2 focus:ring-sky-500/10"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-medium text-slate-700 uppercase tracking-wider">Description</label>
                    <input
                      type="text"
                      value={section.description}
                      onChange={(e) => handleUpdateSection(sectionIndex, "description", e.target.value)}
                      className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none transition-all focus:border-sky-500 focus:ring-2 focus:ring-sky-500/10"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-3">
                    <label className="text-xs font-medium text-slate-700 uppercase tracking-wider">Skills in this category</label>
                    <button
                      onClick={() => handleAddSkill(sectionIndex)}
                      className="text-xs font-medium text-sky-600 hover:text-sky-700 flex items-center gap-1"
                    >
                      <Plus size={14} /> Add Skill
                    </button>
                  </div>
                  
                  <div className="space-y-2">
                    {section.skills.map((skill: any, skillIndex: number) => (
                      <div key={skillIndex} className="flex gap-2 items-center">
                        <input
                          type="text"
                          value={skill.name}
                          onChange={(e) => handleUpdateSkill(sectionIndex, skillIndex, "name", e.target.value)}
                          placeholder="Skill Name"
                          className="flex-1 rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none transition-all focus:border-sky-500 focus:ring-2 focus:ring-sky-500/10"
                        />
                        <select
                          value={skill.level}
                          onChange={(e) => handleUpdateSkill(sectionIndex, skillIndex, "level", e.target.value)}
                          className="w-32 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm outline-none transition-all focus:border-sky-500 focus:ring-2 focus:ring-sky-500/10"
                        >
                          <option value="beginner">Beginner</option>
                          <option value="intermediate">Intermediate</option>
                          <option value="advanced">Advanced</option>
                          <option value="expert">Expert</option>
                        </select>
                        <button
                          onClick={() => handleDeleteSkill(sectionIndex, skillIndex)}
                          className="p-2 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-colors"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    ))}
                    {section.skills.length === 0 && (
                      <div className="text-sm text-slate-500 py-2 italic">No skills added yet.</div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
        {skillSections.length === 0 && (
          <div className="p-8 text-center text-sm text-slate-500 border border-dashed border-slate-300 rounded-xl bg-slate-50">
            No skill categories added yet. Click "Add Category" to start.
          </div>
        )}
      </div>
    </div>
  );
}
