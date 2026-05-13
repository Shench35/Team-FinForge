import { DashboardLayout } from '../components/layout/DashboardLayout';
import { PublicNavbar } from '../components/layout/PublicNavbar';
import { Footer } from '../components/layout/Footer';
import { PlanCard } from '../components/dashboard/PlanCard';
import { ComparisonTable } from '../components/pricing/ComparisonTable';
import { FAQSection } from '../components/pricing/FAQSection';
import { useAuth } from '../hooks/useAuth';
import { Button } from '../ui/Button';

export default function Pricing({ isPublicOnly = false }: { isPublicOnly?: boolean }) {
  const { user } = useAuth();

  const content = (
    <div className="max-w-container-max mx-auto px-6 py-12 md:py-24">
      {/* Hero Section */}
      <div className="text-center space-y-6 mb-20">
        <div className="inline-block px-3 py-1 bg-secondary/10 rounded-full">
          <span className="text-[10px] font-bold text-secondary uppercase tracking-[0.2em]">Pricing transparency</span>
        </div>
        <h1 className="text-4xl md:text-5xl font-display font-bold text-primary">
          Simple, transparent pricing
        </h1>
        <p className="text-on-surface-variant max-w-xl mx-auto">
          Pay per verification session. No subscriptions. No hidden fees.
        </p>
      </div>

      {/* Plan Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-32">
        <PlanCard 
          plan="PRO" 
          onSelect={() => {}} 
        />
        <PlanCard 
          plan="PRO_MAX" 
          selected={user?.plan === 'PRO_MAX'}
          showPopularRibbon
          onSelect={() => {}} 
        />
        <PlanCard 
          plan="ENTERPRISE" 
          onSelect={() => {}} 
        />
      </div>

      {/* Detailed Comparison */}
      <ComparisonTable />

      {/* FAQs */}
      <FAQSection />

      {/* Final CTA */}
      <div className="mt-32 p-12 bg-primary rounded-sm text-center space-y-8 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-secondary to-transparent" />
        <div className="relative z-10 space-y-4">
          <h2 className="text-3xl font-display font-bold text-white">
            Ready to verify your first certificate?
          </h2>
          <p className="text-white/60 max-w-lg mx-auto text-sm">
            Join 500+ institutions using CertVerify for secure validation and institutional trust.
          </p>
          <div className="pt-4">
            <Button variant="primary" className="h-14 px-10 font-bold uppercase tracking-widest text-[10px] bg-secondary hover:bg-secondary/90">
              Get Started Free
            </Button>
          </div>
        </div>
      </div>
    </div>
  );

  // If public route, always show public layout
  if (isPublicOnly) {
    return (
      <div className="min-h-screen bg-surface">
        <PublicNavbar />
        <main>{content}</main>
        <Footer />
      </div>
    );
  }

  // If internal route (e.g. /plans), wrap in DashboardLayout
  return <DashboardLayout>{content}</DashboardLayout>;
}
