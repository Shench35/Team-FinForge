import { FileText, CheckCircle2, AlertTriangle, XCircle } from 'lucide-react';
import { StatCard } from './StatCard';

interface QuickStatsProps {
  stats: {
    total: number | string;
    authentic: number | string;
    suspicious: number | string;
    highRisk: number | string;
  };
}

export const QuickStats = ({ stats }: QuickStatsProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <StatCard 
        label="Total Verifications"
        value={stats.total}
        subtext="TOTAL VERIFICATIONS"
        trend={stats.total === 0 ? undefined : "+12% vs last month"}
        icon={FileText}
        variant="default"
      />
      <StatCard 
        label="Likely Authentic"
        value={stats.authentic}
        subtext={stats.total === 0 ? "0% Rate" : "85.8% Rate"}
        icon={CheckCircle2}
        variant="success"
      />
      <StatCard 
        label="Suspicious"
        value={stats.suspicious}
        subtext="Manual Review"
        icon={AlertTriangle}
        variant="warning"
      />
      <StatCard 
        label="High Risk"
        value={stats.highRisk}
        subtext="Critical Alert"
        icon={XCircle}
        variant="error"
      />
    </div>
  );
};
