"use client";

import React, { useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { AnimatePresence, motion, useMotionValue, useTransform, useSpring } from 'framer-motion';
import {
  BadgeCheck,
  Bot,
  Code2,
  ExternalLink,
  Flame,
  Layers3,
  Menu,
  Send,
  Sparkles,
  Sun,
  Trophy,
  UserCircle,
  X,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import AnimatedNumber from '@/components/dashboard/AnimatedNumber';
import Footer from '@/components/common/Footer';
import { NAV_ITEMS } from '@/lib/constants/config';
import portfolioData from '@/data/portfolio.json';
import type { AnalyticsDashboardData } from '@/lib/analytics/dashboard';
import LoginModal from '@/components/auth/LoginModal';

const HERO_ROLES = ['Software Engineer', 'Full Stack Developer', 'Backend Developer', 'AI Builder', 'Problem Solver', 'Competitive Programmer'];

type Tone = 'sky' | 'emerald' | 'violet' | 'amber';

function toneClasses(tone: Tone) {
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

type LiveMetric = {
  label: string;
  value: number;
  suffix?: string;
  icon: LucideIcon;
  helper: string;
  tone: Tone;
  customValueDisplay?: string;
};

const Hero = () => {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const smoothMouseX = useSpring(mouseX, { damping: 50, stiffness: 400 });
  const smoothMouseY = useSpring(mouseY, { damping: 50, stiffness: 400 });

  const rotateX = useTransform(smoothMouseY, [-1, 1], [2, -2]);
  const rotateY = useTransform(smoothMouseX, [-1, 1], [-2, 2]);
  const translateX = useTransform(smoothMouseX, [-1, 1], [-10, 10]);
  const translateY = useTransform(smoothMouseY, [-1, 1], [-10, 10]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width * 2 - 1;
    const y = (e.clientY - rect.top) / rect.height * 2 - 1;
    mouseX.set(x);
    mouseY.set(y);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [loginOpen, setLoginOpen] = useState(false);
  const [activeRoleIndex, setActiveRoleIndex] = useState(0);
  const [analytics, setAnalytics] = useState<AnalyticsDashboardData | null>(null);
  const [analyticsLoading, setAnalyticsLoading] = useState(true);

  // AI Chat States
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState([
    { role: 'model', text: "Hi! I'm Imran's AI assistant ✨. Ask me anything about his skills, experience, or what it's like to work with him!" }
  ]);
  const [userInput, setUserInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef<HTMLDivElement | null>(null);

  // Auto-scroll chat
  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chatMessages, isTyping]);

  useEffect(() => {
    const interval = window.setInterval(() => {
      setActiveRoleIndex((current) => (current + 1) % HERO_ROLES.length);
    }, 2400);

    return () => window.clearInterval(interval);
  }, []);

  useEffect(() => {
    const controller = new AbortController();

    async function loadAnalytics() {
      setAnalyticsLoading(true);

      try {
        const response = await fetch('/api/analytics', {
          cache: 'no-store',
          signal: controller.signal,
        });

        if (!response.ok) throw new Error('Failed to load analytics');

        const data = (await response.json()) as AnalyticsDashboardData;

        if (!controller.signal.aborted) {
          setAnalytics(data);
        }
      } catch {
        if (!controller.signal.aborted) {
          setAnalytics(null);
        }
      } finally {
        if (!controller.signal.aborted) {
          setAnalyticsLoading(false);
        }
      }
    }

    loadAnalytics();

    return () => controller.abort();
  }, []);  const currentStreak = useMemo(() => {
    if (!analytics) return 0;
    return analytics.platforms.reduce((max, platform) => {
      if (platform.status !== 'connected' || !platform.analytics) return max;
      return Math.max(max, platform.analytics.activeStreak);
    }, 0);
  }, [analytics]);

  const highestRating = useMemo(() => {
    if (!analytics) return 0;
    return analytics.platforms.reduce((max, platform) => {
      if (platform.status !== 'connected' || !platform.analytics) return max;
      const validPlatforms = ['codeforces', 'leetcode', 'codechef', 'atcoder'];
      if (!validPlatforms.includes(platform.platform)) return max;
      return Math.max(max, platform.analytics.rating || 0);
    }, 0);
  }, [analytics]);

  const liveMetrics: LiveMetric[] = [
    {
      label: 'Total Problems Solved',
      value: analytics?.summary.totalProblems ?? 0,
      icon: Code2,
      helper: 'Across connected coding profiles',
      tone: 'sky',
    },
    {
      label: 'Contest Participations',
      value: analytics?.summary.totalContests ?? 0,
      icon: Trophy,
      helper: 'Contest activity updated live',
      tone: 'violet',
    },
    {
      label: 'Current Coding Streak',
      value: currentStreak,
      suffix: ' days',
      icon: Flame,
      helper: 'Best active streak from connected platforms',
      tone: 'emerald',
    },
    {
      label: 'Contest Rating',
      value: highestRating > 0 ? highestRating : 0,
      icon: Layers3,
      helper: highestRating > 0 ? 'Highest Contest Rating' : 'No Rating Available',
      tone: 'amber',
      customValueDisplay: highestRating > 0 ? undefined : '—',
    },
  ];

  // Gemini API call with exponential backoff
  const fetchGeminiResponse = async (userMessage: string): Promise<string> => {
    const apiKey = ""; // API key is injected by the environment
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${apiKey}`;

    const systemInstruction = "You are the AI assistant for Imran Khan, a Full Stack Engineer and AI Enthusiast. You speak professionally but friendly. Keep your answers concise (under 3 sentences). Highlight his skills in React, Next.js, Node, TypeScript, and AI integrations when relevant. If asked something unrelated to tech or hiring Imran, politely steer the conversation back to his professional profile.";

    const payload = {
      contents: [{ parts: [{ text: userMessage }] }],
      systemInstruction: { parts: [{ text: systemInstruction }] }
    };

    const maxRetries = 5;
    const delays = [1000, 2000, 4000, 8000, 16000];

    for (let i = 0; i < maxRetries; i++) {
      try {
        const response = await fetch(url, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload)
        });

        if (!response.ok) throw new Error("API Error");

        const data = await response.json();
        return data.candidates?.[0]?.content?.parts?.[0]?.text || "Sorry, I couldn't process that.";
      } catch {
        if (i === maxRetries - 1) return "Network error connecting to AI. Please try again later.";
        await new Promise(res => setTimeout(res, delays[i]));
      }
    }
    return "Network error connecting to AI. Please try again later.";
  };

  const handleSendMessage = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!userInput.trim() || isTyping) return;

    const newUserMsg = { role: 'user', text: userInput };
    setChatMessages(prev => [...prev, newUserMsg]);
    setUserInput('');
    setIsTyping(true);

    const aiReply = await fetchGeminiResponse(newUserMsg.text);

    setChatMessages(prev => [...prev, { role: 'model', text: aiReply }]);
    setIsTyping(false);
  };

  return (
    <>
      {/* Injecting Premium Fonts */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500&family=Plus+Jakarta+Sans:wght@300;400;500;600;700&display=swap');
        
        .font-sans {
          font-family: 'Plus Jakarta Sans', sans-serif;
        }
        .font-serif {
          font-family: 'Playfair Display', serif;
        }
      `}</style>

      <div className="min-h-screen bg-white text-slate-900 font-sans selection:bg-slate-900 selection:text-white overflow-hidden relative">
        {/* Ambient Background Glows - Blue / Green Subtle */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[420px] rounded-full blur-[120px] -z-10 mix-blend-multiply opacity-60 pointer-events-none bg-gradient-to-r from-sky-100/30 via-emerald-100/20 to-white/0"></div>



        {/* Main Layout */}
        <main className="relative max-w-[1400px] mx-auto px-6 lg:px-12 pt-4 lg:pt-6 pb-4 flex flex-col gap-4 lg:gap-6">
          <div className="grid gap-8 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] items-start w-full max-w-7xl mx-auto">
            <section className="relative z-10 flex flex-col items-start text-left w-full pt-2 lg:pt-4">
              <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full border border-slate-200/80 bg-white/85 backdrop-blur-md shadow-[0_10px_30px_rgba(15,23,42,0.06)] mb-8 text-[10px] font-semibold tracking-[0.32em] text-slate-600 uppercase">
                <Sparkles size={12} className="text-sky-500" />
                <span>Software Engineer • Full Stack Developer • AI Builder</span>
              </div>

              <div className="mb-5 flex items-center gap-3 text-[11px] font-medium uppercase tracking-[0.28em] text-slate-500">
                <span className="h-px w-8 bg-slate-200" />
                <span className="overflow-hidden">
                  <AnimatePresence mode="wait" initial={false}>
                    <motion.span
                      key={HERO_ROLES[activeRoleIndex]}
                      initial={{ opacity: 0, y: 12, filter: 'blur(6px)' }}
                      animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                      exit={{ opacity: 0, y: -12, filter: 'blur(6px)' }}
                      transition={{ duration: 0.4, ease: 'easeOut' }}
                      className="inline-block"
                    >
                      {HERO_ROLES[activeRoleIndex]}
                    </motion.span>
                  </AnimatePresence>
                </span>
              </div>

              <motion.h1
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: 'easeOut' }}
                className="text-[2.85rem] sm:text-6xl lg:text-[4.8rem] leading-[1.03] tracking-[-0.05em] font-serif text-slate-950 mb-6 max-w-3xl"
              >
                Hi, I&apos;m {portfolioData.profile.name}.
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.55, delay: 0.1 }}
                className="text-[1.05rem] sm:text-lg text-slate-500 font-light leading-[1.9] max-w-2xl"
              >
                {portfolioData.profile.summary}
              </motion.p>

              <div className="mt-10 grid w-full max-w-5xl grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-2">
                {liveMetrics.map((metric, index) => (
                  <motion.div
                    key={metric.label}
                    initial={{ opacity: 0, y: 14 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 * index, duration: 0.45 }}
                    className={`relative min-h-[10.5rem] overflow-hidden rounded-[1.9rem] border bg-gradient-to-br ${toneClasses(metric.tone)} backdrop-blur-xl p-5 shadow-[0_18px_50px_rgba(15,23,42,0.05)]`}
                  >
                    <div className="absolute inset-0 bg-white/55 opacity-0 transition-opacity duration-300 hover:opacity-100" />
                    <div className="relative z-10 flex flex-col gap-3">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-slate-500 sm:text-[12px]">{metric.label}</p>
                          <div className="mt-2 flex items-end gap-1.5 text-slate-950">
                            {analyticsLoading ? (
                              <div className="h-12 w-28 animate-pulse rounded-xl bg-slate-200/80" />
                            ) : (
                              <>
                                {metric.customValueDisplay !== undefined ? (
                                  <span className="text-4xl sm:text-[2.9rem] font-serif tracking-[-0.05em] leading-none">
                                    {metric.customValueDisplay}
                                  </span>
                                ) : (
                                  <AnimatedNumber value={metric.value} className="text-4xl sm:text-[2.9rem] font-serif tracking-[-0.05em] leading-none" />
                                )}
                                {metric.suffix && <span className="pb-1 text-base font-medium text-slate-500">{metric.suffix}</span>}
                              </>
                            )}
                          </div>
                        </div>
                        <div className="rounded-2xl border border-white/80 bg-white/90 p-3.5 shadow-[0_8px_20px_rgba(15,23,42,0.05)]">
                          <metric.icon className="h-5 w-5 text-slate-600" />
                        </div>
                      </div>
                      <p className="text-sm leading-6 text-slate-500">{metric.helper}</p>
                    </div>
                  </motion.div>
                ))}
              </div>

              <div className="mt-6 flex w-full max-w-4xl items-center justify-between rounded-[1.75rem] border border-slate-200/80 bg-white/85 px-5 py-4 shadow-[0_14px_40px_rgba(15,23,42,0.06)] backdrop-blur-xl">
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-slate-500">Academic Highlight</p>
                  <p className="mt-1 text-lg font-medium text-slate-900">B.Tech Computer Science</p>
                </div>
                <div className="rounded-full border border-emerald-200/70 bg-emerald-50 px-4 py-2 text-right shadow-[0_10px_24px_rgba(16,185,129,0.08)]">
                  <div className="flex items-center gap-2 text-emerald-900">
                    <BadgeCheck size={16} />
                    <span className="text-lg font-semibold tracking-[-0.03em]">{portfolioData.education?.cgpa || "8+"} CGPA</span>
                  </div>
                  <p className="mt-0.5 text-[11px] text-emerald-700/80">Academic performance, consistently strong</p>
                </div>
              </div>

            </section>

            <section className="relative z-10 w-full pt-0 lg:pt-2 lg:sticky lg:top-16 self-start">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="relative mx-auto w-full max-w-[800px]"
              >
                <motion.div
                  onMouseMove={handleMouseMove}
                  onMouseLeave={handleMouseLeave}
                  style={{
                    rotateX,
                    rotateY,
                    x: translateX,
                    y: translateY,
                    perspective: 1000
                  }}
                  className="relative mx-auto h-72 w-72 md:h-[420px] md:w-[420px] drop-shadow-[0_20px_50px_rgba(0,0,0,0.08)]"
                >
                  {/* Subtle Background Effects */}
                  <div className="absolute inset-0 z-0 pointer-events-none">
                    <div className="absolute inset-0 bg-amber-50/20 blur-[60px] rounded-full scale-110" />
                    <div className="absolute top-0 right-0 w-32 h-32 bg-orange-100/10 blur-3xl rounded-full" />
                    <div className="absolute bottom-0 left-0 w-40 h-40 bg-sky-50/20 blur-3xl rounded-full" />
                  </div>

                  <motion.div
                    animate={{ y: [-4, 4, -4] }}
                    transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
                    className="relative z-10 w-full h-full group flex items-center justify-center"
                  >
                    {/* Very subtle warm glow behind (10-15%) */}
                    <div className="absolute inset-0 bg-gradient-to-tr from-amber-400/15 via-transparent to-orange-400/5 blur-3xl rounded-full scale-[0.85] opacity-80" />

                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src="/profile.png"
                      alt="Imran Khan portrait"
                      className="h-full w-full object-cover rounded-[2.5rem] transition-all duration-700 ease-out group-hover:scale-[1.02] [mask-image:radial-gradient(circle_at_center,black_95%,transparent_100%)] [-webkit-mask-image:radial-gradient(circle_at_center,black_95%,transparent_100%)] brightness-[1.02] contrast-[1.04]"
                    />
                  </motion.div>
                </motion.div>

                <div className="mt-5 grid w-full gap-5 sm:grid-cols-2">
                  {portfolioData.projects.filter(p => p.featured).slice(0, 2).map((project: any, index) => (
                    <motion.article
                      key={project.title}
                      initial={{ opacity: 0, y: 18 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 * index, duration: 0.5 }}
                      whileHover={{ y: -6, scale: 1.01 }}
                      className={`relative overflow-hidden rounded-3xl border bg-gradient-to-br ${toneClasses(index === 0 ? 'sky' : 'emerald')} p-4 sm:p-5 shadow-[0_18px_50px_rgba(15,23,42,0.06)] backdrop-blur-xl`}
                    >
                      <div className="absolute inset-0 bg-white/45 opacity-0 transition-opacity duration-300 hover:opacity-100" />
                      <div className="relative z-10 flex h-full flex-col">
                        <p className="text-[9px] font-semibold uppercase tracking-[0.26em] text-slate-500">Featured Project</p>
                        <h3 className="mt-1.5 text-[1.15rem] font-serif tracking-[-0.03em] text-slate-900 leading-snug">{project.title}</h3>
                        <p className="mt-1.5 text-xs leading-5 text-slate-600 line-clamp-2">{project.description}</p>

                        <div className="mt-3 flex flex-wrap gap-1.5">
                          {project.techStack.map((tech: string) => (
                            <span key={tech} className="rounded-full border border-white/80 bg-white/90 px-2.5 py-1 text-[10px] font-medium text-slate-700 shadow-[0_8px_18px_rgba(15,23,42,0.04)]">
                              {tech}
                            </span>
                          ))}
                        </div>

                        <div className="mt-4 flex gap-2">
                          <Link href={project.demo} className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-full bg-sky-500 py-2.5 text-xs font-medium text-white transition-all duration-300 hover:-translate-y-1 hover:scale-[1.01] hover:bg-sky-600 hover:shadow-[0_18px_30px_rgba(14,165,233,0.16)]">
                            Live Demo <ExternalLink size={12} />
                          </Link>
                          <a href={project.github} target="_blank" rel="noreferrer" className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-full border border-sky-100 bg-white/90 py-2.5 text-xs font-medium text-slate-800 transition-all duration-300 hover:-translate-y-1 hover:scale-[1.01] hover:bg-sky-50 hover:shadow-[0_18px_30px_rgba(15,23,42,0.08)]">
                            GitHub <Code2 size={12} />
                          </a>
                        </div>
                      </div>
                    </motion.article>
                  ))}
                </div>

              </motion.div>
            </section>
          </div>

          <Footer />
        </main>

        <LoginModal isOpen={loginOpen} onClose={() => setLoginOpen(false)} />

        {/* AI Chat Modal Overlay */}
        {isChatOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-gray-900/40 backdrop-blur-sm animate-in fade-in duration-300">
            <div className="bg-white w-full max-w-md rounded-[2rem] shadow-2xl overflow-hidden flex flex-col h-[500px] border border-gray-100 transform transition-all scale-100 animate-in zoom-in-95 duration-300">

              {/* Chat Header */}
              <div className="flex items-center justify-between p-5 border-b border-gray-100 bg-gray-50/50">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600">
                    <Bot size={20} />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-gray-900">IK Assistant ✨</h3>
                    <p className="text-[11px] text-green-600 font-medium flex items-center gap-1">
                      <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span> Online
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setIsChatOpen(false)}
                  className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Chat Messages Area */}
              <div className="flex-1 overflow-y-auto p-5 flex flex-col gap-4 bg-white">
                {chatMessages.map((msg, idx) => (
                  <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[85%] rounded-2xl px-4 py-3 text-[13px] leading-relaxed ${msg.role === 'user'
                        ? 'bg-gray-900 text-white rounded-br-sm'
                        : 'bg-gray-100 text-gray-800 rounded-bl-sm'
                      }`}>
                      {msg.text}
                    </div>
                  </div>
                ))}

                {isTyping && (
                  <div className="flex justify-start">
                    <div className="bg-gray-100 text-gray-800 rounded-2xl rounded-bl-sm px-4 py-3.5 flex items-center gap-1.5">
                      <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                      <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                      <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                    </div>
                  </div>
                )}
                <div ref={chatEndRef} />
              </div>

              {/* Chat Input Area */}
              <div className="p-4 bg-white border-t border-gray-100">
                <form
                  onSubmit={handleSendMessage}
                  className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-full p-1.5 pl-4 focus-within:border-gray-400 focus-within:bg-white transition-colors"
                >
                  <input
                    type="text"
                    value={userInput}
                    onChange={(e) => setUserInput(e.target.value)}
                    placeholder="Ask about my tech stack..."
                    className="flex-1 bg-transparent text-[13px] text-gray-900 placeholder-gray-400 outline-none w-full"
                    disabled={isTyping}
                  />
                  <button
                    type="submit"
                    disabled={!userInput.trim() || isTyping}
                    className="p-2.5 bg-gray-900 text-white rounded-full hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                  >
                    <Send size={14} className="ml-0.5" />
                  </button>
                </form>
              </div>

            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Hero;