import { request } from "../utils/api";

export type PlanType = "PRO" | "PRO_MAX" | "ENTERPRISE";
export type VerificationStatus =
  | "PENDING_PAYMENT"
  | "PAYMENT_CONFIRMED"
  | "PROCESSING"
  | "COMPLETED"
  | "FAILED";

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
  if (typeof value === "object" && value !== null) {
    return value as T;
  }
  return {} as T;
};

const DEMO_BASE = "https://junkman-thrash-omission.ngrok-free.dev";

export interface AIAnalysisResponse {
  success: boolean;
  document_score?: number;
  document_verdict?: string;
  extracted_info?: {
    candidate_name: string;
    exam_year: string;
    registration_number: string;
  };
  flagged_issues?: string[];
  message?: string;
  error?: string;
  type_mismatch?: boolean;
  detected_type?: string;
}

export interface PaymentInitiateResponse {
  checkout_url: string;
  transaction_ref: string;
}

export interface PaymentVerifyResponse {
  paid: boolean;
  status: string;
  amount: number;
  email: string;
  transaction_ref: string;
}

export const uploadVerification = async (file: File, certType: string) => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("cert_type", certType);

  return request<AIAnalysisResponse>({
    method: "POST",
    path: "/AI_pipeline/verify/analyse",
    body: formData,
    isMultipart: true,
    baseUrl: DEMO_BASE,
  });
};

export const initiateVerificationPayment = async (email: string, amount: number) => {
  // Guide says POST with query params
  return request<PaymentInitiateResponse>({
    method: "POST",
    path: `/payment/pay/initiate?email=${encodeURIComponent(email)}&amount_naira=${amount}`,
    baseUrl: DEMO_BASE,
    noAuth: true,
  });
};

export const verifyPaymentStatus = async (transactionRef: string) => {
  return request<PaymentVerifyResponse>({
    method: "GET",
    path: `/payment/pay/verify/${transactionRef}`,
    baseUrl: DEMO_BASE,
    noAuth: true,
  });
};

export const fetchVerificationStatus = async (verificationId: string) => {
  const response = await request<VerificationStatusResponse>({
    method: "GET",
    path: `/api/verification/${verificationId}`,
  });

  return extractResponse<VerificationStatusResponse>(response);
};

export const purchaseApiCredits = async (email: string) => {
  return request<{ api_key: string }>({
    method: "POST",
    path: `/third_party/api/v1/credits/purchase?email=${encodeURIComponent(email)}`,
    baseUrl: DEMO_BASE,
  });
};
