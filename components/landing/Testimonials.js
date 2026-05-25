'use client';
import { motion } from 'framer-motion';
import { Star } from 'lucide-react';
import { testimonials } from '@/lib/data';

function Stars({ count = 5 }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: count }).map((_, i) => (
        <Star key={i} className="w-[14px] h-[14px] text-yellow-400 fill-yellow-400" />
      ))}
    </div>
  );
}

function TestimonialCard({ name, role, avatar, text, stars, country, index }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1], delay: index * 0.09 }}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      className="glass rounded-[var(--radius-card)] p-6 flex flex-col gap-5 hover:border-white/10 transition-colors duration-300 h-full"
    >
      {/* Stars */}
      <Stars count={stars} />

      {/* Quote */}
      <p className="text-sm text-gray-400 leading-relaxed flex-1">
        "{text}"
      </p>

      {/* Author */}
      <div className="flex items-center gap-3 pt-4 border-t border-white/5">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-500/25 to-indigo-500/25 border border-white/10 flex items-center justify-center text-sm font-bold text-white shrink-0">
          {avatar}
        </div>
        <div className="min-w-0">
          <p className="text-sm font-semibold text-white truncate">
            {country} {name}
          </p>
          <p className="text-xs text-gray-600">{role}</p>
        </div>
      </div>
    </motion.div>
  );
}

export default function Testimonials() {
  return (
    <section className="section bg-[#07090d]">

      <div className="absolute inset-0 -z-10">
        <div className="orb w-[500px] h-[350px] top-0 left-0 opacity-[0.04]"
          style={{ background: '#8b5cf6' }} />
      </div>

      <div className="container">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-2xl mx-auto mb-16"
        >
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-green-400 mb-4">Real Users</p>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white leading-[1.1] mb-5">
            Trusted by <span className="gradient-text">248,000+</span> traders
          </h2>
          <p className="text-lg text-gray-500">
            Join the fastest-growing crypto exchange community worldwide.
          </p>
        </motion.div>

        {/* Cards grid — equal heights via grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 items-stretch">
          {testimonials.map((t, i) => (
            <TestimonialCard key={t.name} {...t} index={i} />
          ))}
        </div>

        {/* Trust bar */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="mt-14 pt-8 border-t border-white/5"
        >
          <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3">
            {[
              '⭐ App Store 4.9',
              '⭐ Google Play 4.8',
              '⭐ Trustpilot 4.7',
              '🏆 Forbes Fintech 50',
              '✅ ISO 27001 Certified',
              '🔒 SOC 2 Type II',
            ].map(item => (
              <span key={item} className="text-sm text-gray-600 font-medium">{item}</span>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
