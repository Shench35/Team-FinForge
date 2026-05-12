import { FileText, CheckCircle2, AlertTriangle, XCircle } from 'lucide-react';
import { StatCard } from './StatCard';

export const QuickStats = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <StatCard 
        label="Total Verifications"
        value="1,284"
        subtext="TOTAL VERIFICATIONS"
        trend="+12% vs last month"
        icon={FileText}
        variant="default"
      />
      <StatCard 
        label="Likely Authentic"
        value="1,102"
        subtext="85.8% Rate"
        icon={CheckCircle2}
        variant="success"
      />
      <StatCard 
        label="Suspicious"
        value="142"
        subtext="Manual Review"
        icon={AlertTriangle}
        variant="warning"
      />
      <StatCard 
        label="High Risk"
        value="40"
        subtext="Critical Alert"
        icon={XCircle}
        variant="error"
      />
    </div>
  );
};
