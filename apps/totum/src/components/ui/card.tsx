/**
 * TOTUM CARD COMPONENT
 * Replica exata do design system Digital Architect
 * 
 * Características:
 * - border border-stone-300
 * - bg-[#EAEAE5] padrão
 * - hover:bg-white
 * - transition-colors duration-500
 * - Grid 12 colunas interno
 */

import * as React from "react";
import { cn } from "@/lib/utils";

// Card principal
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
      // Base styles
      "overflow-hidden transition-all duration-500",
      // Background
      "bg-[#EAEAE5]",
      // Border (padrão)
      !noBorder && "border border-stone-300",
      // Hover states
      interactive && "hover:bg-white hover:shadow-lg cursor-pointer",
      className
    )}
    {...props}
  />
));
Card.displayName = "Card";

// Card Header
const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "flex flex-col space-y-1.5 p-6 md:p-8",
      className
    )}
    {...props}
  />
));
CardHeader.displayName = "CardHeader";

// Card Title
const CardTitle = React.forwardRef<
  HTMLHeadingElement,
  React.HTMLAttributes<HTMLHeadingElement> & { 
    as?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
  }
>(({ className, as: Component = "h3", ...props }, ref) => (
  <Component
    ref={ref}
    className={cn(
      "font-medium tracking-tight text-stone-900 transition-transform duration-500",
      "text-2xl md:text-3xl lg:text-4xl leading-tight",
      "group-hover:translate-x-2",
      className
    )}
    {...props}
  />
));
CardTitle.displayName = "CardTitle";

// Card Description
const CardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn(
      "text-sm leading-relaxed text-stone-500",
      className
    )}
    {...props}
  />
));
CardDescription.displayName = "CardDescription";

// Card Content
const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("p-6 md:p-8", className)}
    {...props}
  />
));
CardContent.displayName = "CardContent";

// Card Footer
const CardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "flex items-center p-6 md:p-8 pt-0",
      className
    )}
    {...props}
  />
));
CardFooter.displayName = "CardFooter";

// Project Card (específico para projetos - grid 12 colunas)
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
    <Card
      ref={ref}
      className={cn("group", className)}
      {...props}
    >
      <div className="grid grid-cols-1 md:grid-cols-12 min-h-[250px]">
        {/* Content side */}
        <div className="col-span-1 md:col-span-5 p-6 md:p-8 lg:p-12 flex flex-col justify-center border-r-0 md:border-r border-stone-300/0 md:border-stone-300">
          {/* Meta */}
          <div className="flex items-center gap-3 mb-4">
            <span className="font-mono text-xs text-stone-500">{number}</span>
            <div className="h-px w-8 bg-stone-300" />
            <span className="text-xs font-bold uppercase tracking-wider text-stone-900">
              {category}
            </span>
          </div>
          
          {/* Title */}
          <CardTitle className="mb-4">{title}</CardTitle>
          
          {/* Description */}
          <CardDescription className="max-w-sm">{description}</CardDescription>
        </div>
        
        {/* Image side */}
        <div className="hidden md:block col-span-7 relative overflow-hidden bg-stone-100">
          {imageUrl ? (
            <div className="absolute inset-0 flex items-center justify-center p-8">
              <img
                src={imageUrl}
                alt={imageAlt || title}
                className="w-full h-full object-cover grayscale opacity-80 group-hover:scale-105 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-700"
              />
            </div>
          ) : (
            <div className="absolute inset-0 flex items-center justify-center p-8">
              <div className="w-full h-full bg-stone-300 grayscale opacity-80 group-hover:scale-105 group-hover:grayscale-0 transition-all duration-700 flex items-center justify-center text-stone-500">
                Image Area
              </div>
            </div>
          )}
        </div>
      </div>
    </Card>
  )
);
ProjectCard.displayName = "ProjectCard";

// Stat Card
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
        "border-b border-stone-300 last:border-b-0",
        "group hover:bg-white transition-colors duration-200",
        "reveal",
        delay && `delay-${delay}`,
        className
      )}
      {...props}
    >
      <div className="text-3xl text-stone-400 group-hover:text-stone-800 transition-colors duration-200">
        {icon}
      </div>
      <div>
        <div className="text-5xl font-medium tracking-tighter text-stone-900">{value}</div>
        <span className="font-mono text-xs text-stone-500 mt-1 block uppercase tracking-wider">{label}</span>
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
