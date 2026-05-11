import React, { useEffect } from "react";
import { X } from "lucide-react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface ModalProps extends React.HTMLAttributes<HTMLDivElement> {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  actions?: React.ReactNode;
}

export const Modal = ({
  open,
  onClose,
  title,
  children,
  actions,
  className,
  ...props
}: ModalProps) => {
  // Close on Escape key
  useEffect(() => {
    if (!open) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-40 bg-black/50 transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal */}
      <div
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        role="dialog"
        aria-modal="true"
        {...props}
      >
        <div
          className={cn(
            "relative w-full max-w-md rounded-xl border border-outline-variant bg-white shadow-[0px_4px_12px_rgba(15,45,94,0.08)]",
            className,
          )}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          {title && (
            <div className="flex items-center justify-between border-b border-outline-variant px-6 py-4">
              <h2 className="text-xl font-bold text-on-surface">{title}</h2>
              <button
                onClick={onClose}
                className="rounded p-1 text-on-surface-variant transition-colors hover:bg-surface-container-low"
                aria-label="Close modal"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          )}

          {/* Body */}
          <div className="px-6 py-4">{children}</div>

          {/* Footer with actions */}
          {actions && (
            <div className="flex gap-3 border-t border-outline-variant px-6 py-4">
              {actions}
            </div>
          )}
        </div>
      </div>
    </>
  );
};
