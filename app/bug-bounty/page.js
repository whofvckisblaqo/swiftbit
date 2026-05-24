import Navbar from '@/components/landing/Navbar';
import Footer from '@/components/landing/Footer';
import { Shield, AlertTriangle, CheckCircle, XCircle, ArrowRight } from 'lucide-react';

const tiers = [
  {
    severity: 'Critical',
    reward:   '$10,000 – $50,000',
    color:    'text-red-400 bg-red-400/10 border-red-400/20',
    examples: [
      'Remote code execution on SwiftBit infrastructure',
      'Authentication bypass allowing account takeover',
      'Private key or seed phrase exposure',
      'Direct theft of user funds via smart contract exploit',
    ],
  },
  {
    severity: 'High',
    reward:   '$2,500 – $10,000',
    color:    'text-orange-400 bg-orange-400/10 border-orange-400/20',
    examples: [
      'SQL injection or NoSQL injection with data exfiltration',
      'Privilege escalation to admin-level access',
      'Bypassing transaction signing or approval mechanisms',
      'Mass account enumeration exposing PII',
    ],
  },
  {
    severity: 'Medium',
    reward:   '$500 – $2,500',
    color:    'text-yellow-400 bg-yellow-400/10 border-yellow-400/20',
    examples: [
      'Stored XSS with significant impact',
      'CSRF on sensitive actions (transfers, settings)',
      'Insecure direct object references (IDOR) to other users\' data',
      'Bypassing rate limits on authentication endpoints',
    ],
  },
  {
    severity: 'Low',
    reward:   '$100 – $500',
    color:    'text-blue-400 bg-blue-400/10 border-blue-400/20',
    examples: [
      'Reflected XSS with low exploitability',
      'Open redirect to a non-sensitive resource',
      'Missing security headers (HSTS, CSP, etc.)',
      'Information disclosure of non-sensitive data',
    ],
  },
];

const inScope = [
  'app.swiftbit.com (web platform)',
  'api.swiftbit.com (REST API)',
  'SwiftBit iOS & Android applications',
  'auth.swiftbit.com (authentication service)',
];

const outOfScope = [
  'Social engineering attacks against SwiftBit staff',
  'Physical attacks against SwiftBit offices or infrastructure',
  'DoS / DDoS attacks',
  'Issues requiring unlikely user interaction',
  'Vulnerabilities in third-party services we use',
  'Known CVEs not yet patched upstream',
];

export default function BugBountyPage() {
  return (
    <main>
      <Navbar />

      {/* Hero */}
      <section className="relative pt-36 pb-20 overflow-hidden">
        <div className="absolute inset-0 -z-0"
          style={{ background: 'radial-gradient(ellipse at 50% -10%, rgba(34,197,94,0.10), transparent 65%)' }} />
        <div className="container relative z-10 text-center max-w-3xl mx-auto">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-green-400 mb-4">Responsible Disclosure</p>
          <h1 className="text-4xl sm:text-6xl font-black text-white mb-6 leading-tight">
            Bug Bounty <span className="text-green-400">Program</span>
          </h1>
          <p className="text-gray-400 text-lg mb-8">
            Help us protect 248,000+ users. Earn up to <span className="text-white font-bold">$50,000</span> for critical vulnerabilities.
          </p>
          <a href="mailto:swiftbitsupport@outlook.com"
            className="btn-neon inline-flex items-center gap-2 text-white font-bold px-10 py-4 rounded-2xl text-base">
            Report a Vulnerability <ArrowRight className="w-4 h-4" />
          </a>
        </div>
      </section>

      {/* Stats */}
      <section className="py-10">
        <div className="container">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-3xl mx-auto">
            {[
              { value: '$340K+',  label: 'Total rewards paid' },
              { value: '180+',    label: 'Reports resolved' },
              { value: '< 48h',   label: 'Average triage time' },
            ].map(s => (
              <div key={s.label} className="glass border border-white/5 rounded-2xl p-7 text-center">
                <p className="text-3xl font-black text-green-400 mb-1">{s.value}</p>
                <p className="text-gray-500 text-sm">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Reward tiers */}
      <section className="py-16">
        <div className="container max-w-4xl mx-auto">
          <h2 className="text-2xl font-black text-white text-center mb-10">Reward Tiers</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {tiers.map(tier => (
              <div key={tier.severity} className={`glass border rounded-[var(--radius-card)] p-7 ${tier.color.split(' ')[2]}`}>
                <div className="flex items-center justify-between mb-4">
                  <span className={`text-sm font-black px-3 py-1 rounded-full ${tier.color}`}>{tier.severity}</span>
                  <span className="text-white font-bold text-sm">{tier.reward}</span>
                </div>
                <ul className="space-y-2">
                  {tier.examples.map(ex => (
                    <li key={ex} className="flex items-start gap-2 text-gray-400 text-xs">
                      <Shield className="w-3.5 h-3.5 flex-shrink-0 mt-0.5 text-gray-600" /> {ex}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Scope */}
      <section className="py-10">
        <div className="container max-w-4xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="glass border border-white/5 rounded-[var(--radius-card)] p-7">
              <h3 className="text-white font-bold mb-5 flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-400" /> In Scope
              </h3>
              <ul className="space-y-3">
                {inScope.map(item => (
                  <li key={item} className="text-gray-400 text-sm flex items-start gap-2">
                    <span className="text-green-400 font-bold">✓</span> {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="glass border border-white/5 rounded-[var(--radius-card)] p-7">
              <h3 className="text-white font-bold mb-5 flex items-center gap-2">
                <XCircle className="w-4 h-4 text-red-400" /> Out of Scope
              </h3>
              <ul className="space-y-3">
                {outOfScope.map(item => (
                  <li key={item} className="text-gray-400 text-sm flex items-start gap-2">
                    <span className="text-red-400 font-bold">✗</span> {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Rules */}
      <section className="py-10 pb-24">
        <div className="container max-w-3xl mx-auto">
          <div className="glass border border-white/5 rounded-[var(--radius-card)] p-8">
            <h2 className="text-white font-black text-xl mb-5 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-yellow-400" /> Responsible Disclosure Rules
            </h2>
            <ul className="space-y-3 text-gray-400 text-sm leading-relaxed">
              <li>• Do not access, modify, or delete data belonging to other users.</li>
              <li>• Do not perform actions that could disrupt service availability (DoS).</li>
              <li>• Do not disclose the vulnerability publicly before we have released a fix.</li>
              <li>• Give us at least <strong className="text-white">90 days</strong> to patch before public disclosure.</li>
              <li>• Only test against accounts you own or have explicit permission to test.</li>
              <li>• Report all findings to <a href="mailto:swiftbitsupport@outlook.com" className="text-green-400 hover:text-green-300">swiftbitsupport@outlook.com</a> with full reproduction steps.</li>
            </ul>
            <p className="text-gray-600 text-xs mt-6">
              Researchers who follow our responsible disclosure policy will not face legal action. SwiftBit reserves the right to determine reward amounts based on impact and quality of report.
            </p>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
