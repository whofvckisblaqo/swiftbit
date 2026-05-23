'use client';
import { motion } from 'framer-motion';

export default function GlassCard({ children, className = '', hover = false, glow = false, onClick, delay = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
      whileHover={hover ? { y: -3, scale: 1.01 } : {}}
      onClick={onClick}
      className={`glass rounded-2xl ${glow ? 'glow-green-sm' : ''} ${onClick ? 'cursor-pointer' : ''} ${className}`}
    >
      {children}
    </motion.div>
  );
}
