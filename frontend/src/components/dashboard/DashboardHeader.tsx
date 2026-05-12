import { ShieldCheck, Plus } from 'lucide-react';
import { Button } from '../../ui/Button';

interface DashboardHeaderProps {
  userName: string;
}

export const DashboardHeader = ({ userName }: DashboardHeaderProps) => {
  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6">
      <div className="space-y-1">
        <p className="text-[11px] font-bold text-on-surface-variant/60 uppercase tracking-[0.2em]">
          System Overview
        </p>
        <h1 className="text-4xl font-display font-bold text-primary tracking-tight">
          Hello, {userName}
        </h1>
      </div>

      <div className="flex items-center gap-4 w-full md:w-auto">
        {/* Verification Cap Card */}
        <div className="flex-1 md:flex-none flex items-center gap-4 bg-white p-4 pr-10 rounded-sm border border-outline-variant shadow-sm">
          <div className="w-12 h-12 rounded-sm bg-primary flex items-center justify-center text-white">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <p className="text-[9px] font-bold text-on-surface-variant/60 uppercase tracking-widest">
              Verification Cap
            </p>
            <p className="text-xl font-display font-bold text-primary">
              Unlimited
            </p>
          </div>
        </div>

        {/* Action Button (Desktop only here, Mobile might handle differently) */}
        <div className="hidden md:block">
          <Button variant="primary" className="h-14 px-8 font-bold uppercase tracking-widest text-xs flex items-center gap-2 bg-[#006C4E] hover:bg-[#005a41]">
            <Plus className="w-4 h-4" />
            New Verification
          </Button>
        </div>
      </div>
    </div>
  );
};
