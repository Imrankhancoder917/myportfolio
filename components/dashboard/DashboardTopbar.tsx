"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bell, RefreshCw, Search, SlidersHorizontal, ChevronDown, CalendarDays } from "lucide-react";
import { ChartRange, RANGE_OPTIONS } from "@/lib/analytics/dashboard";

interface DashboardTopbarProps {
  search: string;
  onSearchChange: (value: string) => void;
  onRefresh: () => void;
  isRefreshing: boolean;
  lastUpdated: string;
  chartRange: ChartRange;
  onRangeChange: (range: ChartRange) => void;
}

export default function DashboardTopbar({
  search,
  onSearchChange,
  onRefresh,
  isRefreshing,
  lastUpdated,
  chartRange,
  onRangeChange,
}: DashboardTopbarProps) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <motion.header
      initial={{ opacity: 0, y: -12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45 }}
      className="relative z-40 shrink-0 rounded-[1.75rem] border border-sky-100/80 bg-white/95 px-4 py-4 shadow-[0_18px_60px_rgba(14,165,233,0.06)] backdrop-blur-xl sm:px-5"
    >
      <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
        <div className="flex-1">
          <p className="text-xs uppercase tracking-[0.34em] text-slate-400">Live analytics</p>
          <h2 className="mt-1 text-2xl font-semibold tracking-[-0.05em] text-slate-950 sm:text-3xl">
            DSA Progress & Analytics
          </h2>
        </div>

        <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
          <div className="relative min-w-0 sm:w-64 lg:w-60 xl:w-64">
            <Search className="pointer-events-none absolute left-3.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
            <input
              value={search}
              onChange={(event) => onSearchChange(event.target.value)}
              placeholder="Search platforms..."
              className="h-10 w-full rounded-full border border-slate-200 bg-slate-50/90 px-10 text-sm text-slate-900 outline-none transition focus:border-slate-300 focus:bg-white focus:ring-4 focus:ring-sky-100"
            />
          </div>

          <div className="flex items-center gap-2">
            <button className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 transition hover:bg-slate-50 hover:text-slate-950">
              <Bell className="h-4 w-4" />
            </button>
            
            <button
              onClick={onRefresh}
              className="inline-flex h-11 items-center gap-2 rounded-full border border-sky-100 bg-white px-4 text-sm font-medium text-slate-700 transition hover:border-sky-200 hover:bg-sky-50 hover:text-slate-950"
            >
              <RefreshCw className={`h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`} />
              Refresh
            </button>

            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="inline-flex h-11 items-center justify-center gap-2 rounded-full border border-slate-200 bg-white px-4 text-sm font-medium text-slate-700 transition hover:bg-slate-50 hover:border-slate-300 shadow-[0_8px_20px_rgba(15,23,42,0.04)]"
              >
                <CalendarDays className="h-4 w-4 text-slate-500" />
                <span className="hidden sm:inline-block">
                  {RANGE_OPTIONS.find(o => o.key === chartRange)?.label ?? "All Time"}
                </span>
                <ChevronDown className="h-4 w-4 text-slate-400" />
              </button>

              <AnimatePresence>
                {isDropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 8, scale: 0.96 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 4, scale: 0.96 }}
                    transition={{ duration: 0.15, ease: "easeOut" }}
                    className="absolute right-0 top-full mt-2 w-48 rounded-2xl border border-slate-200 bg-white p-1.5 shadow-[0_20px_60px_-10px_rgba(15,23,42,0.15)] z-50 origin-top-right"
                  >
                    {RANGE_OPTIONS.map((option) => (
                      <button
                        key={option.key}
                        onClick={() => {
                          onRangeChange(option.key);
                          setIsDropdownOpen(false);
                        }}
                        className={`w-full rounded-xl px-3 py-2.5 text-left text-sm font-medium transition-colors ${
                          chartRange === option.key
                            ? "bg-sky-50 text-sky-700"
                            : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                        }`}
                      >
                        {option.label}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-2 text-xs text-slate-500">
        <SlidersHorizontal className="h-3.5 w-3.5 text-slate-400" />
        <span>Last synced {lastUpdated}</span>
      </div>
    </motion.header>
  );
}
