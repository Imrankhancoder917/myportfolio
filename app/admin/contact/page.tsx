"use client";

import React, { useState } from "react";
import { useAdmin } from "@/components/admin/AdminProvider";
import { Check } from "lucide-react";

interface CustomLink {
  label: string;
  url: string;
}

interface ContactState {
  email: string;
  phone: string;
  location: string;
  linkedin: string;
  github: string;
  twitter: string;
  whatsapp: string;
  customLinks: CustomLink[];
}

export default function ContactAdmin() {
  const { draft, updateSection } = useAdmin();
  const [contact, setContact] = useState<ContactState>({
    ...draft.contact,
    customLinks: draft.contact.customLinks || [],
  });
  const [deletedMessage, setDeletedMessage] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const updated = { ...contact, [name]: value };
    setContact(updated);
    updateSection("contact", updated);
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
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-slate-900">Contact & Social Links</h2>
        <p className="text-slate-500">Update your email, phone, and social media URLs.</p>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <div className="grid gap-6 sm:grid-cols-2">
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">Email Address</label>
            <input
              type="email"
              name="email"
              value={contact.email}
              onChange={handleChange}
              className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none transition-all focus:border-sky-500 focus:ring-4 focus:ring-sky-500/10"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">Phone Number</label>
            <input
              type="text"
              name="phone"
              value={contact.phone}
              onChange={handleChange}
              className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none transition-all focus:border-sky-500 focus:ring-4 focus:ring-sky-500/10"
            />
          </div>

          <div className="space-y-2 sm:col-span-2">
            <label className="text-sm font-medium text-slate-700">Location (City, Country)</label>
            <input
              type="text"
              name="location"
              value={contact.location}
              onChange={handleChange}
              className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none transition-all focus:border-sky-500 focus:ring-4 focus:ring-sky-500/10"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">LinkedIn URL</label>
            <input
              type="url"
              name="linkedin"
              value={contact.linkedin}
              onChange={handleChange}
              className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none transition-all focus:border-sky-500 focus:ring-4 focus:ring-sky-500/10"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">GitHub URL</label>
            <input
              type="url"
              name="github"
              value={contact.github}
              onChange={handleChange}
              className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none transition-all focus:border-sky-500 focus:ring-4 focus:ring-sky-500/10"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">Twitter / X URL</label>
            <input
              type="url"
              name="twitter"
              value={contact.twitter}
              onChange={handleChange}
              className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none transition-all focus:border-sky-500 focus:ring-4 focus:ring-sky-500/10"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">WhatsApp URL</label>
            <input
              type="url"
              name="whatsapp"
              value={contact.whatsapp}
              onChange={handleChange}
              className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none transition-all focus:border-sky-500 focus:ring-4 focus:ring-sky-500/10"
            />
          </div>
        </div>
        
        <div className="mt-8 border-t border-slate-100 pt-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-semibold text-slate-900">Custom Links</h3>
              <p className="text-sm text-slate-500">Add any other custom links (e.g., YouTube, Blog, Portfolio)</p>
            </div>
            <button
              onClick={() => {
                const newLinks = [...(contact.customLinks || []), { label: "New Link", url: "" }];
                const updated = { ...contact, customLinks: newLinks };
                setContact(updated);
                updateSection("contact", updated);
              }}
              className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-slate-800 transition-colors"
            >
              Add Link
            </button>
          </div>
          
          <div className="space-y-4">
            {(contact.customLinks || []).map((link: any, index: number) => (
              <div key={index} className="flex gap-4 items-start bg-slate-50 p-4 rounded-xl border border-slate-100">
                <div className="grid gap-4 sm:grid-cols-2 flex-1">
                  <div className="space-y-2">
                    <label className="text-xs font-medium text-slate-700 uppercase tracking-wider">Label</label>
                    <input
                      type="text"
                      value={link.label}
                      onChange={(e) => {
                        const newLinks = [...(contact.customLinks || [])];
                        newLinks[index].label = e.target.value;
                        const updated = { ...contact, customLinks: newLinks };
                        setContact(updated);
                        updateSection("contact", updated);
                      }}
                      className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none transition-all focus:border-sky-500 focus:ring-2 focus:ring-sky-500/10"
                      placeholder="e.g. YouTube"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-medium text-slate-700 uppercase tracking-wider">URL</label>
                    <input
                      type="url"
                      value={link.url}
                      onChange={(e) => {
                        const newLinks = [...(contact.customLinks || [])];
                        newLinks[index].url = e.target.value;
                        const updated = { ...contact, customLinks: newLinks };
                        setContact(updated);
                        updateSection("contact", updated);
                      }}
                      className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none transition-all focus:border-sky-500 focus:ring-2 focus:ring-sky-500/10"
                      placeholder="https://"
                    />
                  </div>
                </div>
                <button
                  onClick={() => {
                    const newLinks = [...(contact.customLinks || [])];
                    newLinks.splice(index, 1);
                    const updated = { ...contact, customLinks: newLinks };
                    setContact(updated);
                    updateSection("contact", updated);
                    setDeletedMessage("Custom link deleted successfully.");
                    setTimeout(() => setDeletedMessage(null), 3000);
                  }}
                  className="mt-6 p-2 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-colors"
                  title="Remove Link"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" x2="10" y1="11" y2="17"/><line x1="14" x2="14" y1="11" y2="17"/></svg>
                </button>
              </div>
            ))}
            {(!contact.customLinks || contact.customLinks.length === 0) && (
              <div className="text-sm text-slate-500 italic py-4 text-center border-2 border-dashed border-slate-200 rounded-xl">
                No custom links added yet.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
