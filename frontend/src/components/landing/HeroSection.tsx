import { Link } from 'react-router-dom';
import { ArrowRight, QrCode } from 'lucide-react';
import { Button } from '../../ui/Button';
import { StatusBadge } from '../badges/StatusBadge';

export const HeroSection = () => {
  return (
    <section className="relative pt-20 pb-24 md:pt-32 md:pb-40 overflow-hidden bg-white">
      <div className="max-w-container-max mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        
        {/* Left: Text Content */}
        <div className="space-y-8 animate-in fade-in slide-in-from-left duration-700">
          <h1 className="text-5xl md:text-7xl font-display font-bold text-primary leading-[1.1] tracking-tight">
            One upload. One payment. <span className="text-secondary">One clear answer.</span>
          </h1>
          <p className="text-lg md:text-xl text-on-surface-variant leading-relaxed max-w-xl">
            AI-powered academic certificate verification for high-stakes hiring and admissions. 
            Instantly validate credentials with Institutional rigor.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link to="/register">
              <Button variant="primary" size="lg" className="h-14 px-8 text-lg gap-2">
                Start Verifying <ArrowRight className="w-5 h-5" />
              </Button>
            </Link>
          </div>
        </div>

        {/* Right: Visual Mockup */}
        <div className="relative animate-in fade-in slide-in-from-right duration-1000">
          <div className="relative z-10 bg-white rounded-2xl border border-outline-variant shadow-2xl p-6 md:p-8 max-w-md mx-auto">
            <div className="flex justify-between items-start mb-8">
              <div className="space-y-1">
                <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Certificate Status</p>
                <StatusBadge status="COMPLETED" size="md" />
              </div>
              <div className="text-right space-y-1">
                <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Trust Score</p>
                <p className="text-3xl font-display font-bold text-secondary">98/100</p>
              </div>
            </div>

            <div className="space-y-4 mb-8">
              <div className="h-4 bg-surface-container-low rounded-full w-full" />
              <div className="h-4 bg-surface-container-low rounded-full w-3/4" />
              <div className="h-4 bg-surface-container-low rounded-full w-5/6" />
            </div>

            <div className="pt-6 border-t border-outline-variant flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded bg-primary/5 flex items-center justify-center">
                  <div className="w-6 h-6 bg-primary rounded-sm opacity-20" />
                </div>
                <div>
                  <p className="text-sm font-bold text-primary">University of Technology</p>
                  <p className="text-xs text-on-surface-variant font-medium">B.Sc Computer Science</p>
                </div>
              </div>
              <QrCode className="w-6 h-6 text-on-surface-variant/40" />
            </div>
          </div>
          
          {/* Decorative Background Elements */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[140%] h-[140%] bg-secondary/5 rounded-full blur-3xl -z-10" />
        </div>
      </div>
    </section>
  );
};
