import { Filter, Download } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { VerificationRow } from './VerificationRow';
import { Button } from '../../ui/Button';

interface HistoryTableProps {
  historyItems: any[];
  totalCount: number;
}

export const HistoryTable = ({ historyItems, totalCount }: HistoryTableProps) => {
  const navigate = useNavigate();

  return (
    <div className="bg-white rounded-sm border border-outline-variant shadow-sm overflow-hidden">
      {/* Table Header Controls */}
      <div className="flex justify-between items-center px-6 py-4 border-b border-outline-variant">
        <h3 className="text-[11px] font-bold text-primary uppercase tracking-[0.2em]">
          Recent Verification History
        </h3>
        <div className="flex items-center gap-2">
          <Button variant="outlined" size="sm" className="h-9 w-9 p-0 flex items-center justify-center opacity-40 cursor-not-allowed" title="Coming Soon" disabled>
            <Filter className="w-4 h-4" />
          </Button>
          <Button variant="outlined" size="sm" className="h-9 w-9 p-0 flex items-center justify-center opacity-40 cursor-not-allowed" title="Coming Soon" disabled>
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
        {historyItems.length > 0 ? (
          historyItems.map((item) => (
            <VerificationRow key={item.id} {...item} />
          ))
        ) : (
          <div className="p-12 text-center">
            <p className="text-sm text-on-surface-variant">No verification history found.</p>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="flex justify-between items-center px-6 py-4 bg-[#F8FAFC]">
        <p className="text-[10px] font-bold text-on-surface-variant/60 uppercase tracking-widest">
          Showing {historyItems.length} of {totalCount.toLocaleString()} verifications
        </p>
        {historyItems.length > 0 && (
          <Button 
            variant="outlined" 
            size="sm" 
            className="h-9 font-bold px-6 uppercase tracking-widest text-[10px]"
            onClick={() => navigate('/history')}
          >
            View All
          </Button>
        )}
      </div>
    </div>
  );
};
