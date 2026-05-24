import Navbar from '@/components/landing/Navbar';
import Footer from '@/components/landing/Footer';
import Link from 'next/link';

const sections = [
  {
    title: '1. Acceptance of Terms',
    content: `By accessing or using SwiftBit's platform, mobile applications, or APIs, you agree to be bound by these Terms of Service. If you do not agree to these terms, you must not use our services. These terms constitute a legally binding agreement between you and SwiftBit Technologies Ltd.`,
  },
  {
    title: '2. Eligibility',
    content: `To use SwiftBit, you must:

• Be at least 18 years of age (or the legal age of majority in your jurisdiction)
• Have the legal capacity to enter into binding contracts
• Not be a resident of a country subject to international sanctions
• Not be on any government watchlist or prohibited person registry
• Successfully complete our identity verification (KYC) process for certain features`,
  },
  {
    title: '3. Account Registration',
    content: `You agree to provide accurate, current, and complete information during registration and to update this information as necessary. You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account. Notify us immediately at support@swiftbit.com if you suspect any unauthorized access.`,
  },
  {
    title: '4. Permitted Use',
    content: `You may use SwiftBit only for lawful purposes. You must not:

• Use our services for money laundering, terrorist financing, or other illegal activities
• Manipulate markets or engage in wash trading
• Attempt to circumvent any security measures or access controls
• Reverse-engineer, decompile, or disassemble any part of our platform
• Use automated tools to scrape data without our written consent`,
  },
  {
    title: '5. Transactions',
    content: `All transactions are final once confirmed on the blockchain. SwiftBit is not responsible for errors caused by incorrect addresses, network congestion, or blockchain forks. Fiat withdrawal processing times may vary between 1–5 business days. We reserve the right to suspend or cancel transactions suspected of being fraudulent or in violation of these terms.`,
  },
  {
    title: '6. Fees',
    content: `SwiftBit charges fees for certain transactions, which are displayed before you confirm any transaction. We reserve the right to change our fee structure with 30 days' notice. Continued use of the platform after the notice period constitutes acceptance of the new fee structure.`,
  },
  {
    title: '7. Risk Disclosure',
    content: `Cryptocurrency trading involves significant risk. The value of crypto assets can rise or fall dramatically in short periods. You may lose all of your invested capital. SwiftBit does not provide investment advice. Nothing on this platform constitutes financial, investment, legal, or tax advice. Always conduct your own research before making financial decisions.`,
  },
  {
    title: '8. Intellectual Property',
    content: `All content, trademarks, logos, and software on the SwiftBit platform are owned by or licensed to SwiftBit Technologies Ltd. You are granted a limited, non-exclusive, non-transferable licence to use our platform for personal, non-commercial purposes. You must not reproduce, distribute, or create derivative works without our express written consent.`,
  },
  {
    title: '9. Limitation of Liability',
    content: `To the maximum extent permitted by law, SwiftBit shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising from your use of our services. Our total liability to you for any claim shall not exceed the lesser of the fees you paid to us in the 12 months preceding the claim, or £1,000.`,
  },
  {
    title: '10. Governing Law',
    content: `These Terms are governed by the laws of England and Wales. Any disputes shall be subject to the exclusive jurisdiction of the courts of England and Wales, except where prohibited by local law.`,
  },
  {
    title: '11. Changes to Terms',
    content: `We may update these Terms at any time. We will notify you of material changes at least 30 days in advance via email or in-app notification. Continued use of the platform after the effective date constitutes acceptance of the revised Terms.`,
  },
  {
    title: '12. Contact',
    content: `For legal enquiries: legal@swiftbit.com
SwiftBit Technologies Ltd, 15 Finsbury Square, London EC2A 1BT, United Kingdom
Registered in England & Wales · Company No. 11234567`,
  },
];

export default function TermsOfServicePage() {
  return (
    <main>
      <Navbar />

      <section className="relative pt-36 pb-16 overflow-hidden">
        <div className="absolute inset-0 -z-0"
          style={{ background: 'radial-gradient(ellipse at 50% -10%, rgba(34,197,94,0.06), transparent 65%)' }} />
        <div className="container relative z-10 max-w-3xl mx-auto">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-green-400 mb-4">Legal</p>
          <h1 className="text-4xl sm:text-5xl font-black text-white mb-4">Terms of Service</h1>
          <p className="text-gray-500 text-sm">Last updated: 1 March 2024 · Effective: 1 April 2024</p>
        </div>
      </section>

      <section className="pb-24">
        <div className="container max-w-3xl mx-auto">
          <div className="glass border border-white/5 rounded-[var(--radius-card)] p-8 sm:p-12">
            <p className="text-gray-400 mb-10 leading-relaxed">
              Please read these Terms of Service carefully before using SwiftBit. By using our platform, you agree to these terms in full.
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
            <Link href="/privacy-policy" className="hover:text-gray-400 transition-colors">Privacy Policy</Link>
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
