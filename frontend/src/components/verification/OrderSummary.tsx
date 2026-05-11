import { PLAN_LABELS, PLAN_PRICES } from "../../utils/constants";
import { Card } from "../../ui/Card";
import { Button } from "../../ui/Button";

interface OrderSummaryProps {
  planType: "PRO" | "PRO_MAX" | "ENTERPRISE";
  documentCount: number;
  onPayClick?: () => void;
}

export const OrderSummary = ({
  planType,
  documentCount,
  onPayClick,
}: OrderSummaryProps) => {
  const planLabel = PLAN_LABELS[planType];
  const planPrice = PLAN_PRICES[planType];

  return (
    <Card elevated className="sticky top-6 space-y-4 p-6">
      {/* Title */}
      <h3 className="font-semibold text-on-surface">Order Summary</h3>

      {/* Plan Row */}
      <div className="flex items-center justify-between border-b border-outline-variant pb-3">
        <span className="text-sm text-on-surface-variant">Plan</span>
        <span className="font-medium text-on-surface">{planLabel}</span>
      </div>

      {/* Documents Row */}
      <div className="flex items-center justify-between border-b border-outline-variant pb-3">
        <span className="text-sm text-on-surface-variant">Documents</span>
        <span className="font-medium text-on-surface">{documentCount}</span>
      </div>

      {/* Total Fee Row */}
      <div className="flex items-center justify-between pb-4">
        <span className="text-sm text-on-surface-variant">Total Fee</span>
        <span className="text-lg font-bold text-secondary">{planPrice}</span>
      </div>

      {/* CTA Button */}
      <Button
        type="button"
        variant="primary"
        className="w-full"
        size="lg"
        onClick={onPayClick}
        disabled={!onPayClick}
      >
        Pay with Squad
      </Button>

      {/* Trust Line */}
      <div className="flex items-center gap-2 text-xs text-on-surface-variant">
        <div className="flex h-4 w-4 items-center justify-center rounded-full bg-secondary/20">
          <span className="text-[10px] text-secondary">✓</span>
        </div>
        <span>
          Secured by Squad. CertVerify does not store your card details.
        </span>
      </div>
    </Card>
  );
};
