import { CheckCircle2 } from "lucide-react";
import { AnomalyItem } from "./AnomalyItem";

interface Anomaly {
  id: string;
  fieldName: string;
  severity: "LOW" | "MEDIUM" | "HIGH";
  description: string;
  confidence?: number;
  anomalyId?: string;
}

interface AnomalyListProps {
  anomalies?: Anomaly[];
  emptyStateTitle?: string;
  emptyStateMessage?: string;
}

export const AnomalyList = ({
  anomalies = [],
  emptyStateTitle = "No anomalies detected",
  emptyStateMessage = "This document passed all structural, textual, and metadata validation checks.",
}: AnomalyListProps) => {
  const isEmpty = !anomalies || anomalies.length === 0;

  return (
    <div className="space-y-6">
      <div>
        <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-on-surface-variant">
          Analysis Details
        </p>
        <h3 className="text-lg font-semibold text-on-surface">
          Anomaly Detection Log
        </h3>
      </div>

      {isEmpty ? (
        <div className="rounded-lg border border-outline-variant bg-surface-container-low p-8 text-center">
          <CheckCircle2 className="mx-auto h-12 w-12 text-secondary" />
          <h4 className="mt-4 font-semibold text-on-surface">
            {emptyStateTitle}
          </h4>
          <p className="mt-2 text-sm text-on-surface-variant">
            {emptyStateMessage}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {anomalies.map((anomaly) => (
            <AnomalyItem
              key={anomaly.id}
              fieldName={anomaly.fieldName}
              severity={anomaly.severity}
              description={anomaly.description}
              confidence={anomaly.confidence}
              anomalyId={anomaly.anomalyId}
            />
          ))}
        </div>
      )}
    </div>
  );
};
