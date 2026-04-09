/**
 * TOTUM CARD COMPONENT — Creative DS
 */

import * as React from "react";
import { cn } from "@/lib/utils";

const Card = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & { 
    interactive?: boolean;
    noBorder?: boolean;
  }
>(({ className, interactive = true, noBorder = false, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "overflow-hidden transition-all duration-500",
      "bg-card",
      !noBorder && "border border-border",
      interactive && "hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5 cursor-pointer",
      className
    )}
    {...props}
  />
));
Card.displayName = "Card";

const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("flex flex-col space-y-1.5 p-6 md:p-8", className)} {...props} />
));
CardHeader.displayName = "CardHeader";

const CardTitle = React.forwardRef<
  HTMLHeadingElement,
  React.HTMLAttributes<HTMLHeadingElement> & { 
    as?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
  }
>(({ className, as: Component = "h3", ...props }, ref) => (
  <Component
    ref={ref}
    className={cn(
      "font-medium tracking-tight text-foreground transition-transform duration-500",
      "text-2xl md:text-3xl lg:text-4xl leading-tight",
      "group-hover:translate-x-2",
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
  <p ref={ref} className={cn("text-sm leading-relaxed text-muted-foreground", className)} {...props} />
));
CardDescription.displayName = "CardDescription";

const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("p-6 md:p-8", className)} {...props} />
));
CardContent.displayName = "CardContent";

const CardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("flex items-center p-6 md:p-8 pt-0", className)} {...props} />
));
CardFooter.displayName = "CardFooter";

interface ProjectCardProps extends React.HTMLAttributes<HTMLDivElement> {
  number: string;
  category: string;
  title: string;
  description: string;
  imageUrl?: string;
  imageAlt?: string;
}

const ProjectCard = React.forwardRef<HTMLDivElement, ProjectCardProps>(
  ({ className, number, category, title, description, imageUrl, imageAlt, ...props }, ref) => (
    <Card ref={ref} className={cn("group", className)} {...props}>
      <div className="grid grid-cols-1 md:grid-cols-12 min-h-[250px]">
        <div className="col-span-1 md:col-span-5 p-6 md:p-8 lg:p-12 flex flex-col justify-center border-r-0 md:border-r border-border">
          <div className="flex items-center gap-3 mb-4">
            <span className="font-mono text-xs text-muted-foreground">{number}</span>
            <div className="h-px w-8 bg-border" />
            <span className="text-xs font-bold uppercase tracking-wider text-foreground">{category}</span>
          </div>
          <CardTitle className="mb-4">{title}</CardTitle>
          <CardDescription className="max-w-sm">{description}</CardDescription>
        </div>
        <div className="hidden md:block col-span-7 relative overflow-hidden bg-secondary">
          {imageUrl ? (
            <div className="absolute inset-0 flex items-center justify-center p-8">
              <img src={imageUrl} alt={imageAlt || title} className="w-full h-full object-cover grayscale opacity-80 group-hover:scale-105 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-700" />
            </div>
          ) : (
            <div className="absolute inset-0 flex items-center justify-center p-8">
              <div className="w-full h-full bg-muted flex items-center justify-center text-muted-foreground">Image Area</div>
            </div>
          )}
        </div>
      </div>
    </Card>
  )
);
ProjectCard.displayName = "ProjectCard";

interface StatCardProps extends React.HTMLAttributes<HTMLDivElement> {
  icon: React.ReactNode;
  value: string;
  label: string;
  delay?: string;
}

const StatCard = React.forwardRef<HTMLDivElement, StatCardProps>(
  ({ className, icon, value, label, delay = "0", ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "row-span-1 p-8 flex flex-col justify-between",
        "border-b border-border last:border-b-0",
        "group hover:bg-card transition-colors duration-200",
        "reveal",
        delay && `delay-${delay}`,
        className
      )}
      {...props}
    >
      <div className="text-3xl text-muted-foreground group-hover:text-foreground transition-colors duration-200">{icon}</div>
      <div>
        <div className="text-5xl font-medium tracking-tighter text-foreground">{value}</div>
        <span className="font-mono text-xs text-muted-foreground mt-1 block uppercase tracking-wider">{label}</span>
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
  ProjectCard,
  StatCard,
};
