import { useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { AIResultSummary } from '../components/results/AIResultSummary';
import { DimensionBreakdown } from '../components/results/DimensionBreakdown';
import { AnomalyList } from '../components/results/AnomalyList';
import { AuditTrail } from '../components/results/AuditTrail';
import { ResultActions } from '../components/results/ResultActions';
import { PageLayout } from '../components/layout/PageLayout';
import { Alert } from '../ui/Alert';
import { Card } from '../ui/Card';
import { Spinner } from '../ui/Spinner';
import {
  fetchVerificationReport,
  normalizeVerificationReport,
  type VerificationReport,
} from '../api/report';

export default function Result() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();

  const verificationId = id ?? 'unknown';
  const statePayload = (location.state as { report?: unknown } | null)?.report;

  const [report, setReport] = useState<VerificationReport | null>(
    statePayload ? normalizeVerificationReport(statePayload, verificationId) : null,
  );
  const [loading, setLoading] = useState(!statePayload);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    const loadReport = async () => {
      setLoading(true);
      setError(null);

      try {
        const fetchedReport = await fetchVerificationReport(verificationId);
        if (cancelled) return;

        setReport(
          statePayload
            ? normalizeVerificationReport(statePayload, verificationId)
            : fetchedReport,
        );
      } catch (fetchError: unknown) {
        if (cancelled) return;

        const message =
          fetchError instanceof Error
            ? fetchError.message
            : 'Failed to load verification report.';
        setError(message);
        setReport(normalizeVerificationReport({}, verificationId));
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    loadReport();

    return () => {
      cancelled = true;
    };
  }, [verificationId, statePayload]);

  const actions = useMemo(() => {
    return {
      onDownload: () => window.print(),
      onVerifyAnother: () => navigate('/verify'),
      onExport: () => window.print(),
      onManualOverride: () => navigate('/dashboard'),
      onRequestReVerification: () => navigate('/verify'),
      onGenerateFraudReport: () => window.print(),
      onFlagForReview: () => navigate('/dashboard'),
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
