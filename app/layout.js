import './globals.css';
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
      </body>
    </html>
  );
}
