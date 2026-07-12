import { NextResponse } from "next/server";
import { SITE_CONFIG } from "@/lib/constants/config";
import { SKILL_SECTIONS } from "@/lib/constants/skills";
import { ALL_PROJECTS } from "@/lib/constants/projects";

export async function GET() {
  const data = {
    profile: {
      name: SITE_CONFIG.author,
      title: "Software Engineer",
      summary: "Building scalable software products with engineering precision, AI intelligence, and problem-solving excellence.",
      about: "A curated technology stack built through real-world projects, competitive programming, and continuous learning—focused on full-stack development, backend engineering, AI, databases, and scalable software systems.",
      location: "Greater Noida, India",
      cgpa: "",
      status: "Available for opportunities",
      openToWork: true
    },
    contact: {
      email: SITE_CONFIG.email,
      phone: "+91 8700520631",
      location: "Greater Noida, India",
      linkedin: SITE_CONFIG.socialLinks.linkedin,
      github: SITE_CONFIG.socialLinks.github,
      twitter: SITE_CONFIG.socialLinks.twitter,
      whatsapp: SITE_CONFIG.socialLinks.whatsapp
    },
    resume: "",
    education: [],
    platforms: [
      { id: "leetcode", name: "LeetCode", username: process.env.LEETCODE_USERNAME || "" },
      { id: "codeforces", name: "Codeforces", username: process.env.CODEFORCES_HANDLE || "" },
      { id: "codechef", name: "CodeChef", username: process.env.CODECHEF_USERNAME || "" },
      { id: "hackerrank", name: "HackerRank", username: process.env.HACKERRANK_USERNAME || "" },
      { id: "gfg", name: "GeeksforGeeks", username: process.env.GFG_USERNAME || "" },
      { id: "atcoder", name: "AtCoder", username: process.env.ATCODER_USERNAME || "" },
      { id: "github", name: "GitHub", username: process.env.GITHUB_USERNAME || "" }
    ],
    skills: SKILL_SECTIONS,
    projects: ALL_PROJECTS
  };

  return NextResponse.json(data);
}
