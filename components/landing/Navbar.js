'use client';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { Menu, X, Zap } from 'lucide-react';

const navLinks = [
  { label: 'Features', href: '#features' },
  { label: 'Markets',  href: '#markets'  },
  { label: 'Security', href: '#security' },
  { label: 'FAQ',      href: '#faq'      },
];

export default function Navbar() {
  const [scrolled,    setScrolled]    = useState(false);
  const [mobileOpen,  setMobileOpen]  = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', handler, { passive: true });
    return () => window.removeEventListener('scroll', handler);
  }, []);

  return (
    <>
      <motion.header
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0,   opacity: 1  }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
          scrolled
            ? 'glass-dark border-b border-white/5 shadow-2xl shadow-black/30'
            : 'bg-transparent'
        }`}
      >
        <div className="container">
          <div className="flex items-center justify-between h-16">

            {/* ── Logo ── */}
            <Link href="/" className="flex items-center gap-2.5 shrink-0">
              <div className="w-8 h-8 rounded-xl btn-neon flex items-center justify-center">
                <Zap className="w-[18px] h-[18px] text-white" fill="white" />
              </div>
              <span className="text-[1.1rem] font-black tracking-tight">
                Swift<span className="text-green-400">Bit</span>
              </span>
            </Link>

            {/* ── Desktop nav links ── */}
            <nav className="hidden md:flex items-center gap-1">
              {navLinks.map(link => (
                <a
                  key={link.href}
                  href={link.href}
                  className="px-4 py-2 text-sm text-gray-400 hover:text-white rounded-lg hover:bg-white/5 transition-all"
                >
                  {link.label}
                </a>
              ))}
            </nav>

            {/* ── Desktop CTA ── */}
            <div className="hidden md:flex items-center gap-3">
              <Link
                href="/login"
                className="px-4 py-2 text-sm text-gray-300 hover:text-white transition-colors"
              >
                Sign In
              </Link>
              <Link
                href="/register"
                className="btn-neon px-5 py-2.5 rounded-xl text-white text-sm font-semibold"
              >
                Get Started
              </Link>
            </div>

            {/* ── Mobile toggle ── */}
            <button
              aria-label="Toggle menu"
              onClick={() => setMobileOpen(v => !v)}
              className="md:hidden glass border border-white/10 p-2 rounded-xl text-gray-300"
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </motion.header>

      {/* ── Mobile drawer ── */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="fixed top-16 inset-x-0 z-40 glass-dark border-b border-white/5 md:hidden shadow-2xl shadow-black/40"
          >
            <div className="container py-4 space-y-1">
              {navLinks.map(link => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="block py-3 px-4 text-gray-300 hover:text-white hover:bg-white/5 rounded-xl transition-all text-sm"
                >
                  {link.label}
                </a>
              ))}
              <div className="pt-3 mt-3 border-t border-white/5 flex flex-col gap-2">
                <Link
                  href="/login"
                  onClick={() => setMobileOpen(false)}
                  className="py-3 text-center text-sm text-gray-300 border border-white/10 rounded-xl hover:border-green-500/30 hover:text-white transition-all"
                >
                  Sign In
                </Link>
                <Link
                  href="/register"
                  onClick={() => setMobileOpen(false)}
                  className="btn-neon py-3 text-center text-sm text-white font-semibold rounded-xl"
                >
                  Get Started Free
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
