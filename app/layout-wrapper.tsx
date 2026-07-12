"use client";

import React from "react";
import { usePathname } from "next/navigation";
import Navbar from "@/components/common/Navbar";
import Footer from "@/components/common/Footer";
import GradientBackground from "@/components/layout/GradientBackground";

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const pathname = usePathname();
  const isAdminRoute = pathname?.startsWith("/admin");
  const isAnalyticsRoute = pathname?.startsWith("/analytics");
  const isProjectsRoute = pathname?.startsWith("/projects");
  const isSkillsRoute = pathname?.startsWith("/skills");
  const isHome = pathname === "/" || pathname === "";

  if (isAdminRoute) {
    return <main className="min-h-screen text-slate-900">{children}</main>;
  }

  if (isAnalyticsRoute) {
    return (
      <div className="relative min-h-screen bg-[#F8FAFC] text-slate-900">
        <Navbar />
        <main className="relative min-h-screen pt-24">{children}</main>
      </div>
    );
  }

  if (isProjectsRoute) {
    return (
      <div className="relative min-h-screen overflow-hidden bg-[radial-gradient(circle_at_top,_rgba(14,165,233,0.10),_transparent_35%),linear-gradient(180deg,#f8fcff_0%,#f4fbf8_100%)] text-slate-900">
        <Navbar />
        <main className="relative min-h-screen pt-24">{children}</main>
        {!isHome && <Footer />}
      </div>
    );
  }

  if (isSkillsRoute) {
    return (
      <div className="relative min-h-screen bg-slate-50 text-slate-900">
        <Navbar />
        <main className="relative min-h-screen pt-24">{children}</main>
        {!isHome && <Footer />}
      </div>
    );
  }

  const isContactRoute = pathname?.startsWith("/contact");
  const isAboutRoute = pathname?.startsWith("/about");
  if (isContactRoute || isAboutRoute) {
    return (
      <div className="relative min-h-screen bg-[#fcfcfc] text-gray-900">
        <Navbar />
        <main className="relative min-h-screen pt-24">{children}</main>
        {!isHome && <Footer />}
      </div>
    );
  }

  return (
    <GradientBackground>
      <Navbar />
      <main className={`relative ${isHome ? "pt-0" : "pt-24"} min-h-screen`}>
        {children}
      </main>
      <Footer />
    </GradientBackground>
  );
}
