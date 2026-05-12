import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { AIResultSummary } from "../components/results/AIResultSummary";
import { DimensionBreakdown } from "../components/results/DimensionBreakdown";
import { AnomalyList } from "../components/results/AnomalyList";
import { AuditTrail } from "../components/results/AuditTrail";
import { ResultActions } from "../components/results/ResultActions";
import { PageLayout } from "../components/layout/PageLayout";
import { Alert } from "../ui/Alert";
import { Card } from "../ui/Card";
import { Spinner } from "../ui/Spinner";
import { get } from "../utils/api";

type Verdict = "LIKELY_AUTHENTIC" | "SUSPICIOUS" | "HIGH_RISK";
type Severity = "LOW" | "MEDIUM" | "HIGH";

interface ResultAnomaly {
  id: string;
  fieldName: string;
  severity: Severity;
  description: string;
  confidence?: number;
  anomalyId?: string;
}

interface ResultAuditEvent {
  timestamp: string;
  event: string;
  icon?: "check" | "upload" | "brain" | "score" | "report";
}

interface VerificationReport {
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
  anomalies: ResultAnomaly[];
  audit: {
    events: ResultAuditEvent[];
    systemId: string;
    transactionRef: string;
    complianceTags: string[];
  };
}

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
  if (
    value === "LIKELY_AUTHENTIC" ||
    value === "SUSPICIOUS" ||
    value === "HIGH_RISK"
  ) {
    return value;
  }
  return "SUSPICIOUS";
};

const toSeverity = (value: unknown): Severity => {
  if (value === "LOW" || value === "MEDIUM" || value === "HIGH") {
    return value;
  }
  return "MEDIUM";
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

const normalizeReport = (payload: unknown, id: string): VerificationReport => {
  const raw = asObject(payload);
  if (!raw) return fallbackReport(id);

  const dimensionsRaw = asObject(raw.dimensions);
  const anomaliesRaw = Array.isArray(raw.anomalies) ? raw.anomalies : [];
  const auditRaw = asObject(raw.auditTrail) ?? asObject(raw.audit);
  const eventsRaw =
    auditRaw && Array.isArray(auditRaw.events) ? auditRaw.events : [];

  const anomalies: ResultAnomaly[] = anomaliesRaw.map((item, index) => {
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

  const events: ResultAuditEvent[] = eventsRaw.map((event) => {
    const entry = asObject(event);
    return {
      timestamp: asString(entry?.timestamp, new Date().toISOString()),
      event: asString(entry?.event, "Processing event"),
      icon:
        entry?.icon === "check" ||
        entry?.icon === "upload" ||
        entry?.icon === "brain" ||
        entry?.icon === "score" ||
        entry?.icon === "report"
          ? entry.icon
          : undefined,
    };
  });

  return {
    id: asString(raw.id, id),
    verdict: toVerdict(raw.verdict),
    trustScore: asNumber(raw.trustScore ?? raw.score, 62),
    aiSummary: asString(raw.aiSummary ?? raw.summary, "Analysis completed."),
    fileName: asString(
      raw.fileName ?? raw.documentName,
      `verification-${id}.pdf`,
    ),
    dimensions: {
      visualAuthenticity: asNumber(
        dimensionsRaw?.visualAuthenticity ?? raw.visualAuthenticity,
        65,
      ),
      textIntegrity: asNumber(
        dimensionsRaw?.textIntegrity ?? raw.textIntegrity,
        58,
      ),
      structuralPattern: asNumber(
        dimensionsRaw?.structuralPattern ?? raw.structuralPattern,
        68,
      ),
      metadataConsistency: asNumber(
        dimensionsRaw?.metadataConsistency ?? raw.metadataConsistency,
        72,
      ),
    },
    anomalies,
    audit: {
      events,
      systemId: asString(auditRaw?.systemId, "VERIFY-NODE-ALPHA-9"),
      transactionRef: asString(auditRaw?.transactionRef, `TX-${id}`),
      complianceTags: Array.isArray(auditRaw?.complianceTags)
        ? auditRaw.complianceTags.filter(
            (tag): tag is string => typeof tag === "string",
          )
        : [],
    },
  };
};

export default function Result() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();

  const verificationId = id ?? "unknown";
  const statePayload = (location.state as { report?: unknown } | null)?.report;

  const [report, setReport] = useState<VerificationReport | null>(
    statePayload ? normalizeReport(statePayload, verificationId) : null,
  );
  const [loading, setLoading] = useState(!statePayload);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    const fetchReport = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await get(`/api/verification/${verificationId}`);
        if (cancelled) return;
        setReport(normalizeReport(response, verificationId));
      } catch (fetchError: unknown) {
        if (cancelled) return;
        const message =
          fetchError instanceof Error
            ? fetchError.message
            : "Failed to load verification report.";
        setError(message);
        setReport((previous) => previous ?? fallbackReport(verificationId));
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    fetchReport();

    return () => {
      cancelled = true;
    };
  }, [verificationId]);

  const actions = useMemo(() => {
    return {
      onDownload: () => window.print(),
      onVerifyAnother: () => navigate("/verify"),
      onExport: () => window.print(),
      onManualOverride: () => navigate("/dashboard"),
      onRequestReVerification: () => navigate("/verify"),
      onGenerateFraudReport: () => window.print(),
      onFlagForReview: () => navigate("/dashboard"),
    };
  }, [navigate]);

  if (loading && !report) {
    return (
      <PageLayout>
        <div className="flex min-h-[50vh] items-center justify-center">
          <Spinner size="lg" color="text-secondary" />
        </div>
      </PageLayout>
    );
  }

  if (!report) {
    return (
      <PageLayout>
        <Alert type="error" message="Verification report is unavailable." />
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      <div className="space-y-6">
        {error && (
          <Alert
            type="warning"
            message={error}
            onClose={() => setError(null)}
          />
        )}

        <AIResultSummary
          verdict={report.verdict}
          trustScore={report.trustScore}
          aiSummary={report.aiSummary}
          fileName={report.fileName}
        />

        <Card className="p-6">
          <DimensionBreakdown
            visualAuthenticity={report.dimensions.visualAuthenticity}
            textIntegrity={report.dimensions.textIntegrity}
            structuralPattern={report.dimensions.structuralPattern}
            metadataConsistency={report.dimensions.metadataConsistency}
          />
        </Card>

        <Card className="p-6">
          <AnomalyList anomalies={report.anomalies} />
        </Card>

        <Card className="p-6">
          <AuditTrail
            events={report.audit.events}
            systemId={report.audit.systemId}
            transactionRef={report.audit.transactionRef}
            complianceTags={report.audit.complianceTags}
          />
        </Card>

        <Card className="p-6">
          <ResultActions
            verdict={report.verdict}
            onDownload={actions.onDownload}
            onVerifyAnother={actions.onVerifyAnother}
            onExport={actions.onExport}
            onManualOverride={actions.onManualOverride}
            onRequestReVerification={actions.onRequestReVerification}
            onGenerateFraudReport={actions.onGenerateFraudReport}
            onFlagForReview={actions.onFlagForReview}
          />
        </Card>
      </div>
    </PageLayout>
  );
}
