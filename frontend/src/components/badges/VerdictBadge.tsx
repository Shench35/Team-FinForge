import { Badge } from "../../ui/Badge";
import { VERDICT_CONFIG } from "../../utils/constants";

interface VerdictBadgeProps {
  verdict: "LIKELY_AUTHENTIC" | "SUSPICIOUS" | "HIGH_RISK";
  size?: "sm" | "md";
}

export const VerdictBadge = ({ verdict, size = "md" }: VerdictBadgeProps) => {
  const config = VERDICT_CONFIG[verdict];

  const colorMap = {
    LIKELY_AUTHENTIC: "bg-green-100 text-green-700",
    SUSPICIOUS: "bg-amber-100 text-amber-700",
    HIGH_RISK: "bg-red-100 text-red-700",
  };

  return (
    <Badge
      label={config.label}
      size={size}
      className={`${colorMap[verdict]} font-semibold`}
    />
  );
};
