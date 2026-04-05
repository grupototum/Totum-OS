/**
 * TOTUM LABEL COMPONENT
 * Replica exata do design system
 * 
 * font-mono, uppercase, tracking-widest, text-xs
 * Usado para: números de seção, labels de campo, metadados
 */

import * as React from "react";
import { cn } from "@/lib/utils";

interface LabelProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "default" | "muted" | "dark" | "light";
  as?: "span" | "div" | "p";
}

const Label = React.forwardRef<HTMLSpanElement, LabelProps>(
  ({ className, variant = "default", as: Component = "span", ...props }, ref) => {
    return (
      <Component
        ref={ref}
        className={cn(
          // Base styles - exatamente como no design system
          "font-mono text-xs font-medium uppercase tracking-widest",
          // Variantes
          variant === "default" && "text-stone-500",
          variant === "muted" && "text-stone-400",
          variant === "dark" && "text-stone-900",
          variant === "light" && "text-stone-200",
          className
        )}
        {...props}
      />
    );
  }
);
Label.displayName = "Label";

// Section Number - "01 / Section Name"
interface SectionNumberProps extends React.HTMLAttributes<HTMLSpanElement> {
  number: string;
  total?: string;
}

const SectionNumber = React.forwardRef<HTMLSpanElement, SectionNumberProps>(
  ({ className, number, total = "Section", ...props }, ref) => (
    <Label
      ref={ref}
      variant="muted"
      className={cn("block mb-2", className)}
      {...props}
    >
      {number} / {total}
    </Label>
  )
);
SectionNumber.displayName = "SectionNumber";

// Meta Label - para datas, categorias
interface MetaLabelProps extends React.HTMLAttributes<HTMLSpanElement> {
  date?: string;
  category?: string;
}

const MetaLabel = React.forwardRef<HTMLSpanElement, MetaLabelProps>(
  ({ className, date, category, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("flex items-center gap-3", className)}
      {...props}
    >
      {date && <span className="font-mono text-xs text-stone-500">{date}</span>}
      {date && category && <div className="h-px w-8 bg-stone-300" />}
      {category && (
        <span className="text-xs font-bold uppercase tracking-wider text-stone-900">
          {category}
        </span>
      )}
    </div>
  )
);
MetaLabel.displayName = "MetaLabel";

export { Label, SectionNumber, MetaLabel };
