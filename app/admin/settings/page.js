'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Settings, Shield, Bell, Palette, Globe, Key, Save, RefreshCw, Zap } from 'lucide-react';
import AdminHeader from '@/components/admin/AdminHeader';

function Toggle({ checked, onChange }) {
  return (
    <button onClick={() => onChange(!checked)}
      className={`relative w-11 h-6 rounded-full transition-colors duration-200 ${checked ? 'bg-green-500' : 'bg-white/10'}`}>
      <div className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform duration-200 ${checked ? 'translate-x-5' : 'translate-x-0'}`} />
    </button>
  );
}

function SettingRow({ label, desc, children }) {
  return (
    <div className="flex items-center justify-between gap-4 py-4 border-b border-white/5 last:border-0">
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-white">{label}</p>
        {desc && <p className="text-xs text-gray-600 mt-0.5">{desc}</p>}
      </div>
      <div className="shrink-0">{children}</div>
    </div>
  );
}

function Section({ icon: Icon, title, color, children }) {
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
      className="glass rounded-2xl border border-white/5 overflow-hidden">
      <div className="flex items-center gap-3 px-5 py-4 border-b border-white/5">
        <div className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0"
          style={{ background: `${color}15`, border: `1px solid ${color}25` }}>
          <Icon className="w-4 h-4" style={{ color }} />
        </div>
        <h3 className="font-bold text-white">{title}</h3>
      </div>
      <div className="px-5">{children}</div>
    </motion.div>
  );
}

export default function SettingsPage() {
  const [s, setS] = useState({
    maintenance: false,
    twoFactor: true,
    autoKyc: true,
    emailAlerts: true,
    slackAlerts: false,
    withdrawalLimit: true,
    tradingEnabled: true,
    depositEnabled: true,
    swapEnabled: true,
    darkMode: true,
    compactMode: false,
  });
  const toggle = key => setS(prev => ({ ...prev, [key]: !prev[key] }));
  const [saved, setSaved] = useState(false);
  const save = () => { setSaved(true); setTimeout(() => setSaved(false), 2000); };

  return (
    <div>
      <AdminHeader title="Settings" subtitle="Platform configuration & preferences" />

      <div className="grid lg:grid-cols-2 gap-5">
        {/* Platform */}
        <Section icon={Settings} title="Platform Settings" color="#22c55e">
          <SettingRow label="Maintenance Mode" desc="Temporarily disable the platform for all users">
            <Toggle checked={s.maintenance} onChange={() => toggle('maintenance')} />
          </SettingRow>
          <SettingRow label="Trading Enabled" desc="Allow buy/sell order execution">
            <Toggle checked={s.tradingEnabled} onChange={() => toggle('tradingEnabled')} />
          </SettingRow>
          <SettingRow label="Deposits Enabled" desc="Allow users to deposit funds">
            <Toggle checked={s.depositEnabled} onChange={() => toggle('depositEnabled')} />
          </SettingRow>
          <SettingRow label="Swaps Enabled" desc="Allow crypto-to-crypto swaps">
            <Toggle checked={s.swapEnabled} onChange={() => toggle('swapEnabled')} />
          </SettingRow>
          <SettingRow label="Fee Rate" desc="Platform trading fee percentage">
            <select className="glass border border-white/10 rounded-xl px-3 py-1.5 text-sm text-white bg-transparent appearance-none focus:outline-none">
              <option style={{background:'#0d1117'}}>0.1% Taker</option>
              <option style={{background:'#0d1117'}}>0.15% Taker</option>
              <option style={{background:'#0d1117'}}>0.2% Taker</option>
            </select>
          </SettingRow>
        </Section>

        {/* Security */}
        <Section icon={Shield} title="Security Settings" color="#6366f1">
          <SettingRow label="Enforce 2FA for All Users" desc="Require two-factor authentication on login">
            <Toggle checked={s.twoFactor} onChange={() => toggle('twoFactor')} />
          </SettingRow>
          <SettingRow label="Auto KYC Review" desc="AI-assisted identity verification screening">
            <Toggle checked={s.autoKyc} onChange={() => toggle('autoKyc')} />
          </SettingRow>
          <SettingRow label="Withdrawal Limits" desc="Cap large withdrawals pending manual review">
            <Toggle checked={s.withdrawalLimit} onChange={() => toggle('withdrawalLimit')} />
          </SettingRow>
          <SettingRow label="Max Daily Withdrawal" desc="Per user limit (USD)">
            <select className="glass border border-white/10 rounded-xl px-3 py-1.5 text-sm text-white bg-transparent appearance-none focus:outline-none">
              {['$10,000','$25,000','$50,000','$100,000'].map(v => (
                <option key={v} style={{background:'#0d1117'}}>{v}</option>
              ))}
            </select>
          </SettingRow>
          <SettingRow label="Session Timeout" desc="Auto-logout inactive admin sessions">
            <select className="glass border border-white/10 rounded-xl px-3 py-1.5 text-sm text-white bg-transparent appearance-none focus:outline-none">
              {['15 min','30 min','1 hour','4 hours'].map(v => (
                <option key={v} style={{background:'#0d1117'}}>{v}</option>
              ))}
            </select>
          </SettingRow>
        </Section>

        {/* Notifications */}
        <Section icon={Bell} title="Alert Settings" color="#f59e0b">
          <SettingRow label="Email Alerts" desc="Send critical alerts to admin email">
            <Toggle checked={s.emailAlerts} onChange={() => toggle('emailAlerts')} />
          </SettingRow>
          <SettingRow label="Slack Alerts" desc="Push security events to Slack">
            <Toggle checked={s.slackAlerts} onChange={() => toggle('slackAlerts')} />
          </SettingRow>
          <SettingRow label="Alert Email" desc="Recipient for critical notifications">
            <input defaultValue="admin@swiftbit.io" className="glass border border-white/10 rounded-xl px-3 py-1.5 text-sm text-white w-44 focus:outline-none focus:border-green-500/40 transition-all" />
          </SettingRow>
          <SettingRow label="Large TX Threshold" desc="Flag transactions above this amount">
            <select className="glass border border-white/10 rounded-xl px-3 py-1.5 text-sm text-white bg-transparent appearance-none focus:outline-none">
              {['$10,000','$25,000','$50,000'].map(v => (
                <option key={v} style={{background:'#0d1117'}}>{v}</option>
              ))}
            </select>
          </SettingRow>
        </Section>

        {/* Appearance */}
        <Section icon={Palette} title="Interface" color="#ec4899">
          <SettingRow label="Dark Mode Only" desc="Force dark theme for all admin users">
            <Toggle checked={s.darkMode} onChange={() => toggle('darkMode')} />
          </SettingRow>
          <SettingRow label="Compact Mode" desc="Reduce table row height and spacing">
            <Toggle checked={s.compactMode} onChange={() => toggle('compactMode')} />
          </SettingRow>
          <SettingRow label="Admin Panel Version" desc="">
            <span className="text-xs font-mono text-green-400 bg-green-500/10 px-2.5 py-1 rounded-full">v2.4.1</span>
          </SettingRow>
          <SettingRow label="Platform Region" desc="Primary data center region">
            <select className="glass border border-white/10 rounded-xl px-3 py-1.5 text-sm text-white bg-transparent appearance-none focus:outline-none">
              {['US East', 'EU West', 'Asia Pacific'].map(v => (
                <option key={v} style={{background:'#0d1117'}}>{v}</option>
              ))}
            </select>
          </SettingRow>
        </Section>
      </div>

      {/* Save bar */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
        className="mt-6 flex items-center justify-between glass rounded-2xl p-5 border border-white/5">
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <Zap className="w-4 h-4 text-green-400" />
          Changes are applied immediately to all platform instances.
        </div>
        <div className="flex gap-3">
          <button className="px-5 py-2.5 rounded-xl glass border border-white/10 text-sm text-gray-400 hover:text-white transition-all flex items-center gap-2">
            <RefreshCw className="w-4 h-4" /> Reset
          </button>
          <button onClick={save}
            className={`px-6 py-2.5 rounded-xl text-sm font-semibold flex items-center gap-2 transition-all ${saved ? 'bg-green-500/20 text-green-400 border border-green-500/30' : 'btn-neon text-white'}`}>
            {saved ? <><CheckCircle2 className="w-4 h-4" /> Saved!</> : <><Save className="w-4 h-4" /> Save Changes</>}
          </button>
        </div>
      </motion.div>
    </div>
  );
}

function CheckCircle2({ className }) {
  return <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>;
}
