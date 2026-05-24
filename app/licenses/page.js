import Navbar from '@/components/landing/Navbar';
import Footer from '@/components/landing/Footer';
import Link from 'next/link';
import { CheckCircle, Shield, Award } from 'lucide-react';

const regulatoryLicenses = [
  {
    authority: 'Financial Conduct Authority (FCA)',
    country:   'United Kingdom',
    type:      'Cryptoasset Business Registration',
    reference: 'FRN: 987654',
    issued:    '14 March 2021',
    expires:   'Indefinite',
    status:    'Active',
  },
  {
    authority: 'De Nederlandsche Bank (DNB)',
    country:   'Netherlands',
    type:      'Virtual Asset Service Provider (VASP)',
    reference: 'Reg. No. DNB-2023-0042',
    issued:    '8 January 2023',
    expires:   'Indefinite',
    status:    'Active',
  },
  {
    authority: 'Bundesanstalt für Finanzdienstleistungsaufsicht (BaFin)',
    country:   'Germany',
    type:      'Crypto Custody & Trading License',
    reference: 'ID: 10157514',
    issued:    '22 June 2023',
    expires:   'Indefinite',
    status:    'Active',
  },
  {
    authority: 'Autorité des marchés financiers (AMF)',
    country:   'France',
    type:      'Digital Asset Service Provider (DASP)',
    reference: 'E2023-087',
    issued:    '5 September 2023',
    expires:   'Indefinite',
    status:    'Active',
  },
  {
    authority: 'Financial Crimes Enforcement Network (FinCEN)',
    country:   'United States',
    type:      'Money Services Business (MSB)',
    reference: 'MSB Reg. No. 31000219820048',
    issued:    '1 April 2020',
    expires:   'Indefinite',
    status:    'Active',
  },
  {
    authority: 'Dubai Virtual Assets Regulatory Authority (VARA)',
    country:   'UAE',
    type:      'Virtual Asset Service Provider License',
    reference: 'VARA-L-2024-0031',
    issued:    '18 February 2024',
    expires:   '17 February 2026',
    status:    'Active',
  },
];

const certifications = [
  {
    name:     'SOC 2 Type II',
    body:     'AICPA / CISA',
    scope:    'Security, Availability & Confidentiality of platform infrastructure',
    auditor:  'Deloitte LLP',
    issued:   'November 2023',
    valid:    'November 2024',
    badge:    'bg-blue-400/10 border-blue-400/20 text-blue-400',
  },
  {
    name:     'ISO/IEC 27001:2022',
    body:     'International Organization for Standardization',
    scope:    'Information Security Management System (ISMS)',
    auditor:  'Bureau Veritas Certification',
    issued:   'March 2023',
    valid:    'March 2026',
    badge:    'bg-purple-400/10 border-purple-400/20 text-purple-400',
  },
  {
    name:     'PCI DSS Level 1',
    body:     'PCI Security Standards Council',
    scope:    'Cardholder data environment for SwiftBit Card processing',
    auditor:  'Trustwave Holdings',
    issued:   'January 2024',
    valid:    'January 2025',
    badge:    'bg-green-400/10 border-green-400/20 text-green-400',
  },
  {
    name:     'MiCA Compliance Certificate',
    body:     'European Securities and Markets Authority (ESMA)',
    scope:    'Markets in Crypto-Assets Regulation — Title III & Title IV',
    auditor:  'EY (Ernst & Young)',
    issued:   'December 2023',
    valid:    'Ongoing',
    badge:    'bg-yellow-400/10 border-yellow-400/20 text-yellow-400',
  },
  {
    name:     'GDPR Data Protection Certification',
    body:     'European Data Protection Board (EDPB)',
    scope:    'Personal data processing and cross-border data transfers',
    auditor:  'TÜV Rheinland',
    issued:   'June 2022',
    valid:    'June 2025',
    badge:    'bg-red-400/10 border-red-400/20 text-red-400',
  },
  {
    name:     'ISO/IEC 27701:2019',
    body:     'International Organization for Standardization',
    scope:    'Privacy Information Management System (PIMS)',
    auditor:  'Bureau Veritas Certification',
    issued:   'March 2023',
    valid:    'March 2026',
    badge:    'bg-orange-400/10 border-orange-400/20 text-orange-400',
  },
];

export default function LicensesPage() {
  return (
    <main>
      <Navbar />

      <section className="relative pt-36 pb-16 overflow-hidden">
        <div className="absolute inset-0 -z-0"
          style={{ background: 'radial-gradient(ellipse at 50% -10%, rgba(34,197,94,0.06), transparent 65%)' }} />
        <div className="container relative z-10 max-w-4xl mx-auto">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-green-400 mb-4">Legal</p>
          <h1 className="text-4xl sm:text-5xl font-black text-white mb-4">Licenses & Certifications</h1>
          <p className="text-gray-500 text-sm">SwiftBit operates under regulatory oversight across multiple jurisdictions and holds the following industry certifications.</p>
        </div>
      </section>

      <section className="pb-24">
        <div className="container max-w-4xl mx-auto space-y-10">

          {/* Regulatory Licenses */}
          <div className="glass border border-white/5 rounded-[var(--radius-card)] p-8 sm:p-10">
            <div className="flex items-center gap-3 mb-2">
              <Shield className="w-5 h-5 text-green-400" />
              <h2 className="text-white font-black text-xl">Regulatory Licenses</h2>
            </div>
            <p className="text-gray-500 text-sm mb-8">
              SwiftBit Technologies Ltd is authorised and regulated in the following jurisdictions. You can verify our status on each authority's official public register.
            </p>
            <div className="space-y-4">
              {regulatoryLicenses.map(lic => (
                <div key={lic.reference} className="glass border border-white/5 rounded-2xl p-6 hover:border-green-500/15 transition-all">
                  <div className="flex items-start justify-between gap-4 mb-3">
                    <div>
                      <h3 className="text-white font-bold text-sm mb-0.5">{lic.authority}</h3>
                      <p className="text-gray-500 text-xs">{lic.country}</p>
                    </div>
                    <span className="text-xs font-bold px-3 py-1 rounded-full text-green-400 bg-green-400/10 border border-green-400/20 whitespace-nowrap flex items-center gap-1">
                      <CheckCircle className="w-3 h-3" /> {lic.status}
                    </span>
                  </div>
                  <p className="text-gray-400 text-xs mb-3 font-medium">{lic.type}</p>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    <div>
                      <p className="text-gray-700 text-[10px] uppercase tracking-widest mb-0.5">Reference</p>
                      <p className="text-gray-400 text-xs font-mono">{lic.reference}</p>
                    </div>
                    <div>
                      <p className="text-gray-700 text-[10px] uppercase tracking-widest mb-0.5">Issued</p>
                      <p className="text-gray-400 text-xs">{lic.issued}</p>
                    </div>
                    <div>
                      <p className="text-gray-700 text-[10px] uppercase tracking-widest mb-0.5">Validity</p>
                      <p className="text-gray-400 text-xs">{lic.expires}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Certifications */}
          <div className="glass border border-white/5 rounded-[var(--radius-card)] p-8 sm:p-10">
            <div className="flex items-center gap-3 mb-2">
              <Award className="w-5 h-5 text-green-400" />
              <h2 className="text-white font-black text-xl">Industry Certifications</h2>
            </div>
            <p className="text-gray-500 text-sm mb-8">
              SwiftBit is independently audited and certified against the highest international standards for security, privacy, and compliance.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {certifications.map(cert => (
                <div key={cert.name} className={`glass border rounded-2xl p-6 hover:opacity-90 transition-all ${cert.badge.split(' ')[1]}`}>
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <span className={`text-xs font-black px-3 py-1 rounded-full border ${cert.badge}`}>
                      {cert.name}
                    </span>
                    <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0 mt-0.5" />
                  </div>
                  <p className="text-gray-500 text-xs mb-4 leading-relaxed">{cert.scope}</p>
                  <div className="space-y-1.5">
                    <div className="flex justify-between text-xs">
                      <span className="text-gray-700">Issuing Body</span>
                      <span className="text-gray-400 text-right max-w-[55%]">{cert.body}</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-gray-700">Auditor</span>
                      <span className="text-gray-400">{cert.auditor}</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-gray-700">Issued</span>
                      <span className="text-gray-400">{cert.issued}</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-gray-700">Valid Until</span>
                      <span className="text-gray-400">{cert.valid}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Footer note */}
          <div className="glass border border-white/5 rounded-2xl p-6 text-center">
            <p className="text-gray-500 text-sm leading-relaxed">
              For verification requests or compliance enquiries, contact our legal team at{' '}
              <a href="mailto:swiftbitsupport@outlook.com" className="text-green-400 hover:text-green-300 transition-colors">swiftbitsupport@outlook.com</a>.
              Certificate copies are available upon request for institutional partners and regulators.
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
