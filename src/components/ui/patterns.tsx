import type * as React from "react";
import type { LucideIcon } from "lucide-react";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface PageHeaderProps extends React.HTMLAttributes<HTMLElement> {
  eyebrow?: string;
  title: string;
  description?: string;
  icon?: LucideIcon;
  actions?: React.ReactNode;
}

export function PageHeader({
  eyebrow,
  title,
  description,
  icon: Icon,
  actions,
  className,
  ...props
}: PageHeaderProps) {
  return (
    <header
      className={cn(
        "relative overflow-hidden rounded-[28px] border border-border/70 bg-white px-6 py-7 shadow-[0_30px_80px_-60px_rgba(29,29,31,0.35)] sm:px-8 sm:py-9",
        className
      )}
      {...props}
    >
      <div className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-[radial-gradient(circle_at_top,rgba(0,113,227,0.12),transparent_70%)]" />
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex min-w-0 items-start gap-4">
          {Icon && (
            <div className="grid h-12 w-12 shrink-0 place-items-center rounded-full border border-border bg-secondary text-primary">
              <Icon className="h-5 w-5" />
            </div>
          )}
          <div className="min-w-0">
            {eyebrow && (
              <p className="mb-2 text-[12px] tracking-[-0.01em] text-[#0066cc]">
                {eyebrow}
              </p>
            )}
            <h1 className="max-w-4xl text-[clamp(2.5rem,5vw,4.5rem)] font-semibold leading-[1.0834933333] tracking-[-0.03em] text-foreground">
              {title}
            </h1>
            {description && (
              <p className="paragraph-lg mt-3 max-w-3xl text-muted-foreground">
                {description}
              </p>
            )}
          </div>
        </div>
        {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
      </div>
    </header>
  );
}

export function SectionHeader({
  title,
  action,
  className,
}: {
  title: string;
  action?: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("mb-4 flex items-center justify-between gap-3", className)}>
      <p className="text-[12px] tracking-[-0.01em] text-muted-foreground">
        {title}
      </p>
      {action}
    </div>
  );
}

export function MetricCard({
  label,
  value,
  description,
  icon: Icon,
  tone = "primary",
}: {
  label: string;
  value: React.ReactNode;
  description?: string;
  icon?: LucideIcon;
  tone?: "primary" | "emerald" | "amber" | "sky" | "violet";
}) {
  const tones = {
    primary: "text-primary bg-primary/10 border-primary/20",
    emerald: "text-[#0066cc] bg-[#0066cc]/10 border-[#0066cc]/20",
    amber: "text-[#b64400] bg-[#ff791b]/10 border-[#ff791b]/20",
    sky: "text-primary bg-primary/10 border-primary/20",
    violet: "text-foreground bg-foreground/5 border-border",
  };

  return (
    <Card>
      <CardContent className="flex items-center gap-4 p-5">
        {Icon && (
          <div className={cn("grid h-11 w-11 shrink-0 place-items-center rounded-full border", tones[tone])}>
            <Icon className="h-5 w-5" />
          </div>
        )}
        <div className="min-w-0">
          <p className="text-[12px] tracking-[-0.01em] text-muted-foreground">
            {label}
          </p>
          <p className="mt-1 font-['SF_Pro_Display','SF_Pro_Icons','Helvetica_Neue',Helvetica,Arial,sans-serif] text-3xl font-semibold tracking-[-0.03em] text-foreground">{value}</p>
          {description && <p className="mt-1 truncate text-sm text-muted-foreground">{description}</p>}
        </div>
      </CardContent>
    </Card>
  );
}

export function DataPanel({
  title,
  children,
  className,
}: {
  title?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <Card className={className}>
      <CardContent className="p-5">
        {title && <SectionHeader title={title} />}
        {children}
      </CardContent>
    </Card>
  );
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  actionLabel,
  onAction,
}: {
  icon?: LucideIcon;
  title: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
}) {
  return (
    <Card className="border-dashed border-border/80 bg-secondary/55">
      <CardContent className="flex flex-col items-center justify-center px-6 py-12 text-center">
        {Icon && (
          <div className="mb-4 grid h-14 w-14 place-items-center rounded-full border border-border bg-white text-muted-foreground">
            <Icon className="h-6 w-6" />
          </div>
        )}
        <p className="text-base font-medium text-foreground">{title}</p>
        {description && <p className="mt-2 max-w-md text-sm text-muted-foreground">{description}</p>}
        {actionLabel && onAction && (
          <Button className="mt-5" onClick={onAction}>
            {actionLabel}
            <ArrowRight className="h-4 w-4" />
          </Button>
        )}
      </CardContent>
    </Card>
  );
}

export function Toolbar({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "flex flex-col gap-3 rounded-[22px] border border-border/80 bg-card p-3 shadow-[0_16px_36px_-30px_rgba(29,29,31,0.25)] sm:flex-row sm:items-center sm:justify-between",
        className
      )}
      {...props}
    />
  );
}
