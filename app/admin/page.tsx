"use client";

import React from "react";
import Link from "next/link";
import { useAdmin } from "@/components/admin/AdminProvider";
import { User, Briefcase, Code2, Globe, Send, ArrowRight, LayoutDashboard } from "lucide-react";

export default function AdminDashboard() {
  const { draft } = useAdmin();

  const stats = [
    {
      label: "Projects",
      value: draft.projects?.length || 0,
      icon: <Briefcase className="h-5 w-5 text-sky-500" />,
      href: "/admin/projects",
      color: "bg-sky-500/10",
    },
    {
      label: "Skill Categories",
      value: draft.skills?.length || 0,
      icon: <Code2 className="h-5 w-5 text-emerald-500" />,
      href: "/admin/skills",
      color: "bg-emerald-500/10",
    },
    {
      label: "Connected Platforms",
      value: draft.platforms?.length || 0,
      icon: <Globe className="h-5 w-5 text-indigo-500" />,
      href: "/admin/platforms",
      color: "bg-indigo-500/10",
    },
  ];

  const quickLinks = [
    { title: "Profile Info", desc: "Update your name, bio, and status", icon: User, href: "/admin/profile" },
    { title: "Contact Details", desc: "Manage emails and social links", icon: Send, href: "/admin/contact" },
  ];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
          <LayoutDashboard className="h-6 w-6 text-slate-700" />
          Dashboard Overview
        </h2>
        <p className="text-slate-500 mt-1">
          Welcome back, <span className="text-sky-600 font-semibold">{draft.profile?.name || "Imran"}</span>. Manage your portfolio content from here.
        </p>
      </div>

      <div className="grid gap-6 sm:grid-cols-3">
        {stats.map((stat, i) => (
          <div key={i} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm flex flex-col justify-between hover:border-slate-300 transition-colors">
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-xl ${stat.color}`}>
                {stat.icon}
              </div>
              <span className="text-3xl font-bold text-slate-900">{stat.value}</span>
            </div>
            <div>
              <p className="text-sm font-medium text-slate-600">{stat.label}</p>
              <Link href={stat.href} className="text-xs text-sky-600 hover:text-sky-700 font-medium mt-1 inline-flex items-center gap-1">
                Manage <ArrowRight className="h-3 w-3" />
              </Link>
            </div>
          </div>
        ))}
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden flex flex-col">
          <div className="p-6 border-b border-slate-100">
            <h3 className="font-semibold text-slate-900">Quick Links</h3>
          </div>
          <div className="divide-y divide-slate-100 flex-1">
            {quickLinks.map((link, i) => (
              <Link key={i} href={link.href} className="flex items-center justify-between p-6 hover:bg-slate-50 transition-colors group">
                <div className="flex items-center gap-4">
                  <div className="h-10 w-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 group-hover:bg-sky-50 group-hover:text-sky-600 transition-colors">
                    <link.icon className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-900">{link.title}</p>
                    <p className="text-xs text-slate-500">{link.desc}</p>
                  </div>
                </div>
                <ArrowRight className="h-4 w-4 text-slate-400 group-hover:text-sky-500 transition-colors" />
              </Link>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm text-slate-900 flex flex-col justify-center relative overflow-hidden">
          <div className="absolute top-0 right-0 -mt-4 -mr-4 h-32 w-32 rounded-full bg-sky-50 blur-3xl"></div>
          <div className="absolute bottom-0 left-0 -mb-4 -ml-4 h-32 w-32 rounded-full bg-sky-100/50 blur-3xl"></div>
          
          <div className="relative z-10">
            <h3 className="text-xl font-bold mb-2">How it works</h3>
            <ul className="space-y-4 text-sm text-slate-600 mt-6">
              <li className="flex gap-3">
                <div className="h-6 w-6 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center flex-shrink-0 text-slate-700 font-medium text-xs">1</div>
                <p>Edit your portfolio content across the different sections in the sidebar.</p>
              </li>
              <li className="flex gap-3">
                <div className="h-6 w-6 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center flex-shrink-0 text-slate-700 font-medium text-xs">2</div>
                <p>Changes are saved locally in your browser as a <strong className="text-sky-600">Draft</strong> until you publish.</p>
              </li>
              <li className="flex gap-3">
                <div className="h-6 w-6 rounded-full bg-sky-500 flex items-center justify-center flex-shrink-0 text-white font-medium text-xs shadow-lg shadow-sky-500/20">3</div>
                <p>Click <strong className="text-sky-600">Publish Changes</strong> to push updates to GitHub and trigger a Vercel deployment.</p>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
