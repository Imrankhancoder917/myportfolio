"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";
import { formatNumber } from "@/lib/utils/formatters";

interface StatCardProps {
  label: string;
  value: number;
  icon?: LucideIcon;
  suffix?: string;
  color?: "cyan" | "purple" | "green" | "orange" | "pink";
  index?: number;
}

const colorClasses = {
  cyan: "from-cyan-500 to-blue-500",
  purple: "from-purple-500 to-pink-500",
  green: "from-green-500 to-emerald-500",
  orange: "from-orange-500 to-red-500",
  pink: "from-pink-500 to-rose-500",
};

const bgClasses = {
  cyan: "bg-cyan-500/10 border-cyan-500/30",
  purple: "bg-purple-500/10 border-purple-500/30",
  green: "bg-green-500/10 border-green-500/30",
  orange: "bg-orange-500/10 border-orange-500/30",
  pink: "bg-pink-500/10 border-pink-500/30",
};

const textClasses = {
  cyan: "text-cyan-300",
  purple: "text-purple-300",
  green: "text-green-300",
  orange: "text-orange-300",
  pink: "text-pink-300",
};

export default function StatCard({
  label,
  value,
  icon: Icon,
  suffix = "",
  color = "cyan",
  index = 0,
}: StatCardProps) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let startValue = 0;
    const increment = Math.ceil(value / 50);

    const timer = setInterval(() => {
      startValue += increment;
      if (startValue >= value) {
        setCount(value);
        clearInterval(timer);
      } else {
        setCount(startValue);
      }
    }, 30);

    return () => clearInterval(timer);
  }, [value]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.5 }}
      viewport={{ once: true }}
      whileHover={{ y: -5 }}
    >
      <div
        className={`relative rounded-[1.5rem] p-6 border ${bgClasses[color]} bg-white/60 backdrop-blur-xl shadow-[0_14px_40px_rgba(0,0,0,0.04)] h-full overflow-hidden group`}
      >
        {/* Background gradient */}
        <div className={`absolute inset-0 bg-gradient-to-br ${colorClasses[color]} opacity-0 group-hover:opacity-5 transition-opacity duration-300`} />

        {/* Content */}
        <div className="relative z-10 flex items-start justify-between">
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-500 mb-2">{label}</p>
            <div className="flex items-baseline gap-2">
              <p className="text-4xl font-serif text-slate-900 tracking-[-0.02em]">{formatNumber(count)}</p>
              {suffix && <span className="text-sm font-medium text-gray-500">{suffix}</span>}
            </div>
          </div>
          {Icon && (
            <motion.div
              className={`p-3 rounded-2xl bg-gradient-to-br ${colorClasses[color]} opacity-20`}
              whileHover={{ rotate: 5, scale: 1.1 }}
            >
              <Icon className={`w-6 h-6 ${textClasses[color]}`} />
            </motion.div>
          )}
        </div>

        {/* Animated border */}
        <motion.div
          className={`absolute inset-0 rounded-xl pointer-events-none bg-gradient-to-r ${colorClasses[color]} opacity-0 group-hover:opacity-10 blur-sm`}
          animate={{ opacity: [0.05, 0.1, 0.05] }}
          transition={{ duration: 3, repeat: Infinity }}
        />
      </div>
    </motion.div>
  );
}
