import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center gap-1.5 rounded-full border px-3 py-1 font-['SF_Pro_Text','SF_Pro_Icons','Helvetica_Neue',Helvetica,Arial,sans-serif] text-[12px] font-normal tracking-[-0.01em] transition-colors",
  {
    variants: {
      variant: {
        default:
          "border-border bg-secondary text-foreground",
        primary:
          "border-transparent bg-foreground text-background",
        bold:
          "border-transparent bg-[#1d1d1f] px-3.5 py-1.5 text-white shadow-[0_16px_34px_-28px_rgba(29,29,31,0.75)]",
        accent:
          "border-transparent bg-primary text-primary-foreground",
        glass:
          "border-white/35 bg-white/15 text-current backdrop-blur-md",
        "glass-dark":
          "border-border bg-white/80 text-foreground backdrop-blur-md",
        success:
          "border-transparent bg-[#0066cc]/10 text-[#0066cc]",
        warning:
          "border-transparent bg-[#ff791b]/12 text-[#b64400]",
        error:
          "border-transparent bg-[#b64400]/12 text-[#b64400]",
        info:
          "border-transparent bg-primary/10 text-primary",
        outline:
          "border-border bg-transparent text-[#0066cc]",
        subtle:
          "border-transparent bg-muted text-muted-foreground",
        secondary:
          "border-transparent bg-secondary text-secondary-foreground",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {
  icon?: React.ReactNode;
}

function Badge({ className, variant, icon, children, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props}>
      {icon && <span className="inline-flex items-center">{icon}</span>}
      {children}
    </div>
  );
}

interface StatusBadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  status: "online" | "offline" | "away" | "busy";
  label?: string;
}

const statusConfig = {
  online: { color: "bg-emerald-500" },
  offline: { color: "bg-muted-foreground" },
  away: { color: "bg-amber-500" },
  busy: { color: "bg-red-500" },
} as const;

function StatusBadge({ className, status, label, ...props }: StatusBadgeProps) {
  const config = statusConfig[status];
  const statusLabel = label || status;

  return (
    <div
      className={cn(
        "inline-flex items-center gap-2 text-[12px] tracking-[-0.01em] text-muted-foreground",
        className
      )}
      {...props}
    >
      <span className={cn("w-2 h-2 rounded-full", config.color)} />
      <span>{statusLabel}</span>
    </div>
  );
}

interface CountBadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  count: number;
  max?: number;
}

function CountBadge({ className, count, max = 99, ...props }: CountBadgeProps) {
  const display = count > max ? `${max}+` : count.toString();

  return (
    <span
      className={cn(
        "inline-flex items-center justify-center",
        "min-w-[1.25rem] h-5 px-1.5",
        "bg-primary text-primary-foreground",
        "text-[10px] font-medium tabular-nums",
        "rounded-full",
        className
      )}
      {...props}
    >
      {display}
    </span>
  );
}

export { Badge, badgeVariants, StatusBadge, CountBadge };
