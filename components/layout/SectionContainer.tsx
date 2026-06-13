"use client";

import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils/cn";

interface SectionContainerProps {
  id?: string;
  className?: string;
  children: React.ReactNode;
  animate?: boolean;
}

export default function SectionContainer({
  id,
  className,
  children,
  animate = true,
}: SectionContainerProps) {
  return (
    <motion.section
      id={id}
      className={cn("relative py-20 sm:py-32 font-sans", className)}
      initial={animate ? { opacity: 0 } : undefined}
      whileInView={animate ? { opacity: 1 } : undefined}
      transition={{ duration: 0.5 }}
      viewport={{ once: true, margin: "-100px" }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">{children}</div>
    </motion.section>
  );
}
