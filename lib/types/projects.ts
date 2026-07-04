export interface Project {
  id: string;
  title: string;
  description: string;
  overview: string;
  category: "AI" | "Full Stack" | "Backend" | "Machine Learning";
  techStack: string[];
  image: string;
  images: string[];
  github?: string;
  demo?: string;
  caseStudy?: string;
  featured: boolean;
}

export type SkillLevel = "beginner" | "intermediate" | "advanced" | "expert";

export type SkillCategory =
  | "Programming Languages"
  | "Front End"
  | "Frontend Development"
  | "Backend Development"
  | "Database"
  | "AI & Machine Learning"
  | "Tools & Platforms"
  | "Computer Science Fundamentals";

export interface Skill {
  name: string;
  level: SkillLevel;
  category: SkillCategory;
}

export interface SkillSection {
  title: SkillCategory;
  description: string;
  skills: Skill[];
}

export interface Certificate {
  id: string;
  title: string;
  issuer: string;
  date: string;
  credentialUrl?: string;
  pdfUrl?: string;
  category: string;
}

export interface TimelineItem {
  date: string;
  title: string;
  description: string;
  type: "education" | "achievement" | "work";
}
