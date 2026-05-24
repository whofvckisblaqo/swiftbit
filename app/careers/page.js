import Navbar from '@/components/landing/Navbar';
import Footer from '@/components/landing/Footer';
import { MapPin, Clock, ArrowRight, Zap, Heart, Globe } from 'lucide-react';

const openRoles = [
  { title: 'Senior Backend Engineer',         dept: 'Engineering',    location: 'Remote',        type: 'Full-time' },
  { title: 'Lead Smart Contract Developer',   dept: 'Engineering',    location: 'Remote',        type: 'Full-time' },
  { title: 'iOS Engineer',                    dept: 'Engineering',    location: 'Lagos / Remote',type: 'Full-time' },
  { title: 'Product Manager – Earn',          dept: 'Product',        location: 'London',        type: 'Full-time' },
  { title: 'UX Designer',                     dept: 'Design',         location: 'Remote',        type: 'Full-time' },
  { title: 'Compliance Officer (EU)',         dept: 'Legal',          location: 'Amsterdam',     type: 'Full-time' },
  { title: 'Growth Marketing Manager',        dept: 'Marketing',      location: 'Remote',        type: 'Full-time' },
  { title: 'Customer Support Specialist',     dept: 'Support',        location: 'Remote',        type: 'Full-time' },
  { title: 'Security Analyst',               dept: 'Security',       location: 'Remote',        type: 'Contract' },
];

const perks = [
  { icon: Zap,   title: 'Competitive Pay',     desc: 'Top-of-market salaries with equity participation for all full-time roles.' },
  { icon: Globe, title: 'Remote-First',        desc: 'Work from anywhere in the world. Async-friendly culture with optional offices in London and Lagos.' },
  { icon: Heart, title: 'Health & Wellness',   desc: 'Full health, dental, and vision coverage. Monthly wellness stipend. Mental health support.' },
];

const depts = ['All', 'Engineering', 'Product', 'Design', 'Legal', 'Marketing', 'Support', 'Security'];

export default function CareersPage() {
  return (
    <main>
      <Navbar />

      {/* Hero */}
      <section className="relative pt-36 pb-20 overflow-hidden">
        <div className="absolute inset-0 -z-0"
          style={{ background: 'radial-gradient(ellipse at 50% -10%, rgba(34,197,94,0.10), transparent 65%)' }} />
        <div className="container relative z-10 text-center max-w-3xl mx-auto">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-green-400 mb-4">Careers at SwiftBit</p>
          <h1 className="text-4xl sm:text-6xl font-black text-white mb-6 leading-tight">
            Build the <span className="text-green-400">future of finance</span>
          </h1>
          <p className="text-gray-400 text-lg">
            We are a remote-first team on a mission to democratize crypto finance. Join us.
          </p>
        </div>
      </section>

      {/* Perks */}
      <section className="py-16">
        <div className="container">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {perks.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="glass border border-white/5 rounded-[var(--radius-card)] p-7 text-center hover:border-green-500/20 transition-all">
                <div className="w-12 h-12 rounded-xl bg-green-500/10 flex items-center justify-center mx-auto mb-5">
                  <Icon className="w-6 h-6 text-green-400" />
                </div>
                <h3 className="text-white font-bold mb-2">{title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Open roles */}
      <section className="py-16">
        <div className="container max-w-4xl mx-auto">
          <h2 className="text-2xl font-black text-white mb-6">Open positions ({openRoles.length})</h2>

          {/* Dept filter */}
          <div className="flex flex-wrap gap-2 mb-8">
            {depts.map((d, i) => (
              <button key={d}
                className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all ${i === 0 ? 'bg-green-500 text-white' : 'glass border border-white/10 text-gray-400 hover:text-white'}`}>
                {d}
              </button>
            ))}
          </div>

          <div className="space-y-3">
            {openRoles.map(role => (
              <div key={role.title}
                className="glass border border-white/5 rounded-2xl px-6 py-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-green-500/20 transition-all cursor-pointer group">
                <div>
                  <p className="text-white font-semibold">{role.title}</p>
                  <div className="flex items-center gap-4 mt-1 text-xs text-gray-500">
                    <span className="text-green-400/80 font-medium">{role.dept}</span>
                    <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> {role.location}</span>
                    <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {role.type}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-500 group-hover:text-green-400 transition-colors font-medium">
                  Apply <ArrowRight className="w-4 h-4" />
                </div>
              </div>
            ))}
          </div>

          <p className="text-center text-gray-600 text-sm mt-8">
            Don't see your role?{' '}
            <a href="mailto:careers@swiftbit.com" className="text-green-400 hover:text-green-300 underline">
              Send us your CV
            </a>{' '}
            and we'll keep you in mind for future openings.
          </p>
        </div>
      </section>

      <Footer />
    </main>
  );
}
