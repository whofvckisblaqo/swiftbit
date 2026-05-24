'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldCheck, CheckCircle2, ChevronDown, RefreshCw } from 'lucide-react';
import { useAuth, useToast } from '@/store/useAppStore';

const DOCUMENT_TYPES = ['Passport', 'National ID', "Driver's License"];

const COUNTRIES = [
  'United States', 'United Kingdom', 'Canada', 'Australia', 'Germany',
  'France', 'Japan', 'Singapore', 'UAE', 'Nigeria', 'South Africa',
  'Brazil', 'India', 'China', 'South Korea', 'Netherlands', 'Sweden',
  'Switzerland', 'Spain', 'Italy', 'Mexico', 'Argentina', 'Ghana',
  'Kenya', 'Egypt', 'Pakistan', 'Bangladesh', 'Philippines', 'Indonesia',
  'Malaysia', 'Thailand', 'Vietnam', 'Other',
];

function Field({ label, children }) {
  return (
    <div>
      <label className="text-xs font-semibold text-gray-400 block mb-1.5">{label}</label>
      {children}
    </div>
  );
}

const inputCls = 'w-full glass border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-700 focus:outline-none focus:border-green-500/40 transition-all bg-transparent';

export default function KycPage() {
  const { token, updateUser } = useAuth();
  const { toast } = useToast();

  const [form, setForm] = useState({
    firstName: '', lastName: '', dateOfBirth: '',
    country: '', documentType: '', documentNumber: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  const set = (k) => (e) => setForm(prev => ({ ...prev, [k]: e.target.value }));

  const valid = Object.values(form).every(v => v.trim() !== '');

  const handleSubmit = async () => {
    if (!valid) return;
    setSubmitting(true);
    try {
      const res = await fetch('/api/kyc', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Submission failed');
      updateUser({ kycStatus: 'pending', kycSubmitted: true });
      setDone(true);
    } catch (e) {
      toast({ message: e.message, type: 'error' });
    } finally {
      setSubmitting(false);
    }
  };

  if (done) {
    return (
      <div className="max-w-lg mx-auto px-4 pt-14 pb-8">
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
          className="text-center py-12">
          <motion.div animate={{ scale: [1, 1.1, 1] }} transition={{ duration: 0.5 }}
            className="w-24 h-24 rounded-full bg-green-500/20 border border-green-500/30 flex items-center justify-center mx-auto mb-6 glow-green">
            <CheckCircle2 className="w-12 h-12 text-green-400" />
          </motion.div>
          <h2 className="text-2xl font-bold text-white mb-3">Application Submitted!</h2>
          <p className="text-gray-400 text-sm leading-relaxed max-w-xs mx-auto mb-6">
            Your KYC application is under review. Our compliance team will process it within 1–2 business days.
          </p>
          <div className="glass rounded-2xl p-4 border border-yellow-500/20 text-left space-y-2 max-w-xs mx-auto">
            <p className="text-xs font-semibold text-yellow-400">What happens next?</p>
            <p className="text-xs text-gray-500">You'll be able to access all transaction features once your identity is verified by our team.</p>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto px-4">
      <div className="pt-14 pb-6">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-green-500/15 border border-green-500/25 flex items-center justify-center">
            <ShieldCheck className="w-5 h-5 text-green-400" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-white">Verify Identity</h1>
            <p className="text-xs text-gray-500">KYC · Identity Verification</p>
          </div>
        </div>
        <p className="text-sm text-gray-500 mt-3 leading-relaxed">
          Complete identity verification to unlock all transaction features. Your information is encrypted and stored securely.
        </p>
      </div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        className="glass rounded-2xl border border-white/5 p-6 space-y-4 mb-4">
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Personal Information</p>

        <div className="grid grid-cols-2 gap-4">
          <Field label="First Name">
            <input value={form.firstName} onChange={set('firstName')} placeholder="John"
              className={inputCls} />
          </Field>
          <Field label="Last Name">
            <input value={form.lastName} onChange={set('lastName')} placeholder="Doe"
              className={inputCls} />
          </Field>
        </div>

        <Field label="Date of Birth">
          <input type="date" value={form.dateOfBirth} onChange={set('dateOfBirth')}
            className={inputCls} style={{ colorScheme: 'dark' }} />
        </Field>

        <Field label="Country of Residence">
          <select value={form.country} onChange={set('country')}
            className={`${inputCls} appearance-none`} style={{ background: 'rgba(255,255,255,0.04)' }}>
            <option value="" disabled style={{ background: '#0d1117' }}>Select country…</option>
            {COUNTRIES.map(c => (
              <option key={c} value={c} style={{ background: '#0d1117' }}>{c}</option>
            ))}
          </select>
        </Field>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.08 }}
        className="glass rounded-2xl border border-white/5 p-6 space-y-4 mb-6">
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Identity Document</p>

        <Field label="Document Type">
          <select value={form.documentType} onChange={set('documentType')}
            className={`${inputCls} appearance-none`} style={{ background: 'rgba(255,255,255,0.04)' }}>
            <option value="" disabled style={{ background: '#0d1117' }}>Select document type…</option>
            {DOCUMENT_TYPES.map(d => (
              <option key={d} value={d} style={{ background: '#0d1117' }}>{d}</option>
            ))}
          </select>
        </Field>

        <Field label="Document Number">
          <input value={form.documentNumber} onChange={set('documentNumber')}
            placeholder="e.g. A12345678"
            className={`${inputCls} font-mono`} />
        </Field>
      </motion.div>

      <div className="glass rounded-xl p-4 border border-white/5 mb-6">
        <p className="text-xs text-gray-600 leading-relaxed">
          By submitting this form you confirm that all information provided is accurate and belongs to you. Submitting false information may result in account suspension.
        </p>
      </div>

      <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
        onClick={handleSubmit}
        disabled={!valid || submitting}
        className="w-full btn-neon text-white font-bold py-4 rounded-xl text-sm flex items-center justify-center gap-2 disabled:opacity-40">
        {submitting
          ? <><RefreshCw className="w-4 h-4 animate-spin" /> Submitting…</>
          : <><ShieldCheck className="w-4 h-4" /> Submit for Verification</>}
      </motion.button>
    </div>
  );
}
