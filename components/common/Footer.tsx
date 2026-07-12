"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
	ArrowRight,
	ArrowUpRight,
	BookOpen,
	ChevronUp,
	Code2,
	Clock3,
	Database,
	Flame,
	Layers3,
	Link2,
	Mail,
	MapPin,
	Sparkles,
	Terminal,
	Trophy,
	Bot,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { NAV_ITEMS } from "@/lib/constants/config";
import portfolioData from "@/data/portfolio.json";
import type { AnalyticsDashboardData } from '@/lib/analytics/dashboard';

type SocialLink = {
	label: string;
	href: string;
	icon: LucideIcon;
	colorClass?: string;
};

type FooterLink = {
	label: string;
	href: string;
};

type TechItem = {
	label: string;
	icon: LucideIcon;
};

const getPlatformUsername = (id: string) => portfolioData.platforms.find(p => p.id === id)?.username || "";

const socialLinks: SocialLink[] = [
	{ label: "GitHub", href: portfolioData.contact.github, icon: Code2, colorClass: "text-[#24292E]" },
	{ label: "LinkedIn", href: portfolioData.contact.linkedin, icon: Link2, colorClass: "text-[#0A66C2]" },
	{ label: "LeetCode", href: `https://leetcode.com/u/${getPlatformUsername("leetcode")}/`, icon: Trophy, colorClass: "text-[#FFA116]" },
	{ label: "Codeforces", href: `https://codeforces.com/profile/${getPlatformUsername("codeforces")}`, icon: Layers3, colorClass: "text-[#1F1C3F]" },
	{ label: "CodeChef", href: `https://www.codechef.com/users/${getPlatformUsername("codechef")}`, icon: Terminal, colorClass: "text-[#5B4638]" },
	{ label: "HackerRank", href: `https://www.hackerrank.com/profile/${getPlatformUsername("hackerrank")}`, icon: BookOpen, colorClass: "text-[#2EC866]" },
	{ label: "Email", href: `mailto:${portfolioData.contact.email}`, icon: Mail, colorClass: "text-rose-500" },
];

const featuredWork: FooterLink[] = portfolioData.projects
	.filter((p: any) => p.featured)
	.slice(0, 5)
	.map((p: any) => ({ label: p.title, href: "/projects" }));
if (featuredWork.length < 5) {
	featuredWork.push({ label: "Portfolio Website", href: "/" });
	featuredWork.push({ label: "DSA Analytics Dashboard", href: "/analytics" });
}

const techStack: TechItem[] = [
	{ label: "Python", icon: Terminal },
	{ label: "Java", icon: Code2 },
	{ label: "Spring Boot", icon: Layers3 },
	{ label: "REST APIs", icon: Code2 },
	{ label: "Tailwind CSS", icon: Sparkles },
	{ label: "MySQL", icon: Database },
	{ label: "Machine Learning", icon: Bot },
	{ label: "AI Integration", icon: Sparkles },
	{ label: "Data Structures & Algorithms", icon: Layers3 },
];

export default function Footer() {
	const currentYear = useMemo(() => new Date().getFullYear(), []);
	const [localTime, setLocalTime] = useState("");
	const [emailAddress, setEmailAddress] = useState("");

	const [analytics, setAnalytics] = useState<AnalyticsDashboardData | null>(null);

	useEffect(() => {
		const controller = new AbortController();

		async function loadAnalytics() {
			try {
				const res = await fetch('/api/analytics', { cache: 'no-store', signal: controller.signal });
				if (!res.ok) throw new Error('failed');
				const data = (await res.json()) as AnalyticsDashboardData;
				if (!controller.signal.aborted) setAnalytics(data);
			} catch {
				if (!controller.signal.aborted) setAnalytics(null);
			}
		}

		loadAnalytics();

		return () => controller.abort();
	}, []);

	function toneClasses(tone: 'emerald' | 'violet' | 'amber' | 'sky') {
		switch (tone) {
			case 'emerald':
				return 'from-emerald-50 via-white to-emerald-100/70 border-emerald-100';
			case 'violet':
				return 'from-violet-50 via-white to-violet-100/70 border-violet-100';
			case 'amber':
				return 'from-amber-50 via-white to-amber-100/70 border-amber-100';
			case 'sky':
			default:
				return 'from-sky-50 via-white to-cyan-100/70 border-sky-100';
		}
	}

	function selectTonesFromAnalytics(data: AnalyticsDashboardData | null) {
		if (!data) return { nav: 'sky', featured: 'sky', tech: 'sky' } as const;

		const totalProblems = data.summary.totalProblems ?? 0;
		const totalContests = data.summary.totalContests ?? 0;
		const platformCount = data.summary.platformCount ?? 0;
		const streak = data.platforms.reduce((m, p) => (p.status === 'connected' && p.analytics ? Math.max(m, p.analytics.activeStreak ?? 0) : m), 0);

		const featured = totalProblems >= 1000 ? 'emerald' : totalProblems >= 300 ? 'sky' : 'violet';
		const nav = platformCount >= 3 ? 'emerald' : platformCount === 2 ? 'sky' : 'violet';
		const tech = totalContests >= 50 ? 'amber' : streak >= 14 ? 'emerald' : 'sky';

		return { nav, featured, tech } as const;
	}

	const tones = selectTonesFromAnalytics(analytics);

	useEffect(() => {
		const updateTime = () => {
			setLocalTime(
				new Intl.DateTimeFormat("en-IN", {
					hour: "2-digit",
					minute: "2-digit",
					hour12: true,
					timeZone: "Asia/Kolkata",
				}).format(new Date()),
			);
		};

		updateTime();
		const timer = window.setInterval(updateTime, 60_000);

		return () => window.clearInterval(timer);
	}, []);

	const handleScrollToTop = () => {
		window.scrollTo({ top: 0, behavior: "smooth" });
	};

	const handleContactSubmit = (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();

		const subject = encodeURIComponent("Portfolio inquiry from Imran Khan's website");
		const body = encodeURIComponent(
			emailAddress
				? `Hello Imran,\n\nI found your portfolio and would like to connect. My email is ${emailAddress}.`
				: "Hello Imran,\n\nI found your portfolio and would like to connect.",
		);

		window.location.href = `mailto:${portfolioData.contact.email}?subject=${subject}&body=${body}`;
	};

	return (
		<motion.footer
			className="relative overflow-hidden border-t border-sky-100 bg-gradient-to-b from-sky-50 via-white to-emerald-50 text-slate-900"
			initial={{ opacity: 0, y: 16 }}
			whileInView={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.55, ease: "easeOut" }}
			viewport={{ once: true, amount: 0.15 }}
		>
			<div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-sky-100/70 to-transparent" />
			<div className="absolute right-0 top-20 h-64 w-64 rounded-full bg-sky-200/40 blur-3xl" />
			<div className="absolute left-10 bottom-0 h-64 w-64 rounded-full bg-emerald-200/35 blur-3xl" />

			<div className="relative mx-auto max-w-7xl px-6 pt-8 pb-10 lg:px-8 lg:pt-10 lg:pb-12">
				<div className="grid gap-4 lg:grid-cols-14">
					<motion.section
						initial={{ opacity: 0, y: 14 }}
						whileInView={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.45, delay: 0.05 }}
						viewport={{ once: true }}
						className="rounded-[2rem] border border-sky-50 bg-white/95 p-7 shadow-[0_16px_44px_rgba(15,23,42,0.05)] backdrop-blur-xl lg:col-span-5"
					>
						<div className="inline-flex items-center gap-2 rounded-full border border-sky-100 bg-sky-50 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.28em] text-sky-600">
							<Sparkles size={12} className="text-sky-500" />
							Premium Portfolio
						</div>

						<div className="mt-6 space-y-3">
							<h2 className="text-3xl font-serif tracking-[-0.04em] text-slate-950">{portfolioData.profile.name}</h2>
							<p className="text-sm font-medium uppercase tracking-[0.28em] text-slate-500">{portfolioData.profile.title}</p>
							<p className="max-w-md text-[0.98rem] leading-7 text-slate-600">
								{portfolioData.profile.summary}
							</p>
						</div>

						<div className="mt-6 flex flex-wrap gap-3">
							{[...socialLinks, ...(portfolioData.contact.customLinks || []).map((link: any) => ({
								label: link.label,
								href: link.url,
								icon: Link2,
								colorClass: "text-slate-600"
							}))].map((social, index) => (
								<motion.a
									key={social.label}
									href={social.href}
									target={social.label === "Email" ? undefined : "_blank"}
									rel={social.label === "Email" ? undefined : "noreferrer"}
									whileHover={{ y: -3, scale: 1.03 }}
									whileTap={{ scale: 0.97 }}
									initial={{ opacity: 0, y: 8 }}
									whileInView={{ opacity: 1, y: 0 }}
									transition={{ delay: 0.03 * index, duration: 0.3 }}
									viewport={{ once: true }}
									className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-sky-50 bg-white shadow-[0_8px_20px_rgba(15,23,42,0.04)] transition-colors hover:border-sky-100 hover:bg-sky-50"
									aria-label={social.label}
									title={social.label}
								>
									<social.icon size={16} className={social.colorClass} />
								</motion.a>
							))}
						</div>

						<div className="mt-6 flex flex-wrap gap-3">
							<Link
								href="/contact"
								className="inline-flex items-center gap-2 rounded-full border border-sky-50 bg-white px-5 py-3 text-sm font-medium text-slate-800 shadow-[0_10px_24px_rgba(15,23,42,0.05)] transition-all duration-300 hover:-translate-y-0.5 hover:border-sky-100 hover:bg-sky-50"
							>
								Let&apos;s Connect <ArrowUpRight size={16} className="text-sky-600" />
							</Link>
						</div>
					</motion.section>

					<motion.section
						initial={{ opacity: 0, y: 14 }}
						whileInView={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.45, delay: 0.1 }}
						viewport={{ once: true }}
						className={`rounded-[2rem] border ${toneClasses(tones.nav)} bg-gradient-to-br p-7 shadow-[0_16px_44px_rgba(15,23,42,0.05)] backdrop-blur-xl lg:col-span-3`}
					>
						<h3 className="text-xs font-semibold uppercase tracking-[0.28em] text-sky-600">Navigation</h3>
						<ul className="mt-5 space-y-3">
							{NAV_ITEMS.map((link, index) => (
								<motion.li
									key={link.href}
									initial={{ opacity: 0, x: -6 }}
									whileInView={{ opacity: 1, x: 0 }}
									transition={{ delay: 0.02 * index, duration: 0.25 }}
									viewport={{ once: true }}
								>
									<Link
										href={link.href}
										className="group flex items-center justify-between rounded-2xl border border-transparent px-3 py-2 text-[0.96rem] text-slate-700 transition-all duration-300 hover:border-sky-50 hover:bg-sky-50 hover:text-slate-950"
									>
										<span>{link.label}</span>
										<ArrowRight size={14} className="text-slate-400 transition-transform duration-300 group-hover:translate-x-0.5" />
									</Link>
								</motion.li>
							))}
						</ul>
					</motion.section>

					<motion.section
						initial={{ opacity: 0, y: 14 }}
						whileInView={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.45, delay: 0.15 }}
						viewport={{ once: true }}
						className={`rounded-[2rem] border ${toneClasses(tones.featured)} bg-gradient-to-br p-7 shadow-[0_16px_44px_rgba(15,23,42,0.05)] backdrop-blur-xl lg:col-span-3`}
					>
						<h3 className="text-xs font-semibold uppercase tracking-[0.28em] text-sky-600">Featured</h3>
						<ul className="mt-5 space-y-3">
							{featuredWork.map((item, index) => (
								<motion.li
									key={item.label}
									initial={{ opacity: 0, x: -6 }}
									whileInView={{ opacity: 1, x: 0 }}
									transition={{ delay: 0.02 * index, duration: 0.25 }}
									viewport={{ once: true }}
								>
									<Link
										href={item.href}
										className="group flex items-center justify-between rounded-2xl border border-transparent px-3 py-2 text-[0.96rem] text-slate-700 transition-all duration-300 hover:border-sky-50 hover:bg-sky-50 hover:text-slate-950"
									>
										<span>{item.label}</span>
										<ArrowRight size={14} className="text-slate-400 transition-transform duration-300 group-hover:translate-x-0.5" />
									</Link>
								</motion.li>
							))}
						</ul>
					</motion.section>

					<motion.section
						initial={{ opacity: 0, y: 14 }}
						whileInView={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.45, delay: 0.2 }}
						viewport={{ once: true }}
						className={`rounded-[2rem] border ${toneClasses(tones.tech)} bg-gradient-to-br p-7 shadow-[0_16px_44px_rgba(15,23,42,0.05)] backdrop-blur-xl lg:col-span-3`}
					>
						<h3 className="text-xs font-semibold uppercase tracking-[0.28em] text-sky-600">Tech Stack</h3>
						<div className="mt-5 flex flex-wrap gap-2.5">
							{techStack.map((tech, index) => (
								<motion.span
									key={tech.label}
									initial={{ opacity: 0, y: 8 }}
									whileInView={{ opacity: 1, y: 0 }}
									transition={{ delay: 0.02 * index, duration: 0.25 }}
									viewport={{ once: true }}
									whileHover={{ y: -2 }}
									className="inline-flex items-center gap-2 rounded-full border border-sky-50 bg-white px-3 py-2 text-[12px] font-medium text-slate-700 shadow-[0_8px_18px_rgba(15,23,42,0.03)]"
								>
									<tech.icon size={13} className="text-slate-500" />
									{tech.label}
								</motion.span>
							))}
						</div>
					</motion.section>

					<motion.section
						initial={{ opacity: 0, y: 14 }}
						whileInView={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.45, delay: 0.25 }}
						viewport={{ once: true }}
						className="rounded-[2rem] border border-sky-50 bg-white/95 p-7 shadow-[0_16px_44px_rgba(15,23,42,0.05)] backdrop-blur-xl lg:col-span-14"
					>
						<div className="grid gap-5 xl:grid-cols-[1.3fr_0.9fr]">
							<div>
								<h3 className="text-xs font-semibold uppercase tracking-[0.28em] text-slate-500">Let&apos;s Connect</h3>
								<p className="mt-4 max-w-xl text-[0.98rem] leading-7 text-slate-600">
									Open to internships, software engineering opportunities, and premium collaborations.
								</p>

								<form onSubmit={handleContactSubmit} className="mt-5 flex max-w-xl flex-col gap-3 sm:flex-row">
									<input
										type="email"
										value={emailAddress}
										onChange={(event) => setEmailAddress(event.target.value)}
										placeholder="Your email address"
										className="h-12 flex-1 rounded-full border border-sky-100 bg-white px-4 text-sm text-slate-900 outline-none transition-all placeholder:text-slate-400 focus:border-sky-200 focus:ring-4 focus:ring-sky-100"
									/>
									<button
										type="submit"
										className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-sky-500 px-5 text-sm font-medium text-white shadow-[0_16px_34px_rgba(14,165,233,0.16)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-sky-600"
									>
										Send Message <ArrowUpRight size={16} />
									</button>
								</form>
							</div>

							<div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-2">
								<div className="rounded-3xl border border-sky-100 bg-white p-4 shadow-[0_10px_24px_rgba(15,23,42,0.05)]">
									<div className="flex items-center gap-2 text-indigo-500">
										<MapPin size={15} />
										<span className="text-[10px] font-semibold uppercase tracking-[0.24em]">Location</span>
									</div>
									<p className="mt-3 text-sm font-medium text-indigo-900">{portfolioData.contact.location}</p>
								</div>

								<div className="rounded-3xl border border-sky-100 bg-white p-4 shadow-[0_10px_24px_rgba(15,23,42,0.05)]">
									<div className="flex items-center gap-2 text-emerald-500">
										<Sparkles size={15} />
										<span className="text-[10px] font-semibold uppercase tracking-[0.24em]">Status</span>
									</div>
									<p className="mt-3 text-sm font-medium text-emerald-900">{portfolioData.profile.status}</p>
								</div>

								<div className="rounded-3xl border border-sky-100 bg-white p-4 shadow-[0_10px_24px_rgba(15,23,42,0.05)]">
									<div className="flex items-center gap-2 text-orange-500">
										<Flame size={15} />
										<span className="text-[10px] font-semibold uppercase tracking-[0.24em]">Openness</span>
									</div>
									<p className="mt-3 text-sm font-medium text-orange-900">{portfolioData.profile.openToWork ? "Open to work" : "Not looking"}</p>
								</div>

								<div className="rounded-3xl border border-sky-100 bg-white p-4 shadow-[0_10px_24px_rgba(15,23,42,0.05)]">
									<div className="flex items-center gap-2 text-sky-500">
										<Clock3 size={15} />
										<span className="text-[10px] font-semibold uppercase tracking-[0.24em]">Local time</span>
									</div>
									<p className="mt-3 text-sm font-medium text-sky-900">{localTime || "Updating..."}</p>
								</div>
							</div>
						</div>
					</motion.section>
				</div>

				<div className="mt-5 border-t border-slate-200/80 bg-[#f8fafc]/90">
					<div className="mx-auto flex max-w-7xl flex-col gap-5 px-6 py-6 text-sm text-slate-600 lg:flex-row lg:items-center lg:justify-between lg:px-8">
						<div className="space-y-1">
							<p>© {currentYear} {portfolioData.profile.name}. All rights reserved.</p>
						</div>

						<div className="inline-flex items-center gap-2 self-start rounded-full border border-emerald-200/70 bg-emerald-50 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.24em] text-emerald-800 lg:self-auto">
							<span className="relative flex h-2 w-2">
								<span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60" />
								<span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
							</span>
							{portfolioData.profile.status}
						</div>

						<div className="flex flex-col items-start gap-3 lg:items-end">
							<p className="text-right text-sm font-medium text-slate-700">Code. Solve. Build. Repeat.</p>
							<motion.button
								type="button"
								onClick={handleScrollToTop}
								whileHover={{ y: -3, scale: 1.03 }}
								whileTap={{ scale: 0.97 }}
								className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-[12px] font-medium text-slate-700 shadow-[0_10px_24px_rgba(15,23,42,0.05)] transition-colors hover:border-slate-300 hover:bg-slate-50 hover:text-slate-950"
							>
								Scroll to top <ChevronUp size={14} />
							</motion.button>
						</div>
					</div>
				</div>
			</div>
		</motion.footer>
	);
}
