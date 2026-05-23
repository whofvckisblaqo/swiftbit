'use client';
import { motion } from 'framer-motion';

export default function GlowButton({ children, variant = 'primary', size = 'md', className = '', onClick, type = 'button', disabled = false }) {
  const sizes = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-sm',
    lg: 'px-8 py-4 text-base',
    xl: 'px-10 py-5 text-lg',
  };

  const variants = {
    primary: 'btn-neon text-white font-semibold',
    outline: 'border border-green-500/40 text-green-400 hover:bg-green-500/10 hover:border-green-400 transition-all',
    ghost: 'text-gray-300 hover:text-white hover:bg-white/5 transition-all',
    danger: 'bg-red-500/20 border border-red-500/30 text-red-400 hover:bg-red-500/30 transition-all',
    secondary: 'bg-white/5 border border-white/10 text-white hover:bg-white/10 transition-all',
  };

  return (
    <motion.button
      type={type}
      onClick={onClick}
      disabled={disabled}
      whileHover={{ scale: disabled ? 1 : 1.02 }}
      whileTap={{ scale: disabled ? 1 : 0.97 }}
      className={`rounded-xl font-medium inline-flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${sizes[size]} ${variants[variant]} ${className}`}
    >
      {children}
    </motion.button>
  );
}
