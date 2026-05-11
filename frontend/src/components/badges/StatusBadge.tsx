import { Badge } from '../../ui/Badge';
import { VERIFICATION_STATUS_CONFIG } from '../../utils/constants';

type StatusKey = keyof typeof VERIFICATION_STATUS_CONFIG;

interface StatusBadgeProps {
  status: StatusKey;
  size?: 'sm' | 'md';
  className?: string;
}

export const StatusBadge = ({ status, size = 'sm', className }: StatusBadgeProps) => {
  const config = VERIFICATION_STATUS_CONFIG[status];
  
  const colors = {
    gray: 'bg-gray-100 text-gray-700',
    blue: 'bg-blue-100 text-blue-700',
    amber: 'bg-amber-100 text-amber-700',
    green: 'bg-green-100 text-green-700',
    red: 'bg-red-100 text-red-700',
  };

  return (
    <Badge
      label={config.label}
      size={size}
      className={`${colors[config.color as keyof typeof colors]} ${'pulse' in config && config.pulse ? 'animate-pulse' : ''} ${className || ''}`}
    />
  );
};
