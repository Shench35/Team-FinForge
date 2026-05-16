export const PLAN_LIMITS = { FREE: 3, PRO: 10, PRO_MAX: 20, ENTERPRISE: 100000000 } as const;

export const PLAN_LABELS = { FREE: 'Free', PRO: 'Pro', PRO_MAX: 'Pro Max', ENTERPRISE: 'Enterprise' } as const;

export const PLAN_PRICES = { FREE: '₦0', PRO: '₦500', PRO_MAX: '₦750', ENTERPRISE: '₦1,200' } as const;
export const PLAN_PRICES_NUMERIC = { FREE: 0, PRO: 500, PRO_MAX: 750, ENTERPRISE: 1200 } as const;

export const PLAN_COLORS = { FREE: 'gray', PRO: 'blue', PRO_MAX: 'purple', ENTERPRISE: 'green' } as const;

export const PLAN_DOC_FEATURES = {
  FREE: [
    '3 Verifications / mo',
    'Standard Email Support',
    'Basic AI analysis',
  ],
  PRO: [
    '10 Verifications / mo',
    'Standard Email Support',
    'Digital Certificates',
    'Standard processing',
    'Basic PDF report',
  ],
  PRO_MAX: [
    '20 Verifications / mo',
    'Priority 24/7 Support',
    'Bulk Upload Feature',
    'API Access (Alpha)',
    'Advanced Fraud Analysis',
  ],
  ENTERPRISE: [
    'Unlimited Verifications',
    'Dedicated Account Manager',
    'Full API & Webhooks',
    'Custom Branding',
    'Priority queue processing',
    'Bulk verification tools',
    'Dedicated account manager',
    'Full Forensic Audit',
  ],
} as const;

export const VERDICT_CONFIG = {
  LIKELY_AUTHENTIC: { label: 'Likely Authentic', color: '#006c4e', borderClass: 'border-t-4 border-secondary', minScore: 80 },
  SUSPICIOUS:       { label: 'Suspicious',        color: '#f59e0b', borderClass: 'border-t-4 border-amber-500', minScore: 50 },
  HIGH_RISK:        { label: 'High Risk',          color: '#ba1a1a', borderClass: 'border-t-4 border-error',    minScore: 0  },
} as const;

export const SEVERITY_CONFIG = {
  LOW:    { label: 'Low',    color: '#f59e0b' },
  MEDIUM: { label: 'Medium', color: '#f97316' },
  HIGH:   { label: 'High',   color: '#ba1a1a' },
} as const;

export const VERIFICATION_STATUS_CONFIG = {
  PENDING_PAYMENT:   { label: 'Pending Payment',   color: 'gray'  },
  PAYMENT_CONFIRMED: { label: 'Payment Confirmed', color: 'blue'  },
  PROCESSING:        { label: 'Processing',        color: 'amber', pulse: true },
  COMPLETED:         { label: 'Completed',         color: 'green' },
  FAILED:            { label: 'Failed',            color: 'red'   },
} as const;

export const PROCESSING_STEPS = [
  { id: 1, label: 'Payment confirmed',           icon: 'check_circle' },
  { id: 2, label: 'Uploading documents',         icon: 'upload'       },
  { id: 3, label: 'Running OCR extraction',      icon: 'text_fields'  },
  { id: 4, label: 'Analysing with Gemini 2.5 Flash', icon: 'psychology'   },
  { id: 5, label: 'Calculating trust score',     icon: 'analytics'    },
  { id: 6, label: 'Generating report',           icon: 'description'  },
] as const;
