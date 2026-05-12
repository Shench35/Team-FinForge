import { useCallback, useState } from "react";
import {
  initiateVerificationPayment,
  parsePaymentUrl,
  parseVerificationId,
  uploadVerification,
} from "../api/verification";

interface UseVerificationResult {
  isSubmitting: boolean;
  error: string | null;
  startVerification: (files: File[]) => Promise<{
    verificationId: string;
    paymentUrl: string;
  }>;
  resetError: () => void;
}

export const useVerification = (): UseVerificationResult => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const resetError = useCallback(() => {
    setError(null);
  }, []);

  const startVerification = useCallback(async (files: File[]) => {
    if (files.length === 0) {
      throw new Error(
        "Please upload at least one document before proceeding to payment.",
      );
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const uploadResponse = await uploadVerification(files);
      const verificationId =
        parseVerificationId(uploadResponse) ?? `local-${Date.now()}`;

      const paymentResponse = await initiateVerificationPayment(verificationId);
      const paymentUrl =
        parsePaymentUrl(paymentResponse) ?? "https://checkout.squadco.com";

      return { verificationId, paymentUrl };
    } catch (requestError: unknown) {
      const message =
        requestError instanceof Error
          ? requestError.message
          : "Failed to initialize verification.";
      setError(message);
      throw requestError instanceof Error ? requestError : new Error(message);
    } finally {
      setIsSubmitting(false);
    }
  }, []);

  return { isSubmitting, error, startVerification, resetError };
};
