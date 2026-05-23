import Navbar from '@/components/landing/Navbar';
import Hero from '@/components/landing/Hero';
import Features from '@/components/landing/Features';
import Markets from '@/components/landing/Markets';
import Security from '@/components/landing/Security';
import Testimonials from '@/components/landing/Testimonials';
import FAQ from '@/components/landing/FAQ';
import Footer from '@/components/landing/Footer';

export default function Home() {
  return (
    <main>
      <Navbar />
      <Hero />
      <Features />
      <Markets />
      <Security />
      <Testimonials />
      <FAQ />
      <Footer />
    </main>
  );
}
