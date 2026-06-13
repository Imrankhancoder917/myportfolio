"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  PolarAngleAxis,
  PolarGrid,
  PolarRadiusAxis,
  Radar,
  RadarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  Code2,
  ExternalLink,
  Flame,
  Globe2,
  RefreshCw,
  Shield,
  Sparkles,
  Target,
  TrendingUp,
  Trophy,
  Zap,
} from "lucide-react";
import FloatingGeometry from "@/components/3d/FloatingGeometry";
import SectionContainer from "@/components/layout/SectionContainer";
import StatCard from "@/components/cards/StatCard";
import { formatDate, formatNumber, formatStreak, formatInteger } from "@/lib/utils/formatters";
import type { AnalyticsDashboardData, AnalyticsPlatformKey, DashboardPlatformSnapshot } from "@/lib/analytics/dashboard";
import { ANALYTICS_REFRESH_INTERVAL_MS, PLATFORM_NAMES } from "@/lib/constants/config";

interface CodingAnalyticsDashboardProps {
  initialData: AnalyticsDashboardData;
}

const filterOptions: Array<{ key: AnalyticsPlatformKey; label: string; icon: React.ComponentType<{ className?: string }> }> = [
  { key: "all", label: "All Platforms", icon: Sparkles },
  { key: "leetcode", label: PLATFORM_NAMES.leetcode, icon: Code2 },
  { key: "codeforces", label: PLATFORM_NAMES.codeforces, icon: Target },
  { key: "codechef", label: PLATFORM_NAMES.codechef, icon: Trophy },
  { key: "hackerrank", label: PLATFORM_NAMES.hackerrank, icon: Shield },
  { key: "gfg", label: PLATFORM_NAMES.gfg, icon: TrendingUp },
  { key: "github", label: PLATFORM_NAMES.github, icon: Globe2 },
  { key: "atcoder", label: PLATFORM_NAMES.atcoder, icon: Flame },
];

const platformOrder: AnalyticsPlatformKey[] = [
  "leetcode",
  "codeforces",
  "codechef",
  "hackerrank",
  "gfg",
  "github",
  "atcoder",
];

function formatStatus(platform: DashboardPlatformSnapshot): string {
  if (platform.status === "connected") {
    return "Connected";
  }
  if (platform.status === "missing") {
    return "Not configured";
  }
  return "Fetch failed";
}

function getPlatformColor(platform: string): string {
  const toneMap: Record<string, string> = {
    leetcode: "#FFA116",
    codeforces: "#3B82F6",
    codechef: "#A78BFA",
    hackerrank: "#2EC866",
    gfg: "#10B981",
    github: "#94A3B8",
    atcoder: "#06B6D4",
  };

  return toneMap[platform] ?? "#60A5FA";
}

function formatRating(rating?: number | null): string {
  if (rating == null) {
    return "—";
  }

  return Number.isInteger(rating) ? rating.toString() : rating.toFixed(2);
}

export default function CodingAnalyticsDashboard({ initialData }: CodingAnalyticsDashboardProps) {
  const [data, setData] = useState(initialData);
  const [selectedPlatform, setSelectedPlatform] = useState<AnalyticsPlatformKey>("all");
  const [isRefreshing, setIsRefreshing] = useState(false);

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

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      void refreshData();
    }, ANALYTICS_REFRESH_INTERVAL_MS);

    return () => window.clearInterval(intervalId);
  }, [refreshData]);

  const connectedPlatforms = data.platforms.filter((platform) => platform.status === "connected" && platform.analytics);
  const chartPlatforms = data.platforms.filter((platform) => platform.analytics);
  const selectedPlatformSnapshot = selectedPlatform === "all"
    ? null
    : data.platforms.find((platform) => platform.platform === selectedPlatform) ?? null;

  const selectedAnalytics = selectedPlatformSnapshot?.analytics ?? null;

  const chartBars = useMemo(
    () => chartPlatforms.map((platform) => ({
      platform: PLATFORM_NAMES[platform.platform] ?? platform.platform,
      solved: platform.analytics?.totalSolved ?? 0,
      contests: platform.analytics?.contests ?? 0,
      streak: platform.analytics?.activeStreak ?? 0,
      color: platform.color,
    })),
    [chartPlatforms],
  );

  const distribution = useMemo(
    () => chartPlatforms.map((platform) => ({
      name: PLATFORM_NAMES[platform.platform] ?? platform.platform,
      value: platform.analytics?.totalSolved ?? 0,
      color: platform.color,
      platform: platform.platform,
    })),
    [chartPlatforms],
  );

  const radarData = selectedAnalytics
    ? [
        { metric: "Solved", value: selectedAnalytics.totalSolved },
        { metric: "Contests", value: selectedAnalytics.contests },
        { metric: "Streak", value: selectedAnalytics.activeStreak },
        { metric: "Max Streak", value: selectedAnalytics.maxStreak },
        { metric: "Rating", value: selectedAnalytics.rating ?? 0 },
      ]
    : [];

  const overviewCards = [
    { label: "Problems Solved", value: data.summary.totalProblems, icon: Code2, color: "cyan" as const },
    { label: "Contests Entered", value: data.summary.totalContests, icon: Trophy, color: "purple" as const },
    { label: "Average Streak", value: data.summary.avgStreak, suffix: "days", icon: Flame, color: "green" as const },
    { label: "Max Streak", value: data.summary.maxStreak, suffix: "days", icon: Zap, color: "orange" as const },
  ];

  return (
    <main className="relative">
      <SectionContainer className="pt-28 sm:pt-32 pb-10 sm:pb-16">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55 }}
          className="relative overflow-hidden rounded-[2rem] border border-cyan-400/20 bg-slate-950/70 backdrop-blur-xl"
        >
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(34,211,238,0.18),_transparent_28%),radial-gradient(circle_at_bottom_right,_rgba(59,130,246,0.14),_transparent_30%)]" />
          <div className="absolute inset-0 opacity-[0.08] [background-image:linear-gradient(rgba(255,255,255,0.25)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.25)_1px,transparent_1px)] [background-size:42px_42px]" />

          <div className="relative z-10 grid gap-10 xl:grid-cols-[1.2fr_0.8fr] p-6 sm:p-8 lg:p-10">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-cyan-400/30 bg-cyan-400/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-cyan-200">
                <Sparkles className="h-4 w-4" />
                Unified coding telemetry
              </div>
              <h1 className="mt-6 text-4xl font-black tracking-tight text-white sm:text-5xl lg:text-6xl">
                Premium coding analytics
                <span className="block bg-gradient-to-r from-cyan-300 via-sky-300 to-violet-300 bg-clip-text text-transparent">
                  across every platform.
                </span>
              </h1>
              <p className="mt-5 max-w-2xl text-base leading-7 text-slate-300 sm:text-lg">
                Real-time aggregation from public coding profiles with one control panel for LeetCode, Codeforces, CodeChef, HackerRank, GeeksforGeeks, GitHub, and optional AtCoder support.
              </p>

              <div className="mt-8 flex flex-wrap items-center gap-3 text-sm text-slate-300">
                <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2">
                  <Shield className="h-4 w-4 text-cyan-300" />
                  Live public data
                </span>
                <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2">
                  <Globe2 className="h-4 w-4 text-sky-300" />
                  {data.summary.platformCount} connected platforms
                </span>
                <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2">
                  <TrendingUp className="h-4 w-4 text-violet-300" />
                  {data.summary.completionRate}% coverage
                </span>
              </div>

              <div className="mt-8 flex flex-wrap gap-3">
                <button
                  onClick={refreshData}
                  disabled={isRefreshing}
                  className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-cyan-500/30 transition-transform hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-70"
                >
                  <RefreshCw className={`h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`} />
                  Refresh Stats
                </button>
                <Link
                  href="#platforms"
                  className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-5 py-3 text-sm font-semibold text-slate-200 transition-colors hover:border-cyan-400/40 hover:bg-cyan-400/10"
                >
                  View platform matrix
                  <ExternalLink className="h-4 w-4" />
                </Link>
              </div>
            </div>

            <div className="grid gap-4">
              <div className="rounded-[1.5rem] border border-cyan-400/20 bg-slate-900/60 p-4 shadow-2xl shadow-cyan-950/30">
                <div className="flex items-center justify-between pb-3">
                  <div>
                    <p className="text-xs uppercase tracking-[0.3em] text-cyan-300/80">Last sync</p>
                    <p className="mt-1 text-sm text-slate-300">{formatDate(new Date(data.generatedAt))}</p>
                  </div>
                  <div className="rounded-full border border-emerald-400/30 bg-emerald-400/10 px-3 py-1 text-xs font-semibold text-emerald-200">
                    Live
                  </div>
                </div>
                <div className="relative h-[280px] overflow-hidden rounded-[1.25rem] border border-white/10 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
                  <FloatingGeometry />
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4 grid grid-cols-2 gap-3 text-xs text-slate-200 sm:text-sm">
                    <div className="rounded-2xl border border-white/10 bg-slate-950/70 px-3 py-3 backdrop-blur">
                      <div className="text-slate-400">Top platform</div>
                      <div className="mt-1 font-semibold">{data.summary.topPlatform?.label ?? "No connected data"}</div>
                    </div>
                    <div className="rounded-2xl border border-white/10 bg-slate-950/70 px-3 py-3 backdrop-blur">
                      <div className="text-slate-400">Completion</div>
                      <div className="mt-1 font-semibold">{data.summary.completionRate}% coverage</div>
                    </div>
                  </div>
                </div>
              </div>

              {data.summary.topPlatform && (
                <div className="grid grid-cols-2 gap-4">
                  <div className="rounded-3xl border border-white/10 bg-white/5 p-4">
                    <p className="text-xs uppercase tracking-[0.24em] text-slate-400">Top solved</p>
                    <p className="mt-2 text-3xl font-black text-white">{formatInteger(data.summary.topPlatform.totalSolved)}</p>
                    <p className="mt-1 text-sm text-slate-400">{data.summary.topPlatform.label}</p>
                  </div>
                  <div className="rounded-3xl border border-white/10 bg-white/5 p-4">
                    <p className="text-xs uppercase tracking-[0.24em] text-slate-400">Platform count</p>
                    <p className="mt-2 text-3xl font-black text-white">{data.summary.platformCount}</p>
                    <p className="mt-1 text-sm text-slate-400">of {data.summary.supportedCount} supported</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </SectionContainer>

      <SectionContainer className="pt-0 pb-10 sm:pb-16">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
          {overviewCards.map((card, index) => (
            <StatCard key={card.label} index={index} {...card} />
          ))}
        </div>
      </SectionContainer>

      <SectionContainer className="pt-0 pb-12 sm:pb-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
          viewport={{ once: true }}
          className="rounded-[2rem] border border-white/10 bg-slate-950/70 p-4 backdrop-blur-xl sm:p-6"
        >
          <div className="mb-5 flex flex-wrap items-center justify-between gap-4">
            <div>
              <h2 className="text-2xl font-bold text-white sm:text-3xl">Platform filters</h2>
              <p className="mt-1 text-sm text-slate-400">Switch between unified and platform-specific telemetry.</p>
            </div>
            <div className="text-sm text-slate-400">
              {selectedPlatform === "all"
                ? `${connectedPlatforms.length} connected profiles`
                : selectedPlatformSnapshot
                  ? `${formatStatus(selectedPlatformSnapshot)} • ${selectedPlatformSnapshot.label}`
                  : "No platform selected"}
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            {filterOptions.map((option) => {
              const Icon = option.icon;
              const active = selectedPlatform === option.key;

              return (
                <motion.button
                  key={option.key}
                  onClick={() => setSelectedPlatform(option.key)}
                  whileHover={{ y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  className={`inline-flex items-center gap-2 rounded-full border px-4 py-3 text-sm font-semibold transition-all ${
                    active
                      ? "border-cyan-400/50 bg-cyan-400/15 text-cyan-100 shadow-lg shadow-cyan-500/10"
                      : "border-white/10 bg-white/5 text-slate-300 hover:border-white/20 hover:bg-white/10"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {option.label}
                </motion.button>
              );
            })}
          </div>
        </motion.div>
      </SectionContainer>

      <SectionContainer className="pt-0 pb-12 sm:pb-16">
        <div className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="rounded-[2rem] border border-white/10 bg-slate-950/75 p-5 sm:p-6"
          >
            <div className="mb-6 flex items-center justify-between gap-4">
              <div>
                <h3 className="text-xl font-bold text-white sm:text-2xl">
                  {selectedPlatform === "all" ? "Cross-platform comparison" : `${selectedPlatformSnapshot?.label ?? "Platform"} deep dive`}
                </h3>
                <p className="mt-1 text-sm text-slate-400">
                  {selectedPlatform === "all"
                    ? "Problem solving and contest volume across every connected profile."
                    : selectedPlatformSnapshot?.description ?? "No platform data available yet."}
                </p>
              </div>
              <div className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-slate-300">
                {selectedPlatform === "all" ? "Unified" : "Focused"}
              </div>
            </div>

            <div className="h-[340px] sm:h-[380px]">
              {selectedPlatform === "all" ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartBars} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                    <CartesianGrid stroke="rgba(148,163,184,0.14)" strokeDasharray="3 3" />
                    <XAxis dataKey="platform" tick={{ fill: "#cbd5e1", fontSize: 12 }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fill: "#cbd5e1", fontSize: 12 }} axisLine={false} tickLine={false} />
                    <Tooltip
                      contentStyle={{
                        background: "rgba(2,6,23,0.92)",
                        border: "1px solid rgba(148,163,184,0.2)",
                        borderRadius: 16,
                        color: "#fff",
                      }}
                    />
                    <Legend />
                    <Bar dataKey="solved" fill="#06b6d4" radius={[12, 12, 0, 0]} name="Solved" />
                    <Bar dataKey="contests" fill="#8b5cf6" radius={[12, 12, 0, 0]} name="Contests" />
                  </BarChart>
                </ResponsiveContainer>
              ) : selectedAnalytics ? (
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart data={radarData}>
                    <PolarGrid stroke="rgba(148,163,184,0.18)" />
                    <PolarAngleAxis dataKey="metric" tick={{ fill: "#cbd5e1", fontSize: 12 }} />
                    <PolarRadiusAxis tick={{ fill: "#94a3b8", fontSize: 10 }} />
                    <Radar
                      dataKey="value"
                      stroke={getPlatformColor(selectedAnalytics.platform)}
                      fill={getPlatformColor(selectedAnalytics.platform)}
                      fillOpacity={0.35}
                    />
                    <Tooltip
                      contentStyle={{
                        background: "rgba(2,6,23,0.92)",
                        border: "1px solid rgba(148,163,184,0.2)",
                        borderRadius: 16,
                        color: "#fff",
                      }}
                    />
                  </RadarChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex h-full items-center justify-center rounded-[1.5rem] border border-white/10 bg-white/5 text-slate-400">
                  Connect a profile to render focused analytics.
                </div>
              )}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="rounded-[2rem] border border-white/10 bg-slate-950/75 p-5 sm:p-6"
          >
            <div className="mb-6 flex items-center justify-between gap-4">
              <div>
                <h3 className="text-xl font-bold text-white sm:text-2xl">Solved distribution</h3>
                <p className="mt-1 text-sm text-slate-400">A visual breakdown of problem volume by platform.</p>
              </div>
              <div className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-slate-300">
                Ranked
              </div>
            </div>

            <div className="h-[340px] sm:h-[380px]">
              {selectedPlatform === "all" ? (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={distribution}
                      dataKey="value"
                      nameKey="name"
                      innerRadius={70}
                      outerRadius={125}
                      paddingAngle={3}
                    >
                      {distribution.map((entry) => (
                        <Cell key={entry.platform} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        background: "rgba(2,6,23,0.92)",
                        border: "1px solid rgba(148,163,184,0.2)",
                        borderRadius: 16,
                        color: "#fff",
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              ) : selectedAnalytics && selectedPlatformSnapshot ? (
                <div className="grid h-full gap-4 md:grid-cols-2">
                  <div className="rounded-[1.5rem] border border-white/10 bg-white/5 p-5">
                    <p className="text-xs uppercase tracking-[0.24em] text-slate-400">Status</p>
                    <p className="mt-2 text-2xl font-black text-white">{formatStatus(selectedPlatformSnapshot)}</p>
                    <p className="mt-2 text-sm text-slate-400">{selectedPlatformSnapshot.description}</p>
                    {selectedAnalytics.profileUrl && (
                      <Link
                        href={selectedAnalytics.profileUrl}
                        target="_blank"
                        className="mt-5 inline-flex items-center gap-2 rounded-full border border-cyan-400/30 bg-cyan-400/10 px-4 py-2 text-sm font-semibold text-cyan-100 transition-colors hover:bg-cyan-400/15"
                      >
                        Open profile
                        <ExternalLink className="h-4 w-4" />
                      </Link>
                    )}
                  </div>

                  <div className="rounded-[1.5rem] border border-white/10 bg-gradient-to-br from-cyan-400/10 via-blue-500/10 to-violet-500/10 p-5">
                    <p className="text-xs uppercase tracking-[0.24em] text-slate-300">Core metrics</p>
                    <div className="mt-4 grid gap-4">
                      <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-slate-950/60 px-4 py-3">
                        <span className="text-slate-400">Problems</span>
                        <span className="font-semibold text-white">{formatInteger(selectedAnalytics.totalSolved)}</span>
                      </div>
                      <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-slate-950/60 px-4 py-3">
                        <span className="text-slate-400">Contests</span>
                        <span className="font-semibold text-white">{formatNumber(selectedAnalytics.contests)}</span>
                      </div>
                      <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-slate-950/60 px-4 py-3">
                        <span className="text-slate-400">Streak</span>
                        <span className="font-semibold text-white">{formatStreak(selectedAnalytics.activeStreak)}</span>
                      </div>
                      <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-slate-950/60 px-4 py-3">
                        <span className="text-slate-400">Updated</span>
                        <span className="font-semibold text-white">{formatDate(new Date(selectedAnalytics.lastUpdated))}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex h-full items-center justify-center rounded-[1.5rem] border border-white/10 bg-white/5 text-slate-400">
                  No data available for this platform.
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </SectionContainer>

      <SectionContainer id="platforms" className="pt-0 pb-16 sm:pb-24">
        <div className="mb-6 flex items-end justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-white sm:text-3xl">Platform matrix</h2>
            <p className="mt-1 text-sm text-slate-400">Every supported profile is tracked here, ready to scale as you add more sources.</p>
          </div>
          <div className="text-sm text-slate-400">Updated {formatDate(new Date(data.summary.lastUpdated))}</div>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {platformOrder.map((platformKey) => {
            const snapshot = data.platforms.find((entry) => entry.platform === platformKey);
            if (!snapshot) {
              return null;
            }

            const active = selectedPlatform === platformKey;
            const analytics = snapshot.analytics;

            return (
              <motion.button
                key={snapshot.platform}
                onClick={() => setSelectedPlatform(platformKey)}
                whileHover={{ y: -4 }}
                whileTap={{ scale: 0.99 }}
                className={`group text-left rounded-[1.6rem] border p-5 transition-all ${
                  active
                    ? "border-cyan-400/50 bg-cyan-400/10 shadow-lg shadow-cyan-500/10"
                    : "border-white/10 bg-slate-950/70 hover:border-white/20 hover:bg-slate-950/90"
                }`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-sm uppercase tracking-[0.24em] text-slate-400">{snapshot.label}</p>
                    <h3 className="mt-2 text-2xl font-bold text-white">{formatStatus(snapshot)}</h3>
                    <p className="mt-1 text-sm text-slate-400">{snapshot.description}</p>
                  </div>
                  <div
                    className="h-3 w-3 rounded-full shadow-lg"
                    style={{ backgroundColor: snapshot.color, boxShadow: `0 0 18px ${snapshot.color}` }}
                  />
                </div>

                <div className="mt-5 grid grid-cols-2 gap-3 text-sm">
                    <div className="rounded-2xl border border-white/10 bg-white/5 px-3 py-3">
                    <span className="block text-slate-400">Solved</span>
                    <span className="mt-1 block font-semibold text-white">
                      {analytics ? formatInteger(analytics.totalSolved) : "—"}
                    </span>
                  </div>
                  <div className="rounded-2xl border border-white/10 bg-white/5 px-3 py-3">
                    <span className="block text-slate-400">Contests</span>
                    <span className="mt-1 block font-semibold text-white">
                      {analytics ? formatNumber(analytics.contests) : "—"}
                    </span>
                  </div>
                  <div className="rounded-2xl border border-white/10 bg-white/5 px-3 py-3">
                    <span className="block text-slate-400">Streak</span>
                    <span className="mt-1 block font-semibold text-white">
                      {analytics ? formatStreak(analytics.activeStreak) : "—"}
                    </span>
                  </div>
                  <div className="rounded-2xl border border-white/10 bg-white/5 px-3 py-3">
                    <span className="block text-slate-400">Rating</span>
                    <span className="mt-1 block font-semibold text-white">
                      {formatRating(analytics?.rating)}
                    </span>
                  </div>
                </div>
              </motion.button>
            );
          })}
        </div>
      </SectionContainer>
    </main>
  );
}
