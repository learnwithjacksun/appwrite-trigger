import { useEffect, type ReactNode } from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/Button";

export interface ModalProps {
  open: boolean;
  title: string;
  description?: string;
  onClose: () => void;
  children: ReactNode;
  footer?: ReactNode;
  className?: string;
}

export function Modal({
  open,
  title,
  description,
  onClose,
  children,
  footer,
  className,
}: ModalProps) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <button
        type="button"
        aria-label="Close overlay"
        className="absolute inset-0 bg-black/60"
        onClick={onClose}
      />
      <div
        role="dialog"
        aria-modal="true"
        className={cn(
          "relative z-10 w-full max-w-lg rounded-sm border border-line bg-background shadow-xl",
          className,
        )}
      >
        <div className="flex items-start justify-between gap-3 border-b border-line px-4 py-3">
          <div>
            <h2 className="text-sm font-semibold text-main">{title}</h2>
            {description ? (
              <p className="mt-0.5 text-xs text-muted">{description}</p>
            ) : null}
          </div>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="size-8 shrink-0 p-0"
            onClick={onClose}
            aria-label="Close"
          >
            <X size={20} />
          </Button>
        </div>
        <div className="max-h-[70vh] overflow-y-auto px-4 py-3">{children}</div>
        {footer ? (
          <div className="flex items-center justify-end gap-2 border-t border-line px-4 py-3">
            {footer}
          </div>
        ) : null}
      </div>
    </div>
  );
}
