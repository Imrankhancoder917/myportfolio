"use client";

import React from "react";
import { motion } from "framer-motion";
import type { Skill } from "@/lib/types/projects";

interface SkillCardProps {
  skill: Skill;
  index?: number;
}

const LEVEL_META = {
  beginner: { label: "Beginner", width: 28, gradient: "from-slate-300 to-slate-500" },
  intermediate: { label: "Intermediate", width: 54, gradient: "from-sky-300 to-blue-500" },
  advanced: { label: "Advanced", width: 82, gradient: "from-sky-400 via-cyan-500 to-emerald-500" },
  expert: { label: "Expert", width: 94, gradient: "from-cyan-400 via-sky-500 to-blue-600" },
} as const;

const TITLE_COLORS = [
  "text-sky-600 group-hover:text-sky-500",
  "text-emerald-600 group-hover:text-emerald-500",
  "text-violet-600 group-hover:text-violet-500",
  "text-orange-600 group-hover:text-orange-500",
  "text-pink-600 group-hover:text-pink-500",
  "text-indigo-600 group-hover:text-indigo-500",
  "text-teal-600 group-hover:text-teal-500",
  "text-rose-600 group-hover:text-rose-500",
];

export default function SkillCard({ skill, index = 0 }: SkillCardProps) {
  const meta = LEVEL_META[skill.level];
  const titleColor = TITLE_COLORS[index % TITLE_COLORS.length];

  return (
    <motion.div
      initial={{ opacity: 0, y: 24, scale: 0.985 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ delay: index * 0.05, duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
      viewport={{ once: true, margin: "-80px" }}
      whileHover={{ y: -6, scale: 1.01 }}
      className="group relative h-full overflow-hidden rounded-[1.75rem] border border-slate-200/80 bg-white/85 p-5 shadow-[0_14px_42px_rgba(15,23,42,0.05)] backdrop-blur-xl transition-all duration-500 hover:border-slate-100 hover:shadow-[0_22px_54px_rgba(15,23,42,0.1)]"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-sky-50/0 via-white/0 to-emerald-50/0 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-sky-400 via-cyan-300 to-emerald-300 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

      <div className="relative flex h-full flex-col">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-slate-500">
              {skill.category}
            </p>
            <h3 className={`mt-2 text-[1.05rem] font-semibold tracking-[-0.02em] transition-colors duration-300 ${titleColor}`}>
              {skill.name}
            </h3>
          </div>

          <span className="rounded-full border border-sky-100 bg-sky-50 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.26em] text-sky-700">
            {meta.label}
          </span>
        </div>

        <div className="mt-5">
          <div className="flex items-center justify-between text-[11px] font-medium text-slate-500">
            <span>Proficiency</span>
            <span>{meta.width}%</span>
          </div>
          <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-100">
            <motion.div
              className={`h-full rounded-full bg-gradient-to-r ${meta.gradient}`}
              initial={{ width: 0 }}
              whileInView={{ width: `${meta.width}%` }}
              transition={{ delay: 0.15 + index * 0.03, duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
              viewport={{ once: true, margin: "-80px" }}
            />
          </div>
        </div>

        <div className="mt-5 flex items-center justify-between text-xs text-slate-500">
          <span className="rounded-full border border-slate-200 bg-white px-2.5 py-1 uppercase tracking-[0.22em]">
            {skill.level}
          </span>
          <span className="text-slate-400">Premium skill profile</span>
        </div>
      </div>
    </motion.div>
  );
}
