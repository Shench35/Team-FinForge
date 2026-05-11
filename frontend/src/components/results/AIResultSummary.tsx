import { TrustScoreRing } from "../badges/TrustScoreRing";
import { VerdictBadge } from "../badges/VerdictBadge";
import { Card } from "../../ui/Card";

interface AIResultSummaryProps {
  verdict: "LIKELY_AUTHENTIC" | "SUSPICIOUS" | "HIGH_RISK";
  trustScore: number;
  aiSummary: string;
  fileName: string;
}

const verdictConfig = {
  LIKELY_AUTHENTIC: {
    title: "Trust Validation Success",
    borderColor: "border-t-4 border-secondary",
  },
  SUSPICIOUS: {
    title: "Verification Result",
    borderColor: "border-t-4 border-amber-500",
  },
  HIGH_RISK: {
    title: "Verification Terminated",
    borderColor: "border-t-4 border-error",
  },
};

export const AIResultSummary = ({
  verdict,
  trustScore,
  aiSummary,
  fileName,
}: AIResultSummaryProps) => {
  const config = verdictConfig[verdict];

  return (
    <Card
      elevated
      className={`space-y-6 p-8 ${config.borderColor}`}
    >
      {/* Score Ring */}
      <div className="flex justify-center">
        <TrustScoreRing score={trustScore} animated={true} />
      </div>

      {/* Verdict Info */}
      <div className="space-y-4 text-center">
        <h2 className="text-2xl font-bold text-on-surface">
          {config.title}
        </h2>
        <VerdictBadge verdict={verdict} size="md" />
      </div>

      {/* AI Summary */}
      <div className="space-y-2 border-t border-outline-variant pt-4">
        <p className="text-xs font-semibold uppercase tracking-wider text-on-surface-variant">
          AI Summary
        </p>
        <p className="text-sm text-on-surface">
          {aiSummary}
        </p>
      </div>

      {/* File Info */}
      <div className="rounded-lg bg-surface-container-low p-3">
        <p className="text-xs text-on-surface-variant">
          Document verified:
        </p>
        <p className="truncate font-mono text-sm font-medium text-on-surface">
          {fileName}
        </p>
      </div>
    </Card>
  );
};
