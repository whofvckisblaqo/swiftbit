'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { Home, BarChart2, ArrowUpDown, History, User } from 'lucide-react';

const tabs = [
  { href: '/wallet', icon: Home, label: 'Home' },
  { href: '/wallet/market', icon: BarChart2, label: 'Market' },
  { href: '/wallet/swap', icon: ArrowUpDown, label: 'Swap' },
  { href: '/wallet/transactions', icon: History, label: 'History' },
  { href: '/wallet/profile', icon: User, label: 'Profile' },
];

export default function BottomNav() {
  const path = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 glass-dark border-t border-white/5 safe-bottom">
      <div className="flex items-center justify-around max-w-lg mx-auto px-2 py-2">
        {tabs.map(({ href, icon: Icon, label }) => {
          const active = path === href;
          return (
            <Link key={href} href={href} className="flex flex-col items-center gap-1 px-3 py-2 relative">
              {active && (
                <motion.div
                  layoutId="bottomNavIndicator"
                  className="absolute -top-2 left-1/2 -translate-x-1/2 w-8 h-0.5 rounded-full bg-green-400"
                />
              )}
              <Icon className={`w-5 h-5 transition-colors ${active ? 'text-green-400' : 'text-gray-600'}`} />
              <span className={`text-[10px] font-medium transition-colors ${active ? 'text-green-400' : 'text-gray-600'}`}>
                {label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
