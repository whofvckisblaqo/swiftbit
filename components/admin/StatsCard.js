'use client';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown } from 'lucide-react';

export default function StatsCard({ title, value, change, changeLabel, icon: Icon, color = '#22c55e', delay = 0 }) {
  const positive = !change || change >= 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.4 }}
      whileHover={{ y: -3, scale: 1.01 }}
      className="glass rounded-2xl p-5 border border-white/5 hover:border-white/10 transition-all"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="w-11 h-11 rounded-xl flex items-center justify-center"
          style={{ background: `${color}15`, border: `1px solid ${color}25` }}>
          <Icon className="w-5 h-5" style={{ color }} />
        </div>
        {change !== undefined && (
          <div className={`flex items-center gap-1 text-xs font-medium ${positive ? 'text-green-400' : 'text-red-400'}`}>
            {positive ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}
            {positive ? '+' : ''}{change}%
          </div>
        )}
      </div>
      <div className="text-2xl font-black text-white mb-1">{value}</div>
      <div className="text-sm text-gray-500">{title}</div>
      {changeLabel && <div className="text-xs text-gray-700 mt-0.5">{changeLabel}</div>}
    </motion.div>
  );
}
