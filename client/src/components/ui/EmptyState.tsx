import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description?: string;
  action?: ReactNode;  className?: string;
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center gap-2 rounded-sm border border-dashed border-line bg-secondary/30 px-6 py-10 text-center",
        className,
      )}
    >
      <Icon className="size-8 text-muted" aria-hidden />
      <p className="text-sm font-medium text-main">{title}</p>
      {description ? (
        <p className="max-w-sm text-xs text-muted">{description}</p>
      ) : null}
      {action ? <div className="pt-2">{action}</div> : null}
    </div>
  );
}
