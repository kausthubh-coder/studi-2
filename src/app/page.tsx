import NavigationWrapper from "./components/navigation-wrapper";
import { Hero } from "./components/hero";
import { Features } from "./components/features";
import { Testimonials } from "./components/testimonials";
import { Pricing } from "./components/pricing";
import { CTA } from "./components/cta";
import { Footer } from "./components/footer";
import AuthCheckWrapper from "./components/auth/auth-check-wrapper";

export default function Home() {
  return (
    <main>
      <AuthCheckWrapper />
      <NavigationWrapper />
      <Hero />
      <Features />
      <Testimonials />
      <Pricing />
      <CTA />
      <Footer />
    </main>
  );
}



