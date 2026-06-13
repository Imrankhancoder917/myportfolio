import type { Certificate, Skill, SkillSection, TimelineItem } from "@/lib/types/projects";

export const SKILL_SECTIONS: SkillSection[] = [
  {
    title: "Programming Languages",
    description: "Core languages used across application, backend, and automation work.",
    skills: [
      { name: "Java", level: "advanced", category: "Programming Languages" },
      { name: "Python", level: "advanced", category: "Programming Languages" },
      { name: "JavaScript", level: "advanced", category: "Programming Languages" },
      { name: "TypeScript", level: "advanced", category: "Programming Languages" },
      { name: "HTML5", level: "advanced", category: "Programming Languages" },
      { name: "CSS3", level: "advanced", category: "Programming Languages" },
    ],
  },
  {
    title: "Frontend Development",
    description: "Product-focused UI engineering with modern web frameworks and responsive systems.",
    skills: [
      { name: "React.js", level: "advanced", category: "Frontend Development" },
      { name: "Next.js", level: "advanced", category: "Frontend Development" },
      { name: "Tailwind CSS", level: "advanced", category: "Frontend Development" },
      { name: "Responsive Design", level: "advanced", category: "Frontend Development" },
      { name: "UI/UX Development", level: "intermediate", category: "Frontend Development" },
    ],
  },
  {
    title: "Backend Development",
    description: "Server-side systems, APIs, and application architecture for production workflows.",
    skills: [
      { name: "Node.js", level: "intermediate", category: "Backend Development" },
      { name: "REST APIs", level: "advanced", category: "Backend Development" },
      { name: "Express.js", level: "intermediate", category: "Backend Development" },
      { name: "Flask", level: "advanced", category: "Backend Development" },
      { name: "Backend Architecture", level: "intermediate", category: "Backend Development" },
      { name: "Mesh Networking", level: "intermediate", category: "Backend Development" },
      { name: "JavaFX", level: "intermediate", category: "Backend Development" },
    ],
  },
  {
    title: "Database",
    description: "Relational and document data modeling for durable application storage.",
    skills: [
      { name: "MySQL", level: "advanced", category: "Database" },
      { name: "MongoDB", level: "intermediate", category: "Database" },
      { name: "Database Design", level: "advanced", category: "Database" },
      { name: "SQLite", level: "intermediate", category: "Database" },
    ],
  },
  {
    title: "AI & Machine Learning",
    description: "Intelligent product features, prompt workflows, and data-driven experimentation.",
    skills: [
      { name: "Artificial Intelligence", level: "advanced", category: "AI & Machine Learning" },
      { name: "Machine Learning", level: "intermediate", category: "AI & Machine Learning" },
      { name: "Prompt Engineering", level: "intermediate", category: "AI & Machine Learning" },
      { name: "AI Integration", level: "advanced", category: "AI & Machine Learning" },
      { name: "Data Analysis", level: "intermediate", category: "AI & Machine Learning" },
    ],
  },
  {
    title: "Tools & Platforms",
    description: "Development tooling and environments used for shipping and debugging software.",
    skills: [
      { name: "Git", level: "advanced", category: "Tools & Platforms" },
      { name: "GitHub", level: "advanced", category: "Tools & Platforms" },
      { name: "VS Code", level: "expert", category: "Tools & Platforms" },
      { name: "Postman", level: "intermediate", category: "Tools & Platforms" },
      { name: "Linux", level: "intermediate", category: "Tools & Platforms" },
      { name: "Tkinter", level: "intermediate", category: "Tools & Platforms" },
    ],
  },
  {
    title: "Computer Science Fundamentals",
    description: "Foundational CS skills that support engineering quality and system understanding.",
    skills: [
      { name: "Data Structures & Algorithms", level: "advanced", category: "Computer Science Fundamentals" },
      { name: "Object-Oriented Programming", level: "advanced", category: "Computer Science Fundamentals" },
      { name: "DBMS", level: "advanced", category: "Computer Science Fundamentals" },
      { name: "Operating Systems", level: "intermediate", category: "Computer Science Fundamentals" },
      { name: "Computer Networks", level: "intermediate", category: "Computer Science Fundamentals" },
      { name: "Software Engineering", level: "advanced", category: "Computer Science Fundamentals" },
      { name: "Networking", level: "intermediate", category: "Computer Science Fundamentals" },
      { name: "Packet Analysis", level: "intermediate", category: "Computer Science Fundamentals" },
    ],
  },
] as const satisfies SkillSection[];

export const SKILLS: Skill[] = SKILL_SECTIONS.flatMap((section) => section.skills);

export const TIMELINE: TimelineItem[] = [];
export const CERTIFICATES: Certificate[] = [];
