import { HeroSection } from '../components/landing/HeroSection';
import { StatsSection } from '../components/landing/StatsSection';
import { ProcessSection } from '../components/landing/ProcessSection';
import { PricingPreview } from '../components/landing/PricingPreview';
import { PublicNavbar } from '../components/layout/PublicNavbar';
import { Footer } from '../components/layout/Footer';


const Landing = () => {
  return (
    <div className="min-h-screen bg-white">
      <PublicNavbar />
      
      <main>
        {/* Hero */}
        <HeroSection />

        {/* Trust Stats */}
        <StatsSection />

        {/* Features / Process */}
        <ProcessSection />

        {/* Pricing */}
        <PricingPreview />

      </main>

      <Footer />
    </div>
  );
};

export default Landing;
