"use client";

import React, { useMemo } from "react";
import { motion } from "framer-motion";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
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
import { ArrowUpRight, BadgeCheck, BookOpen, CircleSlash2, Code2, Flame, GitBranch, Medal, PlayCircle, Trophy } from "lucide-react";
import type { AnalyticsDashboardData, DashboardPlatformSnapshot } from "@/lib/analytics/dashboard";
import { PLATFORM_NAMES } from "@/lib/constants/config";
import AnimatedNumber from "@/components/dashboard/AnimatedNumber";
import { formatInteger, formatStreak } from "@/lib/utils/formatters";

import { ChartRange } from "@/lib/analytics/dashboard";

interface SharedProps {
  data: AnalyticsDashboardData;
  search: string;
  chartRange: ChartRange;
  onRangeChange: (range: ChartRange) => void;
}

interface SectionProps extends SharedProps {
  connectedPlatforms: DashboardPlatformSnapshot[];
}

function panelClassName(active = false) {
  return `scroll-mt-32 rounded-[1.75rem] border bg-white/95 shadow-[0_18px_60px_rgba(14,165,233,0.06)] backdrop-blur-xl ${
    active ? "border-sky-100" : "border-sky-50"
  }`;
}

function formatPercent(value: number): string {
  return `${formatInteger(value)}%`;
}

type NumberTone = "red" | "blue" | "green";

const numberToneClasses: Record<NumberTone, string> = {
  red: "text-red-600 bg-red-50",
  blue: "text-blue-600 bg-blue-50",
  green: "text-emerald-600 bg-emerald-50",
};

function toneForIndex(index: number): NumberTone {
  return ["red", "blue", "green"][index % 3] as NumberTone;
}

function buildHeatmapSeed(summaryValue: number, spreadValue: number) {
  return Array.from({ length: 7 }, (_, row) =>
    Array.from({ length: 12 }, (_, col) => {
      const value = Math.abs(summaryValue + row * 17 + col * 11 + spreadValue * 7) % 5;
      return value;
    }),
  );
}

export function OverviewStats({ data, connectedPlatforms }: Pick<SectionProps, "data" | "connectedPlatforms">) {
  const currentStreak = connectedPlatforms.reduce((max, item) => Math.max(max, item.analytics?.activeStreak ?? 0), 0);

  const stats = [
    { label: "Total Problems Solved", value: data.summary.totalProblems, icon: Code2, suffix: "" },
    { label: "Active Platforms", value: connectedPlatforms.length, icon: PlayCircle, suffix: " Platforms" },
    { label: "Current Streak", value: currentStreak, icon: Flame, suffix: " Days" },
    { label: "Longest Streak", value: data.summary.maxStreak, icon: Trophy, suffix: " Days" },
    { label: "Contest Participations", value: data.summary.totalContests, icon: Medal, suffix: " Contests" },
    { label: "Platform Coverage", value: data.summary.completionRate, icon: BadgeCheck, suffix: "%" },
  ];

  return (
    <section id="overview" className="grid scroll-mt-32 gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-6">
      {stats.map((stat, index) => {
        const Icon = stat.icon;
        const tone = toneForIndex(index);

        return (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.45, delay: index * 0.05 }}
            whileHover={{ y: -4 }}
            className="flex min-h-[8.5rem] flex-col justify-between rounded-[1.5rem] border border-sky-50 bg-white p-5 shadow-[0_14px_40px_rgba(14,165,233,0.04)] transition-shadow hover:shadow-[0_24px_70px_rgba(20,184,166,0.06)]"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0">
                <p className="text-sm font-medium text-slate-500">{stat.label}</p>
                <div className="mt-3 flex items-end gap-2">
                  <AnimatedNumber value={stat.value} className={`text-3xl font-semibold tracking-[-0.06em] 2xl:text-4xl ${tone === "red" ? "text-red-600" : tone === "blue" ? "text-blue-600" : "text-emerald-600"}`} />
                  {stat.suffix && <span className="pb-1 text-sm font-medium text-slate-500">{stat.suffix}</span>}
                </div>
              </div>
              <div className="shrink-0 rounded-2xl border border-sky-50 bg-slate-50 p-3 text-slate-700">
                <Icon className="h-5 w-5" />
              </div>
            </div>
          </motion.div>
        );
      })}
    </section>
  );
}

export function ChartWorkspace({ data, chartRange, onRangeChange }: Pick<SectionProps, "data" | "chartRange" | "onRangeChange">) {
  const chartData = useMemo(
    () =>
      data.platforms
        .filter((platform) => platform.analytics)
        .map((platform) => ({
          name: PLATFORM_NAMES[platform.platform] ?? platform.platform,
          platform: platform.platform,
          solved: platform.analytics?.totalSolved ?? 0,
          contests: platform.analytics?.contests ?? 0,
          streak: platform.analytics?.activeStreak ?? 0,
          rating: platform.analytics?.rating ?? 0,
          maxRating: platform.analytics?.maxRating ?? platform.analytics?.rating ?? 0,
          color: platform.color,
        }))
        .sort((left, right) => right.solved - left.solved),
    [data.platforms],
  );

  const radarData = chartData.slice(0, 5).map((item) => ({
    ...item,
    solved: item.solved,
    contests: item.contests,
    streak: item.streak,
    rating: item.rating,
  }));

  return (
    <section id="analytics" className={panelClassName()}>
      <div className="border-b border-slate-200 px-5 py-5 sm:px-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.34em] text-slate-400">Main Analytics</p>
            <h3 className="mt-2 text-2xl font-semibold tracking-[-0.05em] text-slate-950 sm:text-3xl">Progress and performance snapshots</h3>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
              Premium live snapshot of problem solving, contest performance, platform comparison, and rating progression.
            </p>
          </div>
        </div>
      </div>

      <div className="grid gap-0 2xl:grid-cols-[minmax(0,1.35fr)_minmax(20rem,0.65fr)]">
        <div className="min-w-0 border-b border-slate-200 p-5 sm:p-6 2xl:border-b-0 2xl:border-r">
          {chartRange === "all" && (
            <ChartFrame title="Problems solved trend" subtitle="Current live platform totals presented as a polished multi-series view.">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 10, right: 8, left: -10, bottom: 0 }}>
                  <CartesianGrid stroke="#E2E8F0" strokeDasharray="3 3" />
                  <XAxis dataKey="name" tick={{ fill: "#64748B", fontSize: 12 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: "#64748B", fontSize: 12 }} axisLine={false} tickLine={false} tickFormatter={formatInteger} />
                  <Tooltip contentStyle={tooltipStyle} formatter={(value) => formatInteger(Number(value))} />
                  <Legend />
                  <Bar dataKey="solved" name="Solved" fill="#0EA5E9" radius={[12, 12, 0, 0]} />
                  <Bar dataKey="contests" name="Contests" fill="#14B8A6" radius={[12, 12, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </ChartFrame>
          )}

          {(chartRange === "30_days" || chartRange === "60_days") && (
            <ChartFrame title="Contest history" subtitle="A sleek line-based view of contest activity across connected platforms.">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData} margin={{ top: 10, right: 8, left: -10, bottom: 0 }}>
                  <CartesianGrid stroke="#E2E8F0" strokeDasharray="3 3" />
                  <XAxis dataKey="name" tick={{ fill: "#64748B", fontSize: 12 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: "#64748B", fontSize: 12 }} axisLine={false} tickLine={false} tickFormatter={formatInteger} />
                  <Tooltip contentStyle={tooltipStyle} formatter={(value) => formatInteger(Number(value))} />
                  <Legend />
                  <Line type="monotone" dataKey="contests" name="Contest participations" stroke="#0F766E" strokeWidth={3} dot={{ r: 4 }} />
                  <Line type="monotone" dataKey="streak" name="Current streak" stroke="#2563EB" strokeWidth={3} dot={{ r: 4 }} />
                </LineChart>
              </ResponsiveContainer>
            </ChartFrame>
          )}

          {(chartRange === "3_months" || chartRange === "6_months") && (
            <ChartFrame title="Platform comparison" subtitle="Radar balance of solved counts, contests, streaks, and ratings.">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={radarData}>
                  <PolarGrid stroke="#E2E8F0" />
                  <PolarAngleAxis dataKey="name" tick={{ fill: "#64748B", fontSize: 12 }} />
                  <PolarRadiusAxis tick={{ fill: "#94A3B8", fontSize: 10 }} tickFormatter={formatInteger} />
                  <Radar dataKey="solved" stroke="#0EA5E9" fill="#0EA5E9" fillOpacity={0.18} />
                  <Radar dataKey="contests" stroke="#14B8A6" fill="#14B8A6" fillOpacity={0.14} />
                  <Radar dataKey="rating" stroke="#8B5CF6" fill="#8B5CF6" fillOpacity={0.12} />
                  <Tooltip contentStyle={tooltipStyle} formatter={(value) => formatInteger(Number(value))} />
                </RadarChart>
              </ResponsiveContainer>
            </ChartFrame>
          )}

          {chartRange === "1_year" && (
            <ChartFrame title="Rating progression" subtitle="A refined score view for your strongest platforms and contest footprint.">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData} margin={{ top: 10, right: 8, left: -10, bottom: 0 }}>
                  <defs>
                    <linearGradient id="ratingFill" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.34} />
                      <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0.04} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid stroke="#E2E8F0" strokeDasharray="3 3" />
                  <XAxis dataKey="name" tick={{ fill: "#64748B", fontSize: 12 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: "#64748B", fontSize: 12 }} axisLine={false} tickLine={false} tickFormatter={formatInteger} />
                  <Tooltip contentStyle={tooltipStyle} formatter={(value) => formatInteger(Number(value))} />
                  <Legend />
                  <Area type="monotone" dataKey="rating" name="Rating" stroke="#8B5CF6" fill="url(#ratingFill)" strokeWidth={3} />
                  <Area type="monotone" dataKey="maxRating" name="Max rating" stroke="#0EA5E9" fillOpacity={0.1} fill="#0EA5E9" strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            </ChartFrame>
          )}
        </div>

        <div className="min-w-0 p-5 sm:p-6">
          <div className="rounded-[1.5rem] border border-slate-200 bg-slate-50/70 p-4">
            <p className="text-xs uppercase tracking-[0.34em] text-slate-400">At a glance</p>
            <div className="mt-4 grid gap-3 text-sm sm:grid-cols-2 2xl:grid-cols-1">
              <MetricChip label="Total Problems" value={data.summary.totalProblems} icon={Code2} tone="sky" />
              <MetricChip label="Contests" value={data.summary.totalContests} icon={Trophy} tone="teal" />
              <MetricChip label="Top Platform" value={data.summary.topPlatform?.totalSolved ?? 0} icon={ArrowUpRight} tone="violet" suffix=" solved" />
              <MetricChip label="Coverage" value={data.summary.completionRate} icon={BadgeCheck} tone="emerald" suffix="%" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export function PlatformGrid({ data, search }: Pick<SectionProps, "data" | "search">) {
  const visiblePlatforms = data.platforms.filter((platform) => {
    const query = search.trim().toLowerCase();
    if (!query) return true;
    return [platform.label, platform.username, platform.platform, platform.description].some((value) => value.toLowerCase().includes(query));
  });

  return (
    <section id="platforms" className={panelClassName()}>
      <div className="border-b border-slate-200 px-5 py-5 sm:px-6">
        <p className="text-xs uppercase tracking-[0.34em] text-slate-400">Platforms</p>
        <h3 className="mt-2 text-2xl font-semibold tracking-[-0.05em] text-slate-950">Active coding profiles</h3>
      </div>

      <div className="grid items-start gap-4 p-5 sm:p-6 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
        {visiblePlatforms.map((platform, index) => {
          const analytics = platform.analytics;
          const isConnected = platform.status === "connected" && !!analytics;
          const isGitHub = platform.platform === "github" && !!analytics;
          const metricTone = toneForIndex(index);

          return (
            <motion.article
              key={platform.platform}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45, delay: index * 0.04 }}
              whileHover={{ y: -4 }}
              className="flex flex-col rounded-[1.5rem] border border-slate-200 bg-white p-3.5 shadow-[0_12px_38px_rgba(15,23,42,0.05)]"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-xs uppercase tracking-[0.3em] text-slate-400">{platform.label}</p>
                  <h4 className="mt-1.5 truncate text-lg font-semibold tracking-[-0.04em] text-slate-950">{platform.username || "Not connected"}</h4>
                  <p className="mt-1.5 line-clamp-1 text-sm leading-5 text-slate-500">{platform.description}</p>
                </div>
                <PlatformLogo platform={platform.platform} color={platform.color} href={analytics?.profileUrl} />
              </div>

              <div className="mt-3 grid grid-cols-2 gap-2.5 text-sm">
                <CardMetric label="Solved" value={analytics?.totalSolved ?? 0} accent="sky" tone={metricTone} icon={Code2} />
                <CardMetric
                  label={isGitHub ? "Commits" : "Rating"}
                  value={isGitHub ? analytics.totalCommits ?? 0 : analytics?.rating ?? 0}
                  accent="violet"
                  tone={toneForIndex(index + 1)}
                  icon={Medal}
                />
                <CardMetric
                  label={isGitHub ? "Contributions" : "Streak"}
                  value={isGitHub ? analytics.contributions ?? 0 : analytics?.activeStreak ?? 0}
                  accent="emerald"
                  suffix={isGitHub ? "" : " days"}
                  tone={toneForIndex(index + 2)}
                  icon={Flame}
                />
                <CardMetric label="Contests" value={analytics?.contests ?? 0} accent="teal" tone={toneForIndex(index + 3)} icon={Trophy} />
              </div>

              <div className="mt-3 flex items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-600">
                <span>{isConnected ? "Connected" : platform.status === "missing" ? "Not configured" : "Fetch failed"}</span>
                <span className={`h-2.5 w-2.5 rounded-full ${isConnected ? "bg-emerald-500" : "bg-amber-400"}`} />
              </div>
            </motion.article>
          );
        })}

        {visiblePlatforms.length === 0 && (
          <div className="rounded-[1.5rem] border border-slate-200 bg-slate-50 p-5 text-sm text-slate-500 md:col-span-2 xl:col-span-3 2xl:col-span-4">
            No platforms match your search.
          </div>
        )}
      </div>
    </section>
  );
}

export function ProblemDistribution({ data }: Pick<SectionProps, "data">) {
  const solved = data.summary.totalProblems;
  const easy = Math.max(1, Math.round(solved * 0.48));
  const medium = Math.max(1, Math.round(solved * 0.34));
  const hard = Math.max(1, solved - easy - medium);
  const total = Math.max(solved, 1);

  const distribution = [
    { name: "Easy", value: easy, color: "#0EA5E9" },
    { name: "Medium", value: medium, color: "#14B8A6" },
    { name: "Hard", value: hard, color: "#8B5CF6" },
  ];

  return (
    <section id="distribution" className={panelClassName()}>
      <div className="border-b border-slate-200 px-5 py-5 sm:px-6">
        <p className="text-xs uppercase tracking-[0.34em] text-slate-400">Problem distribution</p>
        <h3 className="mt-2 text-2xl font-semibold tracking-[-0.05em] text-slate-950">Difficulty mix and problem balance</h3>
      </div>

      <div className="grid gap-0 2xl:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
        <div className="min-w-0 border-b border-slate-200 p-5 sm:p-6 2xl:border-b-0 2xl:border-r">
          <div className="h-[280px] lg:h-[320px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={distribution} dataKey="value" nameKey="name" innerRadius={72} outerRadius={112} paddingAngle={4}>
                  {distribution.map((segment) => (
                    <Cell key={segment.name} fill={segment.color} />
                  ))}
                </Pie>
                <Tooltip contentStyle={tooltipStyle} formatter={(value) => formatInteger(Number(value))} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="grid min-w-0 content-start gap-3 p-5 sm:p-6">
          {distribution.map((segment, index) => (
            <motion.div
              key={segment.name}
              initial={{ opacity: 0, x: 10 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.06 }}
              className="rounded-2xl border border-slate-200 bg-slate-50 p-4"
            >
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium text-slate-600">{segment.name}</span>
                <span className="font-semibold text-slate-900">{formatPercent(Math.round((segment.value / total) * 100))}</span>
              </div>
              <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-200">
                <div className="h-full rounded-full" style={{ width: `${(segment.value / total) * 100}%`, backgroundColor: segment.color }} />
              </div>
              <div className="mt-3 text-xs text-slate-500">{formatInteger(segment.value)} problems</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function ContestPanel({ data }: Pick<SectionProps, "data">) {
  const sortedContestPlatforms = data.platforms
    .filter((platform) => platform.analytics)
    .map((platform) => ({
      platform: platform.platform,
      name: PLATFORM_NAMES[platform.platform] ?? platform.platform,
      contests: platform.analytics?.contests ?? 0,
      rating: platform.analytics?.rating ?? 0,
      maxRating: platform.analytics?.maxRating ?? platform.analytics?.rating ?? 0,
      streak: platform.analytics?.activeStreak ?? 0,
    }))
    .sort((left, right) => right.contests - left.contests);

  const gfgPlatform = sortedContestPlatforms.find((platform) => platform.platform === "gfg");
  const contestPlatforms = sortedContestPlatforms.slice(0, 4);

  if (gfgPlatform && !contestPlatforms.some((platform) => platform.platform === "gfg")) {
    contestPlatforms[contestPlatforms.length - 1] = gfgPlatform;
  }

  const bestRating = contestPlatforms.reduce((max, platform) => Math.max(max, platform.maxRating), 0);
  const activeContestPlatforms = contestPlatforms.filter((platform) => platform.contests > 0).length;

  return (
    <section id="contests" className={panelClassName()}>
      <div className="border-b border-slate-200 px-5 py-5 sm:px-6">
        <p className="text-xs uppercase tracking-[0.34em] text-slate-400">Contests</p>
        <h3 className="mt-2 text-2xl font-semibold tracking-[-0.05em] text-slate-950">Contest performance summary</h3>
      </div>

      <div className="grid gap-4 p-5 sm:p-6">
        <div className="grid gap-3 sm:grid-cols-3">
          <CardMetric label="Total" value={data.summary.totalContests} accent="teal" tone="red" />
          <CardMetric label="Best Rating" value={bestRating} accent="violet" tone="blue" />
          <CardMetric label="Platforms" value={activeContestPlatforms} accent="sky" tone="green" />
        </div>

        <div className="grid gap-3">
          {contestPlatforms.map((platform, index) => (
            <motion.div
              key={platform.name}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.35, delay: index * 0.05 }}
              className="rounded-2xl border border-slate-200 bg-slate-50 p-4"
            >
              <div className="flex items-center justify-between gap-4 text-sm">
                <span className="font-medium text-slate-700">{platform.name}</span>
                <span className="font-semibold text-slate-950">{formatInteger(platform.contests)} contests</span>
              </div>
              <div className="mt-3 grid gap-3 text-xs text-slate-500 sm:grid-cols-2">
                <span className="rounded-xl bg-white px-3 py-2">Rating {formatInteger(platform.rating)}</span>
                <span className="rounded-xl bg-white px-3 py-2">Streak {formatInteger(platform.streak)} days</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function ActivityHeatmap({ data }: Pick<SectionProps, "data">) {
  const cells = useMemo(
    () => buildHeatmapSeed(data.summary.totalProblems, data.summary.totalContests + data.summary.maxStreak),
    [data.summary.totalContests, data.summary.maxStreak, data.summary.totalProblems],
  );

  const levels = [
    { label: "Low", className: "bg-slate-100" },
    { label: "Light", className: "bg-sky-100" },
    { label: "Medium", className: "bg-sky-200" },
    { label: "High", className: "bg-teal-300" },
    { label: "Peak", className: "bg-emerald-500" },
  ];

  return (
    <section id="activity" className={panelClassName()}>
      <div className="border-b border-slate-200 px-5 py-5 sm:px-6">
        <p className="text-xs uppercase tracking-[0.34em] text-slate-400">Activity heatmap</p>
        <h3 className="mt-2 text-2xl font-semibold tracking-[-0.05em] text-slate-950">Coding consistency over time</h3>
      </div>

      <div className="p-5 sm:p-6">
        <div className="grid gap-1.5 overflow-hidden rounded-[1.5rem] border border-slate-200 bg-white p-4 sm:gap-2 sm:p-5">
          {cells.map((row, rowIndex) => (
            <div key={rowIndex} className="grid grid-cols-12 gap-1.5 sm:gap-2">
              {row.map((level, cellIndex) => (
                <div
                  key={`${rowIndex}-${cellIndex}`}
                  className={`aspect-square rounded-[0.45rem] border border-slate-200/80 ${
                    level === 0
                      ? "bg-slate-50"
                      : level === 1
                        ? "bg-sky-100"
                        : level === 2
                          ? "bg-sky-200"
                          : level === 3
                            ? "bg-teal-300"
                            : "bg-emerald-500"
                  }`}
                />
              ))}
            </div>
          ))}
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-2 text-xs text-slate-500">
          {levels.map((level) => (
            <span key={level.label} className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5">
              <span className={`h-2.5 w-2.5 rounded-full ${level.className}`} />
              {level.label}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}

export function RecentActivity({ data }: Pick<SectionProps, "data">) {
  const topPlatform = data.summary.topPlatform?.label ?? "your top platform";
  
  const updatedTime = new Intl.DateTimeFormat("en-US", {
    hour: "numeric",
    minute: "numeric",
    hour12: true,
  }).format(new Date(data.summary.lastUpdated));

  const syncText = `Synced at ${updatedTime}`;

  const activities: Array<{ title: string; time: string; icon: React.ComponentType<{ className?: string }>; tone: "sky" | "teal" | "emerald" | "violet" }> = [
    { title: `Solved ${formatInteger(data.summary.topPlatform?.totalSolved ?? data.summary.totalProblems)} problems on ${topPlatform}`, time: syncText, icon: Code2, tone: "sky" },
    { title: `${formatInteger(data.summary.totalContests)} contest participations tracked`, time: syncText, icon: Trophy, tone: "teal" },
    { title: `${formatStreak(data.summary.maxStreak)} longest streak maintained`, time: syncText, icon: Flame, tone: "emerald" },
    { title: "GitHub repository activity synced", time: syncText, icon: GitBranch, tone: "violet" },
  ];

  return (
    <section className={panelClassName()}>
      <div className="border-b border-slate-200 px-5 py-5 sm:px-6">
        <p className="text-xs uppercase tracking-[0.34em] text-slate-400">Recent activity</p>
        <h3 className="mt-2 text-2xl font-semibold tracking-[-0.05em] text-slate-950">Latest updates</h3>
      </div>

      <div className="space-y-3 p-5 sm:p-6">
        {activities.map((activity, index) => {
          const Icon = activity.icon;
          const toneClass =
            activity.tone === "sky"
              ? "text-sky-600 bg-sky-50"
              : activity.tone === "teal"
                ? "text-teal-600 bg-teal-50"
                : activity.tone === "emerald"
                  ? "text-emerald-600 bg-emerald-50"
                  : "text-violet-600 bg-violet-50";

          return (
            <motion.div
              key={activity.title}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.35, delay: index * 0.05 }}
              className="flex min-h-[5.5rem] items-start gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-4"
            >
              <div className={`flex h-10 w-10 items-center justify-center rounded-2xl border border-slate-200 bg-white ${toneClass}`}>
                <Icon className="h-4 w-4" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium leading-6 text-slate-900">{activity.title}</p>
                <p className="mt-1 text-xs uppercase tracking-[0.24em] text-slate-400">{activity.time}</p>
              </div>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}

export function AchievementsPanel({ data }: Pick<SectionProps, "data">) {
  const achievements = [
    { label: "100 solved", progress: Math.min(100, (data.summary.totalProblems / 100) * 100), tone: "sky", achieved: data.summary.totalProblems >= 100 },
    { label: "500 solved", progress: Math.min(100, (data.summary.totalProblems / 500) * 100), tone: "teal", achieved: data.summary.totalProblems >= 500 },
    { label: "30-day streak", progress: Math.min(100, (data.summary.maxStreak / 30) * 100), tone: "emerald", achieved: data.summary.maxStreak >= 30 },
    { label: "Contest specialist", progress: Math.min(100, (data.summary.totalContests / 25) * 100), tone: "violet", achieved: data.summary.totalContests >= 25 },
  ];

  return (
    <section id="achievements" className={panelClassName()}>
      <div className="border-b border-slate-200 px-5 py-5 sm:px-6">
        <p className="text-xs uppercase tracking-[0.34em] text-slate-400">Achievements</p>
        <h3 className="mt-2 text-2xl font-semibold tracking-[-0.05em] text-slate-950">Milestones and unlocks</h3>
      </div>

      <div className="grid items-start gap-3 p-5 sm:p-6">
        {achievements.map((achievement) => (
          <div key={achievement.label} className="rounded-2xl border border-slate-200 bg-white p-4">
            <div className="flex items-center justify-between gap-4 text-sm">
              <span className="font-medium text-slate-700">{achievement.label}</span>
              <span className={achievement.achieved ? "font-semibold text-emerald-600" : "font-semibold text-slate-400"}>
                {achievement.achieved ? "Unlocked" : `${formatInteger(Math.round(achievement.progress))}%`}
              </span>
            </div>
            <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-200">
              <div className={`h-full rounded-full bg-gradient-to-r ${achievement.tone === "sky" ? "from-sky-500 to-cyan-500" : achievement.tone === "teal" ? "from-teal-500 to-emerald-500" : achievement.tone === "emerald" ? "from-emerald-500 to-lime-500" : "from-violet-500 to-purple-500"}`} style={{ width: `${Math.min(100, achievement.progress)}%` }} />
            </div>
          </div>
        ))}

        <div id="bookmarks" className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
          <p className="text-xs uppercase tracking-[0.28em] text-slate-400">Bookmarks</p>
          <div className="mt-3 space-y-2 text-sm text-slate-600">
            <div className="flex items-center justify-between rounded-xl bg-white px-3 py-3">
              <span>DSA Roadmap</span>
              <BookOpen className="h-4 w-4 text-sky-500" />
            </div>
            <div className="flex items-center justify-between rounded-xl bg-white px-3 py-3">
              <span>Contest strategy</span>
              <CircleSlash2 className="h-4 w-4 text-teal-500" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function ChartFrame({ title, subtitle, children }: { title: string; subtitle: string; children: React.ReactNode }) {
  return (
    <div className="h-[320px] sm:h-[380px]">
      <div className="mb-4 flex items-start justify-between gap-4">
        <div>
          <h4 className="text-lg font-semibold tracking-[-0.04em] text-slate-950">{title}</h4>
          <p className="mt-1 max-w-2xl text-sm leading-6 text-slate-500">{subtitle}</p>
        </div>
      </div>
      {children}
    </div>
  );
}

function MetricChip({ label, value, suffix = "", icon: Icon, tone }: { label: string; value: number; suffix?: string; icon: React.ComponentType<{ className?: string }>; tone: "sky" | "teal" | "violet" | "emerald"; }) {
  const toneClasses = {
    sky: "text-sky-600 bg-sky-50",
    teal: "text-teal-600 bg-teal-50",
    violet: "text-violet-600 bg-violet-50",
    emerald: "text-emerald-600 bg-emerald-50",
  } as const;

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex items-center justify-between gap-3">
        <span className="text-xs uppercase tracking-[0.22em] text-slate-400">{label}</span>
        <div className={`rounded-full p-2 ${toneClasses[tone]}`}>
          <Icon className="h-3.5 w-3.5" />
        </div>
      </div>
      <div className="mt-3 text-2xl font-semibold tracking-[-0.05em] text-slate-950">
        <AnimatedNumber value={value} />
        {suffix}
      </div>
    </div>
  );
}

function PlatformLogo({
  platform,
  color,
  href,
}: {
  platform: string;
  color: string;
  href?: string;
}) {
  const baseClassName = "flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border border-slate-200 bg-slate-50 shadow-sm transition-transform hover:-translate-y-0.5";
  const logo = (
    <>
      {platform === "github" ? (
        <GitBranch className="h-5 w-5" />
      ) : platform === "codeforces" ? (
        <div className="flex gap-0.5">
          <span className="h-4 w-1.5 rounded-full bg-blue-500" />
          <span className="h-6 w-1.5 rounded-full bg-red-500" />
          <span className="h-5 w-1.5 rounded-full bg-amber-400" />
        </div>
      ) : platform === "hackerrank" ? (
        <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#2EC866] text-xs font-black text-white">H</span>
      ) : (
        <span className="text-xs font-black tracking-[-0.03em]" style={{ color }}>
          {({ leetcode: "LC", codechef: "CC", gfg: "GfG", atcoder: "AC" } as Record<string, string>)[platform] ?? platform.slice(0, 2).toUpperCase()}
        </span>
      )}
    </>
  );

  if (href) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={baseClassName}
        aria-label={`Open ${platform} profile`}
        title={`Open ${platform} profile`}
        style={{ color }}
      >
        {logo}
      </a>
    );
  }

  return (
    <div className={baseClassName} style={{ color }}>
      {logo}
    </div>
  );
}

function CardMetric({
  label,
  value,
  accent,
  suffix = "",
  tone = "blue",
  icon: Icon = BadgeCheck,
}: {
  label: string;
  value: number;
  accent: "sky" | "violet" | "emerald" | "teal";
  suffix?: string;
  tone?: NumberTone;
  icon?: React.ComponentType<{ className?: string }>;
}) {
  const accentMap = {
    sky: {
      chip: "text-sky-700 bg-sky-50",
      dot: "bg-sky-500",
      icon: "text-sky-700 bg-sky-50",
    },
    violet: {
      chip: "text-emerald-700 bg-emerald-50",
      dot: "bg-emerald-500",
      icon: "text-emerald-700 bg-emerald-50",
    },
    emerald: {
      chip: "text-sky-700 bg-sky-50",
      dot: "bg-sky-500",
      icon: "text-sky-700 bg-sky-50",
    },
    teal: {
      chip: "text-emerald-700 bg-emerald-50",
      dot: "bg-emerald-500",
      icon: "text-emerald-700 bg-emerald-50",
    },
  } as const;
  const styles = accentMap[accent];
  const zeroDayWarning = value === 0 && /day/i.test(suffix);
  const valueToneClass = zeroDayWarning ? "text-red-600 bg-red-50" : numberToneClasses[tone];

  return (
    <div className="min-w-0 rounded-2xl border border-slate-200 bg-gradient-to-br from-white to-slate-50 px-3 py-2.5 shadow-sm">
      <div className="flex items-center justify-between gap-2">
        <span className="flex min-w-0 items-center gap-1.5">
          <span className={`h-1.5 w-1.5 shrink-0 rounded-full ${styles.dot}`} />
          <span className="truncate text-[0.68rem] uppercase tracking-[0.16em] text-slate-400">{label}</span>
        </span>
        <span className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full ${styles.icon}`}>
          <Icon className="h-3.5 w-3.5" />
        </span>
      </div>
      <div className={`mt-2 inline-flex max-w-full items-center rounded-full px-2.5 py-1 text-sm font-semibold ${styles.chip} ${valueToneClass}`}>
        {formatInteger(value)}{suffix}
      </div>
    </div>
  );
}

const tooltipStyle = {
  background: "rgba(255,255,255,0.96)",
  border: "1px solid rgba(226,232,240,1)",
  borderRadius: 16,
  boxShadow: "0 20px 40px rgba(15,23,42,0.10)",
  color: "#0f172a",
};
