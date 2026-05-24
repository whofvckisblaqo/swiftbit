import Navbar from '@/components/landing/Navbar';
import Footer from '@/components/landing/Footer';
import Link from 'next/link';

const sections = [
  {
    title: '1. Information We Collect',
    content: `We collect information you provide directly, such as when you create an account, complete identity verification (KYC), or contact support. This includes:

• Name, email address, phone number, and date of birth
• Government-issued ID documents (for KYC)
• Financial information, including payment methods and transaction history
• Communications with our support team

We also collect information automatically, including IP addresses, device identifiers, browser type, and pages visited on our platform.`,
  },
  {
    title: '2. How We Use Your Information',
    content: `We use collected information to:

• Provide, operate, and improve our services
• Verify your identity and prevent fraud
• Process transactions and send related notifications
• Comply with legal and regulatory obligations (AML, KYC)
• Send service updates, security alerts, and support messages
• Personalise your experience and analyse platform usage`,
  },
  {
    title: '3. Information Sharing',
    content: `We do not sell your personal information. We share data only in these circumstances:

• With service providers who help us operate our platform (under strict confidentiality agreements)
• With regulatory and law enforcement bodies when legally required
• With our compliance partners for fraud prevention and AML screening
• In connection with a merger, acquisition, or sale of assets (with notice to you)`,
  },
  {
    title: '4. Data Retention',
    content: `We retain your personal data for as long as your account is active and for up to 7 years after account closure, as required by financial regulations. Transaction records are kept for a minimum of 5 years in compliance with AML regulations.`,
  },
  {
    title: '5. Your Rights (GDPR)',
    content: `If you are located in the EEA or UK, you have the following rights:

• Right of access — request a copy of your personal data
• Right to rectification — correct inaccurate data
• Right to erasure — request deletion (subject to legal retention requirements)
• Right to data portability — receive your data in a structured format
• Right to restrict processing — limit how we process your data
• Right to object — object to processing based on legitimate interests

To exercise any of these rights, contact us at privacy@swiftbit.com.`,
  },
  {
    title: '6. Security',
    content: `We implement industry-standard security measures including AES-256 encryption, TLS for data in transit, multi-factor authentication, and regular third-party security audits. For more details, visit our Security page.`,
  },
  {
    title: '7. Cookies',
    content: `We use cookies and similar technologies to operate our platform, analyse usage, and personalise content. See our Cookie Policy for full details and opt-out options.`,
  },
  {
    title: '8. Changes to This Policy',
    content: `We may update this Privacy Policy from time to time. We will notify you of material changes via email or an in-app notification at least 30 days before the changes take effect.`,
  },
  {
    title: '9. Contact',
    content: `For privacy-related enquiries, contact our Data Protection Officer at:

Email: privacy@swiftbit.com
Address: SwiftBit Technologies Ltd, 15 Finsbury Square, London EC2A 1BT, United Kingdom`,
  },
];

export default function PrivacyPolicyPage() {
  return (
    <main>
      <Navbar />

      <section className="relative pt-36 pb-16 overflow-hidden">
        <div className="absolute inset-0 -z-0"
          style={{ background: 'radial-gradient(ellipse at 50% -10%, rgba(34,197,94,0.06), transparent 65%)' }} />
        <div className="container relative z-10 max-w-3xl mx-auto">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-green-400 mb-4">Legal</p>
          <h1 className="text-4xl sm:text-5xl font-black text-white mb-4">Privacy Policy</h1>
          <p className="text-gray-500 text-sm">Last updated: 1 March 2024 · Effective: 1 April 2024</p>
        </div>
      </section>

      <section className="pb-24">
        <div className="container max-w-3xl mx-auto">
          <div className="glass border border-white/5 rounded-[var(--radius-card)] p-8 sm:p-12">
            <p className="text-gray-400 mb-10 leading-relaxed">
              SwiftBit Technologies Ltd ("SwiftBit", "we", "us", or "our") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, share, and protect your personal information when you use our services.
            </p>

            <div className="space-y-10">
              {sections.map(sec => (
                <div key={sec.title}>
                  <h2 className="text-white font-bold text-lg mb-4">{sec.title}</h2>
                  <p className="text-gray-400 text-sm leading-relaxed whitespace-pre-line">{sec.content}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-8 flex flex-wrap gap-4 text-sm text-gray-600 justify-center">
            <Link href="/terms-of-service" className="hover:text-gray-400 transition-colors">Terms of Service</Link>
            <span>·</span>
            <Link href="/cookie-policy" className="hover:text-gray-400 transition-colors">Cookie Policy</Link>
            <span>·</span>
            <Link href="/licenses" className="hover:text-gray-400 transition-colors">Licenses</Link>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
