import { Navigation } from './components/navigation';
import { Hero } from './components/hero';
import { Features } from './components/features';
import { Testimonials } from './components/testimonials';
import { Pricing } from './components/pricing';
import { CTA } from './components/cta';
import { Footer } from './components/footer';
import { AuthCheck } from './components/auth/auth-check';

export default function Home() {
  return (
    <main>
      <AuthCheck />
      <Navigation />
      <Hero />
      <Features />
      <Testimonials />
      <Pricing />
      <CTA />
      <Footer />
    </main>
  );
}
