import { ShieldCheck } from 'lucide-react';
import { Button } from '../../ui/Button';

export const SecurityAuditBanner = () => {
  return (
    <div className="mt-12 bg-[#0F172A] rounded-sm p-10 text-white flex flex-col md:flex-row justify-between items-center gap-8 relative overflow-hidden group">
      {/* Background Glow */}
      <div className="absolute top-0 right-0 w-1/3 h-full bg-primary/20 blur-[100px] -mr-20 pointer-events-none" />
      
      <div className="relative z-10 max-w-2xl space-y-6">
        <h2 className="text-3xl font-display font-bold">Automated Security Audits</h2>
        <p className="text-white/60 text-lg leading-relaxed">
          Our blockchain-backed verification system ensures 99.9% accuracy. 
          For institutions requiring deeper forensic analysis, upgrade to our 
          Enterprise Protocol.
        </p>
        <Button variant="primary" className="h-12 px-8 font-bold uppercase tracking-widest text-[10px] bg-[#006C4E] hover:bg-[#005a41] border-none">
          Request Forensic Audit
        </Button>
      </div>

      <div className="relative z-10 shrink-0">
        <div className="w-48 h-48 bg-white/5 rounded-sm flex items-center justify-center border border-white/10 group-hover:border-white/20 transition-colors">
          <ShieldCheck className="w-24 h-24 text-secondary/40" />
        </div>
      </div>
    </div>
  );
};
