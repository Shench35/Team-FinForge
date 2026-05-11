import { Building2, Clock, Brain } from 'lucide-react';

const stats = [
  {
    icon: Building2,
    value: '500+',
    label: 'Organizations',
  },
  {
    icon: Clock,
    value: 'Under 2m',
    label: 'Verification Time',
  },
  {
    icon: Brain,
    value: 'AI-Powered',
    label: 'Fraud Detection',
  },
];

export const StatsSection = () => {
  return (
    <section className="bg-surface py-12 md:py-16 border-y border-outline-variant">
      <div className="max-w-container-max mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {stats.map((stat) => (
            <div 
              key={stat.label} 
              className="bg-white p-6 rounded-xl border border-outline-variant shadow-sm flex items-center gap-5 group hover:border-secondary transition-colors"
            >
              <div className="w-12 h-12 rounded-lg bg-surface-container-high flex items-center justify-center text-primary group-hover:bg-secondary group-hover:text-white transition-all">
                <stat.icon className="w-6 h-6" />
              </div>
              <div>
                <p className="text-2xl font-display font-bold text-primary tracking-tight">
                  {stat.value}
                </p>
                <p className="text-xs font-bold text-on-surface-variant uppercase tracking-widest">
                  {stat.label}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
