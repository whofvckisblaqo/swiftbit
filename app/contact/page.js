'use client';
import { useState } from 'react';
import Navbar from '@/components/landing/Navbar';
import Footer from '@/components/landing/Footer';
import { Mail, MessageCircle, MapPin, Clock, Send, CheckCircle } from 'lucide-react';

const topics = [
  'Account issue',
  'Transaction problem',
  'KYC / Verification',
  'Billing & fees',
  'Security concern',
  'Media / Press',
  'Partnership enquiry',
  'Other',
];

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', topic: '', message: '' });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  function handleChange(e) {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    await new Promise(r => setTimeout(r, 900));
    setLoading(false);
    setSubmitted(true);
  }

  return (
    <main>
      <Navbar />

      {/* Hero */}
      <section className="relative pt-36 pb-16 overflow-hidden">
        <div className="absolute inset-0 -z-0"
          style={{ background: 'radial-gradient(ellipse at 50% -10%, rgba(34,197,94,0.10), transparent 65%)' }} />
        <div className="container relative z-10 text-center max-w-2xl mx-auto">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-green-400 mb-4">Contact Us</p>
          <h1 className="text-4xl sm:text-5xl font-black text-white mb-5">Get in touch</h1>
          <p className="text-gray-400">We're here to help. Choose the best channel for your enquiry.</p>
        </div>
      </section>

      {/* Quick contact cards */}
      <section className="py-10">
        <div className="container max-w-4xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            {[
              { icon: MessageCircle, title: 'Live Chat',    value: 'Available 24/7',              sub: 'Average wait: under 2 min' },
              { icon: Mail,          title: 'Email Support', value: 'swiftbitsuport@outlook.com',        sub: 'Reply within 24 hours' },
              { icon: MapPin,        title: 'Head Office',   value: 'London, United Kingdom',      sub: '15 Finsbury Square, EC2A 1BT' },
            ].map(({ icon: Icon, title, value, sub }) => (
              <div key={title} className="glass border border-white/5 rounded-[var(--radius-card)] p-6 hover:border-green-500/20 transition-all">
                <div className="w-10 h-10 rounded-xl bg-green-500/10 flex items-center justify-center mb-4">
                  <Icon className="w-5 h-5 text-green-400" />
                </div>
                <h3 className="text-white font-bold text-sm mb-1">{title}</h3>
                <p className="text-gray-300 text-sm font-medium mb-1">{value}</p>
                <p className="text-gray-600 text-xs">{sub}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact form */}
      <section className="py-12 pb-24">
        <div className="container max-w-2xl mx-auto">
          <div className="glass border border-white/5 rounded-[var(--radius-card)] p-8 sm:p-12">

            {submitted ? (
              <div className="text-center py-8">
                <div className="w-16 h-16 rounded-full bg-green-500/10 flex items-center justify-center mx-auto mb-5">
                  <CheckCircle className="w-8 h-8 text-green-400" />
                </div>
                <h2 className="text-white font-black text-2xl mb-3">Message sent!</h2>
                <p className="text-gray-400 text-sm">
                  Thanks for reaching out, <span className="text-white">{form.name}</span>. We'll reply to <span className="text-white">{form.email}</span> within 24 hours.
                </p>
              </div>
            ) : (
              <>
                <h2 className="text-white font-black text-xl mb-8">Send us a message</h2>
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Full Name</label>
                      <input
                        name="name" value={form.name} onChange={handleChange} required
                        placeholder="John Doe"
                        className="w-full glass border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-green-500/40"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Email Address</label>
                      <input
                        name="email" type="email" value={form.email} onChange={handleChange} required
                        placeholder="john@example.com"
                        className="w-full glass border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-green-500/40"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Topic</label>
                    <select
                      name="topic" value={form.topic} onChange={handleChange} required
                      className="w-full glass border border-white/10 rounded-xl px-4 py-3 text-sm text-white bg-transparent focus:outline-none focus:border-green-500/40 [&>option]:bg-[#0d1117]">
                      <option value="" className="text-gray-500">Select a topic</option>
                      {topics.map(t => <option key={t} value={t}>{t}</option>)}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Message</label>
                    <textarea
                      name="message" value={form.message} onChange={handleChange} required rows={5}
                      placeholder="Describe your issue or question in detail..."
                      className="w-full glass border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-green-500/40 resize-none"
                    />
                  </div>

                  <button type="submit" disabled={loading}
                    className="btn-neon w-full flex items-center justify-center gap-2 text-white font-bold px-6 py-4 rounded-2xl text-sm disabled:opacity-60">
                    {loading ? 'Sending…' : <><Send className="w-4 h-4" /> Send Message</>}
                  </button>
                </form>
              </>
            )}
          </div>

          <div className="mt-8 flex items-center justify-center gap-2 text-xs text-gray-600">
            <Clock className="w-3 h-3" />
            <span>Support hours: 24/7 for live chat · Mon–Fri 09:00–18:00 GMT for phone callbacks</span>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
