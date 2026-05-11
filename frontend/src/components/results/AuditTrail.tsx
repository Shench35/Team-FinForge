import {
  CheckCircle2,
  FileText,
  Brain,
  TrendingUp,
  BarChart3,
  Clock,
} from "lucide-react";
import { Badge } from "../../ui/Badge";
import { formatDate } from "../../utils/formatters";

interface AuditEvent {
  timestamp: string;
  event: string;
  icon?: "check" | "upload" | "brain" | "score" | "report";
}

interface AuditTrailProps {
  events?: AuditEvent[];
  systemId?: string;
  transactionRef?: string;
  complianceTags?: string[];
}

const iconMap = {
  check: <CheckCircle2 className="h-5 w-5 text-secondary" />,
  upload: <FileText className="h-5 w-5 text-secondary" />,
  brain: <Brain className="h-5 w-5 text-secondary" />,
  score: <TrendingUp className="h-5 w-5 text-secondary" />,
  report: <BarChart3 className="h-5 w-5 text-secondary" />,
};

const defaultEvents: AuditEvent[] = [
  {
    timestamp: new Date().toISOString(),
    event: "Verification initiated",
    icon: "check",
  },
  {
    timestamp: new Date(Date.now() - 60000).toISOString(),
    event: "OCR Extraction completed",
    icon: "upload",
  },
  {
    timestamp: new Date(Date.now() - 120000).toISOString(),
    event: "AI Analysis complete",
    icon: "brain",
  },
  {
    timestamp: new Date(Date.now() - 180000).toISOString(),
    event: "Report generated",
    icon: "report",
  },
];

export const AuditTrail = ({
  events = defaultEvents,
  systemId = "VERIFY-NODE-ALPHA-9",
  transactionRef = "SQD-8829-XKJ-44",
  complianceTags = [],
}: AuditTrailProps) => {
  return (
    <div className="space-y-6">
      <div>
        <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-on-surface-variant">
          Security & Compliance
        </p>
        <h3 className="text-lg font-semibold text-on-surface">
          Audit Trail
        </h3>
      </div>

      {/* Events Timeline */}
      <div className="space-y-3">
        {events.map((event, index) => (
          <div key={index} className="flex gap-4">
            {/* Icon */}
            <div className="flex-shrink-0">
              {event.icon ? iconMap[event.icon] : <Clock className="h-5 w-5 text-secondary" />}
            </div>

            {/* Content */}
            <div className="flex-1">
              <p className="text-sm font-medium text-on-surface">
                {event.event}
              </p>
              <p className="font-mono text-xs text-on-surface-variant">
                {formatDate(event.timestamp)}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* System Info */}
      <div className="space-y-2 border-t border-outline-variant pt-4">
        {systemId && (
          <div>
            <p className="text-xs text-on-surface-variant">
              System Node:
            </p>
            <p className="font-mono text-sm font-semibold text-on-surface">
              {systemId}
            </p>
          </div>
        )}

        {transactionRef && (
          <div>
            <p className="text-xs text-on-surface-variant">
              Transaction Reference:
            </p>
            <p className="font-mono text-sm font-semibold text-on-surface">
              {transactionRef}
            </p>
          </div>
        )}

        {/* Compliance Tags */}
        {complianceTags.length > 0 && (
          <div>
            <p className="text-xs text-on-surface-variant">
              Compliance:
            </p>
            <div className="mt-1 flex gap-2">
              {complianceTags.map((tag) => (
                <Badge
                  key={tag}
                  label={tag}
                  size="sm"
                  className="bg-secondary/10 text-secondary"
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
