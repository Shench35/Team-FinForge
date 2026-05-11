import { Badge } from "../../ui/Badge";
import { SEVERITY_CONFIG } from "../../utils/constants";

interface SeverityBadgeProps {
  severity: "LOW" | "MEDIUM" | "HIGH";
  size?: "sm" | "md";
}

export const SeverityBadge = ({
  severity,
  size = "sm",
}: SeverityBadgeProps) => {
  const config = SEVERITY_CONFIG[severity];

  const colorMap = {
    LOW: "bg-amber-100 text-amber-700",
    MEDIUM: "bg-orange-100 text-orange-700",
    HIGH: "bg-red-100 text-red-700",
  };

  return (
    <Badge
      label={config.label}
      size={size}
      className={`${colorMap[severity]} font-semibold`}
    />
  );
};
