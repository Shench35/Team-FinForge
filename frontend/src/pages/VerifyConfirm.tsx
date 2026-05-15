import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { ShieldCheck, Loader2, CheckCircle2 } from "lucide-react";
import { PageLayout } from "../components/layout/PageLayout";
import { Card } from "../ui/Card";
import { Button } from "../ui/Button";
import { FileUpload } from "../components/verification/FileUpload";
import { StepIndicator } from "../components/verification/StepIndicator";
import { ProcessingView } from "../components/verification/ProcessingView";
import { useAuth } from "../hooks/useAuth";
import { uploadVerification, verifyPaymentStatus } from "../api/verification";

export default function VerifyConfirm() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user } = useAuth();

  // Support multiple parameter names from Squad redirect
  const verificationId =
    searchParams.get("verificationId") ||
    searchParams.get("tx_ref") ||
    searchParams.get("reference");

  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [certType, setCertType] = useState("WAEC");
  const [isVerifyingPayment, setIsVerifyingPayment] = useState(true);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [paymentVerified, setPaymentVerified] = useState(false);

  const planType = user?.plan || "PRO";

  // Verify payment on mount
  useEffect(() => {
    const checkPayment = async () => {
      if (!verificationId) {
        setError("Missing transaction reference. Please start a new verification.");
        setIsVerifyingPayment(false);
        return;
      }

      try {
        const result = await verifyPaymentStatus(verificationId);
        if (result.paid) {
          setPaymentVerified(true);
        } else {
          setError("Payment not yet confirmed. Please complete your payment first.");
        }
      } catch (err: any) {
        setError(err.message || "Failed to verify payment status.");
      } finally {
        setIsVerifyingPayment(false);
      }
    };

    checkPayment();
  }, [verificationId]);

  const handleStartAnalysis = async () => {
    if (selectedFiles.length === 0 || !verificationId) return;

    setIsAnalyzing(true);
    setError(null);

    try {
      console.log("Starting AI analysis with:", {
        fileName: selectedFiles[0].name,
        certType,
        fileSize: selectedFiles[0].size,
      });

      const result = await uploadVerification(selectedFiles[0], certType);
      console.log("AI analysis response:", result);

      if (!result.success) {
        if (result.type_mismatch) {
          throw new Error(result.message || `Type mismatch: Detected ${result.detected_type || 'another type'}`);
        } else {
          throw new Error(result.error || result.message || "Analysis failed on the server.");
        }
      }

      // Navigate to result page with the raw response
      navigate(`/result/${verificationId}`, { state: { report: result } });
    } catch (err: any) {
      console.error("AI analysis error:", err);
      // Catch network errors or the errors we explicitly threw above
      const message = err.message || "Network error or server unavailable. Please try again later.";
      setError(message);
      setIsAnalyzing(false);
    }
  };

  // Loading state while checking payment
  if (isVerifyingPayment) {
    return (
      <PageLayout>
        <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
          <Loader2 className="w-12 h-12 text-secondary animate-spin" />
          <p className="text-on-surface-variant animate-pulse font-medium">
            Verifying your payment...
          </p>
        </div>
      </PageLayout>
    );
  }

  // Processing state while AI is running
  if (isAnalyzing) {
    return (
      <ProcessingView
        currentStep={4}
        isComplete={false}
        isFailed={Boolean(error)}
      />
    );
  }

  return (
    <PageLayout>
      <div className="space-y-8">
        <div className="space-y-3">
          <h1 className="text-3xl font-bold text-on-surface">
            Upload & Analyze
          </h1>
          <p className="text-sm text-on-surface-variant">
            Your payment has been confirmed. Upload your certificate to begin AI analysis.
          </p>
        </div>

        <StepIndicator currentStep={2} isProcessing={false} />

        {/* Payment Confirmed Badge */}
        {paymentVerified && (
          <div className="flex items-center gap-3 p-4 rounded-xl bg-secondary/5 border border-secondary/20">
            <CheckCircle2 className="w-5 h-5 text-secondary flex-shrink-0" />
            <p className="text-sm font-medium text-secondary">
              Payment verified successfully
            </p>
          </div>
        )}

        {/* Dismissable Error Card Overlay */}
        {error && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-primary/30 backdrop-blur-sm p-4">
            <Card className="max-w-md w-full p-8 text-center space-y-6 animate-in fade-in zoom-in duration-300">
              <div className="w-16 h-16 bg-error/10 rounded-full flex items-center justify-center mx-auto">
                <ShieldCheck className="w-8 h-8 text-error" />
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-bold text-on-surface">Analysis Issue</h3>
                <p className="text-sm text-on-surface-variant">{error}</p>
              </div>
              <Button
                variant="primary"
                className="w-full h-12 font-bold"
                onClick={() => {
                  setError(null);
                  setSelectedFiles([]);
                }}
              >
                OK — Try Again
              </Button>
            </Card>
          </div>
        )}

        {paymentVerified && (
          <div className="max-w-3xl mx-auto">
            <Card className="p-6 space-y-6">
              <h2 className="text-lg font-semibold text-on-surface">
                Upload Your Certificate
              </h2>

              <FileUpload
                planType={planType as any}
                onFilesSelected={setSelectedFiles}
                onCertTypeChange={setCertType}
                onContinue={handleStartAnalysis}
                submitLabel="Get Result"
                isSubmitting={isAnalyzing}
              />
            </Card>
          </div>
        )}
      </div>
    </PageLayout>
  );
}
