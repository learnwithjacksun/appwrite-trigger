import type {
  HTMLAttributes,
  TableHTMLAttributes,
  TdHTMLAttributes,
  ThHTMLAttributes,
} from "react";
import { cn } from "@/lib/utils";

export function Table({
  className,
  ...props
}: TableHTMLAttributes<HTMLTableElement>) {
  return (
    <div className="w-full overflow-x-auto rounded-sm border border-line">
      <table
        className={cn("w-full border-collapse text-left text-sm", className)}
        {...props}
      />
    </div>
  );
}

export function THead({
  className,
  ...props
}: HTMLAttributes<HTMLTableSectionElement>) {
  return (
    <thead
      className={cn(
        "bg-secondary/80 text-xs uppercase tracking-wide text-muted",
        className,
      )}
      {...props}
    />
  );
}

export function TBody({
  className,
  ...props
}: HTMLAttributes<HTMLTableSectionElement>) {
  return (
    <tbody
      className={cn("divide-y divide-line bg-background", className)}
      {...props}
    />
  );
}

export function Tr({
  className,
  ...props
}: HTMLAttributes<HTMLTableRowElement>) {
  return <tr className={cn("hover:bg-secondary/40", className)} {...props} />;
}

export function Th({
  className,
  ...props
}: ThHTMLAttributes<HTMLTableCellElement>) {
  return (
    <th
      className={cn("px-3 py-2 font-medium whitespace-nowrap", className)}
      {...props}
    />
  );
}

export function Td({
  className,
  ...props
}: TdHTMLAttributes<HTMLTableCellElement>) {
  return (
    <td
      className={cn("px-3 py-2 text-main whitespace-nowrap", className)}
      {...props}
    />
  );
}
