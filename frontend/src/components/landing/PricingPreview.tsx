import { Check } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '../../ui/Button';
import { PLAN_PRICES, PLAN_DOC_FEATURES, PLAN_LABELS } from '../../utils/constants';

const plans = [
  {
    id: 'PRO',
    name: PLAN_LABELS.PRO,
    price: PLAN_PRICES.PRO,
    period: '/session',
    features: PLAN_DOC_FEATURES.PRO,
    buttonVariant: 'outlined' as const,
  },
  {
    id: 'PRO_MAX',
    name: PLAN_LABELS.PRO_MAX,
    price: PLAN_PRICES.PRO_MAX,
    period: '/session',
    features: PLAN_DOC_FEATURES.PRO_MAX,
    isPopular: true,
    buttonVariant: 'primary' as const,
  },
  {
    id: 'ENTERPRISE',
    name: PLAN_LABELS.ENTERPRISE,
    price: PLAN_PRICES.ENTERPRISE,
    period: '/session',
    features: PLAN_DOC_FEATURES.ENTERPRISE,
    buttonVariant: 'outlined' as const,
  },
];

export const PricingPreview = () => {
  return (
    <section className="bg-primary py-24 md:py-32 text-white overflow-hidden relative" id="pricing">
      {/* Decorative Grid */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '40px 40px' }} />

      <div className="max-w-container-max mx-auto px-6 relative z-10">
        <div className="text-center max-w-2xl mx-auto mb-20 space-y-4">
          <h2 className="text-4xl md:text-5xl font-display font-bold tracking-tight">
            Scalable verification plans
          </h2>
          <p className="text-white/60 text-lg">
            Choose the tier that fits your institutional or personal needs. 
            High volume discounts available for enterprise.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
          {plans.map((plan) => (
            <div 
              key={plan.id}
              className={`
                relative flex flex-col p-8 rounded-2xl border transition-all duration-300
                ${plan.isPopular 
                  ? 'bg-white text-primary border-white scale-105 z-10 shadow-2xl shadow-black/20' 
                  : 'bg-white/5 border-white/10 hover:border-white/20'
                }
              `}
            >
              {plan.isPopular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-secondary text-primary text-[10px] font-bold uppercase tracking-[0.2em] px-4 py-1 rounded-full shadow-lg">
                  Most Popular
                </div>
              )}

              <div className="mb-8">
                <p className={`text-xs font-bold uppercase tracking-widest mb-4 ${plan.isPopular ? 'text-secondary' : 'text-white/60'}`}>
                  {plan.name}
                </p>
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl md:text-5xl font-display font-bold tracking-tight">{plan.price}</span>
                  <span className={`text-sm font-medium ${plan.isPopular ? 'text-on-surface-variant' : 'text-white/40'}`}>{plan.period}</span>
                </div>
              </div>

              <ul className="space-y-4 mb-10 flex-1">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-3 text-sm">
                    <div className={`mt-0.5 w-4 h-4 rounded-full flex items-center justify-center shrink-0 ${plan.isPopular ? 'bg-secondary/20 text-secondary' : 'bg-white/10 text-white'}`}>
                      <Check className="w-3 h-3" />
                    </div>
                    <span className={plan.isPopular ? 'text-on-surface-variant font-medium' : 'text-white/80'}>
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>

              <Link to="/register">
                <Button 
                  variant={plan.buttonVariant} 
                  className={`w-full h-12 font-bold ${plan.isPopular ? 'bg-[#006C4E] text-white border-none hover:bg-[#005a41] hover:shadow-lg' : 'text-white border-white/20 hover:bg-white/10 hover:border-white'}`}
                >
                  Register
                </Button>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
