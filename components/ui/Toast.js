'use client';
import { AnimatePresence, motion } from 'framer-motion';
import { CheckCircle2, XCircle, AlertTriangle, Info, X } from 'lucide-react';
import { useToast } from '@/store/useAppStore';

const icons = {
  success: <CheckCircle2 className="w-4 h-4 text-green-400 shrink-0" />,
  error:   <XCircle className="w-4 h-4 text-red-400 shrink-0" />,
  warning: <AlertTriangle className="w-4 h-4 text-yellow-400 shrink-0" />,
  info:    <Info className="w-4 h-4 text-blue-400 shrink-0" />,
};

const borders = {
  success: 'border-green-500/25',
  error:   'border-red-500/25',
  warning: 'border-yellow-500/25',
  info:    'border-blue-500/25',
};

function ToastItem({ toast }) {
  const { removeToast } = useToast();
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 40, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 20, scale: 0.95 }}
      transition={{ type: 'spring', stiffness: 500, damping: 40 }}
      className={`flex items-start gap-3 glass-dark border ${borders[toast.type] || borders.success} rounded-2xl px-4 py-3.5 shadow-xl max-w-xs w-full`}
    >
      {icons[toast.type] || icons.success}
      <p className="text-sm text-gray-200 leading-snug flex-1">{toast.message}</p>
      <button onClick={() => removeToast(toast.id)} className="text-gray-600 hover:text-gray-300 transition-colors mt-0.5">
        <X className="w-3.5 h-3.5" />
      </button>
    </motion.div>
  );
}

export default function ToastContainer() {
  const { toasts } = useToast();
  return (
    <div className="fixed bottom-6 right-4 z-[9999] flex flex-col gap-2 items-end pointer-events-none">
      <AnimatePresence mode="sync">
        {toasts.map(t => (
          <div key={t.id} className="pointer-events-auto">
            <ToastItem toast={t} />
          </div>
        ))}
      </AnimatePresence>
    </div>
  );
}
