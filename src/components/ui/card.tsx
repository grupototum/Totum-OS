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
        "relative overflow-hidden rounded-[18px] border border-border/80 bg-card text-card-foreground shadow-[0_18px_50px_-36px_rgba(29,29,31,0.24)]",
        hoverGlow && [
          "transition-all duration-300 ease-out hover:-translate-y-px",
          "hover:border-primary/25 hover:shadow-[0_28px_60px_-38px_rgba(29,29,31,0.28)]",
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
      "font-['SF_Pro_Display','SF_Pro_Icons','Helvetica_Neue',Helvetica,Arial,sans-serif] text-[24px] font-semibold leading-[1.1666666667] tracking-[0.009em] text-foreground",
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
    className={cn("text-sm leading-relaxed tracking-[-0.016em] text-muted-foreground", className)}
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
        "rounded-[18px] border border-border/70 bg-card p-6",
        "overflow-hidden transition-colors duration-300",
        "cursor-pointer group hover:bg-secondary/80",
        className
      )}
      {...props}
    >
      {showAccentBar && (
        <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-accent transform -translate-x-full group-hover:translate-x-0 transition-transform duration-200" />
      )}
      <div className="transition-transform duration-300 group-hover:translate-x-2">
        {number && (
          <span className="mb-1 block text-[12px] tracking-[-0.01em] text-muted-foreground transition-colors group-hover:text-[#0066cc]">
            {number}
          </span>
        )}
        <h4 className="font-['SF_Pro_Display','SF_Pro_Icons','Helvetica_Neue',Helvetica,Arial,sans-serif] text-[24px] font-semibold leading-[1.1666666667] tracking-[0.009em] text-foreground">
          {title}
        </h4>
        {children}
      </div>
    </div>
  )
);
ListItemCard.displayName = "ListItemCard";

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
      <div className="mb-4 flex items-center justify-between border-b border-border/70 pb-4">
        <span className="text-[12px] tracking-[-0.01em] text-[#0066cc]">
          {label}
        </span>
        <div className="flex gap-1.5">
          <div className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#0066cc]" />
          <div className="h-1.5 w-1.5 rounded-full bg-border" />
        </div>
      </div>
      {children}
    </Card>
  )
);
TechCard.displayName = "TechCard";

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
        "rounded-[18px] border border-border/70 bg-card last:border-b",
        "group transition-colors duration-200 hover:bg-secondary/85",
        className
      )}
      {...props}
    >
      <div className="text-3xl text-muted-foreground group-hover:text-foreground transition-colors duration-200">
        {icon}
      </div>
      <div>
        <div className="font-['SF_Pro_Display','SF_Pro_Icons','Helvetica_Neue',Helvetica,Arial,sans-serif] text-5xl font-semibold tracking-[-0.03em] text-foreground">
          {value}
        </div>
        <span className="mt-2 block text-[12px] tracking-[-0.01em] text-muted-foreground">
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
