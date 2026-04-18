/**
 * TOTUM BADGE — Editorial DS v6
 *
 * Pill-forward badge set tuned to the editorial palette. Uses the
 * semantic color tokens (`foreground`, `accent`, `muted`…) so every
 * variant adapts between light and dark themes automatically.
 */

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center gap-1.5 font-sans text-[11px] font-medium uppercase tracking-[0.18em] rounded-full transition-colors",
  {
    variants: {
      variant: {
        // Default: soft neutral pill
        default:
          "bg-muted text-foreground border border-border px-2.5 py-0.5",

        // Primary: inverted-ink pill (like the reference "BOLD" red label, but in editorial ink)
        primary:
          "bg-foreground text-background border-transparent px-2.5 py-0.5",

        // Bold: signature rotated pill used on hero sections
        bold:
          "bg-foreground text-background border-transparent px-3 py-1 -rotate-2 text-[10px] tracking-[0.25em] font-semibold",

        // Accent: editorial blue pill
        accent:
          "bg-accent text-accent-foreground border-transparent px-2.5 py-0.5",

        // Glass: translucent on colored backgrounds
        glass:
          "bg-white/10 text-current border border-white/25 backdrop-blur-md px-3 py-1",

        // Glass-dark: translucent on light backgrounds
        "glass-dark":
          "bg-foreground/[0.04] text-foreground border border-border backdrop-blur-md px-3 py-1",

        // Semantic states
        success:
          "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border-transparent px-2.5 py-0.5",
        warning:
          "bg-amber-500/15 text-amber-700 dark:text-amber-300 border-transparent px-2.5 py-0.5",
        error:
          "bg-red-500/15 text-red-700 dark:text-red-300 border-transparent px-2.5 py-0.5",
        info:
          "bg-blue-500/15 text-blue-700 dark:text-blue-300 border-transparent px-2.5 py-0.5",

        // Outline: bordered pill
        outline:
          "bg-transparent border border-border text-muted-foreground px-2.5 py-0.5",

        // Subtle: surface-muted pill
        subtle:
          "bg-muted text-muted-foreground border-transparent px-2.5 py-0.5",

        // Secondary: alias for subtle (kept for call-site compatibility)
        secondary:
          "bg-secondary text-secondary-foreground border-transparent px-2.5 py-0.5",
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

// ───────────────────────────────────────────────────────────────
// StatusBadge — online / offline / away / busy with a dot
// ───────────────────────────────────────────────────────────────
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
        "inline-flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.22em] text-muted-foreground",
        className
      )}
      {...props}
    >
      <span className={cn("w-2 h-2 rounded-full", config.color)} />
      <span>{statusLabel}</span>
    </div>
  );
}

// ───────────────────────────────────────────────────────────────
// CountBadge — compact numeric badge (notifications, counters)
// ───────────────────────────────────────────────────────────────
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
        "bg-foreground text-background",
        "text-[10px] font-semibold tabular-nums",
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
