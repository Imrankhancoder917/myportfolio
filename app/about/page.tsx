"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import {
  Link2,
  Mail,
  Code2,
  Terminal,
  Trophy,
  Coffee,
  FileCode2,
  FileJson,
  Globe2,
  Palette,
  Atom,
  Triangle,
  Wind,
  FlaskConical,
  Network,
  Database,
  GitBranch,
  BrainCircuit,
  Cpu,
  ArrowUpRight,
  Download,
  MessageSquare
} from "lucide-react";
import portfolioData from "@/data/portfolio.json";
import type { AnalyticsDashboardData } from "@/lib/analytics/dashboard";

const FEATURED_PROJECTS = portfolioData.projects.filter(p => p.featured).slice(0, 2);
const SKILLS = portfolioData.skills.flatMap((section: any) => section.skills);

const ROLES = [
  "Software Engineer",
  "Backend Developer",
  "Full Stack Developer",
  "AI Enthusiast",
  "Competitive Programmer",
  "Problem Solver",
];



function AnimatedCounter({ value, isStatic }: { value: number | null | string, isStatic?: boolean }) {
  const [count, setCount] = useState<number | string>(isStatic && value !== null ? value : 0);

  useEffect(() => {
    if (isStatic) return;
    if (value === null || typeof value === 'string') return;

    let startTime: number | null = null;
    const duration = 1500;

    const animate = (time: number) => {
      if (!startTime) startTime = time;
      const progress = time - startTime;
      const current = Math.min(Math.floor((progress / duration) * (value as number)), value as number);
      setCount(current);
      if (progress < duration) {
        requestAnimationFrame(animate);
      } else {
        setCount(value);
      }
    };

    const rafId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafId);
  }, [value, isStatic]);

  if (value === null) return <span>—</span>;
  return <span>{count}</span>;
}

export default function AboutPage() {
  const [roleIndex, setRoleIndex] = useState(0);
  const [analytics, setAnalytics] = useState<AnalyticsDashboardData | null>(null);
  const [githubStats, setGithubStats] = useState<{ repos: number | null, contributions: number | null }>({ repos: null, contributions: null });

  useEffect(() => {
    const id = setInterval(() => {
      setRoleIndex((current) => (current + 1) % ROLES.length);
    }, 2500);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    fetch("/api/analytics")
      .then((res) => res.json())
      .then((data: AnalyticsDashboardData) => {
        setAnalytics(data);
        const githubData = data.platforms.find(p => p.platform === "github")?.analytics;
        if (githubData) {
          setGithubStats({
            repos: githubData.totalSolved ?? null,
            contributions: githubData.contributions ?? null
          });
        }
      })
      .catch((err) => console.error("Failed to fetch analytics", err));
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" as const } },
  };

  return (
    <div className="relative mx-auto max-w-[1400px] px-6 py-8 md:py-12 lg:px-12">
      <div className="mx-auto w-full max-w-7xl">

      {/* SECTION 1: HERO */}
      <motion.section
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="grid items-center gap-12 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] lg:gap-20"
      >
        <div className="flex flex-col items-start">
          <motion.div variants={itemVariants} className="mb-6 rounded-full border border-slate-200 bg-white px-4 py-1.5 shadow-sm">
            <span className="text-xs font-bold tracking-widest text-slate-500 uppercase">
              About Me
            </span>
          </motion.div>

          <motion.h1 variants={itemVariants} className="font-serif text-5xl font-semibold tracking-tight text-slate-900 md:text-6xl">
            Hi, I&apos;m {portfolioData.profile.name}
          </motion.h1>

          <motion.div variants={itemVariants} className="mt-4 h-8 text-lg font-medium text-slate-500 md:text-xl">
            <AnimatePresence mode="wait">
              <motion.span
                key={roleIndex}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.4 }}
                className="inline-block"
              >
                {ROLES[roleIndex]}
              </motion.span>
            </AnimatePresence>
          </motion.div>

          <motion.p variants={itemVariants} className="mt-6 text-base leading-relaxed text-slate-600">
            {portfolioData.profile.about}
          </motion.p>

          <motion.div variants={itemVariants} className="mt-8 flex gap-4">
            <Link href={portfolioData.contact.github} target="_blank" className="rounded-xl border border-slate-200 bg-white p-2.5 text-[#24292E] shadow-sm transition-all hover:scale-105 hover:border-slate-300">
              <Code2 size={20} />
            </Link>
            <Link href={portfolioData.contact.linkedin} target="_blank" className="rounded-xl border border-slate-200 bg-white p-2.5 text-[#0A66C2] shadow-sm transition-all hover:scale-105 hover:border-slate-300">
              <Link2 size={20} />
            </Link>
            <Link href={`mailto:${portfolioData.contact.email}`} className="rounded-xl border border-slate-200 bg-white p-2.5 text-rose-500 shadow-sm transition-all hover:scale-105 hover:border-slate-300">
              <Mail size={20} />
            </Link>
          </motion.div>
        </div>

        <motion.div variants={itemVariants} className="flex flex-col items-center gap-6">
          <motion.div
            animate={{ y: [-6, 6, -6] }}
            transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut' }}
            className="relative h-72 w-72 md:h-96 md:w-96 drop-shadow-[0_24px_48px_rgba(0,0,0,0.15)] group"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/profile.png" alt={portfolioData.profile.name} className="h-full w-full object-cover transition-all duration-500 ease-out group-hover:scale-[1.03] group-hover:brightness-[1.03] group-hover:contrast-[1.02] group-hover:drop-shadow-[0_20px_40px_rgba(0,0,0,0.2)]" />
          </motion.div>
          {portfolioData.profile.openToWork && (
            <div className="flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-4 py-2 text-sm font-medium text-emerald-700 shadow-sm">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500"></span>
              </span>
              {portfolioData.profile.status || "Open to Internship & Full-Time Opportunities"}
            </div>
          )}
        </motion.div>
      </motion.section>

      {/* SECTION 2: QUICK HIGHLIGHTS */}
      <motion.section
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-100px" }}
        variants={containerVariants}
        className="mt-16 md:mt-20"
      >
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:gap-6">
          {[
            { label: "Total Problems Solved", value: analytics?.summary.totalProblems ?? null, colorClass: "text-[#FFA116]" },
            { label: "Contest Participations", value: analytics?.summary.totalContests ?? null, colorClass: "text-[#1F1C3F]" },
            { label: "Current Coding Streak", value: analytics ? (analytics.summary.avgStreak || analytics.summary.maxStreak) : null, colorClass: "text-emerald-500" },
            { label: "GitHub Repositories", value: githubStats.repos, colorClass: "text-slate-900" },
            { label: "GitHub Contributions", value: githubStats.contributions, colorClass: "text-emerald-600" },
            { label: "CGPA", value: portfolioData.education?.cgpa || "8.4", isStatic: true, colorClass: "text-blue-500" },
          ].map((stat, i) => (
            <motion.div
              key={i}
              variants={itemVariants}
              whileHover={{ y: -4 }}
              className="flex flex-col items-start justify-center rounded-2xl border border-slate-200/80 bg-white/60 p-6 shadow-sm backdrop-blur-md transition-all hover:border-slate-300 hover:shadow-md"
            >
              <div className={`text-3xl font-bold tracking-tight ${stat.colorClass}`}>
                <AnimatedCounter value={stat.value} isStatic={stat.isStatic} />
              </div>
              <div className="mt-2 text-sm font-medium text-slate-500">
                {stat.label}
              </div>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* SECTION 3: TECH STACK */}
      <motion.section
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-100px" }}
        variants={containerVariants}
        className="mt-16 md:mt-20"
      >
        <motion.h2 variants={itemVariants} className="mb-8 font-serif text-3xl font-semibold text-slate-900">
          Tech Stack
        </motion.h2>
        <div className="flex flex-wrap gap-3">
          {SKILLS.map((skill) => {
            let Icon = Terminal;
            let colorClass = "text-slate-700";
            const s = skill.name.toLowerCase();

            if (s.includes("java") && !s.includes("script")) { Icon = Coffee; colorClass = "text-orange-600"; }
            else if (s.includes("python")) { Icon = FileCode2; colorClass = "text-blue-600"; }
            else if (s.includes("javascript")) { Icon = FileJson; colorClass = "text-amber-500"; }
            else if (s.includes("html")) { Icon = Globe2; colorClass = "text-orange-500"; }
            else if (s.includes("css") || s.includes("bootstrap")) { Icon = Palette; colorClass = "text-indigo-500"; }
            else if (s.includes("react")) { Icon = Atom; colorClass = "text-cyan-500"; }
            else if (s.includes("next")) { Icon = Triangle; colorClass = "text-slate-900"; }
            else if (s.includes("tailwind")) { Icon = Wind; colorClass = "text-cyan-600"; }
            else if (s.includes("flask") || s.includes("spring")) { Icon = FlaskConical; colorClass = "text-emerald-600"; }
            else if (s.includes("api")) { Icon = Network; colorClass = "text-rose-500"; }
            else if (s.includes("sql") || s.includes("database") || s.includes("dbms")) { Icon = Database; colorClass = "text-blue-500"; }
            else if (s.includes("git")) { Icon = s.includes("hub") ? Code2 : GitBranch; colorClass = "text-orange-600"; }
            else if (s.includes("ai") || s.includes("intelligence") || s.includes("prompt")) { Icon = BrainCircuit; colorClass = "text-purple-600"; }
            else if (s.includes("machine learning")) { Icon = Cpu; colorClass = "text-violet-600"; }
            else if (s.includes("network") || s.includes("packet")) { Icon = Network; colorClass = "text-teal-600"; }
            else if (s.includes("structure") || s.includes("algorithm")) { Icon = Code2; colorClass = "text-fuchsia-600"; }
            else if (s.includes("system") || s.includes("linux") || s.includes("architecture")) { Icon = Terminal; colorClass = "text-slate-800"; }

            return (
              <motion.div
                key={skill.name}
                variants={itemVariants}
                whileHover={{ y: -2 }}
                className="flex items-center gap-2.5 rounded-xl border border-slate-200/80 bg-white/60 px-4 py-2.5 shadow-sm backdrop-blur-md transition-all hover:border-slate-300 hover:bg-white"
              >
                <Icon size={16} className={colorClass} />
                <span className={`text-sm font-semibold ${colorClass}`}>{skill.name}</span>
              </motion.div>
            );
          })}
        </div>
      </motion.section>

      {/* SECTION 4: HIGHLIGHTED PROJECTS */}
      <motion.section
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-100px" }}
        variants={containerVariants}
        className="mt-16 md:mt-20"
      >
        <motion.h2 variants={itemVariants} className="mb-8 font-serif text-3xl font-semibold text-slate-900">
          Highlighted Projects
        </motion.h2>
        <div className="grid gap-8 md:grid-cols-2">
          {FEATURED_PROJECTS.map((project) => (
            <motion.div
              key={project.id}
              variants={itemVariants}
              whileHover={{ y: -4 }}
              className="group flex flex-col overflow-hidden rounded-[2rem] border border-slate-200/80 bg-white shadow-sm transition-all hover:border-slate-300 hover:shadow-xl"
            >
              <div className="relative h-56 w-full overflow-hidden border-b border-slate-100 bg-slate-50">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={project.image}
                  alt={project.title}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <div className="flex flex-1 flex-col p-8">
                <h3 className="text-xl font-bold tracking-tight text-slate-900">
                  {project.title}
                </h3>
                <p className="mt-3 line-clamp-2 text-sm leading-relaxed text-slate-600">
                  {project.description}
                </p>
                <div className="mt-6 flex flex-wrap gap-2">
                  {project.techStack.map((tech: string) => (
                    <span key={tech} className="rounded-md bg-slate-100 px-2 py-1 text-xs font-medium text-slate-600">
                      {tech}
                    </span>
                  ))}
                </div>
                <div className="mt-8 flex items-center gap-4">
                  <Link
                    href={project.demo || "#"}
                    className="flex items-center gap-2 rounded-full bg-slate-900 px-5 py-2.5 text-sm font-medium text-white transition-all hover:bg-slate-800"
                  >
                    Live Demo <ArrowUpRight size={16} />
                  </Link>
                  <Link
                    href={project.github || "#"}
                    target="_blank"
                    className="flex items-center gap-2 rounded-full border border-slate-200 px-5 py-2.5 text-sm font-medium text-slate-700 transition-all hover:border-slate-300 hover:bg-slate-50"
                  >
                    <Code2 size={16} /> GitHub
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* SECTION 5: CALL TO ACTION */}
      <motion.section
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-100px" }}
        variants={containerVariants}
        className="mt-16 md:mt-20"
      >
        <motion.div
          variants={itemVariants}
          className="flex flex-col items-center justify-center rounded-[2.5rem] border border-slate-200/80 bg-white p-12 text-center shadow-[0_20px_40px_rgba(15,23,42,0.04)] sm:p-16"
        >
          <h2 className="font-serif text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
            Let&apos;s Build Something Amazing Together
          </h2>
          <div className="mt-10 flex flex-col gap-4 sm:flex-row">
            <Link
              href="/contact"
              className="flex items-center justify-center gap-2 rounded-full bg-slate-900 px-8 py-4 text-sm font-medium text-white transition-all hover:scale-105 hover:bg-slate-800 hover:shadow-lg"
            >
              <MessageSquare size={18} /> Contact Me
            </Link>
            <Link
              href={portfolioData.education?.resume || "/resume.pdf"}
              target="_blank"
              className="flex items-center justify-center gap-2 rounded-full border border-slate-200 bg-white px-8 py-4 text-sm font-medium text-slate-700 transition-all hover:scale-105 hover:border-slate-300 hover:bg-slate-50 hover:shadow-lg"
            >
              <Download size={18} /> Download Resume
            </Link>
          </div>
        </motion.div>
      </motion.section>

      </div>
    </div>
  );
}
