import { forwardRef, type InputHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, hint, id, ...props }, ref) => {
    const inputId = id ?? props.name;
    return (
      <div className="flex w-full flex-col gap-1">
        {label ? (
          <label
            htmlFor={inputId}
            className="text-xs font-medium text-muted"
          >
            {label}
          </label>
        ) : null}
        <input
          ref={ref}
          id={inputId}
          className={cn(
            "h-9 w-full rounded-sm border border-line bg-background px-3 text-sm text-main placeholder:text-muted focus-visible:ring-1 focus-visible:ring-main/30",
            error ? "border-red-500/60" : "",
            className,
          )}
          {...props}
        />
        {hint && !error ? (
          <p className="text-xs text-muted">{hint}</p>
        ) : null}
        {error ? (
          <p className="text-xs text-red-500">{error}</p>
        ) : null}
      </div>
    );
  },
);
Input.displayName = "Input";
