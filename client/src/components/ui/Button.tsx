import { forwardRef, type ButtonHTMLAttributes } from "react";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
  loading?: boolean;
}

const variants: Record<NonNullable<ButtonProps["variant"]>, string> = {
  primary:
    "bg-primary text-white border border-line hover:opacity-90",
  secondary:
    "bg-secondary text-main border border-line hover:bg-foreground/80",
  outline:
    "bg-transparent text-main border border-line hover:bg-secondary",
  ghost: "bg-transparent text-main border border-transparent hover:bg-secondary",
  danger:
    "bg-transparent text-red-500 border border-red-500/40 hover:bg-red-500/10",
};

const sizes: Record<NonNullable<ButtonProps["size"]>, string> = {
  sm: "h-8 px-2.5 text-xs gap-1.5",
  md: "h-9 px-3 text-sm gap-2",
  lg: "h-10 px-4 text-sm gap-2",
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = "primary",
      size = "md",
      loading,
      disabled,
      children,
      ...props
    },
    ref,
  ) => {
    return (
      <button
        ref={ref}
        type="button"
        disabled={disabled ?? loading}
        className={cn(
          "inline-flex items-center justify-center rounded-sm font-medium transition-opacity disabled:cursor-not-allowed disabled:opacity-50",
          variants[variant],
          sizes[size],
          className,
        )}
        {...props}
      >
        {loading ? <Loader2 className="size-3.5 animate-spin" /> : null}
        {children}
      </button>
    );
  },
);
Button.displayName = "Button";
