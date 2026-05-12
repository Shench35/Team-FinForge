import { Filter, Download } from 'lucide-react';
import { VerificationRow } from './VerificationRow';
import { Button } from '../../ui/Button';

const SAMPLE_HISTORY = [
  {
    id: '1',
    fileName: 'BSc_Computer_Science_Lagos_Uni.pdf',
    date: 'Oct 12, 2023',
    plan: 'PRO_MAX' as const,
    status: 'COMPLETED' as const,
    trustScore: 98,
    verdict: 'LIKELY_AUTHENTIC' as const,
  },
  {
    id: '2',
    fileName: 'Diploma_Engineering_YabaTech.pdf',
    date: 'Oct 11, 2023',
    plan: 'PRO_MAX' as const,
    status: 'PROCESSING' as const,
  },
  {
    id: '3',
    fileName: 'Master_Business_Admin_UI.pdf',
    date: 'Oct 10, 2023',
    plan: 'PRO' as const,
    status: 'FAILED' as const,
    trustScore: 12,
    verdict: 'HIGH_RISK' as const,
  },
  {
    id: '4',
    fileName: 'Certification_Project_Mgmt.pdf',
    date: 'Oct 09, 2023',
    plan: 'PRO_MAX' as const,
    status: 'PENDING_PAYMENT' as const,
    verdict: 'SUSPICIOUS' as const,
  },
];

export const HistoryTable = () => {
  return (
    <div className="bg-white rounded-sm border border-outline-variant shadow-sm overflow-hidden">
      {/* Table Header Controls */}
      <div className="flex justify-between items-center px-6 py-4 border-b border-outline-variant">
        <h3 className="text-[11px] font-bold text-primary uppercase tracking-[0.2em]">
          Recent Verification History
        </h3>
        <div className="flex items-center gap-2">
          <Button variant="outlined" size="sm" className="h-9 w-9 p-0 flex items-center justify-center">
            <Filter className="w-4 h-4" />
          </Button>
          <Button variant="outlined" size="sm" className="h-9 w-9 p-0 flex items-center justify-center">
            <Download className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Column Headers - Desktop Only */}
      <div className="hidden md:grid grid-cols-6 px-4 py-4 bg-[#F8FAFC] border-b border-outline-variant">
        <div className="col-span-2 text-[10px] font-bold text-on-surface-variant/60 uppercase tracking-widest">File Name</div>
        <div className="text-[10px] font-bold text-on-surface-variant/60 uppercase tracking-widest">Plan Used</div>
        <div className="text-[10px] font-bold text-on-surface-variant/60 uppercase tracking-widest">Status</div>
        <div className="text-[10px] font-bold text-on-surface-variant/60 uppercase tracking-widest text-center">Trust Score</div>
        <div className="text-[10px] font-bold text-on-surface-variant/60 uppercase tracking-widest text-right">Verdict</div>
      </div>

      {/* Rows */}
      <div className="divide-y divide-outline-variant">
        {SAMPLE_HISTORY.map((item) => (
          <VerificationRow key={item.id} {...item} />
        ))}
      </div>

      {/* Pagination Footer */}
      <div className="flex justify-between items-center px-6 py-4 bg-[#F8FAFC]">
        <p className="text-[10px] font-bold text-on-surface-variant/60 uppercase tracking-widest">
          Showing 4 of 1,284 verifications
        </p>
        <div className="flex items-center gap-2">
          <Button variant="outlined" size="sm" className="h-9 font-bold px-4 uppercase tracking-widest text-[10px]">
            Previous
          </Button>
          <Button variant="outlined" size="sm" className="h-9 font-bold px-4 uppercase tracking-widest text-[10px]">
            Next
          </Button>
        </div>
      </div>
    </div>
  );
};
