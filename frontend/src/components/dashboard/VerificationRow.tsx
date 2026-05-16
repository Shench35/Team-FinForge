import { FileText } from 'lucide-react';
import { PlanBadge } from '../badges/PlanBadge';
import { StatusBadge } from '../badges/StatusBadge';
import { VerdictBadge } from '../badges/VerdictBadge';

interface VerificationRowProps {
  fileName: string;
  date: string;
  plan: 'PRO' | 'PRO_MAX' | 'ENTERPRISE';
  status: 'PENDING_PAYMENT' | 'PAYMENT_CONFIRMED' | 'PROCESSING' | 'COMPLETED' | 'FAILED';
  trustScore?: number;
  verdict?: 'LIKELY_AUTHENTIC' | 'SUSPICIOUS' | 'HIGH_RISK';
}

export const VerificationRow = ({ 
  fileName, 
  date, 
  plan, 
  status, 
  trustScore, 
  verdict 
}: VerificationRowProps) => {
  return (
    <>
      {/* Desktop View (Table Row) */}
      <div className="hidden md:grid grid-cols-6 items-center py-6 px-4 border-b border-outline-variant hover:bg-surface transition-colors">
        <div className="col-span-2 flex items-center gap-4">
          <div className="w-10 h-10 rounded-sm bg-surface-container-high flex items-center justify-center text-primary/40">
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <p className="text-sm font-bold text-primary truncate max-w-[200px]">
              {fileName}
            </p>
            <p className="text-[10px] font-bold text-on-surface-variant/60 uppercase tracking-widest mt-0.5">
              {date}
            </p>
          </div>
        </div>

        <div className="flex justify-start">
          <PlanBadge plan={plan} />
        </div>

        <div className="flex justify-start">
          <StatusBadge status={status} size="sm" />
        </div>

        <div className="text-center">
          {trustScore ? (
            <p className="text-sm font-bold text-primary">
              {trustScore}<span className="text-on-surface-variant/40">/100</span>
            </p>
          ) : (
            <p className="text-sm font-bold text-on-surface-variant/20">--</p>
          )}
        </div>

        <div className="flex justify-end">
          {verdict ? (
            <VerdictBadge verdict={verdict} />
          ) : (
            <p className="text-sm font-bold text-on-surface-variant/20">--</p>
          )}
        </div>
      </div>

      {/* Mobile View (Card) */}
      <div className="md:hidden p-5 border-b border-outline-variant space-y-4">
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-sm bg-surface-container-high flex items-center justify-center text-primary/40">
              <FileText className="w-4 h-4" />
            </div>
            <div>
              <p className="text-sm font-bold text-primary truncate max-w-[180px]">{fileName}</p>
              <p className="text-[10px] font-bold text-on-surface-variant/40 uppercase tracking-widest">{date}</p>
            </div>
          </div>
          <StatusBadge status={status} size="sm" />
        </div>
        
        <div className="flex justify-between items-center pt-2 border-t border-dashed border-outline-variant">
          <div className="flex flex-col gap-1">
            <span className="text-[9px] font-bold text-on-surface-variant/40 uppercase tracking-widest">Verdict</span>
            {verdict ? <VerdictBadge verdict={verdict} /> : <span className="text-xs font-bold text-on-surface-variant/20">PENDING</span>}
          </div>
          <div className="text-right flex flex-col gap-1">
            <span className="text-[9px] font-bold text-on-surface-variant/40 uppercase tracking-widest">Trust Score</span>
            <p className="text-sm font-bold text-primary">{trustScore || '--'}</p>
          </div>
        </div>
      </div>
    </>
  );
};
