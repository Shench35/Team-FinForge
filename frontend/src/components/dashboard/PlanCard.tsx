import { Check } from 'lucide-react';
import { Button } from '../../ui/Button';
import { PLAN_PRICES, PLAN_DOC_FEATURES, PLAN_LABELS } from '../../utils/constants';

interface PlanCardProps {
  plan: 'PRO' | 'PRO_MAX' | 'ENTERPRISE';
  selected?: boolean;
  onSelect: (plan: string) => void;
  showPopularRibbon?: boolean;
  loading?: boolean;
}

const planMetadata = {
  PRO: {
    tagline: 'STANDARD',
    buttonVariant: 'outlined' as const,
  },
  PRO_MAX: {
    tagline: 'RECOMMENDED',
    buttonVariant: 'primary' as const,
  },
  ENTERPRISE: {
    tagline: 'SCALE',
    buttonVariant: 'outlined' as const,
  }
};

export const PlanCard = ({ plan, selected, onSelect, showPopularRibbon, loading }: PlanCardProps) => {
  const metadata = planMetadata[plan];
  const features = PLAN_DOC_FEATURES[plan];
  const price = PLAN_PRICES[plan];
  const label = PLAN_LABELS[plan];

  return (
    <div 
      className={`
        relative flex flex-col p-8 rounded-sm border transition-all duration-300 bg-white
        ${showPopularRibbon 
          ? 'border-secondary border-2 ring-1 ring-secondary/20 shadow-xl' 
          : 'border-outline-variant hover:border-outline'
        }
      `}
    >
      {showPopularRibbon && (
        <div className="absolute -top-3.5 right-4 bg-[#006C4E] text-white text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-sm">
          Most Popular
        </div>
      )}

      <div className="mb-8">
        <p className="text-[10px] font-bold text-on-surface-variant/60 uppercase tracking-widest mb-4">
          {metadata.tagline}
        </p>
        <h3 className="text-2xl font-display font-bold text-primary mb-2">
          {label}
        </h3>
        <div className="flex items-baseline gap-1">
          <span className="text-3xl font-display font-bold text-primary">{price}</span>
          <span className="text-xs font-medium text-on-surface-variant">/session</span>
        </div>
      </div>

      <div className="flex-1 space-y-4 mb-10">
        {features.map((feature, i) => (
          <div key={i} className="flex items-start gap-3">
            <div className="mt-1 w-4 h-4 rounded-full bg-secondary/10 flex items-center justify-center flex-shrink-0">
              <Check className="w-2.5 h-2.5 text-secondary" />
            </div>
            <span className="text-sm text-on-surface-variant leading-tight">
              {feature}
            </span>
          </div>
        ))}
      </div>

      <Button 
        variant={metadata.buttonVariant} 
        className={`w-full h-12 font-bold uppercase tracking-widest text-[10px] ${selected ? 'opacity-50 pointer-events-none' : ''}`}
        onClick={() => onSelect(plan)}
        loading={loading}
      >
        {selected ? 'Active Plan' : plan === 'ENTERPRISE' ? 'Contact Sales' : `Select ${label}`}
      </Button>
    </div>
  );
};


