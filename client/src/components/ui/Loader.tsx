import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

export function Loader({
  className,
  label = "Loading",
}: {
  className?: string;
  label?: string;
}) {
  return (
    <div
      className={cn(
        "flex items-center justify-center gap-2 text-sm text-muted",
        className,
      )}
      role="status"
      aria-live="polite"
    >
      <Loader2 className="size-4 animate-spin" />
      <span>{label}</span>
    </div>
  );
}
