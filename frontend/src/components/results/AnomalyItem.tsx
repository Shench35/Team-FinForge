import { AlertTriangle, AlertCircle } from "lucide-react";
import { Card } from "../../ui/Card";
import { SeverityBadge } from "../badges/SeverityBadge";

interface AnomalyItemProps {
  fieldName: string;
  severity: "LOW" | "MEDIUM" | "HIGH";
  description: string;
  confidence?: number;
  anomalyId?: string;
}

const iconMap = {
  LOW: <AlertCircle className="h-5 w-5 text-amber-600" />,
  MEDIUM: <AlertTriangle className="h-5 w-5 text-orange-600" />,
  HIGH: <AlertTriangle className="h-5 w-5 text-error" />,
};

export const AnomalyItem = ({
  fieldName,
  severity,
  description,
  confidence,
  anomalyId,
}: AnomalyItemProps) => {
  return (
    <Card className="space-y-3 p-4">
      <div className="flex items-start gap-3">
        {/* Icon */}
        <div className="flex-shrink-0 pt-0.5">{iconMap[severity]}</div>

        {/* Content */}
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h4 className="font-semibold text-on-surface">{fieldName}</h4>
            <SeverityBadge severity={severity} size="sm" />
          </div>

          <p className="mt-2 text-sm text-on-surface-variant">{description}</p>

          {/* Footer Info */}
          <div className="mt-3 flex items-center justify-between">
            {confidence !== undefined && (
              <p className="text-xs text-on-surface-variant">
                Confidence: <span className="font-semibold">{confidence}%</span>
              </p>
            )}
            {anomalyId && (
              <p className="font-mono text-xs text-on-surface-variant">
                ID: {anomalyId}
              </p>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
};
