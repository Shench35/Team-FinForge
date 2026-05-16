import React from 'react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  label: string;
  color?: string; // Optional hex or custom class tint
  size?: 'sm' | 'md';
}

export const Badge = ({ className, label, size = 'sm', ...props }: BadgeProps) => {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full font-bold uppercase tracking-widest',
        size === 'sm' ? 'px-2 py-0.5 text-[10px]' : 'px-3 py-1 text-xs',
        className
      )}
      {...props}
    >
      {label}
    </span>
  );
};
