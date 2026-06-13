import { SITE_CONFIG } from "@/lib/constants/config";
import type { Project } from "@/lib/types/projects";
const PROJECT_IMAGES = {
  aiInterview: "https://aiinterviewhub.com/static/media/dashboard-group.ffcae4978897e8eb0347.png",
  offlinePayment: "https://mir-s3-cdn-cf.behance.net/project_modules/1400/9eacff100357725.5f0719696399d.jpg",
  ecommerce: "https://mir-s3-cdn-cf.behance.net/project_modules/1400/8890f9175758177.64b8ff51e4fc2.png",
  carbon: "https://www.board.com/wp-content/uploads/2025/02/picture1_11.png",
  dpi: "https://cdn.comparitech.com/wp-content/uploads/2018/04/6-captured-packets-screenshot-.jpg",
  temperature: "https://sp-ao.shortpixel.ai/client/to_auto,q_glossy,ret_img,w_498,h_290/https://www.programminginpython.com/wp-content/uploads/2023/03/tempature_converter_python1.png",
} as const;

export const PROJECT_FALLBACK_IMAGES = {
  aiInterview: "https://cdn.dribbble.com/userupload/43504791/file/original-6cb43bd548ab6d6733c94dc1619ea388.jpg?resize={width}x{height}&vertical=center",
  offlinePayment: "https://uiworkshop.com/upload/images/7eabe3a1649ffa2b3ff8c02ebfd5659f_dc1abec14aa6e50efb6f3cdfbb45c2a0.webp",
  ecommerce: "https://cdn.dribbble.com/users/5087733/screenshots/15206744/ecommerce_dashboard_ui_exploration_4x.png",
  carbon: "https://cdn.dribbble.com/userupload/37871361/file/original-7f3b8af6704f52e7cf88888613332eda.png?crop=0x0-2840x2130&resize=1600x1200",
  dpi: "https://www.researchgate.net/profile/Mohammed_Qadeer/publication/232625696/figure/fig1/AS:441986638454784@1482389234850/Screen-shot-of-wireshark.png",
  temperature: "https://i.ytimg.com/vi/DOdv8O1QA44/maxresdefault.jpg",
} as const;

export const ALL_PROJECTS: Project[] = [
  {
    id: "ai-mock-interview-platform",
    title: "AI Mock Interview Platform",
    description:
      "An AI-powered interview preparation platform featuring real-time mock interviews, intelligent feedback, performance analytics, and personalized improvement recommendations.",
    overview:
      "A polished interview practice experience that blends AI feedback, analytics, and structured simulations to help candidates improve faster.",
    category: "AI",
    techStack: ["Next.js", "TypeScript", "Flask", "AI", "Tailwind CSS"],
    image: PROJECT_IMAGES.aiInterview,
    images: [PROJECT_IMAGES.aiInterview],
    github: SITE_CONFIG.socialLinks.github,
    demo: "/projects#ai-mock-interview-platform",
    featured: true,
  },
  {
    id: "offline-payment-system",
    title: "Offline Payment System Using Java & Mesh Technology",
    description:
      "A secure offline payment solution using mesh networking technology that enables transactions even without internet connectivity.",
    overview:
      "An edge-first transaction system designed for resilience, local-first workflows, and secure payment exchange across mesh-connected devices.",
    category: "Backend",
    techStack: ["Java", "Mesh Networking", "SQLite", "JavaFX"],
    image: PROJECT_IMAGES.offlinePayment,
    images: [PROJECT_IMAGES.offlinePayment],
    github: SITE_CONFIG.socialLinks.github,
    demo: "/projects#offline-payment-system",
    featured: true,
  },
  {
    id: "e-commerce-website",
    title: "E-Commerce Website",
    description: "A polished shopping experience with product browsing, cart management, and structured checkout flows.",
    overview:
      "A full-stack commerce interface focused on premium presentation, category exploration, and a smooth purchase path.",
    category: "Full Stack",
    techStack: ["Java", "HTML", "CSS", "MySQL"],
    image: PROJECT_IMAGES.ecommerce,
    images: [PROJECT_IMAGES.ecommerce],
    github: SITE_CONFIG.socialLinks.github,
    demo: "/projects#e-commerce-website",
    featured: false,
  },
  {
    id: "temperature-converter",
    title: "Temperature Converter",
    description: "A clean desktop utility for fast and reliable temperature conversions with a modern calculator-style interface.",
    overview:
      "A simple but polished Tkinter application that prioritizes clarity, speed, and a refined utility-app layout.",
    category: "Full Stack",
    techStack: ["Python", "Tkinter"],
    image: PROJECT_IMAGES.temperature,
    images: [PROJECT_IMAGES.temperature],
    github: SITE_CONFIG.socialLinks.github,
    demo: "/projects#temperature-converter",
    featured: false,
  },
  {
    id: "carbon-footprint-monitor",
    title: "Carbon Footprint Monitor",
    description: "A sustainability dashboard for tracking environmental impact, carbon usage, and actionable analytics.",
    overview:
      "A metrics-driven sustainability product that turns environmental data into clear decisions and visual progress.",
    category: "Machine Learning",
    techStack: ["Java", "HTML", "CSS", "JavaScript"],
    image: PROJECT_IMAGES.carbon,
    images: [PROJECT_IMAGES.carbon],
    github: SITE_CONFIG.socialLinks.github,
    demo: "/projects#carbon-footprint-monitor",
    featured: false,
  },
  {
    id: "deep-packet-inspection",
    title: "Deep Packet Inspection",
    description: "A cybersecurity and network monitoring project for packet analysis, traffic inspection, and visibility.",
    overview:
      "A technically focused networking tool that highlights packet-level analysis, inspection workflows, and security observability.",
    category: "Backend",
    techStack: ["Java", "Networking", "Packet Analysis"],
    image: PROJECT_IMAGES.dpi,
    images: [PROJECT_IMAGES.dpi],
    github: SITE_CONFIG.socialLinks.github,
    demo: "/projects#deep-packet-inspection",
    featured: false,
  },
];

export const FEATURED_PROJECTS = ALL_PROJECTS.filter((project) => project.featured);
