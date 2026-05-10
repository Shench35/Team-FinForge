import React from 'react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  success?: boolean;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, success, id, ...props }, ref) => {
    const inputId = id || React.useId();

    return (
      <div className="w-full space-y-1.5">
        {label && (
          <label
            htmlFor={inputId}
            className="block text-xs font-semibold uppercase tracking-wider text-on-surface-variant"
          >
            {label}
          </label>
        )}
        <div className="relative">
          <input
            id={inputId}
            ref={ref}
            className={cn(
              'w-full rounded border border-outline-variant bg-white px-4 py-2.5 text-on-surface outline-none transition-all',
              'focus:border-primary focus:ring-2 focus:ring-secondary/20',
              error && 'border-error focus:ring-error/20',
              success && 'border-secondary focus:ring-secondary/20',
              className
            )}
            {...props}
          />
          {success && (
            <div className="absolute inset-y-0 right-3 flex items-center text-secondary">
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
          )}
        </div>
        {error && <p className="text-sm text-error">{error}</p>}
      </div>
    );
  }
);

Input.displayName = 'Input';
