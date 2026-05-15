import { ShieldCheck, ExternalLink, ArrowRight } from 'lucide-react';
import { Button } from '../../ui/Button';
import { Card } from '../../ui/Card';
import { PLAN_PRICES, PLAN_LABELS } from '../../utils/constants';

interface PaymentGateProps {
  planType: 'FREE' | 'PRO' | 'PRO_MAX' | 'ENTERPRISE';
  documentCount: number;
  paymentUrl: string;
  onPaymentInitiated?: () => void;
  onClose?: () => void;
}

export const PaymentGate = ({ 
  planType, 
  documentCount, 
  paymentUrl, 
  onPaymentInitiated,
}: PaymentGateProps) => {
  const price = PLAN_PRICES[planType];
  const label = PLAN_LABELS[planType];

  const handleSameTabPay = () => {
    // This will redirect the user away, but we saved the file to IndexedDB already
    window.location.assign(paymentUrl);
  };

  return (
    <div className="max-w-2xl mx-auto py-12 px-4">
      <Card className="p-8 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="flex items-center gap-4 border-b border-outline-variant pb-6">
          <div className="w-16 h-16 rounded-full bg-secondary/10 flex items-center justify-center">
            <ShieldCheck className="w-8 h-8 text-secondary" />
          </div>
          <div className="space-y-1">
            <h2 className="text-2xl font-bold text-on-surface">Secure Payment Required</h2>
            <p className="text-on-surface-variant text-sm">
              Complete payment to unlock your {label} analysis.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 rounded-xl bg-surface-container-low border border-outline-variant">
            <p className="text-[10px] font-bold text-on-surface-variant/60 uppercase tracking-widest mb-1">Items</p>
            <p className="font-bold text-on-surface">{documentCount} Document</p>
          </div>
          <div className="p-4 rounded-xl bg-surface-container-low border border-outline-variant text-right">
            <p className="text-[10px] font-bold text-on-surface-variant/60 uppercase tracking-widest mb-1">Total Due</p>
            <p className="text-xl font-display font-bold text-primary">{price}</p>
          </div>
        </div>

        <div className="space-y-4 pt-4">
          <Button 
            variant="primary" 
            size="lg" 
            className="w-full h-14 text-lg font-bold bg-secondary hover:bg-secondary/90 shadow-lg shadow-secondary/20"
            onClick={handleSameTabPay}
          >
            Pay with Squad
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>

          <div className="flex items-center gap-4 py-2">
            <div className="flex-1 h-px bg-outline-variant" />
            <span className="text-[10px] font-bold text-on-surface-variant/40 uppercase tracking-widest">Or</span>
            <div className="flex-1 h-px bg-outline-variant" />
          </div>

          <div className="bg-surface-container-highest/50 rounded-xl p-6 border border-outline-variant/50">
            <p className="text-xs text-on-surface-variant mb-6 text-center">
              If you have already completed your payment in another window, click the button below to proceed.
            </p>

            <div className="flex flex-col sm:flex-row gap-3">
               <Button 
                variant="outlined" 
                className="flex-1 h-12 font-bold text-[11px] uppercase tracking-wider border-outline-variant"
                onClick={() => window.open(paymentUrl, '_blank')}
              >
                <ExternalLink className="w-4 h-4 mr-2" />
                Pay in New Tab
              </Button>
              <Button 
                variant="primary" 
                className="flex-1 h-12 font-bold text-[11px] uppercase tracking-wider"
                onClick={onPaymentInitiated}
              >
                I have paid
              </Button>
            </div>
          </div>
        </div>

        <p className="text-[10px] text-center text-on-surface-variant/60 italic">
          Secure payment processed by Squad. Your document remains safe in your browser session.
        </p>
      </Card>
    </div>
  );
};
