"use client";

import React, { useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  ArrowUpRight,
  Code2,
  Globe2,
  Link2,
  Mail,
  MapPin,
  Phone,
  Send,
  Shield,
  Target,
  Trophy,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import SectionContainer from "@/components/layout/SectionContainer";
import portfolioData from "@/data/portfolio.json";

type FormState = {
  name: string;
  email: string;
  subject: string;
  message: string;
};

type ContactCard = {
  label: string;
  value: string;
  href: string;
  icon: LucideIcon;
};

type SocialLink = {
  label: string;
  href: string;
  icon: LucideIcon;
  colorClass: string;
};

const CONTACT_CARDS: ContactCard[] = [
  {
    label: "Email",
    value: portfolioData.contact.email,
    href: `mailto:${portfolioData.contact.email}`,
    icon: Mail,
  },
  {
    label: "Phone",
    value: portfolioData.contact.phone,
    href: `tel:${portfolioData.contact.phone}`,
    icon: Phone,
  },
  {
    label: "Location",
    value: portfolioData.contact.location,
    href: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(portfolioData.contact.location)}`,
    icon: MapPin,
  },
];

const getPlatformUsername = (id: string) => portfolioData.platforms.find(p => p.id === id)?.username || "";

const SOCIAL_LINKS: SocialLink[] = [
  { label: "GitHub", href: portfolioData.contact.github, icon: Code2, colorClass: "text-slate-700 hover:bg-slate-100 hover:border-slate-300" },
  { label: "LinkedIn", href: portfolioData.contact.linkedin, icon: Link2, colorClass: "text-[#0A66C2] hover:bg-blue-50 hover:border-blue-200" },
  { label: "LeetCode", href: `https://leetcode.com/u/${getPlatformUsername("leetcode")}/`, icon: Trophy, colorClass: "text-[#FFA116] hover:bg-orange-50 hover:border-orange-200" },
  { label: "Codeforces", href: `https://codeforces.com/profile/${getPlatformUsername("codeforces")}`, icon: Target, colorClass: "text-[#3B5998] hover:bg-indigo-50 hover:border-indigo-200" },
  { label: "HackerRank", href: `https://www.hackerrank.com/profile/${getPlatformUsername("hackerrank")}`, icon: Shield, colorClass: "text-[#2EC866] hover:bg-green-50 hover:border-green-200" },
  { label: "Twitter", href: portfolioData.contact.twitter, icon: Globe2, colorClass: "text-violet-600 hover:bg-violet-50 hover:border-violet-200" },
];

const containerVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0 },
};

export default function ContactPage() {
  const [form, setForm] = useState<FormState>({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const contactNote = useMemo(
    () => "I am always excited to connect with recruiters, developers, founders, and teams working on innovative ideas. Whether it's an internship, full-time role, freelance project, or technical collaboration, let's build something meaningful together.",
    [],
  );

  const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setStatus("idle");

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(form.email)) {
      setStatus("error");
      setErrorMessage("Please enter a valid email address.");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await response.json();

      if (!response.ok) {
        setStatus("error");
        setErrorMessage(data.error || "Failed to send message. Please try again.");
        return;
      }

      setStatus("success");
      setErrorMessage("");
      setForm({ name: "", email: "", subject: "", message: "" });

      setTimeout(() => {
        setStatus("idle");
      }, 2000);
    } catch {
      setStatus("error");
      setErrorMessage("Network error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="relative overflow-hidden bg-[#fcfcfc] text-gray-900">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-24 top-16 h-72 w-72 rounded-full bg-sky-200/35 blur-3xl" />
        <div className="absolute -right-24 top-24 h-72 w-72 rounded-full bg-emerald-200/35 blur-3xl" />
        <div className="absolute left-1/2 top-1/2 h-96 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full bg-cyan-100/25 blur-3xl" />
      </div>

      <SectionContainer className="pt-4 pb-8 sm:pt-8 sm:pb-12 lg:pt-12 lg:pb-16">
        <div className="relative mx-auto max-w-7xl">
          <motion.div
            initial="hidden"
            animate="show"
            variants={containerVariants}
            className="grid gap-10 lg:grid-cols-[1.02fr_0.98fr] lg:gap-12"
          >
            <motion.section variants={itemVariants} className="flex flex-col justify-between">
              <div>
                <motion.p
                  variants={itemVariants}
                  className="text-[11px] font-semibold uppercase tracking-[0.34em] text-slate-500"
                >
                  Get In Touch
                </motion.p>

                <motion.h1
                  variants={itemVariants}
                  className="mt-5 max-w-lg font-serif text-6xl font-semibold tracking-[-0.06em] text-slate-950 sm:text-7xl lg:text-[5.5rem] lg:leading-[0.96]"
                >
                  Let&apos;s Work
                  <br />
                  <span className="bg-gradient-to-r from-sky-500 via-cyan-500 to-blue-600 bg-clip-text text-transparent">
                    Together
                  </span>
                </motion.h1>

                <motion.p
                  variants={itemVariants}
                  className="mt-6 max-w-xl text-[1.02rem] leading-8 text-slate-600 sm:text-[1.05rem]"
                >
                  {contactNote}
                  <br />
                  <br />
                  Reach out through any of the contact options below.
                </motion.p>
              </div>

              <motion.div variants={itemVariants} className="mt-10 space-y-4">
                {CONTACT_CARDS.map((card, index) => {
                  const Icon = card.icon;

                  return (
                    <motion.a
                      key={card.label}
                      href={card.href}
                      target={card.href.startsWith("http") ? "_blank" : undefined}
                      rel={card.href.startsWith("http") ? "noreferrer" : undefined}
                      whileHover={{ y: -4, x: 4 }}
                      whileTap={{ scale: 0.99 }}
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.04 * index, duration: 0.35 }}
                      className="group flex items-center gap-4 rounded-[1.5rem] border border-slate-200/80 bg-white/80 p-4 shadow-[0_14px_38px_rgba(15,23,42,0.05)] backdrop-blur-xl transition-all duration-300 hover:border-sky-100 hover:shadow-[0_20px_44px_rgba(15,23,42,0.08)]"
                    >
                      <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-sky-100 bg-sky-50 text-sky-600 transition-all duration-300 group-hover:bg-sky-100/80 group-hover:text-sky-700">
                        <Icon size={18} />
                      </div>

                      <div className="min-w-0 flex-1">
                        <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-slate-500">
                          {card.label}
                        </p>
                        <p className="mt-1 truncate text-[1.02rem] font-medium text-slate-900">
                          {card.value}
                        </p>
                      </div>

                      <ArrowUpRight
                        size={16}
                        className="shrink-0 text-slate-400 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-sky-500"
                      />
                    </motion.a>
                  );
                })}
              </motion.div>
            </motion.section>

            <motion.section
              variants={itemVariants}
              className="relative rounded-[2rem] border border-slate-200/80 bg-white/78 p-5 shadow-[0_18px_48px_rgba(15,23,42,0.06)] backdrop-blur-xl sm:p-7 lg:p-8"
            >
              <div className="absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-sky-300/70 to-transparent" />

              <div className="mb-8">
                <p className="text-[11px] font-semibold uppercase tracking-[0.34em] text-slate-500">
                  Send A Message
                </p>
                <h2 className="mt-4 text-3xl font-semibold tracking-[-0.04em] text-slate-950 sm:text-4xl">
                  Let's Connect
                </h2>
                <p className="mt-3 max-w-xl text-sm leading-7 text-slate-600">
                  Share a project idea, internship opportunity, freelance brief, or just say hello.
                </p>
              </div>

              <motion.form
                onSubmit={handleSubmit}
                initial="hidden"
                animate="show"
                variants={containerVariants}
                className="space-y-5"
              >
                {status === "success" && (
                  <motion.div
                    variants={itemVariants}
                    className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700"
                  >
                    Message sent successfully. I&apos;ll get back to you soon.
                  </motion.div>
                )}

                {status === "error" && (
                  <motion.div
                    variants={itemVariants}
                    className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-medium text-rose-700"
                  >
                    {errorMessage || "Failed to send your message. Please try again."}
                  </motion.div>
                )}

                <motion.div variants={containerVariants} className="grid gap-4 sm:grid-cols-2">
                  <motion.label variants={itemVariants} className="block">
                    <span className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.28em] text-slate-500">
                      Your Name
                    </span>
                    <input
                      type="text"
                      name="name"
                      value={form.name}
                      onChange={handleChange}
                      required
                      className="h-12 w-full rounded-2xl border border-slate-200 bg-white/90 px-4 text-sm text-slate-900 outline-none transition-all placeholder:text-slate-400 focus:border-sky-300 focus:ring-4 focus:ring-sky-100"
                      placeholder="John Doe"
                    />
                  </motion.label>

                  <motion.label variants={itemVariants} className="block">
                    <span className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.28em] text-slate-500">
                      Your Email
                    </span>
                    <input
                      type="email"
                      name="email"
                      value={form.email}
                      onChange={handleChange}
                      required
                      className="h-12 w-full rounded-2xl border border-slate-200 bg-white/90 px-4 text-sm text-slate-900 outline-none transition-all placeholder:text-slate-400 focus:border-sky-300 focus:ring-4 focus:ring-sky-100"
                      placeholder="john@example.com"
                    />
                  </motion.label>
                </motion.div>

                <motion.label variants={itemVariants} className="block">
                  <span className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.28em] text-slate-500">
                    Subject
                  </span>
                  <input
                    type="text"
                    name="subject"
                    value={form.subject}
                    onChange={handleChange}
                    required
                    className="h-12 w-full rounded-2xl border border-slate-200 bg-white/90 px-4 text-sm text-slate-900 outline-none transition-all placeholder:text-slate-400 focus:border-sky-300 focus:ring-4 focus:ring-sky-100"
                    placeholder="Let&apos;s discuss a project"
                  />
                </motion.label>

                <motion.label variants={itemVariants} className="block">
                  <span className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.28em] text-slate-500">
                    Your Message
                  </span>
                  <textarea
                    name="message"
                    value={form.message}
                    onChange={handleChange}
                    required
                    rows={7}
                    className="w-full rounded-3xl border border-slate-200 bg-white/90 px-4 py-4 text-sm text-slate-900 outline-none transition-all placeholder:text-slate-400 focus:border-sky-300 focus:ring-4 focus:ring-sky-100"
                    placeholder="Tell me a little about the project or opportunity."
                  />
                </motion.label>

                <motion.button
                  variants={itemVariants}
                  type="submit"
                  disabled={loading}
                  whileHover={loading ? undefined : { y: -3, scale: 1.01 }}
                  whileTap={loading ? undefined : { scale: 0.99 }}
                  className="group inline-flex h-14 w-full items-center justify-center gap-3 rounded-full bg-gradient-to-r from-sky-500 via-cyan-500 to-blue-600 px-6 text-sm font-semibold text-white shadow-[0_18px_40px_rgba(14,165,233,0.22)] transition-all duration-300 hover:shadow-[0_24px_52px_rgba(14,165,233,0.30)] disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {loading ? (
                    <span className="inline-flex items-center gap-3">
                      <motion.span
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        className="inline-block h-4 w-4 rounded-full border-2 border-white/40 border-t-white"
                      />
                      Sending...
                    </span>
                  ) : (
                    <>
                      Send Message
                      <Send className="transition-transform duration-300 group-hover:translate-x-1" size={16} />
                    </>
                  )}
                </motion.button>
              </motion.form>
            </motion.section>
          </motion.div>

          <motion.section
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
            viewport={{ once: true, margin: "-80px" }}
            className="mt-10 rounded-[2rem] border border-slate-200/80 bg-white/75 px-5 py-6 shadow-[0_14px_40px_rgba(15,23,42,0.05)] backdrop-blur-xl sm:px-7 sm:py-7"
          >
            <div className="flex flex-col items-start justify-between gap-6 lg:flex-row lg:items-center">
              <p className="max-w-2xl text-[0.98rem] leading-7 text-slate-600 sm:text-[1.02rem]">
                Let&apos;s connect and build something extraordinary together.
              </p>

              <div className="flex flex-wrap gap-3">
                {[...SOCIAL_LINKS, ...(portfolioData.contact.customLinks || []).map((link: any) => ({
                  label: link.label,
                  href: link.url,
                  icon: Globe2,
                  colorClass: "text-slate-700 hover:bg-slate-100 hover:border-slate-300"
                }))].map((social, index) => {
                  const Icon = social.icon;

                  return (
                    <motion.a
                      key={social.label}
                      href={social.href}
                      target="_blank"
                      rel="noreferrer"
                      whileHover={{ y: -4, scale: 1.04 }}
                      whileTap={{ scale: 0.96 }}
                      initial={{ opacity: 0, y: 10 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.03 * index, duration: 0.3 }}
                      viewport={{ once: true }}
                      aria-label={social.label}
                      title={social.label}
                      className={`group inline-flex h-12 w-12 items-center justify-center rounded-full border border-slate-200 bg-white shadow-[0_10px_24px_rgba(15,23,42,0.05)] transition-all duration-300 ${social.colorClass}`}
                    >
                      <Icon size={17} className="transition-transform duration-300 group-hover:scale-110" />
                    </motion.a>
                  );
                })}
              </div>
            </div>
          </motion.section>
        </div>
      </SectionContainer>
    </main>
  );
}
