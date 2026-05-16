import { FileText, CreditCard, ShieldCheck } from 'lucide-react';

const steps = [
  {
    icon: FileText,
    title: 'Upload Certificate',
    description: 'Drop any academic document. Our AI reads and parses the metadata instantly.',
  },
  {
    icon: CreditCard,
    title: 'Pay via Squad',
    description: 'Secure, one-click payment processing for immediate verification processing.',
  },
  {
    icon: ShieldCheck,
    title: 'Get Trust Score',
    description: 'Receive a detailed report with a clear authenticity score and institutional links.',
  },
];

export const ProcessSection = () => {
  return (
    <section className="py-24 md:py-32 bg-white" id="features">
      <div className="max-w-container-max mx-auto px-6 text-center">
        <p className="text-[10px] font-bold text-secondary uppercase tracking-[0.2em] mb-4">Process</p>
        <h2 className="text-4xl md:text-5xl font-display font-bold text-primary mb-20 tracking-tight">
          Three steps to total certainty
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-16 relative">
          {/* Connector Line (Desktop) */}
          <div className="hidden md:block absolute top-10 left-[15%] right-[15%] h-px bg-outline-variant -z-10 border-dashed border-t" />

          {steps.map((step, index) => (
            <div key={step.title} className="space-y-6 group">
              <div className="w-20 h-20 mx-auto rounded-2xl bg-white border border-outline-variant shadow-md flex items-center justify-center text-primary group-hover:scale-110 group-hover:border-secondary group-hover:shadow-lg transition-all duration-300">
                <step.icon className="w-10 h-10 group-hover:text-secondary transition-colors" />
                
                {/* Step Number Badge */}
                <div className="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-surface-container-high border border-outline-variant flex items-center justify-center text-xs font-bold">
                  {index + 1}
                </div>
              </div>
              <div className="space-y-3">
                <h3 className="text-xl font-display font-bold text-primary">{step.title}</h3>
                <p className="text-on-surface-variant leading-relaxed text-sm max-w-[280px] mx-auto">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
