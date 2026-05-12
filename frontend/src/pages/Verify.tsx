import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { FileUpload } from '../components/verification/FileUpload';
import { OrderSummary } from '../components/verification/OrderSummary';
import { PaymentGate } from '../components/verification/PaymentGate';
import { ProcessingView } from '../components/verification/ProcessingView';
import { StepIndicator } from '../components/verification/StepIndicator';
import { PageLayout } from '../components/layout/PageLayout';
import { Alert } from '../ui/Alert';
import { Card } from '../ui/Card';
import { useAuth } from '../hooks/useAuth';
import { get, post } from '../utils/api';

type PlanType = 'PRO' | 'PRO_MAX' | 'ENTERPRISE';
type FlowStage = 'upload' | 'payment' | 'processing';
type VerificationStatus =
  | 'PENDING_PAYMENT'
  | 'PAYMENT_CONFIRMED'
  | 'PROCESSING'
  | 'COMPLETED'
  | 'FAILED';

interface UploadResponse {
  verificationId?: string;
  id?: string;
}

interface PaymentResponse {
  paymentUrl?: string;
  url?: string;
}

interface StatusResponse {
  status?: VerificationStatus;
  currentStep?: number;
  step?: number;
  error?: string;
  message?: string;
}

const parseVerificationId = (value: UploadResponse): string | null => {
  return value.verificationId ?? value.id ?? null;
};

const parsePaymentUrl = (value: PaymentResponse): string | null => {
  return value.paymentUrl ?? value.url ?? null;
};

const clampStep = (step: number): number => Math.max(1, Math.min(6, step));

const toStatusResponse = (value: unknown): StatusResponse => {
  if (typeof value === 'object' && value !== null) {
    return value as StatusResponse;
  }
  return {};
};

export default function Verify() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user } = useAuth();
  const initialVerificationId = searchParams.get('verificationId');
  const initialPaymentState = searchParams.get('payment');
  const initialFlowStage: FlowStage =
    initialVerificationId && initialPaymentState === 'success'
      ? 'processing'
      : 'upload';

  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [verificationId, setVerificationId] = useState<string | null>(
    initialVerificationId
  );
  const [paymentUrl, setPaymentUrl] = useState<string>('');
  const [flowStage, setFlowStage] = useState<FlowStage>(initialFlowStage);
  const [currentStep, setCurrentStep] = useState(1);
  const [isFailed, setIsFailed] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const planType: PlanType = useMemo(() => {
    if (!user?.plan) return 'PRO';
    return user.plan;
  }, [user?.plan]);

  useEffect(() => {
    if (flowStage !== 'processing' || !verificationId || isFailed) return;

    let cancelled = false;

    const pollStatus = async () => {
      try {
        const response = toStatusResponse(await get(`/api/verification/${verificationId}`));
        if (cancelled) return;

        const status = response.status;
        const apiStep = response.currentStep ?? response.step;

        if (typeof apiStep === 'number') {
          setCurrentStep(clampStep(apiStep));
        } else {
          setCurrentStep((prev) => clampStep(prev + 1));
        }

        if (status === 'COMPLETED') {
          navigate(`/result/${verificationId}`);
          return;
        }

        if (status === 'FAILED') {
          setIsFailed(true);
          setError(response.error ?? response.message ?? 'Verification failed. Please retry.');
        }
      } catch {
        setCurrentStep((prev) => {
          const next = clampStep(prev + 1);
          if (next >= 6) {
            navigate(`/result/${verificationId}`);
          }
          return next;
        });
      }
    };

    pollStatus();
    const interval = window.setInterval(pollStatus, 3000);

    return () => {
      cancelled = true;
      window.clearInterval(interval);
    };
  }, [flowStage, verificationId, isFailed, navigate]);

  const handleStartPayment = async () => {
    if (selectedFiles.length === 0) {
      setError('Please upload at least one document before proceeding to payment.');
      return;
    }

    setError(null);
    setIsSubmitting(true);

    try {
      const formData = new FormData();
      selectedFiles.forEach((file) => formData.append('files', file));

      const uploadResponse = await post('/api/verification/upload', formData, true) as UploadResponse;
      const resolvedVerificationId = parseVerificationId(uploadResponse) ?? `local-${Date.now()}`;

      const paymentResponse = await post('/api/verification/pay', {
        verificationId: resolvedVerificationId,
      }) as PaymentResponse;

      const resolvedPaymentUrl = parsePaymentUrl(paymentResponse) ?? 'https://checkout.squadco.com';

      setVerificationId(resolvedVerificationId);
      setPaymentUrl(resolvedPaymentUrl);
      setFlowStage('payment');
      navigate(`/verify?verificationId=${resolvedVerificationId}`, { replace: true });
    } catch (submitError: unknown) {
      const message = submitError instanceof Error ? submitError.message : 'Failed to initialize verification.';
      setError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePaymentInitiated = () => {
    setFlowStage('processing');
    setCurrentStep(1);
    setIsFailed(false);
    setError(null);
  };

  if (flowStage === 'payment' && verificationId) {
    return (
      <PaymentGate
        planType={planType}
        documentCount={selectedFiles.length || 1}
        paymentUrl={paymentUrl}
        onPaymentInitiated={handlePaymentInitiated}
      />
    );
  }

  if (flowStage === 'processing' && verificationId) {
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
          <h1 className="text-3xl font-bold text-on-surface">New Verification</h1>
          <p className="text-sm text-on-surface-variant">
            Upload your documents, complete payment, and we will run a full AI trust analysis.
          </p>
        </div>

        <StepIndicator currentStep={1} isProcessing={false} />

        {error && <Alert type="error" message={error} onClose={() => setError(null)} />}

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <Card className="space-y-5 p-6 lg:col-span-2">
            <h2 className="text-lg font-semibold text-on-surface">Upload Documents</h2>
            <FileUpload
              planType={planType}
              onFilesSelected={setSelectedFiles}
              onContinue={handleStartPayment}
            />
          </Card>

          <OrderSummary
            planType={planType}
            documentCount={selectedFiles.length}
            onPayClick={selectedFiles.length > 0 && !isSubmitting ? handleStartPayment : undefined}
          />
        </div>
      </div>
    </PageLayout>
  );
}
