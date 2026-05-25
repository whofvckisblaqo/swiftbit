import './globals.css';
import Script from 'next/script';
import ToastContainer from '@/components/ui/Toast';

export const metadata = {
  title: 'SwiftBit — Secure. Fast. Crypto Banking Reimagined.',
  description: 'Buy, sell, swap, and manage your crypto portfolio with SwiftBit — the premium crypto banking platform trusted by 248,000+ traders.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="antialiased bg-[#07090d] text-white">
        {children}
        <ToastContainer />
        <Script id="smartsupp" strategy="afterInteractive">{`
          var _smartsupp = _smartsupp || {};
          _smartsupp.key = '6344c78da45213b07d5767dd645eae013b91595a';
          window.smartsupp||(function(d) {
            var s,c,o=smartsupp=function(){ o._.push(arguments)};o._=[];
            s=d.getElementsByTagName('script')[0];c=d.createElement('script');
            c.type='text/javascript';c.charset='utf-8';c.async=true;
            c.src='https://www.smartsuppchat.com/loader.js?';s.parentNode.insertBefore(c,s);
          })(document);
        `}</Script>
      </body>
    </html>
  );
}
