import { useEffect, useState } from 'react';
import { fetchVerificationStatus, type VerificationStatus } from '../api/verification';

interface UsePollStatusOptions {
  verificationId: string | null;
  enabled?: boolean;
  intervalMs?: number;
  onComplete?: () => void;
  onFailure?: (message: string) => void;
}

interface UsePollStatusResult {
  currentStep: number;
  status: VerificationStatus | null;
  isFailed: boolean;
  error: string | null;
}

const clampStep = (step: number): number => Math.max(1, Math.min(6, step));

export const usePollStatus = ({
  verificationId,
  enabled = true,
  intervalMs = 3000,
  onComplete,
  onFailure,
}: UsePollStatusOptions): UsePollStatusResult => {
  const [currentStep, setCurrentStep] = useState(1);
  const [status, setStatus] = useState<VerificationStatus | null>(null);
  const [isFailed, setIsFailed] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!enabled || !verificationId || isFailed) return;

    let cancelled = false;

    const pollStatus = async () => {
      try {
        const response = await fetchVerificationStatus(verificationId);
        if (cancelled) return;

        setStatus(response.status ?? null);

        const apiStep = response.currentStep ?? response.step;
        if (typeof apiStep === 'number') {
          setCurrentStep(clampStep(apiStep));
        } else {
          setCurrentStep((prev) => clampStep(prev + 1));
        }

        if (response.status === 'COMPLETED') {
          onComplete?.();
          cancelled = true;
          return;
        }

        if (response.status === 'FAILED') {
          const message = response.error ?? response.message ?? 'Verification failed. Please retry.';
          setIsFailed(true);
          setError(message);
          onFailure?.(message);
        }
      } catch {
        if (cancelled) return;
        setCurrentStep((prev) => clampStep(prev + 1));
      }
    };

    pollStatus();
    const interval = window.setInterval(pollStatus, intervalMs);

    return () => {
      cancelled = true;
      window.clearInterval(interval);
    };
  }, [enabled, verificationId, intervalMs, isFailed, onComplete, onFailure]);

  return { currentStep, status, isFailed, error };
};
