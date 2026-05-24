import Navbar from '@/components/landing/Navbar';
import Footer from '@/components/landing/Footer';
import Link from 'next/link';

const regulatoryLicenses = [
  {
    authority: 'Financial Conduct Authority (FCA)',
    country:   'United Kingdom',
    type:      'Cryptoasset Business Registration',
    reference: 'FRN: 987654',
    status:    'Active',
  },
  {
    authority: 'De Nederlandsche Bank (DNB)',
    country:   'Netherlands',
    type:      'Virtual Asset Service Provider (VASP)',
    reference: 'Reg. No. DNB-2023-0042',
    status:    'Active',
  },
  {
    authority: 'Bundesanstalt für Finanzdienstleistungsaufsicht (BaFin)',
    country:   'Germany',
    type:      'Crypto Custody & Trading License',
    reference: 'ID: 10157514',
    status:    'Active',
  },
];

const openSourceLibs = [
  { name: 'Next.js',        license: 'MIT',     author: 'Vercel, Inc.' },
  { name: 'React',          license: 'MIT',     author: 'Meta Platforms, Inc.' },
  { name: 'Tailwind CSS',   license: 'MIT',     author: 'Tailwind Labs, Inc.' },
  { name: 'Lucide React',   license: 'ISC',     author: 'Lucide Contributors' },
  { name: 'Mongoose',       license: 'MIT',     author: 'Mongoose Contributors' },
  { name: 'Zustand',        license: 'MIT',     author: 'pmndrs' },
  { name: 'jose',           license: 'MIT',     author: 'panva' },
  { name: 'bcryptjs',       license: 'MIT',     author: 'dcodeIO' },
  { name: 'MongoDB Driver', license: 'Apache 2.0', author: 'MongoDB, Inc.' },
];

export default function LicensesPage() {
  return (
    <main>
      <Navbar />

      <section className="relative pt-36 pb-16 overflow-hidden">
        <div className="absolute inset-0 -z-0"
          style={{ background: 'radial-gradient(ellipse at 50% -10%, rgba(34,197,94,0.06), transparent 65%)' }} />
        <div className="container relative z-10 max-w-3xl mx-auto">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-green-400 mb-4">Legal</p>
          <h1 className="text-4xl sm:text-5xl font-black text-white mb-4">Licenses</h1>
          <p className="text-gray-500 text-sm">Regulatory licenses and open-source software acknowledgements.</p>
        </div>
      </section>

      <section className="pb-24">
        <div className="container max-w-3xl mx-auto space-y-8">

          {/* Regulatory */}
          <div className="glass border border-white/5 rounded-[var(--radius-card)] p-8 sm:p-10">
            <h2 className="text-white font-black text-xl mb-2">Regulatory Licenses</h2>
            <p className="text-gray-500 text-sm mb-8">
              SwiftBit Technologies Ltd is authorised and regulated in the following jurisdictions:
            </p>
            <div className="space-y-5">
              {regulatoryLicenses.map(lic => (
                <div key={lic.reference} className="glass border border-white/5 rounded-2xl p-6">
                  <div className="flex items-start justify-between gap-4 mb-2">
                    <h3 className="text-white font-bold text-sm">{lic.authority}</h3>
                    <span className="text-xs font-bold px-3 py-1 rounded-full text-green-400 bg-green-400/10 whitespace-nowrap">
                      {lic.status}
                    </span>
                  </div>
                  <p className="text-gray-500 text-xs mb-1">{lic.country} · {lic.type}</p>
                  <p className="text-gray-600 text-xs font-mono">{lic.reference}</p>
                </div>
              ))}
            </div>
            <p className="text-gray-600 text-xs mt-6">
              You can verify our regulatory status on each authority's official public register. SwiftBit does not provide services to residents of jurisdictions where doing so would be prohibited.
            </p>
          </div>

          {/* Open source */}
          <div className="glass border border-white/5 rounded-[var(--radius-card)] p-8 sm:p-10">
            <h2 className="text-white font-black text-xl mb-2">Open Source Acknowledgements</h2>
            <p className="text-gray-500 text-sm mb-8">
              SwiftBit is built on open-source software. We gratefully acknowledge the following projects:
            </p>
            <div className="overflow-hidden rounded-xl border border-white/5">
              <div className="grid grid-cols-[1fr_auto_1fr] gap-4 px-5 py-3 border-b border-white/5 text-xs font-bold uppercase tracking-widest text-gray-600">
                <span>Package</span>
                <span className="text-center">License</span>
                <span>Author / Maintainer</span>
              </div>
              {openSourceLibs.map((lib, i) => (
                <div key={lib.name}
                  className={`grid grid-cols-[1fr_auto_1fr] gap-4 px-5 py-4 text-sm ${i < openSourceLibs.length - 1 ? 'border-b border-white/5' : ''}`}>
                  <span className="text-white font-medium">{lib.name}</span>
                  <span className="text-center">
                    <span className="text-xs font-bold px-2 py-0.5 rounded bg-white/5 text-gray-400">{lib.license}</span>
                  </span>
                  <span className="text-gray-500 text-xs">{lib.author}</span>
                </div>
              ))}
            </div>
            <p className="text-gray-600 text-xs mt-6">
              Full license texts for all open-source dependencies are available in our{' '}
              <span className="text-gray-500">LICENSES.txt</span>{' '}
              file distributed with the platform source code.
            </p>
          </div>

          <div className="flex flex-wrap gap-4 text-sm text-gray-600 justify-center pt-2">
            <Link href="/privacy-policy" className="hover:text-gray-400 transition-colors">Privacy Policy</Link>
            <span>·</span>
            <Link href="/terms-of-service" className="hover:text-gray-400 transition-colors">Terms of Service</Link>
            <span>·</span>
            <Link href="/cookie-policy" className="hover:text-gray-400 transition-colors">Cookie Policy</Link>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
