'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  LayoutDashboard, Users, Wallet, ArrowUpDown, ArrowDownToLine, ArrowUpFromLine,
  ShoppingCart, Landmark, CreditCard, ShieldCheck, Bell, LifeBuoy,
  BarChart3, Settings, Zap, LogOut, ChevronLeft, ChevronRight, Menu
} from 'lucide-react';
import { useState } from 'react';

const navItems = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/users', label: 'Users', icon: Users },
  { href: '/admin/wallets', label: 'Wallets', icon: Wallet },
  { href: '/admin/transactions', label: 'Transactions', icon: ArrowUpDown },
  { href: '/admin/deposits', label: 'Deposits', icon: ArrowDownToLine },
  { href: '/admin/withdrawals', label: 'Withdrawals', icon: ArrowUpFromLine },
  { href: '/admin/buy-sell', label: 'Buy / Sell', icon: ShoppingCart },
  { href: '/admin/loans', label: 'Loans', icon: Landmark },
  { href: '/admin/crypto-cards', label: 'Crypto Cards', icon: CreditCard },
  { href: '/admin/kyc', label: 'KYC Verification', icon: ShieldCheck },
  { href: '/admin/notifications', label: 'Notifications', icon: Bell },
  { href: '/admin/support', label: 'Support Tickets', icon: LifeBuoy },
  { href: '/admin/analytics', label: 'Analytics', icon: BarChart3 },
  { href: '/admin/settings', label: 'Settings', icon: Settings },
];

export default function Sidebar({ mobile = false }) {
  const path = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <motion.aside
      animate={{ width: collapsed ? 72 : 240 }}
      transition={{ duration: 0.25, ease: 'easeInOut' }}
      className={`${mobile ? 'flex w-full' : 'hidden lg:flex'} flex-col h-screen sticky top-0 glass-dark border-r border-white/5 flex-shrink-0 overflow-hidden`}
    >
      {/* Logo */}
      <div className="flex items-center gap-3 px-4 py-5 border-b border-white/5">
        <div className="w-8 h-8 rounded-lg btn-neon flex items-center justify-center flex-shrink-0">
          <Zap className="w-4 h-4 text-white" fill="white" />
        </div>
        {!collapsed && (
          <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-lg font-black whitespace-nowrap">
            Swift<span className="text-green-400">Bit</span>
            <span className="text-xs text-gray-600 font-normal ml-1">Admin</span>
          </motion.span>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="ml-auto p-1 rounded-lg text-gray-600 hover:text-gray-300 hover:bg-white/5 transition-all flex-shrink-0"
        >
          {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto py-3 px-2 space-y-0.5">
        {navItems.map(({ href, label, icon: Icon }) => {
          const active = path === href;
          return (
            <Link key={href} href={href}>
              <div className={`sidebar-item flex items-center gap-3 px-3 py-2.5 rounded-xl border transition-all ${
                active
                  ? 'bg-green-500/12 border-green-500/25 text-green-400'
                  : 'border-transparent text-gray-500 hover:text-gray-200'
              }`}>
                <Icon className={`w-4 h-4 flex-shrink-0 ${active ? 'text-green-400' : ''}`} />
                {!collapsed && (
                  <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-sm font-medium whitespace-nowrap">
                    {label}
                  </motion.span>
                )}
                {!collapsed && active && (
                  <motion.div layoutId="activeIndicator" className="ml-auto w-1.5 h-1.5 rounded-full bg-green-400" />
                )}
              </div>
            </Link>
          );
        })}
      </nav>

      {/* Bottom */}
      <div className="p-3 border-t border-white/5">
        {!collapsed ? (
          <div className="glass rounded-xl p-3 mb-2">
            <div className="flex items-center gap-2 mb-1">
              <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-green-400/30 to-purple-500/30 flex items-center justify-center text-xs font-bold text-white">SA</div>
              <div>
                <div className="text-xs font-semibold text-white">Super Admin</div>
                <div className="text-[10px] text-gray-600">admin@swiftbit.io</div>
              </div>
            </div>
          </div>
        ) : null}
        <Link href="/" className={`flex items-center gap-3 px-3 py-2 rounded-xl text-red-400 hover:bg-red-500/10 transition-all ${collapsed ? 'justify-center' : ''}`}>
          <LogOut className="w-4 h-4 flex-shrink-0" />
          {!collapsed && <span className="text-sm font-medium">Logout</span>}
        </Link>
      </div>
    </motion.aside>
  );
}
