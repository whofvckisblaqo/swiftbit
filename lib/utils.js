export function formatCurrency(value, decimals = 2) {
  if (value >= 1e12) return `$${(value / 1e12).toFixed(2)}T`;
  if (value >= 1e9) return `$${(value / 1e9).toFixed(2)}B`;
  if (value >= 1e6) return `$${(value / 1e6).toFixed(2)}M`;
  if (value >= 1e3) return `$${(value / 1e3).toFixed(2)}K`;
  return `$${Number(value).toFixed(decimals)}`;
}

export function formatNumber(value) {
  return new Intl.NumberFormat('en-US').format(value);
}

export function formatPercent(value) {
  const sign = value >= 0 ? '+' : '';
  return `${sign}${Number(value).toFixed(2)}%`;
}

export function formatCrypto(value, symbol) {
  if (value < 0.0001) return `${value.toFixed(8)} ${symbol}`;
  if (value < 1) return `${value.toFixed(6)} ${symbol}`;
  return `${value.toFixed(4)} ${symbol}`;
}

export function truncateAddress(addr, start = 6, end = 4) {
  if (!addr) return '';
  return `${addr.slice(0, start)}...${addr.slice(-end)}`;
}

export function getChangeColor(value) {
  if (value > 0) return 'text-green-400';
  if (value < 0) return 'text-red-400';
  return 'text-gray-400';
}

export function getChangeBg(value) {
  if (value > 0) return 'bg-green-500/10 text-green-400';
  if (value < 0) return 'bg-red-500/10 text-red-400';
  return 'bg-gray-500/10 text-gray-400';
}

export function getStatusColor(status) {
  const map = {
    completed: 'text-green-400 bg-green-500/10',
    pending: 'text-yellow-400 bg-yellow-500/10',
    failed: 'text-red-400 bg-red-500/10',
    'in-progress': 'text-blue-400 bg-blue-500/10',
    active: 'text-green-400 bg-green-500/10',
    suspended: 'text-red-400 bg-red-500/10',
    verified: 'text-green-400 bg-green-500/10',
    rejected: 'text-red-400 bg-red-500/10',
    open: 'text-yellow-400 bg-yellow-500/10',
    resolved: 'text-green-400 bg-green-500/10',
    high: 'text-red-400 bg-red-500/10',
    medium: 'text-yellow-400 bg-yellow-500/10',
    low: 'text-green-400 bg-green-500/10',
  };
  return map[status] || 'text-gray-400 bg-gray-500/10';
}

export function getTxIcon(type) {
  const map = {
    buy: '↓',
    sell: '↑',
    send: '↑',
    receive: '↓',
    swap: '⇄',
    deposit: '↓',
    withdraw: '↑',
    withdrawal: '↑',
  };
  return map[type] || '•';
}

export function getTxColor(type) {
  const green = ['buy', 'receive', 'deposit'];
  const red = ['sell', 'send', 'withdraw', 'withdrawal'];
  if (green.includes(type)) return 'text-green-400 bg-green-500/10';
  if (red.includes(type)) return 'text-red-400 bg-red-500/10';
  return 'text-blue-400 bg-blue-500/10';
}
