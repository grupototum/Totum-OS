import * as React from "react";
import { cn } from "@/lib/utils";

interface LabelProps extends React.HTMLAttributes<HTMLElement> {
  variant?: "default" | "muted" | "dark" | "light";
  as?: "span" | "div" | "p" | "label";
  htmlFor?: string;
}

const Label = React.forwardRef<HTMLElement, LabelProps>(
  ({ className, variant = "default", as: Component = "span", htmlFor, ...props }, ref) => {
    const ResolvedComponent = (htmlFor && Component === "span" ? "label" : Component) as React.ElementType;

    const elementProps: React.HTMLAttributes<HTMLElement> & { htmlFor?: string } = {
      ...props,
      className: cn(
        "font-['SF_Pro_Text','SF_Pro_Icons','Helvetica_Neue',Helvetica,Arial,sans-serif] text-[12px] font-normal tracking-[-0.01em]",
        variant === "default" && "text-muted-foreground",
        variant === "muted" && "text-muted-foreground/80",
        variant === "dark" && "text-foreground",
        variant === "light" && "text-background",
        className
      ),
    };

    if (htmlFor) {
      elementProps.htmlFor = htmlFor;
    }

    return <ResolvedComponent ref={ref} {...elementProps} />;
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
      ref={ref as React.Ref<HTMLElement>}
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
      {date && <span className="text-[12px] tracking-[-0.01em] text-muted-foreground">{date}</span>}
      {date && category && <div className="h-px w-8 bg-border" />}
      {category && (
        <span className="text-[12px] tracking-[-0.01em] text-foreground">
          {category}
        </span>
      )}
    </div>
  )
);
MetaLabel.displayName = "MetaLabel";

export { Label, SectionNumber, MetaLabel };
export type { LabelProps };
