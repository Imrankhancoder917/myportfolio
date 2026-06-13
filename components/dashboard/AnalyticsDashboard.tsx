"use client";

import React, { useCallback, useMemo, useState } from "react";
import { motion } from "framer-motion";
import type { AnalyticsDashboardData } from "@/lib/analytics/dashboard";
import { ANALYTICS_REFRESH_INTERVAL_MS } from "@/lib/constants/config";
import DashboardSidebar from "@/components/dashboard/DashboardSidebar";
import DashboardTopbar from "@/components/dashboard/DashboardTopbar";
import {
  ChartRange,
  ChartWorkspace,
  ContestPanel,
  OverviewStats,
  PlatformGrid,
  ProblemDistribution,
  RecentActivity,
} from "@/components/dashboard/DashboardSections";
import { formatDate } from "@/lib/utils/formatters";

interface AnalyticsDashboardProps {
  initialData: AnalyticsDashboardData;
}

const dashboardNavItems = [
  { id: "overview", label: "Overview" },
  { id: "platforms", label: "Platforms" },
  { id: "analytics", label: "Analytics" },
  { id: "distribution", label: "Problem Distribution" },
  { id: "contests", label: "Contests" },
] as const;

type DashboardSectionId = (typeof dashboardNavItems)[number]["id"];

export default function AnalyticsDashboard({ initialData }: AnalyticsDashboardProps) {
  const [data, setData] = useState(initialData);
  const [search, setSearch] = useState("");
  const [chartRange, setChartRange] = useState<ChartRange>("all");
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [activeSection, setActiveSection] = useState<DashboardSectionId>("overview");

  const refreshData = useCallback(async () => {
    setIsRefreshing(true);
    try {
      const response = await fetch("/api/analytics", { cache: "no-store" });
      if (!response.ok) {
        throw new Error("Failed to refresh analytics");
      }

      const nextData = (await response.json()) as AnalyticsDashboardData;
      setData(nextData);
    } catch (error) {
      console.error(error);
    } finally {
      setIsRefreshing(false);
    }
  }, []);

  React.useEffect(() => {
    const timer = window.setInterval(() => {
      void refreshData();
    }, ANALYTICS_REFRESH_INTERVAL_MS);

    return () => window.clearInterval(timer);
  }, [refreshData]);

  React.useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visibleEntry = entries
          .filter((entry) => entry.isIntersecting)
          .sort((left, right) => right.intersectionRatio - left.intersectionRatio)[0];

        if (visibleEntry) {
          setActiveSection(visibleEntry.target.id as DashboardSectionId);
        }
      },
      {
        rootMargin: "-18% 0px -62% 0px",
        threshold: [0.12, 0.24, 0.48],
      },
    );

    dashboardNavItems.forEach((item) => {
      const section = document.getElementById(item.id);
      if (section) observer.observe(section);
    });

    return () => observer.disconnect();
  }, []);

  const scrollToSection = useCallback((sectionId: DashboardSectionId) => {
    const section = document.getElementById(sectionId);
    if (!section) return;

    setActiveSection(sectionId);
    section.scrollIntoView({ behavior: "smooth", block: "start" });
  }, []);

  const connectedPlatforms = useMemo(
    () => data.platforms.filter((platform) => platform.status === "connected" && platform.analytics),
    [data.platforms],
  );

  const githubHref =
    connectedPlatforms.find((platform) => platform.platform === "github")?.analytics?.profileUrl ?? "https://github.com";

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(14,165,233,0.10),_transparent_35%),linear-gradient(180deg,#f8fcff_0%,#f4fbf8_100%)] text-slate-900">
      <div className="mx-auto grid w-full max-w-[1680px] gap-6 px-4 py-4 sm:px-6 lg:grid-cols-[18rem_minmax(0,1fr)] lg:px-8 lg:py-6 xl:grid-cols-[20rem_minmax(0,1fr)]">
        <DashboardSidebar githubHref={githubHref} />

        <div className="min-w-0 space-y-4">
          <DashboardTopbar
            search={search}
            onSearchChange={setSearch}
            onRefresh={refreshData}
            isRefreshing={isRefreshing}
            lastUpdated={formatDate(new Date(data.summary.lastUpdated))}
          />

          <DashboardSectionNav activeSection={activeSection} onNavigate={scrollToSection} />

          <main className="grid min-w-0 grid-cols-1 items-start gap-6 pb-6 xl:grid-cols-12">
            <div className="min-w-0 xl:col-span-12">
              <OverviewStats data={data} connectedPlatforms={connectedPlatforms} />
            </div>

            <div className="min-w-0 xl:col-span-8">
              <ChartWorkspace data={data} chartRange={chartRange} onRangeChange={setChartRange} />
            </div>

            <aside className="grid min-w-0 items-start gap-6 md:grid-cols-2 xl:col-span-4 xl:grid-cols-1 xl:self-start">
              <RecentActivity data={data} />
            </aside>

            <div className="min-w-0 xl:col-span-12">
              <PlatformGrid data={data} search={search} />
            </div>

            <div className="min-w-0 xl:col-span-6">
              <ProblemDistribution data={data} />
            </div>

            <div className="min-w-0 xl:col-span-6">
              <ContestPanel data={data} />
            </div>

          </main>
        </div>
      </div>
    </div>
  );
}

function DashboardSectionNav({
  activeSection,
  onNavigate,
}: {
  activeSection: DashboardSectionId;
  onNavigate: (sectionId: DashboardSectionId) => void;
}) {
  return (
    <motion.nav
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="sticky top-4 z-30 rounded-[1.5rem] border border-sky-100/80 bg-white/90 p-2 shadow-[0_18px_60px_rgba(14,165,233,0.08)] backdrop-blur-xl"
      aria-label="Dashboard sections"
    >
      <div className="flex gap-2 overflow-x-auto">
        {dashboardNavItems.map((item) => {
          const active = activeSection === item.id;

          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onNavigate(item.id)}
              className={`shrink-0 rounded-full px-4 py-2 text-sm font-medium transition-all ${
                active
                  ? "bg-gradient-to-r from-sky-600 to-emerald-600 text-white shadow-lg shadow-sky-200/70"
                  : "text-slate-500 hover:bg-sky-50 hover:text-slate-950"
              }`}
            >
              {item.label}
            </button>
          );
        })}
      </div>
    </motion.nav>
  );
}
