import sys

def update_file():
    with open('/Users/imrankhan/Desktop/portfolio/components/Hero.tsx', 'r') as f:
        content = f.read()
    
    # We need to add useMotionValue, useTransform, useSpring to framer-motion import
    if "useMotionValue" not in content:
        content = content.replace("import { AnimatePresence, motion } from 'framer-motion';", "import { AnimatePresence, motion, useMotionValue, useTransform, useSpring } from 'framer-motion';")
        
    # We need to add the hooks to the component
    hook_str = """  const mouseX = useMotionValue(0);
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
  };"""
    
    if "const mouseX = useMotionValue(0);" not in content:
        content = content.replace("  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);", hook_str + "\n\n  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);")
    
    # We need to replace the image container section
    old_img_section = """                <motion.div
                  animate={{ y: [0, -6, 0] }}
                  transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
                  whileHover={{ scale: 1.02 }}
                  className="relative mx-auto h-72 w-72 md:h-[420px] md:w-[420px] drop-shadow-[0_20px_40px_rgba(0,0,0,0.15)]"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="/profile.png"
                    alt="Imran Khan portrait"
                    className="h-full w-full object-cover transition-transform duration-1000"
                  />"""
                  
    new_img_section = """                <motion.div
                  onMouseMove={handleMouseMove}
                  onMouseLeave={handleMouseLeave}
                  style={{
                    rotateX,
                    rotateY,
                    x: translateX,
                    y: translateY,
                    perspective: 1000
                  }}
                  className="relative mx-auto h-72 w-72 md:h-[420px] md:w-[420px] drop-shadow-[0_24px_48px_rgba(0,0,0,0.15)]"
                >
                  {/* Subtle Background Effects */}
                  <div className="absolute inset-0 z-0">
                    <div className="absolute inset-0 bg-sky-200/20 blur-3xl rounded-full scale-150 animate-pulse" style={{ animationDuration: '4s' }} />
                    <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-100/30 blur-2xl rounded-full" />
                    <div className="absolute bottom-0 left-0 w-40 h-40 bg-blue-100/30 blur-2xl rounded-full" />
                    <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-white rounded-full opacity-60 animate-bounce" style={{ animationDuration: '3s' }} />
                    <div className="absolute bottom-1/4 right-1/4 w-3 h-3 bg-white rounded-full opacity-40 animate-bounce" style={{ animationDuration: '5s' }} />
                    <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/5 to-white/10 rounded-full" />
                  </div>

                  <motion.div
                    animate={{ y: [-6, 6, -6] }}
                    transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut' }}
                    className="relative z-10 w-full h-full"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src="/profile.png"
                      alt="Imran Khan portrait"
                      className="h-full w-full object-cover transition-all duration-500 ease-out hover:scale-[1.03] hover:brightness-[1.03] hover:contrast-[1.02] hover:drop-shadow-[0_20px_40px_rgba(0,0,0,0.2)]"
                    />
                  </motion.div>"""
                  
    content = content.replace(old_img_section, new_img_section)
    
    with open('/Users/imrankhan/Desktop/portfolio/components/Hero.tsx', 'w') as f:
        f.write(content)
        
    print("Updated Hero.tsx")

update_file()
