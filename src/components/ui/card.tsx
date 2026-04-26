/**
 * TOTUM CARD — Editorial DS v6
 *
 * Editorial, rounded, light-first cards that adapt to dark mode via
 * semantic tokens. Preserves the original component surface:
 *   Card, CardHeader, CardTitle, CardDescription, CardContent,
 *   CardFooter, ListItemCard, TechCard, StatCard.
 *
 * The `cornerAccents` prop is kept for call-site compatibility but
 * is no longer rendered — the editorial style uses soft ink borders
 * plus hover elevation instead of hard red corners.
 */

import * as React from "react";
import { cn } from "@/lib/utils";

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  /** @deprecated Preserved for call-site compatibility; has no visual effect in the editorial DS. */
  cornerAccents?: boolean;
  /** @deprecated Legacy alias for cornerAccents from older dashboard cards. */
  cornerMarks?: boolean;
  hoverGlow?: boolean;
}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({
    className,
    cornerAccents: _cornerAccents = false,
    cornerMarks: _cornerMarks = false,
    hoverGlow = true,
    children,
    ...props
  }, ref) => (
    <div
      ref={ref}
      className={cn(
        "relative bg-card text-card-foreground border border-border/80 rounded-xl overflow-hidden shadow-[0_0_0_1px_rgba(255,255,255,0.02)]",
        hoverGlow && [
          "transition-all duration-300 ease-out",
          "hover:-translate-y-px",
          "hover:border-primary/40 hover:shadow-[0_18px_60px_-35px_hsl(var(--primary)/0.55)]",
        ],
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
);
Card.displayName = "Card";

const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-col space-y-1.5 p-6", className)}
    {...props}
  />
));
CardHeader.displayName = "CardHeader";

const CardTitle = React.forwardRef<
  HTMLHeadingElement,
  React.HTMLAttributes<HTMLHeadingElement> & { as?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6" }
>(({ className, as: Component = "h3", ...props }, ref) => (
  <Component
    ref={ref}
    className={cn(
      "font-display text-lg font-semibold tracking-tight text-foreground",
      className
    )}
    {...props}
  />
));
CardTitle.displayName = "CardTitle";

const CardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("text-sm text-muted-foreground leading-relaxed", className)}
    {...props}
  />
));
CardDescription.displayName = "CardDescription";

const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("p-6", className)} {...props} />
));
CardContent.displayName = "CardContent";

const CardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex items-center p-6 pt-0", className)}
    {...props}
  />
));
CardFooter.displayName = "CardFooter";

// ────────────────────────────────────────────────────────────────
// ListItemCard — row-style hover card with accent bar
// ────────────────────────────────────────────────────────────────
interface ListItemCardProps extends React.HTMLAttributes<HTMLDivElement> {
  number?: string;
  title: string;
  showAccentBar?: boolean;
}

const ListItemCard = React.forwardRef<HTMLDivElement, ListItemCardProps>(
  ({ className, number, title, showAccentBar = true, children, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "relative flex items-center justify-between",
        "p-6 bg-transparent border-b border-border",
        "overflow-hidden transition-colors duration-300",
        "hover:bg-muted/60 cursor-pointer group",
        className
      )}
      {...props}
    >
      {showAccentBar && (
        <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-accent transform -translate-x-full group-hover:translate-x-0 transition-transform duration-200" />
      )}
      <div className="transition-transform duration-300 group-hover:translate-x-2">
        {number && (
          <span className="block text-[10px] text-muted-foreground font-medium tracking-[0.25em] mb-1 group-hover:text-accent transition-colors uppercase">
            {number}
          </span>
        )}
        <h4 className="text-lg text-foreground font-display font-semibold tracking-tight">
          {title}
        </h4>
        {children}
      </div>
    </div>
  )
);
ListItemCard.displayName = "ListItemCard";

// ────────────────────────────────────────────────────────────────
// TechCard — headline label + status pips, rounded editorial style
// ────────────────────────────────────────────────────────────────
interface TechCardProps extends React.HTMLAttributes<HTMLDivElement> {
  label?: string;
  status?: string;
}

const TechCard = React.forwardRef<HTMLDivElement, TechCardProps>(
  ({ className, label = "System Status", status: _status, children, ...props }, ref) => (
    <Card
      ref={ref}
      className={cn("p-6 flex flex-col justify-between min-h-[200px]", className)}
      {...props}
    >
      <div className="flex items-center justify-between border-b border-border border-dashed pb-4 mb-4">
        <span className="text-[10px] text-accent tracking-[0.25em] uppercase font-semibold">
          [ {label} ]
        </span>
        <div className="flex gap-1.5">
          <div className="w-1.5 h-1.5 bg-accent animate-pulse rounded-full" />
          <div className="w-1.5 h-1.5 bg-border rounded-full" />
        </div>
      </div>
      {children}
    </Card>
  )
);
TechCard.displayName = "TechCard";

// ────────────────────────────────────────────────────────────────
// StatCard — large numeric value with mono label
// ────────────────────────────────────────────────────────────────
interface StatCardProps extends React.HTMLAttributes<HTMLDivElement> {
  value: string;
  label: string;
  icon?: React.ReactNode;
}

const StatCard = React.forwardRef<HTMLDivElement, StatCardProps>(
  ({ className, value, label, icon, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "p-6 flex flex-col justify-between",
        "border-b border-border/70 last:border-b-0",
        "group hover:bg-muted/60 transition-colors duration-200",
        className
      )}
      {...props}
    >
      <div className="text-3xl text-muted-foreground group-hover:text-foreground transition-colors duration-200">
        {icon}
      </div>
      <div>
        <div className="text-5xl font-display font-semibold tracking-tighter text-foreground">
          {value}
        </div>
        <span className="text-[10px] text-muted-foreground mt-2 block uppercase tracking-[0.25em] font-medium">
          {label}
        </span>
      </div>
    </div>
  )
);
StatCard.displayName = "StatCard";

export {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardDescription,
  CardContent,
  ListItemCard,
  TechCard,
  StatCard,
};
