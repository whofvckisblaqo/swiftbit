import './globals.css';
import ToastContainer from '@/components/ui/Toast';
import Smartsupp from '@/components/Smartsupp';

export const metadata = {
  title: 'SwiftBit — Secure. Fast. crypto exchange Reimagined.',
  description: 'Buy, sell, swap, and manage your crypto portfolio with SwiftBit — the premium crypto exchange platform trusted by 248,000+ traders.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="antialiased bg-[#07090d] text-white">
        {children}
        <ToastContainer />
        <Smartsupp />
      </body>
    </html>
  );
}
