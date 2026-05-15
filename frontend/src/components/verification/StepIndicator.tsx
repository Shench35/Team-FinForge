import { Check, Loader2 } from 'lucide-react';

const VERIFICATION_STEPS = [
  { id: 1, label: 'Payment' },
  { id: 2, label: 'Upload Certificate' },
  { id: 3, label: 'Get Results' },
];

interface StepIndicatorProps {
  currentStep: number; // 1 to 3
  isProcessing?: boolean;
}

export const StepIndicator = ({ currentStep, isProcessing }: StepIndicatorProps) => {
  return (
    <div className="w-full">
      {/* Mobile view */}
      <div className="md:hidden space-y-3">
        <div className="flex justify-between items-end">
          <span className="text-xs font-bold text-on-surface-variant uppercase tracking-widest">
            Step {currentStep} of {VERIFICATION_STEPS.length}
          </span>
          <span className="text-sm font-semibold text-primary">
            {VERIFICATION_STEPS[currentStep - 1]?.label}
          </span>
        </div>
        <div className="h-1.5 w-full bg-surface-container-high rounded-full overflow-hidden">
          <div 
            className="h-full bg-secondary transition-all duration-500 ease-out"
            style={{ width: `${(currentStep / VERIFICATION_STEPS.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Desktop view */}
      <div className="hidden md:flex items-center justify-between relative">
        {/* Background Line */}
        <div className="absolute top-5 left-0 right-0 h-0.5 bg-outline-variant -z-10" />
        
        {VERIFICATION_STEPS.map((step) => {
          const isCompleted = step.id < currentStep;
          const isActive = step.id === currentStep;

          return (
            <div key={step.id} className="flex flex-col items-center gap-3">
              <div 
                className={`
                  w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-300
                  ${isCompleted ? 'bg-secondary border-secondary text-white' : ''}
                  ${isActive ? 'bg-white border-primary text-primary shadow-lg scale-110' : ''}
                  ${!isActive && !isCompleted ? 'bg-white border-outline-variant text-on-surface-variant' : ''}
                `}
              >
                {isCompleted ? (
                  <Check className="w-5 h-5" />
                ) : isActive && isProcessing ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <span className="text-sm font-bold">{step.id}</span>
                )}
              </div>
              <span className={`text-[10px] font-bold uppercase tracking-tighter text-center max-w-[80px] ${isActive ? 'text-primary' : 'text-on-surface-variant'}`}>
                {step.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
