import { Download, Share2, Flag, AlertTriangle } from "lucide-react";
import { Button } from "../../ui/Button";

interface ResultActionsProps {
  verdict: "LIKELY_AUTHENTIC" | "SUSPICIOUS" | "HIGH_RISK";
  onDownload?: () => void;
  onVerifyAnother?: () => void;
  onExport?: () => void;
  onManualOverride?: () => void;
  onRequestReVerification?: () => void;
  onGenerateFraudReport?: () => void;
  onFlagForReview?: () => void;
}

export const ResultActions = ({
  verdict,
  onDownload,
  onVerifyAnother,
  onExport,
  onManualOverride,
  onRequestReVerification,
  onGenerateFraudReport,
  onFlagForReview,
}: ResultActionsProps) => {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:gap-4">
      {verdict === "LIKELY_AUTHENTIC" && (
        <>
          <Button
            type="button"
            variant="primary"
            className="flex items-center gap-2"
            onClick={onDownload}
            disabled={!onDownload}
          >
            <Download className="h-4 w-4" />
            Download PDF Report
          </Button>
          <Button
            type="button"
            variant="outlined"
            className="flex items-center gap-2"
            onClick={onVerifyAnother}
            disabled={!onVerifyAnother}
          >
            Verify Another Certificate
          </Button>
        </>
      )}

      {verdict === "SUSPICIOUS" && (
        <>
          <Button
            type="button"
            variant="primary"
            className="flex items-center gap-2"
            onClick={onExport}
            disabled={!onExport}
          >
            <Share2 className="h-4 w-4" />
            Export Report
          </Button>
          <Button
            type="button"
            variant="outlined"
            className="flex items-center gap-2"
            onClick={onManualOverride}
            disabled={!onManualOverride}
          >
            Manual Override
          </Button>
          <Button
            type="button"
            variant="outlined"
            className="flex items-center gap-2"
            onClick={onRequestReVerification}
            disabled={!onRequestReVerification}
          >
            Request Re-verification
          </Button>
        </>
      )}

      {verdict === "HIGH_RISK" && (
        <>
          <Button
            type="button"
            variant="danger"
            className="flex items-center gap-2"
            onClick={onGenerateFraudReport}
            disabled={!onGenerateFraudReport}
          >
            <AlertTriangle className="h-4 w-4" />
            Generate Fraud Report
          </Button>
          <Button
            type="button"
            variant="outlined"
            className="flex items-center gap-2"
            onClick={onFlagForReview}
            disabled={!onFlagForReview}
          >
            <Flag className="h-4 w-4" />
            Flag for Manual Review
          </Button>
          <Button
            type="button"
            variant="outlined"
            className="flex items-center gap-2"
            onClick={onDownload}
            disabled={!onDownload}
          >
            <Download className="h-4 w-4" />
            Download Original
          </Button>
        </>
      )}
    </div>
  );
};
