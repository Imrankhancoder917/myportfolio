# 🚀 Premium AI Developer Portfolio

A production-grade, ultra-premium personal portfolio website built with cutting-edge technologies for showcasing software engineering and AI development projects.

## ✨ Features

### Visual Design
- ✅ **Ultra-Premium Aesthetic**: Apple × Stripe × Futuristic developer dashboard design
- ✅ **Smooth Animations**: Page transitions, scroll-triggered animations, micro-interactions
- ✅ **Glassmorphism Effects**: Modern frosted glass UI components
- ✅ **3D Elements**: Animated floating geometric shapes using React Three Fiber
- ✅ **Animated Gradients**: Gradient backgrounds with smooth animations
- ✅ **Responsive Design**: Mobile, tablet, and desktop optimized

### Pages & Sections
1. **Home**: Hero section, featured projects, stats, CTA
2. **Analytics Dashboard**: Unified coding stats across 7 platforms
3. **Projects**: Filterable project showcase with categories
4. **Skills**: Categorized technical skills with proficiency indicators
5. **Certificates**: Professional credentials gallery
6. **About**: Timeline, achievements, resume download
7. **Contact**: Contact form with backend integration

### Technical Features
- **Modular Architecture**: Clean, reusable components
- **Type Safety**: Full TypeScript with strict mode
- **Performance Optimized**: Code splitting, lazy loading
- **Analytics Adapters**: Platform-specific API integrations
- **Caching**: In-memory cache for analytics data
- **API Routes**: Backend email integration
- **SEO Friendly**: Metadata optimization

## 🛠️ Tech Stack

- **Framework**: Next.js 15+ (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **3D Graphics**: React Three Fiber + Three.js
- **Charts**: Recharts
- **Icons**: Lucide Icons

## 📦 Installation

### Prerequisites
- Node.js 18+
- npm or yarn

### Setup

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build
```

Visit `http://localhost:3000` to see your portfolio.

## ⚙️ Configuration

### Update Personal Information

Edit `/lib/constants/config.ts`:

```typescript
export const SITE_CONFIG = {
  title: "Your Name - Portfolio",
  description: "Your professional description",
  author: "Your Name",
  email: "your.email@example.com",
  socialLinks: {
    github: "https://github.com/yourusername",
    linkedin: "https://linkedin.com/in/yourusername",
    twitter: "https://twitter.com/yourusername",
    whatsapp: "https://wa.me/your-number",
  },
};
```

### Update Projects

Edit `/lib/constants/projects.ts`:

```typescript
export const FEATURED_PROJECTS = [
  {
    id: "1",
    title: "Your Project Title",
    description: "Short description",
    overview: "Detailed overview",
    category: "AI", // "Full Stack", "Backend", or "Machine Learning"
    techStack: ["Next.js", "React", "TypeScript"],
    images: ["/images/project1.png"],
    github: "https://github.com/yourusername/project",
    demo: "https://yourproject.com",
    featured: true,
  },
];
```

### Update Skills & Certificates

Edit `/lib/constants/skills.ts` to add your technical skills and professional certificates.

## 🔌 Analytics Integration

The portfolio includes adapters for 7 coding platforms:
- LeetCode
- Codeforces
- CodeChef
- HackerRank
- GeeksforGeeks
- GitHub
- AtCoder

No configuration needed - adapters work with just usernames!

## 📧 Contact Form

The contact form is ready for email integration. Choose your email service:
- SendGrid
- Resend
- EmailJS
- Or any SMTP service

Update `/app/api/contact/route.ts` with your preferred service.

## 📁 Project Structure

```
components/       # Reusable UI components
lib/
  ├── types/      # TypeScript types
  ├── adapters/   # Platform integrations
  ├── constants/  # Config & data
  └── utils/      # Helper functions
app/              # Pages & routes
public/           # Static assets
```

## 🚀 Deployment

### Vercel (Recommended)
```bash
npm install -g vercel
vercel
```

### Other Platforms
Works with any Node.js hosting (Netlify, AWS, DigitalOcean, etc.)

## 🎨 Customization

- **Colors**: Edit `/app/globals.css`
- **Animations**: Modify `/lib/utils/animations.ts`
- **3D Scene**: Customize `/components/3d/FloatingGeometry.tsx`
- **Components**: All components use Tailwind CSS for easy styling

## 📚 Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Framer Motion](https://www.framer.com/motion/)
- [React Three Fiber](https://docs.pmnd.rs/react-three-fiber/)

## 🙌 Key Features Implemented

✅ Hero section with 3D floating geometry  
✅ Animated statistics with counters  
✅ Featured projects showcase  
✅ Multi-platform analytics dashboard  
✅ Filterable projects page  
✅ Categorized skills visualization  
✅ Professional certificates gallery  
✅ Timeline with achievements  
✅ Contact form with backend integration  
✅ Responsive mobile design  
✅ Smooth page transitions  
✅ SEO optimization  
✅ TypeScript strict mode  
✅ Production-ready build  

---

**Built with ❤️ for ambitious developers**

