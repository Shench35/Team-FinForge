import { useMemo, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { CreditCard, ShieldCheck, ArrowRight } from "lucide-react";
import { PaymentGate } from "../components/verification/PaymentGate";
import { StepIndicator } from "../components/verification/StepIndicator";
import { PageLayout } from "../components/layout/PageLayout";
import { Alert } from "../ui/Alert";
import { Card } from "../ui/Card";
import { Button } from "../ui/Button";
import { useAuth } from "../hooks/useAuth";
import { useVerification } from "../hooks/useVerification";
import { PLAN_PRICES_NUMERIC, PLAN_PRICES, PLAN_LABELS } from "../utils/constants";

type PlanType = "FREE" | "PRO" | "PRO_MAX" | "ENTERPRISE";

export default function Verify() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [verificationId, setVerificationId] = useState<string | null>(null);
  const [paymentUrl, setPaymentUrl] = useState<string>("");
  const [showPaymentGate, setShowPaymentGate] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);

  // Check if user already paid for a verification in this demo session
  useEffect(() => {
    if (localStorage.getItem('demo_verification_paid') === 'true') {
      navigate(`/verify/confirm?verificationId=paid-session-${Date.now()}`);
    }
  }, [navigate]);

  const planType: PlanType = useMemo(() => {
    if (!user?.plan) return "FREE";
    return user.plan;
  }, [user?.plan]);

  const {
    isSubmitting,
    error: verificationError,
    startVerification,
    resetError,
  } = useVerification();

  const handleContinueToPayment = async () => {
    resetError();
    setLocalError(null);

    if (planType === "FREE") {
      navigate(`/verify/confirm?verificationId=free-session-${Date.now()}`);
      return;
    }

    try {
      const amount = PLAN_PRICES_NUMERIC[planType];
      const email = user?.email || "demo@example.com";

      const {
        verificationId: resolvedVerificationId,
        paymentUrl: resolvedPaymentUrl,
      } = await startVerification(email, amount);

      setVerificationId(resolvedVerificationId);
      setPaymentUrl(resolvedPaymentUrl);
      setShowPaymentGate(true);
    } catch (submitError: unknown) {
      const message =
        submitError instanceof Error
          ? submitError.message
          : "Failed to initialize payment.";
      setLocalError(message);
    }
  };

  if (showPaymentGate && verificationId) {
    return (
      <PaymentGate
        planType={planType}
        documentCount={1}
        paymentUrl={paymentUrl}
        onPaymentInitiated={() => {
          localStorage.setItem('demo_verification_paid', 'true');
          navigate('/payment-success');
        }}
      />
    );
  }

  return (
    <PageLayout>
      <div className="space-y-8">
        <div className="space-y-3">
          <h1 className="text-3xl font-bold text-on-surface">
            New Verification
          </h1>
          <p className="text-sm text-on-surface-variant">
            Complete payment first, then upload your certificate for AI analysis.
          </p>
        </div>

        <StepIndicator currentStep={1} isProcessing={false} />

        {(localError || verificationError) && (
          <Alert
            type="error"
            message={localError ?? verificationError ?? "Something went wrong."}
            onClose={() => setLocalError(null)}
          />
        )}

        <div className="max-w-2xl mx-auto">
          <Card className="p-8 space-y-8">
            {/* Plan Summary */}
            <div className="flex items-center gap-4 border-b border-outline-variant pb-6">
              <div className="w-14 h-14 rounded-full bg-secondary/10 flex items-center justify-center">
                <ShieldCheck className="w-7 h-7 text-secondary" />
              </div>
              <div className="flex-1">
                <h2 className="text-xl font-bold text-on-surface">
                  {PLAN_LABELS[planType]} Plan
                </h2>
                <p className="text-sm text-on-surface-variant">
                  AI-powered certificate verification
                </p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-display font-bold text-primary">
                  {PLAN_PRICES[planType]}
                </p>
                <p className="text-[10px] text-on-surface-variant uppercase tracking-widest">per verification</p>
              </div>
            </div>

            {/* What's Included */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold text-on-surface-variant/60 uppercase tracking-widest">What&apos;s included</h3>
              <ul className="space-y-2">
                {[
                  "Deep AI document analysis",
                  "Trust score & verdict report",
                  "Flagged issues breakdown",
                  "Candidate detail extraction",
                ].map((item) => (
                  <li key={item} className="flex items-center gap-3 text-sm text-on-surface">
                    <div className="w-5 h-5 rounded-full bg-secondary/10 flex items-center justify-center flex-shrink-0">
                      <span className="text-[10px] text-secondary font-bold">✓</span>
                    </div>
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            {/* CTA */}
            <Button
              variant="primary"
              size="lg"
              className="w-full h-14 text-lg font-bold bg-secondary hover:bg-secondary/90 shadow-lg shadow-secondary/20"
              onClick={handleContinueToPayment}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                "Initializing..."
              ) : (
                <>
                  <CreditCard className="w-5 h-5 mr-2" />
                  Continue to Payment
                  <ArrowRight className="w-5 h-5 ml-2" />
                </>
              )}
            </Button>

            <p className="text-[10px] text-center text-on-surface-variant/60 italic">
              After payment, you'll upload your certificate and receive instant AI analysis results.
            </p>
          </Card>
        </div>
      </div>
    </PageLayout>
  );
}
