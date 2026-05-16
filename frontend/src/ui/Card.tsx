import React from 'react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  elevated?: boolean;
}

export const Card = ({ className, elevated, children, ...props }: CardProps) => {
  return (
    <div
      className={cn(
        'rounded-xl border border-outline-variant bg-white transition-shadow',
        elevated && 'shadow-[0px_4px_12px_rgba(15,45,94,0.08)]',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};
