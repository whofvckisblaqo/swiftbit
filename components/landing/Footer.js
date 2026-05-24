import Link from 'next/link';
import { Zap, Globe, Mail, Rss, Send } from 'lucide-react';

const footerLinks = {
  Product: [
    { label: 'Features',    href: '/features'    },
    { label: 'Markets',     href: '/markets'     },
    { label: 'Security',    href: '/security'    },
    { label: 'Earn',        href: '/earn'        },
    { label: 'Crypto Card', href: '/crypto-card' },
  ],
  Company: [
    { label: 'About',    href: '/about'    },
    { label: 'Blog',     href: '/blog'     },
    { label: 'Careers',  href: '/careers'  },
    { label: 'Press',    href: '/press'    },
    { label: 'Partners', href: '/partners' },
  ],
  Legal: [
    { label: 'Privacy Policy',   href: '/privacy-policy'   },
    { label: 'Terms of Service', href: '/terms-of-service' },
    { label: 'Cookie Policy',    href: '/cookie-policy'    },
    { label: 'Licenses',         href: '/licenses'         },
  ],
  Support: [
    { label: 'Help Center',  href: '/help-center' },
    { label: 'Contact Us',   href: '/contact'     },
    { label: 'Status Page',  href: '/status'      },
    { label: 'Bug Bounty',   href: '/bug-bounty'  },
  ],
};

const socialIcons = [Globe, Mail, Rss, Send];

export default function Footer() {
  return (
    <footer className="relative bg-[#07090d] border-t border-white/5">

      {/* CTA banner */}
      <div className="container pt-20 pb-0">
        <div className="relative glass rounded-[var(--radius-card)] p-10 sm:p-14 text-center overflow-hidden border border-green-500/10 mb-20">
          <div className="absolute inset-0 -z-0">
            <div className="absolute inset-0 opacity-[0.04]"
              style={{ background: 'radial-gradient(ellipse at 50% 0%, #22c55e, transparent 65%)' }} />
          </div>
          <div className="relative z-10">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-green-400 mb-4">Get Started Today</p>
            <h2 className="text-3xl sm:text-4xl font-black text-white mb-4 max-w-xl mx-auto leading-tight">
              Start your crypto journey — zero fees for 30 days
            </h2>
            <p className="text-gray-500 text-base mb-8 max-w-md mx-auto">
              Join 248,000+ users already trading on SwiftBit.
            </p>
            <Link
              href="/register"
              className="btn-neon inline-flex items-center gap-2 text-white font-bold px-10 py-4 rounded-2xl text-base"
            >
              Create Free Account
            </Link>
          </div>
        </div>

        {/* Link grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-8 pb-14 border-b border-white/5">
          {/* Brand column */}
          <div className="col-span-2 sm:col-span-3 lg:col-span-1">
            <Link href="/" className="flex items-center gap-2.5 mb-5">
              <div className="w-9 h-9 rounded-xl btn-neon flex items-center justify-center">
                <Zap className="w-5 h-5 text-white" fill="white" />
              </div>
              <span className="text-xl font-black">
                Swift<span className="text-green-400">Bit</span>
              </span>
            </Link>
            <p className="text-sm text-gray-600 leading-relaxed mb-5 max-w-[220px]">
              The premium crypto banking platform. Secure. Fast. Reimagined.
            </p>
            <div className="flex gap-2.5">
              {socialIcons.map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="w-9 h-9 rounded-xl glass border border-white/8 flex items-center justify-center text-gray-600 hover:text-green-400 hover:border-green-500/30 transition-all"
                >
                  <Icon className="w-[15px] h-[15px]" />
                </a>
              ))}
            </div>
          </div>

          {/* Link columns */}
          {Object.entries(footerLinks).map(([cat, items]) => (
            <div key={cat}>
              <h4 className="text-xs font-bold uppercase tracking-widest text-white mb-5">{cat}</h4>
              <ul className="space-y-3">
                {items.map(item => (
                  <li key={item.label}>
                    <Link href={item.href} className="text-sm text-gray-600 hover:text-gray-300 transition-colors">
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 py-8 text-xs text-gray-700">
          <span>© 2024 SwiftBit Technologies Ltd. All rights reserved.</span>
          <div className="flex items-center gap-5">
            <span>🇺🇸 English (US)</span>
            <span>Regulated by FCA & MiCA</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
