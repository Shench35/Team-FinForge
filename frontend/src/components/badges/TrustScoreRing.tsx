import { useEffect, useState } from "react";
import {
  RadialBarChart,
  RadialBar,
  PolarAngleAxis,
  ResponsiveContainer,
} from "recharts";
import { VerdictBadge } from "./VerdictBadge";
import { scoreToVerdict } from "../../utils/formatters";

interface TrustScoreRingProps {
  score: number; // 0-100
  animated?: boolean;
}

export const TrustScoreRing = ({
  score,
  animated = true,
}: TrustScoreRingProps) => {
  const [displayScore, setDisplayScore] = useState(animated ? 0 : score);
  const verdict = scoreToVerdict(score);

  const scoreColor =
    score >= 80 ? "#006c4e" : score >= 50 ? "#f59e0b" : "#ba1a1a";

  useEffect(() => {
    if (!animated) return;

    const interval = setInterval(() => {
      setDisplayScore((prev) => {
        if (prev >= score) {
          clearInterval(interval);
          return score;
        }
        return prev + 2; // Increment by 2 per interval
      });
    }, 20);

    return () => clearInterval(interval);
  }, [score, animated]);

  const data = [{ name: "score", value: displayScore, fill: scoreColor }];

  return (
    <div className="flex flex-col items-center gap-4">
      {/* Radial Bar Chart */}
      <div className="h-40 w-40">
        <ResponsiveContainer width="100%" height="100%">
          <RadialBarChart data={data} innerRadius="60%" outerRadius="100%">
            <PolarAngleAxis
              type="number"
              domain={[0, 100]}
              angleAxisId={0}
              tick={false}
            />
            <RadialBar
              background
              dataKey="value"
              cornerRadius={8}
              angleAxisId={0}
            />
          </RadialBarChart>
        </ResponsiveContainer>
      </div>

      {/* Score Text */}
      <div className="text-center">
        <div className="text-4xl font-bold text-on-surface">{displayScore}</div>
        <div className="text-sm text-on-surface-variant">/ 100</div>
      </div>

      {/* Verdict Badge */}
      <VerdictBadge verdict={verdict} size="md" />
    </div>
  );
};
