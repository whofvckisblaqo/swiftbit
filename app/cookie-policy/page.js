import Navbar from '@/components/landing/Navbar';
import Footer from '@/components/landing/Footer';
import Link from 'next/link';

const cookieTypes = [
  {
    name: 'Strictly Necessary',
    required: true,
    desc: 'These cookies are essential for the platform to function. They enable core functionality such as session management, authentication, and security. These cannot be disabled.',
    examples: ['Session token', 'CSRF protection token', 'Load balancer affinity'],
  },
  {
    name: 'Performance & Analytics',
    required: false,
    desc: 'These cookies help us understand how visitors interact with our platform by collecting anonymous usage data. We use this information to improve performance and user experience.',
    examples: ['Page view tracking', 'Error rate monitoring', 'Feature usage heatmaps'],
  },
  {
    name: 'Functional',
    required: false,
    desc: 'These cookies enable enhanced functionality and personalisation, such as remembering your preferred language, currency, or theme settings.',
    examples: ['Language preference', 'Currency preference', 'Theme (dark/light)'],
  },
  {
    name: 'Marketing',
    required: false,
    desc: 'These cookies are used to deliver relevant advertisements and track the effectiveness of our marketing campaigns. We do not sell this data to third parties.',
    examples: ['Referral source tracking', 'Campaign attribution', 'Conversion tracking'],
  },
];

export default function CookiePolicyPage() {
  return (
    <main>
      <Navbar />

      <section className="relative pt-36 pb-16 overflow-hidden">
        <div className="absolute inset-0 -z-0"
          style={{ background: 'radial-gradient(ellipse at 50% -10%, rgba(34,197,94,0.06), transparent 65%)' }} />
        <div className="container relative z-10 max-w-3xl mx-auto">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-green-400 mb-4">Legal</p>
          <h1 className="text-4xl sm:text-5xl font-black text-white mb-4">Cookie Policy</h1>
          <p className="text-gray-500 text-sm">Last updated: 1 March 2024 · Effective: 1 April 2024</p>
        </div>
      </section>

      <section className="pb-24">
        <div className="container max-w-3xl mx-auto">
          <div className="glass border border-white/5 rounded-[var(--radius-card)] p-8 sm:p-12">

            <p className="text-gray-400 mb-10 leading-relaxed">
              SwiftBit Technologies Ltd uses cookies and similar technologies to operate our platform, analyse usage, and deliver relevant content. This policy explains what cookies we use and how you can control them.
            </p>

            <h2 className="text-white font-bold text-lg mb-4">What are cookies?</h2>
            <p className="text-gray-400 text-sm leading-relaxed mb-10">
              Cookies are small text files stored on your device when you visit a website. They help the site remember information about your visit, making subsequent visits faster and more personalised. Cookies cannot run programs or deliver viruses to your device.
            </p>

            <h2 className="text-white font-bold text-lg mb-6">Cookies we use</h2>
            <div className="space-y-6 mb-10">
              {cookieTypes.map(type => (
                <div key={type.name} className="glass border border-white/5 rounded-2xl p-6">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-white font-bold">{type.name}</h3>
                    <span className={`text-xs font-bold px-3 py-1 rounded-full ${type.required ? 'text-green-400 bg-green-400/10' : 'text-gray-400 bg-white/5'}`}>
                      {type.required ? 'Always Active' : 'Optional'}
                    </span>
                  </div>
                  <p className="text-gray-400 text-sm leading-relaxed mb-4">{type.desc}</p>
                  <div className="flex flex-wrap gap-2">
                    {type.examples.map(ex => (
                      <span key={ex} className="text-xs text-gray-600 bg-white/3 border border-white/5 rounded-full px-3 py-1">{ex}</span>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <h2 className="text-white font-bold text-lg mb-4">Managing your cookie preferences</h2>
            <p className="text-gray-400 text-sm leading-relaxed mb-6">
              You can manage your cookie preferences at any time through our Cookie Preferences panel (accessible via the link in our footer). You can also configure your browser to refuse or delete cookies — refer to your browser's help documentation for instructions.
            </p>
            <p className="text-gray-400 text-sm leading-relaxed mb-10">
              Note that disabling certain cookies may affect the functionality of our platform. Strictly necessary cookies cannot be disabled as they are required for the site to operate.
            </p>

            <h2 className="text-white font-bold text-lg mb-4">Third-party cookies</h2>
            <p className="text-gray-400 text-sm leading-relaxed mb-10">
              Some cookies on our platform are set by third-party services including analytics providers and payment processors. These providers have their own privacy policies governing their use of cookies. We require all third-party providers to comply with applicable data protection law.
            </p>

            <h2 className="text-white font-bold text-lg mb-4">Contact</h2>
            <p className="text-gray-400 text-sm leading-relaxed">
              For cookie-related enquiries, contact us at{' '}
              <a href="mailto:privacy@swiftbit.com" className="text-green-400 hover:text-green-300">privacy@swiftbit.com</a>.
            </p>
          </div>

          <div className="mt-8 flex flex-wrap gap-4 text-sm text-gray-600 justify-center">
            <Link href="/privacy-policy" className="hover:text-gray-400 transition-colors">Privacy Policy</Link>
            <span>·</span>
            <Link href="/terms-of-service" className="hover:text-gray-400 transition-colors">Terms of Service</Link>
            <span>·</span>
            <Link href="/licenses" className="hover:text-gray-400 transition-colors">Licenses</Link>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
