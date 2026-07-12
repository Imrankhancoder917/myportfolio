"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Sun, UserCircle } from 'lucide-react';
import { NAV_ITEMS } from '@/lib/constants/config';
import LoginModal from '@/components/auth/LoginModal';

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [loginOpen, setLoginOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <header className={`fixed top-0 left-0 w-full z-50 px-2 lg:px-8 py-6 transition-all duration-300 pointer-events-auto ${scrolled ? 'bg-white/40 backdrop-blur-xl border-b border-white/20 shadow-sm' : ''}`}>
        <motion.nav
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="relative mx-auto max-w-[1400px] flex items-center justify-between"
        >
          <div className="flex items-center gap-1 cursor-pointer group ml-2">
            <Link href="/" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-2">
              <span className="text-2xl font-serif font-bold tracking-tight text-sky-800 group-hover:opacity-80 transition-opacity">Imran Khan</span>
              <div className="w-1.5 h-1.5 bg-gray-900 rounded-full mb-3" />
            </Link>
          </div>

          {/* Right-aligned Desktop Menu & Actions */}
          <div className="hidden md:flex items-center gap-6 ml-auto">
            <ul className="flex items-center gap-3">
              <li className="relative group">
                <Link
                  href="/"
                  className={`block px-5 py-2.5 rounded-full border border-slate-200/80 bg-white/85 shadow-[0_4px_14px_rgba(0,0,0,0.03)] backdrop-blur-2xl text-[13px] tracking-wide font-bold transition-all hover:-translate-y-0.5 hover:shadow-md hover:border-slate-300 hover:text-sky-700 ${pathname === "/" ? "text-slate-900" : "text-slate-600"}`}
                >
                  Home
                </Link>
              </li>
              {NAV_ITEMS.map((item) => {
                const isActive = pathname === item.href || (item.href !== "/" && pathname?.startsWith(item.href));
                return (
                  <li key={item.href} className="relative group">
                    <Link
                      href={item.href}
                      className={`block px-5 py-2.5 rounded-full border border-slate-200/80 bg-white/85 shadow-[0_4px_14px_rgba(0,0,0,0.03)] backdrop-blur-2xl text-[13px] tracking-wide font-bold transition-all hover:-translate-y-0.5 hover:shadow-md hover:border-slate-300 hover:text-sky-700 ${isActive ? "text-slate-900" : "text-slate-600"}`}
                    >
                      {item.label}
                    </Link>
                  </li>
                );
              })}
            </ul>

            <div className="flex items-center gap-3 mr-2">
              <button className="p-2.5 bg-white/50 backdrop-blur-md border border-gray-200/80 rounded-full hover:border-gray-300 hover:bg-white transition-all duration-300 text-gray-600 shadow-[0_2px_10px_rgba(0,0,0,0.02)]">
                <Sun size={16} />
              </button>
              <button
                onClick={() => setLoginOpen(true)}
                className="p-2.5 bg-white/50 backdrop-blur-md border border-gray-200/80 rounded-full hover:border-gray-300 hover:bg-white transition-all duration-300 text-gray-600 shadow-[0_2px_10px_rgba(0,0,0,0.02)] hover:text-sky-600"
              >
                <UserCircle size={18} />
              </button>
            </div>
          </div>

          {/* Mobile Toggle */}
          <button
            className="md:hidden p-2 text-gray-600 mr-2"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </motion.nav>

        {/* Mobile Menu Overlay */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="md:hidden absolute top-24 left-4 right-4 bg-white/95 backdrop-blur-xl z-50 border border-gray-100 rounded-3xl shadow-2xl p-6"
            >
              <ul className="flex flex-col gap-5 text-base font-medium text-gray-600">
                <li>
                  <Link
                    href="/"
                    onClick={() => setMobileMenuOpen(false)}
                    className={pathname === "/" ? "text-gray-900 font-bold" : ""}
                  >
                    Home
                  </Link>
                </li>
                {NAV_ITEMS.map((item) => {
                  const isActive = pathname === item.href || (item.href !== "/" && pathname?.startsWith(item.href));
                  return (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        onClick={() => setMobileMenuOpen(false)}
                        className={isActive ? "text-gray-900 font-bold" : ""}
                      >
                        {item.label}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </motion.div>
          )}
        </AnimatePresence>

        <LoginModal isOpen={loginOpen} onClose={() => setLoginOpen(false)} />
      </header>
    </>
  );
}
