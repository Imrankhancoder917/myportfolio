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
  const isAnalyticsRoute = pathname?.startsWith("/analytics");
  const isProjectsRoute = pathname?.startsWith("/projects");
  const isHome = pathname === "/" || pathname === "";

  if (isAnalyticsRoute) {
    return <main className="min-h-screen bg-[#F8FAFC] text-slate-900">{children}</main>;
  }

  if (isProjectsRoute) {
    return (
      <div className="relative min-h-screen overflow-hidden bg-[radial-gradient(circle_at_top,_rgba(14,165,233,0.10),_transparent_35%),linear-gradient(180deg,#f8fcff_0%,#f4fbf8_100%)] text-slate-900">
        {!isHome && <Navbar />}
        <main className="relative min-h-screen">{children}</main>
        {!isHome && <Footer />}
      </div>
    );
  }

  return (
    <GradientBackground>
      {!isHome && <Navbar />}
      <main className={`relative ${isHome ? "pt-0" : "pt-16"} min-h-screen`}>
        {children}
      </main>
      {!isHome && <Footer />}
    </GradientBackground>
  );
}
