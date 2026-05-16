import { Badge } from '../../ui/Badge';
import { PLAN_LABELS } from '../../utils/constants';

type PlanTier = keyof typeof PLAN_LABELS;

interface PlanBadgeProps {
  plan: PlanTier;
  size?: 'sm' | 'md';
  className?: string;
}

export const PlanBadge = ({ plan, size = 'sm', className }: PlanBadgeProps) => {
  const colors: Record<PlanTier, string> = {
    FREE: 'bg-gray-100 text-gray-700',
    PRO: 'bg-blue-100 text-blue-700',
    PRO_MAX: 'bg-purple-100 text-purple-700',
    ENTERPRISE: 'bg-green-100 text-green-700',
  };

  return (
    <Badge
      label={PLAN_LABELS[plan]}
      size={size}
      className={`${colors[plan]} ${className || ''}`}
    />
  );
};
