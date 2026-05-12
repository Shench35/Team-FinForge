import { useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { FileUpload } from "../components/verification/FileUpload";
import { OrderSummary } from "../components/verification/OrderSummary";
import { PaymentGate } from "../components/verification/PaymentGate";
import { ProcessingView } from "../components/verification/ProcessingView";
import { StepIndicator } from "../components/verification/StepIndicator";
import { PageLayout } from "../components/layout/PageLayout";
import { Alert } from "../ui/Alert";
import { Card } from "../ui/Card";
import { useAuth } from "../hooks/useAuth";
import { useVerification } from "../hooks/useVerification";
import { usePollStatus } from "../hooks/usePollStatus";

type PlanType = "PRO" | "PRO_MAX" | "ENTERPRISE";
type FlowStage = "upload" | "payment" | "processing";

export default function Verify() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user } = useAuth();
  const initialVerificationId = searchParams.get("verificationId");
  const initialPaymentState = searchParams.get("payment");
  const initialFlowStage: FlowStage =
    initialVerificationId && initialPaymentState === "success"
      ? "processing"
      : "upload";

  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [verificationId, setVerificationId] = useState<string | null>(
    initialVerificationId,
  );
  const [paymentUrl, setPaymentUrl] = useState<string>("");
  const [flowStage, setFlowStage] = useState<FlowStage>(initialFlowStage);
  const [localError, setLocalError] = useState<string | null>(null);

  const planType: PlanType = useMemo(() => {
    if (!user?.plan) return "PRO";
    return user.plan;
  }, [user?.plan]);

  const { isSubmitting, error: verificationError, startVerification, resetError } =
    useVerification();

  const { currentStep, isFailed, error: pollError } = usePollStatus({
    verificationId,
    enabled: flowStage === "processing" && Boolean(verificationId),
    onComplete: () => {
      if (verificationId) {
        navigate(`/result/${verificationId}`);
      }
    },
    onFailure: (message) => {
      setLocalError(message);
    },
  });

  const handleStartPayment = async () => {
    if (selectedFiles.length === 0) {
      setLocalError(
        "Please upload at least one document before proceeding to payment.",
      );
      return;
    }

    resetError();
    setLocalError(null);

    try {
      const { verificationId: resolvedVerificationId, paymentUrl: resolvedPaymentUrl } =
        await startVerification(selectedFiles);

      setVerificationId(resolvedVerificationId);
      setPaymentUrl(resolvedPaymentUrl);
      setFlowStage("payment");
      navigate(`/verify?verificationId=${resolvedVerificationId}`, {
        replace: true,
      });
    } catch (submitError: unknown) {
      const message =
        submitError instanceof Error
          ? submitError.message
          : "Failed to initialize verification.";
      setLocalError(message);
    }
  };

  const handlePaymentInitiated = () => {
    setFlowStage("processing");
    setLocalError(null);
  };

  if (flowStage === "payment" && verificationId) {
    return (
      <PaymentGate
        planType={planType}
        documentCount={selectedFiles.length || 1}
        paymentUrl={paymentUrl}
        onPaymentInitiated={handlePaymentInitiated}
      />
    );
  }

  if (flowStage === "processing" && verificationId) {
    return (
      <ProcessingView
        currentStep={currentStep}
        isComplete={currentStep >= 6 && !isFailed}
        isFailed={isFailed}
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
            Upload your documents, complete payment, and we will run a full AI
            trust analysis.
          </p>
        </div>

        <StepIndicator currentStep={1} isProcessing={false} />

        {(localError || verificationError || pollError) && (
          <Alert
            type="error"
            message={localError ?? verificationError ?? pollError ?? "Something went wrong."}
            onClose={() => setLocalError(null)}
          />
        )}

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <Card className="space-y-5 p-6 lg:col-span-2">
            <h2 className="text-lg font-semibold text-on-surface">
              Upload Documents
            </h2>
            <FileUpload
              planType={planType}
              onFilesSelected={setSelectedFiles}
              onContinue={handleStartPayment}
            />
          </Card>

          <OrderSummary
            planType={planType}
            documentCount={selectedFiles.length}
            onPayClick={
              selectedFiles.length > 0 && !isSubmitting
                ? handleStartPayment
                : undefined
            }
          />
        </div>
      </div>
    </PageLayout>
  );
}
