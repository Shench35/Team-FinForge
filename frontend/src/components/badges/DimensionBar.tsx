import { useEffect, useState } from "react";

interface DimensionBarProps {
  label: string;
  value: number; // 0-100
  animated?: boolean;
}

export const DimensionBar = ({
  label,
  value,
  animated = true,
}: DimensionBarProps) => {
  const [displayValue, setDisplayValue] = useState(animated ? 0 : value);

  useEffect(() => {
    if (!animated) return;

    const interval = setInterval(() => {
      setDisplayValue((prev) => {
        if (prev >= value) {
          clearInterval(interval);
          return value;
        }
        return prev + 2; // Increment by 2 per interval
      });
    }, 20);

    return () => clearInterval(interval);
  }, [value, animated]);

  const barColor =
    displayValue >= 80
      ? "#006c4e" // Teal (secondary)
      : displayValue >= 50
        ? "#f59e0b" // Amber
        : "#ba1a1a"; // Red (error)

  return (
    <div className="flex items-center gap-4">
      {/* Label */}
      <div className="min-w-fit text-sm font-medium text-on-surface">
        {label}
      </div>

      {/* Progress Bar */}
      <div className="flex-1">
        <div className="relative h-2 overflow-hidden rounded-full bg-outline-variant">
          <div
            className="h-full rounded-full transition-all"
            style={{
              width: `${displayValue}%`,
              backgroundColor: barColor,
            }}
          />
        </div>
      </div>

      {/* Percentage */}
      <div className="min-w-fit text-right text-sm font-semibold text-on-surface">
        {displayValue}%
      </div>
    </div>
  );
};
