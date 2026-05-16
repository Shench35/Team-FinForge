import { DimensionBar } from "../badges/DimensionBar";

interface DimensionBreakdownProps {
  visualAuthenticity: number;
  textIntegrity: number;
  structuralPattern: number;
  metadataConsistency: number;
}

export const DimensionBreakdown = ({
  visualAuthenticity,
  textIntegrity,
  structuralPattern,
  metadataConsistency,
}: DimensionBreakdownProps) => {
  return (
    <div className="space-y-6">
      <div>
        <p className="mb-4 text-xs font-semibold uppercase tracking-wider text-on-surface-variant">
          Dimension Breakdown
        </p>
        <h3 className="text-lg font-semibold text-on-surface">
          Technical Integrity Analysis
        </h3>
      </div>

      <div className="space-y-4">
        <DimensionBar
          label="Visual Authenticity"
          value={visualAuthenticity}
          animated={true}
        />
        <DimensionBar
          label="Text Integrity"
          value={textIntegrity}
          animated={true}
        />
        <DimensionBar
          label="Structural Pattern"
          value={structuralPattern}
          animated={true}
        />
        <DimensionBar
          label="Metadata Consistency"
          value={metadataConsistency}
          animated={true}
        />
      </div>
    </div>
  );
};
