import { useMemo, useState } from "react";
import { Card } from "../../ui/Card";
import { Button } from "../../ui/Button";
import { Alert } from "../../ui/Alert";
import { PLAN_LABELS, PLAN_PRICES } from "../../utils/constants";

interface PaymentGateProps {
  planType: "PRO" | "PRO_MAX" | "ENTERPRISE";
  documentCount: number;
  paymentUrl: string;
  onPaymentInitiated?: () => void;
}

export const PaymentGate = ({
  planType,
  documentCount,
  paymentUrl,
  onPaymentInitiated,
}: PaymentGateProps) => {
  const [error, setError] = useState<string | null>(null);
  const planLabel = PLAN_LABELS[planType];
  const planPrice = PLAN_PRICES[planType];

  const safePaymentUrl = useMemo(() => {
    try {
      const parsedUrl = new URL(paymentUrl, window.location.origin);
      return parsedUrl.protocol === "https:" ? parsedUrl.toString() : null;
    } catch {
      return null;
    }
  }, [paymentUrl]);

  const handlePayment = () => {
    if (!safePaymentUrl) {
      setError("Payment link is invalid. Please try again.");
      return;
    }

    setError(null);
    onPaymentInitiated?.();
    // Redirect to Squad payment URL
    window.location.assign(safePaymentUrl);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-surface p-4">
      <Card elevated className="w-full max-w-md space-y-6 p-8">
        {error && <Alert type="error" message={error} />}

        {/* Header */}
        <div>
          <h2 className="text-2xl font-bold text-on-surface">
            Complete Payment
          </h2>
          <p className="mt-2 text-sm text-on-surface-variant">
            Proceed to Squad checkout to complete your verification.
          </p>
        </div>

        {/* Summary */}
        <div className="space-y-3 rounded-lg bg-surface-container-low p-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-on-surface-variant">Plan</span>
            <span className="font-medium text-on-surface">{planLabel}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-on-surface-variant">Documents</span>
            <span className="font-medium text-on-surface">{documentCount}</span>
          </div>
          <div className="border-t border-outline-variant pt-3">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-on-surface">
                Total Amount
              </span>
              <span className="text-lg font-bold text-secondary">
                {planPrice}
              </span>
            </div>
          </div>
        </div>

        {/* Payment Button */}
        <Button
          type="button"
          variant="primary"
          size="lg"
          className="w-full"
          onClick={handlePayment}
          disabled={!safePaymentUrl}
        >
          Pay with Squad
        </Button>

        {/* Trust Message */}
        <div className="space-y-2 rounded-lg bg-surface-container-low p-4">
          <div className="flex items-start gap-2">
            <div className="mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-secondary/20">
              <span className="text-xs text-secondary">✓</span>
            </div>
            <div className="text-sm text-on-surface">
              <p className="font-medium">Secure Payment</p>
              <p className="mt-1 text-xs">
                CertVerify does not store your card details. Payment processing
                is handled securely by Squad.
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-xs text-on-surface-variant">
          You will be redirected to Squad to complete your payment securely.
        </p>
      </Card>
    </div>
  );
};
