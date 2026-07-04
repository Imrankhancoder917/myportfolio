"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Bookmark,
  Code2,
  GitBranch,
  House,
  LayoutDashboard,
  LifeBuoy,
  MessageCircle,
  Medal,
  FolderKanban,
  Workflow,
  Sparkles,
} from "lucide-react";
import portfolioData from "@/data/portfolio.json";

const navigation = [
  { label: "Dashboard", href: "#overview", icon: LayoutDashboard },
  { label: "Problem Analytics", href: "#analytics", icon: Code2 },
  { label: "Platforms", href: "#platforms", icon: Sparkles },
  { label: "Contests", href: "#contests", icon: Medal },
  { label: "Activity", href: "#activity", icon: LifeBuoy },
  { label: "Bookmarks", href: "#bookmarks", icon: Bookmark },
];

interface DashboardSidebarProps {
  githubHref: string;
}

export default function DashboardSidebar({ githubHref }: DashboardSidebarProps) {
  const [active, setActive] = useState("#overview");

  return (
    <aside className="hidden lg:sticky lg:top-6 lg:block lg:h-[calc(100vh-3rem)] lg:self-start">
      <div className="flex h-full min-h-0 flex-col overflow-hidden rounded-[2rem] border border-slate-200/80 bg-white/90 p-4 shadow-[0_18px_60px_rgba(15,23,42,0.06)] backdrop-blur-xl sm:p-5">
        <div className="scrollbar-hidden min-h-0 flex-1 overflow-y-auto overscroll-contain pr-1">
          <div className="rounded-[1.5rem] border border-sky-50 bg-gradient-to-br from-white to-sky-50 p-5 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-900 text-white shadow-lg shadow-slate-300/40">
                <span className="text-sm font-semibold tracking-[0.22em]">IK</span>
              </div>
              <div>
                <h1 className="mt-1 text-lg font-semibold tracking-[-0.04em] text-slate-900">Imran Khan</h1>
              </div>
            </div>
            <p className="mt-4 text-sm leading-6 text-slate-500">
              DSA analytics, contest velocity, and platform performance in one clean control room.
            </p>
          </div>

          <nav className="mt-5 space-y-1">
            {navigation.map((item) => {
              const Icon = item.icon;
              const isActive = active === item.href;

              return (
                <motion.a
                  key={item.href}
                  href={item.href}
                  onClick={() => setActive(item.href)}
                  whileHover={{ x: 4 }}
                  className={`flex items-center justify-between rounded-2xl border px-4 py-3 text-sm font-medium transition-all ${
                    isActive
                      ? "border-sky-700 bg-gradient-to-br from-sky-600 to-emerald-600 text-white shadow-lg shadow-sky-200/50"
                      : "border-transparent text-slate-600 hover:border-sky-100 hover:bg-sky-50 hover:text-slate-900"
                  }`}
                >
                  <span className="flex items-center gap-3">
                    <Icon className="h-4 w-4" />
                    {item.label}
                  </span>
                  <span className={`h-2 w-2 rounded-full ${isActive ? "bg-white" : "bg-slate-300"}`} />
                </motion.a>
              );
            })}
          </nav>

          <div className="mt-6 rounded-[1.5rem] border border-slate-200 bg-slate-50/80 p-4">
            <p className="text-xs uppercase tracking-[0.32em] text-slate-400">Quick actions</p>
            <div className="mt-4 space-y-2">
              <Link href="/" className="flex items-center gap-3 rounded-2xl px-3 py-3 text-sm font-medium text-slate-700 transition-colors hover:bg-white hover:text-slate-950">
                <House className="h-4 w-4 text-slate-700" />
                Home
              </Link>
              <Link href="/projects" className="flex items-center gap-3 rounded-2xl px-3 py-3 text-sm font-medium text-slate-700 transition-colors hover:bg-white hover:text-slate-950">
                <FolderKanban className="h-4 w-4 text-indigo-500" />
                Projects
              </Link>
              <Link href="/skills" className="flex items-center gap-3 rounded-2xl px-3 py-3 text-sm font-medium text-slate-700 transition-colors hover:bg-white hover:text-slate-950">
                <Workflow className="h-4 w-4 text-violet-500" />
                Skills
              </Link>
              <Link href={portfolioData.education?.resume || "/resume.pdf"} target="_blank" className="flex items-center gap-3 rounded-2xl px-3 py-3 text-sm font-medium text-slate-700 transition-colors hover:bg-white hover:text-slate-950">
                <Sparkles className="h-4 w-4 text-sky-500" />
                Resume
              </Link>
              <Link href={githubHref} target="_blank" className="flex items-center gap-3 rounded-2xl px-3 py-3 text-sm font-medium text-slate-700 transition-colors hover:bg-white hover:text-slate-950">
                <GitBranch className="h-4 w-4 text-slate-700" />
                GitHub
              </Link>
              <Link href="/contact" className="flex items-center gap-3 rounded-2xl px-3 py-3 text-sm font-medium text-slate-700 transition-colors hover:bg-white hover:text-slate-950">
                <MessageCircle className="h-4 w-4 text-emerald-500" />
                Contact
              </Link>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}
