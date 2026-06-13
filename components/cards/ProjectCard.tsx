"use client";

import React, { useMemo, useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowUpRight, Code2 } from "lucide-react";
import { Project } from "@/lib/types/projects";
import { PROJECT_FALLBACK_IMAGES } from "@/lib/constants/projects";

interface ProjectCardProps {
  project: Project;
  index?: number;
  featured?: boolean;
}

export default function ProjectCard({ project, index = 0, featured = false }: ProjectCardProps) {
  const initialImage = project.image ?? project.images?.[0] ?? "";
  const fallbackImage = useMemo(() => {
    switch (project.id) {
      case "ai-mock-interview-platform":
        return PROJECT_FALLBACK_IMAGES.aiInterview;
      case "offline-payment-system":
        return PROJECT_FALLBACK_IMAGES.offlinePayment;
      case "e-commerce-website":
        return PROJECT_FALLBACK_IMAGES.ecommerce;
      case "temperature-converter":
        return PROJECT_FALLBACK_IMAGES.temperature;
      case "carbon-footprint-monitor":
        return PROJECT_FALLBACK_IMAGES.carbon;
      case "deep-packet-inspection":
        return PROJECT_FALLBACK_IMAGES.dpi;
      default:
        return PROJECT_FALLBACK_IMAGES.aiInterview;
    }
  }, [project.id]);
  const [imageSrc, setImageSrc] = useState(initialImage || fallbackImage);

  const demoHref = project.demo ?? `/projects#${project.id}`;
  const githubHref = project.github ?? "#";

  return (
    <motion.div
      id={project.id}
      initial={{ opacity: 0, y: 24, scale: 0.985 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ delay: index * 0.08, duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
      viewport={{ once: true, margin: "-80px" }}
      whileHover={{ y: -10 }}
      className={`group h-full ${featured ? "lg:scale-[1.01]" : ""}`}
    >
      <div className={`relative flex h-full flex-col overflow-hidden rounded-[2rem] border bg-white/80 backdrop-blur-2xl transition-all duration-500 group-hover:border-slate-200 group-hover:shadow-[0_26px_80px_rgba(15,23,42,0.1)] ${featured ? "border-slate-200/90 shadow-[0_22px_70px_rgba(15,23,42,0.08)] ring-1 ring-sky-100/60" : "border-slate-200/80 shadow-[0_18px_60px_rgba(15,23,42,0.06)]"}`}>
        <div className="absolute inset-0 bg-gradient-to-br from-sky-50/0 via-white/0 to-emerald-50/0 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
        {featured && (
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-sky-400 via-cyan-300 to-emerald-300 opacity-80" />
        )}

        <div className={`relative ${featured ? "p-5 sm:p-6" : "p-4 sm:p-5"}`}>
          <div className="group/image relative aspect-[16/10] overflow-hidden rounded-[1.45rem] border border-white/80 bg-slate-100 shadow-[0_18px_40px_rgba(15,23,42,0.08)]">
            <Image
              src={imageSrc}
              alt={project.title}
              fill
              priority={index < 2}
              className="object-cover transition-transform duration-700 ease-out group-hover/image:scale-[1.04]"
              sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
              onError={() => setImageSrc(fallbackImage)}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-white/78 via-white/10 to-transparent" />

            <div className="absolute left-4 top-4 flex items-center gap-2 rounded-full border border-white/75 bg-white/85 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.28em] text-slate-700 shadow-[0_10px_24px_rgba(15,23,42,0.08)]">
              {project.featured ? "Featured" : project.category}
            </div>
            {featured && (
              <div className="absolute right-4 top-4 rounded-full border border-sky-200/70 bg-gradient-to-r from-sky-500/10 via-white/85 to-emerald-500/10 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.26em] text-slate-700 shadow-[0_10px_24px_rgba(15,23,42,0.08)] backdrop-blur-md">
                Featured Project
              </div>
            )}
            <div className="absolute bottom-4 right-4 rounded-full border border-white/75 bg-white/90 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.24em] text-slate-600 shadow-[0_10px_24px_rgba(15,23,42,0.08)]">
              Production Work
            </div>
          </div>

          <div className="mt-5 flex flex-col">
            <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-slate-500">
              {project.category}
            </p>
            <h3 className={`mt-3 font-serif tracking-[-0.03em] text-slate-900 transition-colors duration-300 group-hover:text-sky-700 ${featured ? "text-[1.65rem]" : "text-[1.45rem]"}`}>
              {project.title}
            </h3>
            <p className={`${featured ? "mt-3 text-[0.98rem] leading-7" : "mt-3 text-sm leading-7"} text-slate-600`}>{project.description}</p>
          </div>

          <div className="mt-5 flex flex-wrap gap-2">
            {project.techStack.map((tech) => (
              <span
                key={tech}
                className="rounded-full border border-white/80 bg-white/92 px-3 py-1.5 text-[11px] font-medium text-slate-700 shadow-[0_8px_18px_rgba(15,23,42,0.04)]"
              >
                {tech}
              </span>
            ))}
          </div>

          <div className={`mt-6 grid grid-cols-1 gap-2.5 sm:grid-cols-2 ${featured ? "pt-1" : ""}`}>
            <motion.a
              href={demoHref}
              className={`group/button inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-sky-500 via-blue-600 to-cyan-600 px-4.5 py-3 text-sm font-medium text-white shadow-[0_14px_28px_rgba(14,165,233,0.14)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_18px_34px_rgba(14,165,233,0.2)] ${featured ? "ring-1 ring-sky-200/60" : ""}`}
              whileHover={{ y: -2, scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
            >
              <span>Live Demo</span>
              <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover/button:translate-x-0.5 group-hover/button:-translate-y-0.5" />
            </motion.a>
            <motion.a
              href={githubHref}
              target="_blank"
              rel="noopener noreferrer"
              className={`group/button inline-flex items-center justify-center gap-2 rounded-full border border-slate-200/90 bg-white/90 px-4.5 py-3 text-sm font-medium text-slate-800 shadow-[0_12px_24px_rgba(15,23,42,0.06)] transition-all duration-300 hover:-translate-y-0.5 hover:border-slate-300 hover:bg-slate-50 hover:shadow-[0_18px_34px_rgba(15,23,42,0.08)] ${featured ? "ring-1 ring-white/80" : ""}`}
              whileHover={{ y: -2, scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
            >
              <Code2 className="h-4 w-4 transition-transform duration-300 group-hover/button:scale-110" />
              <span>GitHub Repository</span>
            </motion.a>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
