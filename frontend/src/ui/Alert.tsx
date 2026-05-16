import React from "react";
import {
  AlertCircle,
  CheckCircle2,
  AlertTriangle,
  Info,
  X,
} from "lucide-react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface AlertProps extends React.HTMLAttributes<HTMLDivElement> {
  type: "success" | "warning" | "error" | "info";
  message: string | React.ReactNode;
  onClose?: () => void;
}

export const Alert = ({
  type,
  message,
  onClose,
  className,
  ...props
}: AlertProps) => {
  const typeConfig = {
    success: {
      icon: CheckCircle2,
      bgClass: "bg-green-50 border-green-300",
      textClass: "text-green-800",
      iconClass: "text-green-600",
    },
    warning: {
      icon: AlertTriangle,
      bgClass: "bg-yellow-50 border-yellow-300",
      textClass: "text-yellow-800",
      iconClass: "text-yellow-600",
    },
    error: {
      icon: AlertCircle,
      bgClass: "bg-red-50 border-red-300",
      textClass: "text-red-800",
      iconClass: "text-error",
    },
    info: {
      icon: Info,
      bgClass: "bg-blue-50 border-blue-300",
      textClass: "text-blue-800",
      iconClass: "text-blue-600",
    },
  };

  const config = typeConfig[type];
  const Icon = config.icon;

  return (
    <div
      role="alert"
      className={cn(
        "flex items-start gap-3 rounded border px-4 py-3",
        config.bgClass,
        className,
      )}
      {...props}
    >
      <Icon className={cn("mt-0.5 h-5 w-5 flex-shrink-0", config.iconClass)} />
      <div className={cn("flex-1 text-sm font-medium", config.textClass)}>
        {message}
      </div>
      {onClose && (
        <button
          onClick={onClose}
          className={cn(
            "flex-shrink-0 rounded p-1 transition-colors hover:bg-black/10",
            config.textClass,
          )}
          aria-label="Close alert"
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  );
};
