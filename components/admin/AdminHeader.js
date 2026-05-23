'use client';
import { useState } from 'react';
import { Bell, Search, Download, RefreshCw } from 'lucide-react';
import { motion } from 'framer-motion';

export default function AdminHeader({ title, subtitle }) {
  const [refreshing, setRefreshing] = useState(false);

  const refresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1000);
  };

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
      <div>
        <h1 className="text-2xl font-black text-white">{title}</h1>
        {subtitle && <p className="text-sm text-gray-500 mt-0.5">{subtitle}</p>}
      </div>
      <div className="flex items-center gap-3">
        {/* Search */}
        <div className="relative hidden sm:block">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600" />
          <input placeholder="Search..." className="glass border border-white/10 rounded-xl pl-9 pr-4 py-2 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-green-500/40 w-48 transition-all" />
        </div>

        {/* Refresh */}
        <button onClick={refresh} className="glass border border-white/10 rounded-xl p-2.5 text-gray-500 hover:text-gray-300 transition-all">
          <motion.div animate={{ rotate: refreshing ? 360 : 0 }} transition={{ duration: 0.6 }}>
            <RefreshCw className="w-4 h-4" />
          </motion.div>
        </button>

        {/* Export */}
        <button className="glass border border-white/10 rounded-xl px-4 py-2.5 text-sm text-gray-400 hover:text-white flex items-center gap-2 transition-all">
          <Download className="w-4 h-4" />
          <span className="hidden sm:inline">Export</span>
        </button>

        {/* Notifications */}
        <div className="relative">
          <button className="glass border border-white/10 rounded-xl p-2.5 text-gray-500 hover:text-gray-300 transition-all">
            <Bell className="w-4 h-4" />
          </button>
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-red-400 border border-[#080b0f]" />
        </div>
      </div>
    </div>
  );
}
