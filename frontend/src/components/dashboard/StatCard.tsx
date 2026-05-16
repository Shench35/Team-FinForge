import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  label: string;
  value: string | number;
  subtext: string;
  icon: LucideIcon;
  variant?: 'default' | 'success' | 'warning' | 'error';
  trend?: string;
}

export const StatCard = ({ label, value, subtext, icon: Icon, variant = 'default', trend }: StatCardProps) => {
  const variants = {
    default: 'text-primary bg-surface-container-high',
    success: 'text-secondary bg-secondary/10',
    warning: 'text-amber-600 bg-amber-50',
    error: 'text-error bg-error/10',
  };

  const borderColors = {
    default: 'border-outline-variant',
    success: 'border-secondary/20',
    warning: 'border-amber-200',
    error: 'border-error/20',
  };

  return (
    <div className={`bg-white p-6 rounded-sm border ${borderColors[variant]} shadow-sm space-y-4`}>
      <div className="flex justify-between items-start">
        <div className="space-y-1">
          {trend && (
            <p className="text-[10px] font-bold text-on-surface-variant/60 uppercase tracking-widest flex items-center gap-1">
              {trend}
            </p>
          )}
          <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">
            {label}
          </p>
        </div>
        <div className={`p-2 rounded-sm ${variants[variant]}`}>
          <Icon className="w-5 h-5" />
        </div>
      </div>
      
      <div className="space-y-1">
        <h3 className="text-3xl font-display font-bold text-primary tracking-tight">
          {value}
        </h3>
        <p className={`text-[10px] font-bold uppercase tracking-widest ${variant === 'default' ? 'text-on-surface-variant/60' : ''}`}>
          {subtext}
        </p>
      </div>
    </div>
  );
};
