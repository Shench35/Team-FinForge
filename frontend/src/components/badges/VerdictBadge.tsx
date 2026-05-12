import { VERDICT_CONFIG } from '../../utils/constants';

type VerdictType = keyof typeof VERDICT_CONFIG;

interface VerdictBadgeProps {
  verdict: VerdictType;
  className?: string;
}

export const VerdictBadge = ({ verdict, className = '' }: VerdictBadgeProps) => {
  const config = VERDICT_CONFIG[verdict];
  
  if (!config) return null;

  return (
    <span 
      className={`px-3 py-1 rounded-sm text-[10px] font-bold uppercase tracking-widest border border-current ${className}`}
      style={{ 
        color: config.color,
        backgroundColor: `${config.color}10` // 10% opacity
      }}
    >
      {config.label}
    </span>
  );
};
