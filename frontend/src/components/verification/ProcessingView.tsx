import { CheckCircle2, Circle } from "lucide-react";
import { Card } from "../../ui/Card";
import { Spinner } from "../../ui/Spinner";
import { PROCESSING_STEPS } from "../../utils/constants";

interface ProcessingViewProps {
  currentStep?: number; // 1-6 based on PROCESSING_STEPS
  isComplete?: boolean;
  isFailed?: boolean;
}

export const ProcessingView = ({
  currentStep = 1,
  isComplete = false,
  isFailed = false,
}: ProcessingViewProps) => {
  const safeStep = Math.min(
    Math.max(currentStep, 1),
    PROCESSING_STEPS.length,
  );

  return (
    <div className="flex items-center justify-center min-h-screen bg-surface p-4">
      <Card className="w-full max-w-2xl space-y-8 p-8">
        {/* Header */}
        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-on-surface">
            Analyzing Documents
          </h2>
          <p className="text-sm text-on-surface-variant">
            Our institutional verification engine is processing your request.
          </p>
        </div>

        {/* Steps Pipeline */}
        <div className="space-y-4">
          {PROCESSING_STEPS.map((step) => {
            const stepNumber = step.id;
            const isCompleted = stepNumber < safeStep;
            const isCurrent = stepNumber === safeStep;

            return (
              <div key={step.id} className="flex items-center gap-4">
                {/* Icon */}
                <div className="flex-shrink-0">
                  {isCompleted ? (
                    <CheckCircle2 className="h-6 w-6 text-secondary" />
                  ) : isCurrent ? (
                    <div className="h-6 w-6">
                      <Spinner size="md" color="text-secondary" />
                    </div>
                  ) : (
                    <Circle className="h-6 w-6 text-outline-variant" />
                  )}
                </div>

                {/* Label */}
                <span
                  className={`text-sm font-medium ${
                    isCompleted || isCurrent
                      ? "text-on-surface"
                      : "text-on-surface-variant"
                  }`}
                >
                  {step.label}
                </span>
              </div>
            );
          })}
        </div>

        {/* Status Message */}
        <div className="rounded-lg bg-surface-container-low p-4">
          {isComplete ? (
            <div className="space-y-2">
              <p className="font-semibold text-secondary">
                ✓ Analysis complete
              </p>
              <p className="text-sm text-on-surface-variant">
                Redirecting to results... Please wait.
              </p>
            </div>
          ) : isFailed ? (
            <div className="space-y-2">
              <p className="font-semibold text-error">✗ Verification failed</p>
              <p className="text-sm text-on-surface-variant">
                An error occurred during processing. Please try again.
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              <p className="font-semibold text-on-surface">
                Step {safeStep} of {PROCESSING_STEPS.length}
              </p>
              <p className="text-sm text-on-surface-variant">
                This usually takes under 2 minutes. Please don't close this tab.
              </p>
            </div>
          )}
        </div>

        {/* Progress Indicator */}
        <div className="space-y-2">
          <div className="h-2 overflow-hidden rounded-full bg-outline-variant">
            <div
              className="h-full bg-secondary transition-all duration-500"
              style={{
                width: `${((safeStep - 1) / PROCESSING_STEPS.length) * 100}%`,
              }}
            />
          </div>
          <p className="text-center text-xs text-on-surface-variant">
            {Math.round(((safeStep - 1) / PROCESSING_STEPS.length) * 100)}%
          </p>
        </div>
      </Card>
    </div>
  );
};
