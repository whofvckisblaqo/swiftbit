'use client';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { useShallow } from 'zustand/react/shallow';
import { cryptoAssets, transactions as initialTx } from '@/lib/data';

/* ─── DB persistence helper ──────────────────────────── */
async function postTx(token, payload) {
  if (!token) return null;
  const res = await fetch('/api/transactions', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify(payload),
  });
  const data = await res.json();
  return data.transaction || null;
}

/* ─── Auth slice ─────────────────────────────────────── */
const authSlice = (set, get) => ({
  user: null,
  token: null,
  isAuthenticated: false,
  _hydrated: false,
  _setHydrated: () => set({ _hydrated: true }),

  setAuth: (user, token) => {
    const baseAssets = cryptoAssets.map(a => {
      const bal = parseFloat(user?.walletBalances?.[a.symbol]) || 0;
      return { ...a, balance: bal, usdValue: bal * a.price };
    });
    set({
      isAuthenticated: true, user, token,
      assets: baseAssets,
      transactions: [],
      totalBalance: baseAssets.reduce((sum, a) => sum + a.usdValue, 0),
      change24h: 0,
      changePct24h: 0,
    });
  },

  logout: () => set({ isAuthenticated: false, user: null, token: null }),

  updateUser: (data) => set(s => {
    const newUser = { ...s.user, ...data };
    const updates = { user: newUser };
    if (data.walletBalances) {
      const updatedAssets = s.assets.map(a => {
        const bal = parseFloat(data.walletBalances[a.symbol]) || 0;
        return { ...a, balance: bal, usdValue: bal * a.price };
      });
      updates.assets = updatedAssets;
      updates.totalBalance = updatedAssets.reduce((sum, a) => sum + a.usdValue, 0);
    }
    return updates;
  }),
});

/* ─── Wallet slice ───────────────────────────────────── */
const walletSlice = (set, get) => ({
  assets: cryptoAssets,
  transactions: initialTx,
  totalBalance: 67894.23,
  change24h: 2840.12,
  changePct24h: 4.36,
  hideBalance: false,

  toggleHideBalance: () => set(s => ({ hideBalance: !s.hideBalance })),

  addTransaction: (tx) => set(s => ({
    transactions: [tx, ...s.transactions],
  })),

  updateBalance: (delta) => set(s => ({
    totalBalance: s.totalBalance + delta,
  })),

  executeBuy: async ({ coin, usdAmount, method }) => {
    const cryptoAmount = usdAmount / coin.price;
    const fee = usdAmount * 0.015;
    const tx = await postTx(get().token, {
      type: 'buy', amount: usdAmount, coin: coin.name, symbol: coin.symbol,
      qty: cryptoAmount, price: coin.price, method: method || 'Crypto', fee,
    });
    if (tx) set(s => ({ transactions: [tx, ...s.transactions] }));
    return tx;
  },

  executeSwap: async ({ fromCoin, toCoin, fromAmount }) => {
    const rate = fromCoin.price / toCoin.price;
    const toAmount = fromAmount * rate;
    const usdValue = fromAmount * fromCoin.price;
    const tx = await postTx(get().token, {
      type: 'swap', amount: usdValue,
      coin: `${fromCoin.name} → ${toCoin.name}`,
      symbol: fromCoin.symbol, qty: fromAmount, price: fromCoin.price,
      toSymbol: toCoin.symbol, toQty: toAmount,
      fee: usdValue * 0.001,
    });
    if (tx) set(s => ({ transactions: [tx, ...s.transactions] }));
    return tx;
  },

  executeSend: async ({ coin, amount, address }) => {
    const usdValue = amount * coin.price;
    const tx = await postTx(get().token, {
      type: 'send', amount: usdValue, coin: coin.name, symbol: coin.symbol,
      qty: amount, price: coin.price, address, fee: 0.25,
    });
    if (tx) set(s => ({ transactions: [tx, ...s.transactions] }));
    return tx;
  },
});

/* ─── Notification slice ─────────────────────────────── */
const notifSlice = (set) => ({
  notifications: [
    { id: 'n1', title: 'BTC surged +8.2%', body: 'Bitcoin is up today. Your portfolio gained $2,840.', time: '2 min ago', read: false, type: 'market' },
    { id: 'n2', title: 'Deposit confirmed', body: '$2,000 USDT deposit has been processed.', time: '1 hr ago', read: false, type: 'transaction' },
    { id: 'n3', title: 'KYC Verified ✓', body: 'Your identity verification is complete. Level 3 access granted.', time: '1 day ago', read: true, type: 'account' },
    { id: 'n4', title: 'Swap executed', body: '10 SOL → 1.84 ETH swap completed successfully.', time: '2 days ago', read: true, type: 'transaction' },
  ],
  unreadCount: 2,

  markAllRead: () => set(s => ({
    notifications: s.notifications.map(n => ({ ...n, read: true })),
    unreadCount: 0,
  })),

  markRead: (id) => set(s => {
    const updated = s.notifications.map(n => n.id === id ? { ...n, read: true } : n);
    return { notifications: updated, unreadCount: updated.filter(n => !n.read).length };
  }),

  addNotification: (notif) => set(s => ({
    notifications: [{ id: `n${Date.now()}`, time: 'just now', read: false, ...notif }, ...s.notifications],
    unreadCount: s.unreadCount + 1,
  })),
});

/* ─── Admin slice ────────────────────────────────────── */
const adminSlice = (set) => ({
  kycQueue: [
    { id: 'kyc001', name: 'James Wilson',   email: 'james@example.com', country: 'US', submitted: '2 hrs ago', docType: 'Passport',       risk: 'low',    status: 'pending' },
    { id: 'kyc002', name: 'Liu Wei',        email: 'liu@example.com',   country: 'CN', submitted: '4 hrs ago', docType: 'National ID',    risk: 'medium', status: 'pending' },
    { id: 'kyc003', name: 'Amara Osei',     email: 'amara@example.com', country: 'GH', submitted: '6 hrs ago', docType: 'Driver License', risk: 'low',    status: 'pending' },
    { id: 'kyc004', name: 'Ivan Petrov',    email: 'ivan@example.com',  country: 'RU', submitted: '8 hrs ago', docType: 'Passport',       risk: 'high',   status: 'pending' },
    { id: 'kyc005', name: 'Sofia Garcia',   email: 'sofia@example.com', country: 'ES', submitted: '10 hrs ago',docType: 'Passport',       risk: 'low',    status: 'pending' },
  ],
  withdrawalQueue: [
    { id: 'WD-7421', user: 'Sarah Chen',         amount: '$8,200',  coin: 'ETH', address: '0x7F4e...E4f', status: 'pending', risk: 'low'    },
    { id: 'WD-7417', user: 'Alex Johnson',        amount: '$42,100', coin: 'BTC', address: '1BvBM...vQN', status: 'pending', risk: 'medium' },
    { id: 'WD-7415', user: 'Priya Patel',         amount: '$15,200', coin: 'ETH', address: '0x9a3c...F2b', status: 'pending', risk: 'medium' },
  ],
  users: [
    { id: 'u001', name: 'Alex Johnson',       email: 'alex@example.com',   balance: '$124,580', kyc: 'verified', status: 'active',    joined: 'Jan 12, 2024', country: 'US' },
    { id: 'u002', name: 'Sarah Chen',         email: 'sarah@example.com',  balance: '$89,320',  kyc: 'verified', status: 'active',    joined: 'Jan 10, 2024', country: 'SG' },
    { id: 'u003', name: 'Mohammed Al-Rashid', email: 'mo@example.com',     balance: '$245,100', kyc: 'pending',  status: 'active',    joined: 'Jan 8, 2024',  country: 'AE' },
    { id: 'u004', name: 'Emma Williams',      email: 'emma@example.com',   balance: '$32,450',  kyc: 'verified', status: 'suspended', joined: 'Jan 5, 2024',  country: 'UK' },
    { id: 'u005', name: 'Carlos Mendez',      email: 'carlos@example.com', balance: '$78,900',  kyc: 'verified', status: 'active',    joined: 'Jan 3, 2024',  country: 'MX' },
    { id: 'u006', name: 'Priya Patel',        email: 'priya@example.com',  balance: '$156,780', kyc: 'rejected', status: 'active',    joined: 'Dec 28, 2023', country: 'IN' },
  ],

  approveKyc: (id) => set(s => ({
    kycQueue: s.kycQueue.map(k => k.id === id ? { ...k, status: 'approved' } : k),
  })),

  rejectKyc: (id) => set(s => ({
    kycQueue: s.kycQueue.map(k => k.id === id ? { ...k, status: 'rejected' } : k),
  })),

  approveWithdrawal: (id) => set(s => ({
    withdrawalQueue: s.withdrawalQueue.map(w => w.id === id ? { ...w, status: 'completed' } : w),
  })),

  rejectWithdrawal: (id) => set(s => ({
    withdrawalQueue: s.withdrawalQueue.map(w => w.id === id ? { ...w, status: 'failed' } : w),
  })),

  toggleUserStatus: (id) => set(s => ({
    users: s.users.map(u => u.id === id ? { ...u, status: u.status === 'active' ? 'suspended' : 'active' } : u),
  })),
});

/* ─── Toast slice ────────────────────────────────────── */
const toastSlice = (set) => ({
  toasts: [],
  toast: ({ message, type = 'success', duration = 3500 }) => {
    const id = Date.now();
    set(s => ({ toasts: [...s.toasts, { id, message, type }] }));
    setTimeout(() => set(s => ({ toasts: s.toasts.filter(t => t.id !== id) })), duration);
  },
  removeToast: (id) => set(s => ({ toasts: s.toasts.filter(t => t.id !== id) })),
});

/* ─── Combined store ─────────────────────────────────── */
export const useAppStore = create(
  persist(
    (set, get) => ({
      ...authSlice(set, get),
      ...walletSlice(set, get),
      ...notifSlice(set),
      ...adminSlice(set),
      ...toastSlice(set),
    }),
    {
      name: 'swiftbit-store',
      partialize: (s) => ({
        isAuthenticated: s.isAuthenticated,
        user: s.user,
        token: s.token,
        hideBalance: s.hideBalance,
        assets: s.assets,
        transactions: s.transactions,
        totalBalance: s.totalBalance,
      }),
      onRehydrateStorage: () => (state) => {
        state?._setHydrated();
      },
    }
  )
);

/* ─── Convenience selectors ──────────────────────────── */
export const useAuth       = () => useAppStore(useShallow(s => ({ user: s.user, token: s.token, isAuthenticated: s.isAuthenticated, setAuth: s.setAuth, logout: s.logout, updateUser: s.updateUser })));
export const useWallet     = () => useAppStore(useShallow(s => ({ assets: s.assets, transactions: s.transactions, totalBalance: s.totalBalance, change24h: s.change24h, changePct24h: s.changePct24h, hideBalance: s.hideBalance, toggleHideBalance: s.toggleHideBalance, executeBuy: s.executeBuy, executeSwap: s.executeSwap, executeSend: s.executeSend })));
export const useNotifs     = () => useAppStore(useShallow(s => ({ notifications: s.notifications, unreadCount: s.unreadCount, markAllRead: s.markAllRead, markRead: s.markRead, addNotification: s.addNotification })));
export const useToast      = () => useAppStore(useShallow(s => ({ toasts: s.toasts, toast: s.toast, removeToast: s.removeToast })));
export const useAdminStore = () => useAppStore(useShallow(s => ({ kycQueue: s.kycQueue, withdrawalQueue: s.withdrawalQueue, users: s.users, approveKyc: s.approveKyc, rejectKyc: s.rejectKyc, approveWithdrawal: s.approveWithdrawal, rejectWithdrawal: s.rejectWithdrawal, toggleUserStatus: s.toggleUserStatus })));
