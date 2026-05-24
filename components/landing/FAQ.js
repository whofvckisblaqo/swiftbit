'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Minus } from 'lucide-react';
import { faqs } from '@/lib/data';

function FAQItem({ q, a, index }) {
  const [open, setOpen] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: index * 0.06 }}
      className={`glass rounded-2xl overflow-hidden transition-colors duration-200 ${
        open ? 'border-green-500/25' : 'border-white/5 hover:border-white/10'
      }`}
    >
      <button
        onClick={() => setOpen(v => !v)}
        className="w-full flex items-center justify-between gap-4 px-6 py-5 text-left"
      >
        <span className={`text-sm font-semibold leading-snug transition-colors duration-200 ${
          open ? 'text-green-400' : 'text-white'
        }`}>
          {q}
        </span>
        <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 transition-all duration-200 ${
          open ? 'bg-green-500/20 text-green-400' : 'bg-white/5 text-gray-500'
        }`}>
          {open ? <Minus className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
        </div>
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            key="answer"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <div className="px-6 pb-5 text-sm text-gray-500 leading-relaxed border-t border-white/5 pt-4">
              {a}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default function FAQ() {
  return (
    <section id="faq" className="section bg-[#07090d]">

      <div className="absolute inset-0 -z-10">
        <div className="orb w-[400px] h-[300px] bottom-0 right-0 opacity-[0.04]"
          style={{ background: '#22c55e' }} />
      </div>

      <div className="container">
        {/* Two-column layout: header | accordions */}
        <div className="grid lg:grid-cols-[1fr_1.6fr] gap-12 xl:gap-20 items-start">

          {/* Left: header (sticky on desktop) */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="lg:sticky lg:top-28"
          >
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-green-400 mb-4">FAQ</p>
            <h2 className="text-3xl sm:text-4xl font-black text-white leading-[1.1] mb-5">
              Got <span className="gradient-text">questions?</span>
            </h2>
            <p className="text-gray-500 text-base leading-relaxed mb-8">
              Everything you need to know about SwiftBit. Can't find what you're looking for? Our support team is available 24/7.
            </p>
            <a
              href="mailto:swiftbitsupport@outlook.com"
              className="btn-neon inline-flex items-center gap-2 text-white font-semibold px-6 py-3 rounded-xl text-sm"
            >
              Contact Support
            </a>
          </motion.div>

          {/* Right: accordions */}
          <div className="space-y-3">
            {faqs.map((faq, i) => (
              <FAQItem key={i} {...faq} index={i} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
