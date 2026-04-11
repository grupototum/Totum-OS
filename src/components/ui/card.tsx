/**
 * TOTUM CARD COMPONENT v5 - EXACT DS IMPLEMENTATION
 * Based on Design System Digital Architect
 */

import * as React from "react";
import { cn } from "@/lib/utils";

// Base Card with corner accents support
interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  cornerAccents?: boolean;
  hoverGlow?: boolean;
}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, cornerAccents = false, hoverGlow = true, children, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "relative bg-black border border-zinc-800 overflow-hidden",
        hoverGlow && [
          "transition-all duration-500",
          "hover:border-[#ef233c]/50",
          "hover:shadow-[0_0_20px_-5px_rgba(239,35,60,0.25)]"
        ],
        className
      )}
      {...props}
    >
      {cornerAccents && (
        <>
          <span className="absolute top-0 left-0 w-2 h-2 border-t border-l border-[#ef233c] pointer-events-none" />
          <span className="absolute top-0 right-0 w-2 h-2 border-t border-r border-[#ef233c] pointer-events-none" />
          <span className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-[#ef233c] pointer-events-none" />
          <span className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-[#ef233c] pointer-events-none" />
        </>
      )}
      {children}
    </div>
  )
);
Card.displayName = "Card";

// Card Header
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

// Card Title - Using exact typography from DS
const CardTitle = React.forwardRef<
  HTMLHeadingElement,
  React.HTMLAttributes<HTMLHeadingElement> & { as?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6" }
>(({ className, as: Component = "h3", ...props }, ref) => (
  <Component
    ref={ref}
    className={cn(
      "font-manrope text-lg font-normal tracking-tight text-white",
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
    className={cn("text-sm text-zinc-400 leading-relaxed", className)} 
    {...props} 
  />
));
CardDescription.displayName = "CardDescription";

// Card Content
const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("p-6", className)} {...props} />
));
CardContent.displayName = "CardContent";

// Card Footer
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

/**
 * LIST ITEM CARD
 * From design-system.html - "List Item Card"
 */
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
        "p-6 bg-transparent border-b border-zinc-800",
        "overflow-hidden transition-colors duration-300",
        "hover:bg-zinc-900/30 cursor-pointer group",
        className
      )}
      {...props}
    >
      {showAccentBar && (
        <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#ef233c] transform -translate-x-full group-hover:translate-x-0 transition-transform duration-200" />
      )}
      <div className="transition-transform duration-300 group-hover:translate-x-2">
        {number && (
          <span className="block text-[10px] text-zinc-600 font-mono mb-1 group-hover:text-[#ef233c] transition-colors">
            {number}
          </span>
        )}
        <h4 className="text-lg text-white font-manrope font-normal tracking-tight">
          {title}
        </h4>
        {children}
      </div>
    </div>
  )
);
ListItemCard.displayName = "ListItemCard";

/**
 * TECH CARD with Corner Accents
 * From design-system.html - "Tech Card with Corner Accents"
 */
interface TechCardProps extends React.HTMLAttributes<HTMLDivElement> {
  label?: string;
  status?: string;
}

const TechCard = React.forwardRef<HTMLDivElement, TechCardProps>(
  ({ className, label = "System Status", status, children, ...props }, ref) => (
    <Card
      ref={ref}
      cornerAccents={true}
      className={cn("p-6 flex flex-col justify-between min-h-[200px]", className)}
      {...props}
    >
      <div className="flex items-center justify-between border-b border-zinc-800 border-dashed pb-4 mb-4">
        <span className="font-mono text-[10px] text-[#ef233c] tracking-widest uppercase font-bold">
          [ {label} ]
        </span>
        <div className="flex gap-1.5">
          <div className="w-1.5 h-1.5 bg-[#ef233c] animate-pulse rounded-none" />
          <div className="w-1.5 h-1.5 bg-zinc-800 rounded-none" />
        </div>
      </div>
      {children}
    </Card>
  )
);
TechCard.displayName = "TechCard";

/**
 * STAT CARD
 * From design-system.html
 */
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
        "p-8 flex flex-col justify-between",
        "border-b border-zinc-800 last:border-b-0",
        "group hover:bg-zinc-900 transition-colors duration-200",
        className
      )}
      {...props}
    >
      <div className="text-3xl text-zinc-600 group-hover:text-zinc-400 transition-colors duration-200">
        {icon}
      </div>
      <div>
        <div className="text-5xl font-manrope font-medium tracking-tighter text-white">
          {value}
        </div>
        <span className="font-mono text-[10px] text-zinc-500 mt-1 block uppercase tracking-wider">
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
