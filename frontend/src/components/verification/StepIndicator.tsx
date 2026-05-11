import { Check, Loader2 } from 'lucide-react';
import { PROCESSING_STEPS } from '../../utils/constants';

interface StepIndicatorProps {
  currentStep: number; // 1 to 6
  isProcessing?: boolean;
}

export const StepIndicator = ({ currentStep, isProcessing }: StepIndicatorProps) => {
  return (
    <div className="w-full">
      {/* Mobile view (Simple progress bar + current step name) */}
      <div className="md:hidden space-y-3">
        <div className="flex justify-between items-end">
          <span className="text-xs font-bold text-on-surface-variant uppercase tracking-widest">
            Step {currentStep} of {PROCESSING_STEPS.length}
          </span>
          <span className="text-sm font-semibold text-primary">
            {PROCESSING_STEPS[currentStep - 1].label}
          </span>
        </div>
        <div className="h-1.5 w-full bg-surface-container-high rounded-full overflow-hidden">
          <div 
            className="h-full bg-secondary transition-all duration-500 ease-out"
            style={{ width: `${(currentStep / PROCESSING_STEPS.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Desktop view (Horizontal steps with icons) */}
      <div className="hidden md:flex items-center justify-between relative">
        {/* Background Line */}
        <div className="absolute top-5 left-0 right-0 h-0.5 bg-outline-variant -z-10" />
        
        {PROCESSING_STEPS.map((step) => {
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
