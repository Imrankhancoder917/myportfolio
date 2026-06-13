"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { Menu, X, Sun } from 'lucide-react';
import { NAV_ITEMS } from '@/lib/constants/config';

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="relative z-50 mx-auto max-w-[1400px] px-6 py-6 lg:px-12">
      <nav className="flex items-center justify-between rounded-full border border-slate-200/80 bg-white/85 px-4 py-3 shadow-[0_14px_40px_rgba(15,23,42,0.06)] backdrop-blur-2xl">
        <Link href="/" onClick={() => setOpen(false)} className="flex items-center gap-3">
          <span className="text-2xl font-serif font-bold tracking-tight text-slate-900">Imran Khan</span>
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
        </Link>

        <div className="hidden md:flex items-center gap-8">
          <Link
            href="/"
            className="text-sm font-medium text-slate-700 transition-colors hover:text-sky-700"
          >
            Home
          </Link>
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-sm font-medium text-slate-700 transition-colors hover:text-sky-700"
            >
              {item.label}
            </Link>
          ))}

          <button className="rounded-full border border-slate-200/80 bg-white/90 p-2.5 text-slate-600 shadow-sm transition-colors hover:bg-slate-50">
            <Sun size={16} />
          </button>
        </div>

        <button className="md:hidden p-2 text-slate-700" onClick={() => setOpen(!open)} aria-label="Toggle menu">
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </nav>

      {open && (
        <div className="mt-4 rounded-2xl border border-slate-200/80 bg-white/95 p-4 text-slate-700 shadow-[0_16px_44px_rgba(15,23,42,0.08)] backdrop-blur-2xl md:hidden">
          <ul className="flex flex-col gap-3">
            <li>
              <Link href="/" onClick={() => setOpen(false)} className="block rounded-lg px-3 py-2 hover:bg-slate-50">
                Home
              </Link>
            </li>
            {NAV_ITEMS.map((item) => (
              <li key={item.href}>
                <Link href={item.href} onClick={() => setOpen(false)} className="block rounded-lg px-3 py-2 hover:bg-slate-50">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </header>
  );
}
