import { request } from '../utils/api';

export type PlanType = 'PRO' | 'PRO_MAX' | 'ENTERPRISE';
export type VerificationStatus =
  | 'PENDING_PAYMENT'
  | 'PAYMENT_CONFIRMED'
  | 'PROCESSING'
  | 'COMPLETED'
  | 'FAILED';

export interface UploadVerificationResponse {
  verificationId?: string;
  id?: string;
}

export interface PaymentVerificationResponse {
  paymentUrl?: string;
  url?: string;
}

export interface VerificationStatusResponse {
  status?: VerificationStatus;
  currentStep?: number;
  step?: number;
  error?: string;
  message?: string;
}

const extractResponse = <T>(value: unknown): T => {
  if (typeof value === 'object' && value !== null) {
    return value as T;
  }
  return {} as T;
};

export const parseVerificationId = (value: UploadVerificationResponse): string | null => {
  return value.verificationId ?? value.id ?? null;
};

export const parsePaymentUrl = (value: PaymentVerificationResponse): string | null => {
  return value.paymentUrl ?? value.url ?? null;
};

export const uploadVerification = async (files: File[]) => {
  const formData = new FormData();
  files.forEach((file) => formData.append('files', file));

  const response = await request<UploadVerificationResponse>({
    method: 'POST',
    path: '/api/verification/upload',
    body: formData,
    isMultipart: true,
  });

  return extractResponse<UploadVerificationResponse>(response);
};

export const initiateVerificationPayment = async (verificationId: string) => {
  const response = await request<PaymentVerificationResponse>({
    method: 'POST',
    path: '/api/verification/pay',
    body: { verificationId },
  });

  return extractResponse<PaymentVerificationResponse>(response);
};

export const fetchVerificationStatus = async (verificationId: string) => {
  const response = await request<VerificationStatusResponse>({
    method: 'GET',
    path: `/api/verification/${verificationId}`,
  });

  return extractResponse<VerificationStatusResponse>(response);
};
