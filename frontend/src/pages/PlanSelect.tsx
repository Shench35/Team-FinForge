import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Check, Info } from 'lucide-react';
import { PublicNavbar } from '../components/layout/PublicNavbar';
import { Footer } from '../components/layout/Footer';
import { Button } from '../ui/Button';
import { useAuth } from '../hooks/useAuth';
import { authApi } from '../api/auth';
import { PLAN_PRICES, PLAN_DOC_FEATURES, PLAN_LABELS } from '../utils/constants';

const plans = [
  {
    id: 'PRO',
    tagline: 'STANDARD ACCESS',
    price: PLAN_PRICES.PRO,
    features: PLAN_DOC_FEATURES.PRO,
    buttonVariant: 'outlined' as const,
  },
  {
    id: 'PRO_MAX',
    tagline: 'ENHANCED SECURITY',
    price: PLAN_PRICES.PRO_MAX,
    features: PLAN_DOC_FEATURES.PRO_MAX,
    isPopular: true,
    buttonVariant: 'primary' as const,
  },
  {
    id: 'ENTERPRISE',
    tagline: 'INSTITUTIONAL',
    price: PLAN_PRICES.ENTERPRISE,
    features: PLAN_DOC_FEATURES.ENTERPRISE,
    buttonVariant: 'outlined' as const,
  },
];

const PlanSelect = () => {
  const [loading, setLoading] = useState<string | null>(null);
  const { updateUser } = useAuth();
  const navigate = useNavigate();

  const handleSelectPlan = async (planId: string) => {
    setLoading(planId);
    try {
      const updatedUser = await authApi.updatePlan(planId);
      updateUser(updatedUser);
      navigate('/dashboard');
    } catch (error) {
      console.error('Failed to update plan:', error);
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <PublicNavbar />
      
      <main className="flex-1 py-20 px-6">
        <div className="max-w-container-max mx-auto">
          {/* Header */}
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
            <h1 className="text-4xl md:text-5xl font-display font-bold text-primary tracking-tight">
              Choose your verification plan
            </h1>
            <p className="text-on-surface-variant text-lg">
              Select the professional tier that best fits your document verification volume 
              and organizational requirements.
            </p>
          </div>

          {/* Pricing Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch mb-12">
            {plans.map((plan) => (
              <div 
                key={plan.id}
                className={`
                  relative flex flex-col p-8 rounded-sm border transition-all duration-300
                  ${plan.isPopular 
                    ? 'border-secondary border-2 ring-1 ring-secondary/20 shadow-xl' 
                    : 'border-outline-variant hover:border-outline'
                  }
                `}
              >
                {plan.isPopular && (
                  <div className="absolute -top-3.5 right-4 bg-[#006C4E] text-white text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-sm">
                    Most Popular
                  </div>
                )}

                <div className="mb-8">
                  <p className="text-[10px] font-bold text-on-surface-variant/60 uppercase tracking-widest mb-4">
                    {plan.tagline}
                  </p>
                  <h3 className="text-2xl font-display font-bold text-primary mb-2">
                    {PLAN_LABELS[plan.id as keyof typeof PLAN_LABELS]}
                  </h3>
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl font-display font-bold text-primary">{plan.price}</span>
                    <span className="text-xs font-medium text-on-surface-variant">/session</span>
                  </div>
                </div>

                <ul className="space-y-4 mb-10 flex-1">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-3 text-sm">
                      <div className="mt-0.5 w-5 h-5 rounded-full bg-secondary/10 text-secondary flex items-center justify-center shrink-0">
                        <Check className="w-3 h-3" />
                      </div>
                      <span className="text-on-surface-variant font-medium">
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>

                <Button 
                  variant={plan.id === 'PRO_MAX' ? 'primary' : 'outlined'} 
                  className={`w-full h-12 font-bold uppercase tracking-widest text-xs border-outline ${plan.id === 'PRO_MAX' ? 'bg-[#006C4E] hover:bg-[#005a41]' : ''}`}
                  onClick={() => handleSelectPlan(plan.id)}
                  loading={loading === plan.id}
                >
                  Select Plan
                </Button>
              </div>
            ))}
          </div>

          {/* Info Box */}
          <div className="max-w-xl mx-auto bg-surface p-4 rounded-sm border border-outline-variant flex items-center justify-center gap-3 text-xs font-medium text-on-surface-variant mb-20">
            <Info className="w-4 h-4 text-primary/40" />
            <p>You can change your plan anytime from your dashboard</p>
          </div>

          {/* Social Proof Section */}
          <div className="bg-[#F8FAFC] rounded-lg border border-outline-variant p-12 text-center relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-white/80 via-transparent to-white/80" />
            <div className="relative z-10 space-y-6">
              <h2 className="text-2xl font-display font-bold text-primary">Trusted by 50+ Institutions</h2>
              <p className="text-on-surface-variant max-w-xl mx-auto leading-relaxed">
                Our enterprise-grade security ensures that your document verifications are handled 
                with the highest level of cryptographic precision.
              </p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default PlanSelect;
