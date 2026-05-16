import { useCallback, useState } from "react";
import {
  initiateVerificationPayment,
} from "../api/verification";

interface UseVerificationResult {
  isSubmitting: boolean;
  error: string | null;
  startVerification: (email: string, amount: number) => Promise<{
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

  const startVerification = useCallback(async (email: string, amount: number) => {
    setIsSubmitting(true);
    setError(null);

    try {
      const paymentResponse = await initiateVerificationPayment(email, amount);
      return { 
        verificationId: paymentResponse.transaction_ref, 
        paymentUrl: paymentResponse.checkout_url 
      };
    } catch (requestError: unknown) {
      const message =
        requestError instanceof Error
          ? requestError.message
          : "Failed to initialize payment.";
      setError(message);
      throw requestError instanceof Error ? requestError : new Error(message);
    } finally {
      setIsSubmitting(false);
    }
  }, []);

  return { isSubmitting, error, startVerification, resetError };
};
