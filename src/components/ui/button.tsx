/**
 * TOTUM BUTTON — Editorial DS v6
 *
 * Editorial pill-first button set. Primary is an inverted-ink pill,
 * outline is a bordered pill, secondary/ghost/link pick up softer
 * neutral treatments. All variants respect the current theme through
 * `--primary`, `--foreground`, `--border`, etc.
 *
 * `GlowButton`, `BeamButton`, `OutlineButton` are preserved as
 * re-exports so legacy call sites keep working — they now render the
 * same editorial pill instead of the previous red rotating-border.
 */

import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap font-medium transition-all duration-300 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        // Primary: inverted-ink pill, soft shadow, micro lift on hover
        primary:
          "rounded-full bg-primary text-primary-foreground shadow-editorial hover:-translate-y-px hover:bg-primary/90 active:translate-y-0",

        // Accent: blue accent pill (editorial highlight)
        accent:
          "rounded-full bg-accent text-accent-foreground shadow-editorial hover:-translate-y-px hover:bg-accent/90 active:translate-y-0",

        // Secondary: neutral pill (surface container)
        secondary:
          "rounded-full bg-secondary text-secondary-foreground hover:bg-secondary/70",

        // Outline: bordered pill
        outline:
          "rounded-full bg-transparent border border-border text-foreground hover:bg-foreground hover:text-background hover:border-foreground",

        // Ghost: text-only, pill on hover
        ghost:
          "rounded-full bg-transparent text-foreground hover:bg-muted",

        // Link: underline on hover, no pill
        link: "bg-transparent text-foreground underline-offset-4 hover:underline",

        // Destructive: red pill (kept for destructive CTAs)
        destructive:
          "rounded-full bg-destructive text-destructive-foreground hover:bg-destructive/90",
      },
      size: {
        default: "h-11 px-6 text-sm",
        sm: "h-9 px-4 text-xs",
        lg: "h-12 px-8 text-sm tracking-wide",
        xl: "h-14 px-10 text-base",
        icon: "h-11 w-11 rounded-full",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

/* ------------------------------------------------------------------
   Legacy aliases — kept so existing call sites compile unchanged.
   Previously these rendered elaborate rotating-border / red-beam
   markup; in the editorial DS they collapse to clean pill buttons.
   ------------------------------------------------------------------ */

interface CompatButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
}

const GlowButton = React.forwardRef<HTMLButtonElement, CompatButtonProps>(
  ({ className, children, ...props }, ref) => (
    <Button
      ref={ref}
      variant="primary"
      size="lg"
      className={cn("uppercase tracking-[0.18em] text-xs", className)}
      {...props}
    >
      {children}
    </Button>
  )
);
GlowButton.displayName = "GlowButton";

const BeamButton = React.forwardRef<HTMLButtonElement, CompatButtonProps>(
  ({ className, children, ...props }, ref) => (
    <Button
      ref={ref}
      variant="outline"
      size="lg"
      className={cn("uppercase tracking-[0.18em] text-xs", className)}
      {...props}
    >
      {children}
    </Button>
  )
);
BeamButton.displayName = "BeamButton";

const OutlineButton = React.forwardRef<HTMLButtonElement, CompatButtonProps>(
  ({ className, children, ...props }, ref) => (
    <Button
      ref={ref}
      variant="outline"
      size="default"
      className={cn("uppercase tracking-[0.22em] text-[11px] font-semibold", className)}
      {...props}
    >
      {children}
    </Button>
  )
);
OutlineButton.displayName = "OutlineButton";

export { Button, buttonVariants, GlowButton, BeamButton, OutlineButton };
