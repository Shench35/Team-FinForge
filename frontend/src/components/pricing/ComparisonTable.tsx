import { Check, X } from 'lucide-react';

const features = [
  { name: "Document Limit", pro: "3 per session", proMax: "5 per session", enterprise: "7 per session" },
  { name: "Processing Speed", pro: "Standard", proMax: "Instant", enterprise: "Priority", highlight: "enterprise" },
  { name: "Report Type", pro: "Basic PDF", proMax: "Detailed Analytics", enterprise: "Full Forensic Audit" },
  { name: "Batch Support", pro: false, proMax: true, enterprise: true },
];

export const ComparisonTable = () => {
  return (
    <div className="max-w-5xl mx-auto mt-24 mb-32">
      <h2 className="text-2xl font-display font-bold text-primary text-center mb-12">
        Compare detailed plans
      </h2>
      <div className="overflow-hidden border border-outline-variant rounded-sm bg-white shadow-sm">
        <div className="grid grid-cols-4 bg-surface-container-low border-b border-outline-variant">
          <div className="px-6 py-4 text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Features</div>
          <div className="px-6 py-4 text-[10px] font-bold text-on-surface-variant uppercase tracking-widest text-center">Pro</div>
          <div className="px-6 py-4 text-[10px] font-bold text-on-surface-variant uppercase tracking-widest text-center">Pro Max</div>
          <div className="px-6 py-4 text-[10px] font-bold text-on-surface-variant uppercase tracking-widest text-center">Enterprise</div>
        </div>
        <div className="divide-y divide-outline-variant">
          {features.map((feature, i) => (
            <div key={i} className="grid grid-cols-4 items-center">
              <div className="px-6 py-5 text-sm font-bold text-primary bg-surface/30">{feature.name}</div>
              <div className="px-6 py-5 text-sm text-center text-on-surface-variant">
                {typeof feature.pro === 'boolean' ? (
                  feature.pro ? <Check className="w-5 h-5 mx-auto text-secondary" /> : <X className="w-5 h-5 mx-auto text-on-surface-variant/20" />
                ) : feature.pro}
              </div>
              <div className="px-6 py-5 text-sm text-center text-on-surface-variant">
                {typeof feature.proMax === 'boolean' ? (
                  feature.proMax ? <Check className="w-5 h-5 mx-auto text-secondary" /> : <X className="w-5 h-5 mx-auto text-on-surface-variant/20" />
                ) : feature.proMax}
              </div>
              <div className={feature.highlight === 'enterprise' ? "px-6 py-5 text-sm text-center font-bold text-secondary" : "px-6 py-5 text-sm text-center text-on-surface-variant"}>
                {typeof feature.enterprise === 'boolean' ? (
                  feature.enterprise ? <Check className="w-5 h-5 mx-auto text-secondary" /> : <X className="w-5 h-5 mx-auto text-on-surface-variant/20" />
                ) : feature.enterprise}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
