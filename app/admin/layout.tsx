"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  UserCircle, 
  Briefcase, 
  Code2, 
  MonitorPlay, 
  GraduationCap, 
  Share2, 
  LogOut,
  Menu,
  X,
  FileText
} from "lucide-react";
import { AdminProvider } from "@/components/admin/AdminProvider";
import AdminTopbar from "@/components/admin/AdminTopbar";

const ADMIN_NAV = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/profile", label: "Profile", icon: UserCircle },
  { href: "/admin/education", label: "Resume & Education", icon: GraduationCap },
  { href: "/admin/skills", label: "Skills", icon: Code2 },
  { href: "/admin/projects", label: "Projects", icon: Briefcase },
  { href: "/admin/platforms", label: "Coding Platforms", icon: MonitorPlay },
  { href: "/admin/contact", label: "Contact & Socials", icon: Share2 },
];

function AdminSidebar({ open, setOpen }: { open: boolean; setOpen: (v: boolean) => void }) {
  const pathname = usePathname();

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    window.location.href = "/";
  };

  return (
    <>
      <div 
        className={`fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-sm lg:hidden ${open ? "block" : "hidden"}`} 
        onClick={() => setOpen(false)} 
      />
      <aside className={`fixed inset-y-0 left-0 z-50 flex w-72 flex-col border-r border-slate-200 bg-white transition-transform duration-300 lg:static lg:translate-x-0 ${open ? "translate-x-0" : "-translate-x-full"}`}>
        <div className="flex h-16 shrink-0 items-center justify-between px-6 border-b border-slate-100">
          <Link href="/admin" className="flex items-center gap-3">
            <span className="text-xl font-serif font-bold tracking-tight text-slate-900">Portfolio CMS</span>
          </Link>
          <button className="lg:hidden text-slate-500" onClick={() => setOpen(false)}>
            <X size={20} />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto p-4 space-y-1">
          {ADMIN_NAV.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-colors ${
                  isActive 
                    ? "bg-sky-50 text-sky-600 shadow-sm" 
                    : "text-slate-700 hover:bg-slate-50 hover:text-sky-600"
                }`}
              >
                <Icon size={18} className={isActive ? "text-sky-600" : "text-slate-400 group-hover:text-sky-500"} />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-slate-100">
          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-rose-600 transition-colors hover:bg-rose-50"
          >
            <LogOut size={18} className="text-rose-500" />
            Sign Out
          </button>
        </div>
      </aside>
    </>
  );
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <AdminProvider>
      <div className="flex h-screen overflow-hidden bg-slate-50">
        <AdminSidebar open={sidebarOpen} setOpen={setSidebarOpen} />
        
        <div className="flex flex-1 flex-col overflow-hidden">
          <AdminTopbar onMenuClick={() => setSidebarOpen(true)} />
          
          <main className="flex-1 overflow-y-auto p-6 lg:p-8">
            <div className="mx-auto max-w-5xl">
              {children}
            </div>
          </main>
        </div>
      </div>
    </AdminProvider>
  );
}
