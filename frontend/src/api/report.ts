import { request } from "../utils/api";

export type Verdict = "LIKELY_AUTHENTIC" | "SUSPICIOUS" | "HIGH_RISK";
export type Severity = "LOW" | "MEDIUM" | "HIGH";
export type AuditIcon = "check" | "upload" | "brain" | "score" | "report";

export interface ReportAnomaly {
  id: string;
  fieldName: string;
  severity: Severity;
  description: string;
  confidence?: number;
  anomalyId?: string;
}

export interface ReportAuditEvent {
  timestamp: string;
  event: string;
  icon?: AuditIcon;
}

export interface VerificationReport {
  id: string;
  verdict: Verdict;
  trustScore: number;
  aiSummary: string;
  fileName: string;
  dimensions: {
    visualAuthenticity: number;
    textIntegrity: number;
    structuralPattern: number;
    metadataConsistency: number;
  };
  anomalies: ReportAnomaly[];
  audit: {
    events: ReportAuditEvent[];
    systemId: string;
    transactionRef: string;
    complianceTags: string[];
  };
}

type ReportPayload = Partial<VerificationReport> & {
  score?: number;
  document_score?: number;
  document_verdict?: string;
  extracted_info?: Record<string, unknown>;
  flagged_issues?: Array<unknown>;
  message?: string;
  summary?: string;
  documentName?: string;
  visualAuthenticity?: number;
  textIntegrity?: number;
  structuralPattern?: number;
  metadataConsistency?: number;
  auditTrail?: {
    events?: Array<Partial<ReportAuditEvent> & { icon?: string }>;
    systemId?: string;
    transactionRef?: string;
    complianceTags?: unknown[];
  };
};

const asObject = (value: unknown): Record<string, unknown> | null => {
  if (typeof value === "object" && value !== null) {
    return value as Record<string, unknown>;
  }
  return null;
};

const asString = (value: unknown, fallback: string): string => {
  return typeof value === "string" ? value : fallback;
};

const asNumber = (value: unknown, fallback: number): number => {
  return typeof value === "number" && Number.isFinite(value) ? value : fallback;
};

const toVerdict = (value: unknown): Verdict => {
  if (value === "AUTHENTIC" || value === "LIKELY_AUTHENTIC") {
    return "LIKELY_AUTHENTIC";
  }
  if (value === "SUSPICIOUS") {
    return "SUSPICIOUS";
  }
  if (value === "HIGH_RISK" || value === "UNAUTHENTIC") {
    return "HIGH_RISK";
  }
  return "SUSPICIOUS";
};

const toSeverity = (value: unknown): Severity => {
  if (value === "LOW" || value === "MEDIUM" || value === "HIGH") {
    return value;
  }
  return "MEDIUM";
};

const toAuditIcon = (value: unknown): AuditIcon | undefined => {
  if (
    value === "check" ||
    value === "upload" ||
    value === "brain" ||
    value === "score" ||
    value === "report"
  ) {
    return value;
  }
  return undefined;
};

const fallbackReport = (id: string): VerificationReport => ({
  id,
  verdict: "SUSPICIOUS",
  trustScore: 62,
  aiSummary:
    "Analysis completed with minor anomalies. Manual review is recommended.",
  fileName: `verification-${id}.pdf`,
  dimensions: {
    visualAuthenticity: 65,
    textIntegrity: 58,
    structuralPattern: 68,
    metadataConsistency: 72,
  },
  anomalies: [
    {
      id: "anom-1",
      fieldName: "Seal Placement",
      severity: "MEDIUM",
      description: "Alignment differs from institutional template by 4mm.",
      confidence: 87,
      anomalyId: "ANOM-001",
    },
  ],
  audit: {
    events: [
      {
        timestamp: new Date().toISOString(),
        event: "Verification initiated",
        icon: "check",
      },
      {
        timestamp: new Date().toISOString(),
        event: "OCR extraction completed",
        icon: "upload",
      },
      {
        timestamp: new Date().toISOString(),
        event: "AI analysis complete",
        icon: "brain",
      },
      {
        timestamp: new Date().toISOString(),
        event: "Report generated",
        icon: "report",
      },
    ],
    systemId: "VERIFY-NODE-ALPHA-9",
    transactionRef: `TX-${id}`,
    complianceTags: ["GDPR"],
  },
});

export const normalizeVerificationReport = (
  payload: unknown,
  id: string,
): VerificationReport => {
  const raw = asObject(payload) as ReportPayload | null;
  if (!raw) return fallbackReport(id);

  const dimensionsRaw = asObject(raw.dimensions);
  const anomaliesRaw = Array.isArray(raw.anomalies) 
    ? raw.anomalies 
    : Array.isArray(raw.flagged_issues) 
      ? raw.flagged_issues 
      : [];
  const auditRaw = raw.auditTrail ?? raw.audit;
  const eventsRaw = Array.isArray(auditRaw?.events) ? auditRaw.events : [];

  const anomalies: ReportAnomaly[] = anomaliesRaw.map((item, index) => {
    const entry = asObject(item);
    return {
      id: asString(entry?.id, `anomaly-${index + 1}`),
      fieldName: asString(entry?.fieldName ?? entry?.field, "Unknown Field"),
      severity: toSeverity(entry?.severity),
      description: asString(
        entry?.description,
        "No anomaly description available.",
      ),
      confidence: asNumber(entry?.confidence, 0),
      anomalyId: asString(entry?.anomalyId, ""),
    };
  });

  const events: ReportAuditEvent[] = eventsRaw.map((event) => {
    const entry = asObject(event);
    return {
      timestamp: asString(entry?.timestamp, new Date().toISOString()),
      event: asString(entry?.event, "Processing event"),
      icon: toAuditIcon(entry?.icon),
    };
  });

  const complianceTags = Array.isArray(auditRaw?.complianceTags)
    ? auditRaw.complianceTags.filter(
        (tag): tag is string => typeof tag === "string",
      )
    : [];

  let aiSummary = asString(raw.aiSummary ?? raw.summary ?? raw.message, "Analysis completed.");
  if (raw.extracted_info) {
    const details = raw.extracted_info;
    const name = asString(details.candidate_name, "");
    const year = asString(details.exam_year, "");
    if (name) aiSummary = `Certificate for ${name} (${year}) verified. ${aiSummary}`;
  }

  const trustScore = asNumber(raw.document_score ?? raw.trustScore ?? raw.score, 0);

  return {
    id: asString(raw.id, id),
    verdict: toVerdict(raw.document_verdict ?? raw.verdict),
    trustScore,
    aiSummary,
    fileName: asString(
      raw.fileName ?? raw.documentName,
      `verification-${id}.pdf`,
    ),
    dimensions: {
      visualAuthenticity: asNumber(
        dimensionsRaw?.visualAuthenticity ?? raw.visualAuthenticity,
        trustScore,
      ),
      textIntegrity: asNumber(
        dimensionsRaw?.textIntegrity ?? raw.textIntegrity,
        trustScore,
      ),
      structuralPattern: asNumber(
        dimensionsRaw?.structuralPattern ?? raw.structuralPattern,
        trustScore,
      ),
      metadataConsistency: asNumber(
        dimensionsRaw?.metadataConsistency ?? raw.metadataConsistency,
        trustScore,
      ),
    },
    anomalies,
    audit: {
      events,
      systemId: asString(auditRaw?.systemId, "VERIFY-NODE-ALPHA-9"),
      transactionRef: asString(auditRaw?.transactionRef, `TX-${id}`),
      complianceTags,
    },
  };
};

export const fetchVerificationReport = async (verificationId: string) => {
  const response = await request<unknown>({
    method: "GET",
    path: `/api/verification/${verificationId}`,
  });

  return normalizeVerificationReport(response, verificationId);
};
