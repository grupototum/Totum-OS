/**
 * TOTUM LABEL COMPONENT
 * font-mono, uppercase, tracking-widest, text-xs
 */

import * as React from "react";
import { cn } from "@/lib/utils";

interface LabelProps extends React.HTMLAttributes<HTMLElement> {
  variant?: "default" | "muted" | "dark" | "light";
  as?: "span" | "div" | "p" | "label";
  htmlFor?: string;
}

const Label = React.forwardRef<HTMLElement, LabelProps>(
  ({ className, variant = "default", as: Component = "span", htmlFor, ...props }, ref) => {
    const elementProps: any = { ...props, className: cn(
      "font-mono text-xs font-medium uppercase tracking-widest",
      variant === "default" && "text-stone-500",
      variant === "muted" && "text-stone-400",
      variant === "dark" && "text-stone-900",
      variant === "light" && "text-stone-200",
      className
    )};

    if (htmlFor && Component === "span") {
      Component = "label" as any;
      elementProps.htmlFor = htmlFor;
    } else if (htmlFor) {
      elementProps.htmlFor = htmlFor;
    }

    return <Component ref={ref as any} {...elementProps} />;
  }
);
Label.displayName = "Label";

// Section Number
interface SectionNumberProps extends React.HTMLAttributes<HTMLSpanElement> {
  number: string;
  total?: string;
}

const SectionNumber = React.forwardRef<HTMLSpanElement, SectionNumberProps>(
  ({ className, number, total = "Section", ...props }, ref) => (
    <Label
      ref={ref as any}
      variant="muted"
      className={cn("block mb-2", className)}
      {...props}
    >
      {number} / {total}
    </Label>
  )
);
SectionNumber.displayName = "SectionNumber";

// Meta Label
interface MetaLabelProps extends React.HTMLAttributes<HTMLDivElement> {
  date?: string;
  category?: string;
}

const MetaLabel = React.forwardRef<HTMLDivElement, MetaLabelProps>(
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
export type { LabelProps };