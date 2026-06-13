export const SITE_CONFIG = {
  title: "Software Engineer & AI Developer Portfolio",
  description: "Premium portfolio showcasing software engineering and AI development projects",
  author: "Imran Khan",
  email: "ik3370349@gmail.com",
  socialLinks: {
    github: "https://github.com/yourusername",
    linkedin: "https://linkedin.com/in/yourusername",
    twitter: "https://twitter.com/yourusername",
    whatsapp: "https://wa.me/1234567890",
  },
};

export const PLATFORM_COLORS = {
  leetcode: "#FFA116",
  codeforces: "#1F1C3F",
  codechef: "#5B4D3F",
  hackerrank: "#2EC866",
  gfg: "#1F8253",
  github: "#24292E",
  atcoder: "#00A3E0",
};

export const PLATFORM_NAMES: Record<string, string> = {
  leetcode: "LeetCode",
  codeforces: "Codeforces",
  codechef: "CodeChef",
  hackerrank: "HackerRank",
  gfg: "GeeksforGeeks",
  github: "GitHub",
  atcoder: "AtCoder",
};

export const CACHE_TTL = {
  analytics: Number(process.env.NEXT_PUBLIC_ANALYTICS_REFRESH_INTERVAL_MS ?? 300000),
  projects: 60 * 60 * 1000, // 1 hour
  skills: 24 * 60 * 60 * 1000, // 24 hours
};

export const ANALYTICS_REFRESH_INTERVAL_MS = CACHE_TTL.analytics;

export const NAV_ITEMS = [
  { href: "/projects", label: "Project" },
  { href: "/analytics", label: "DSA Dashboard" },
  { href: "/skills", label: "Skill" },
  { href: "/contact", label: "Contact" },
  { href: "/about", label: "About" },
];
