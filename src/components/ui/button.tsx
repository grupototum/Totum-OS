import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full font-normal tracking-[-0.022em] transition-all duration-300 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        primary:
          "bg-primary text-primary-foreground shadow-[0_18px_34px_-24px_rgba(0,113,227,0.85)] hover:-translate-y-px hover:bg-[#0077ed] active:translate-y-0 active:bg-[#006edb]",
        accent:
          "bg-[#1d1d1f] text-white shadow-[0_18px_34px_-24px_rgba(29,29,31,0.7)] hover:-translate-y-px hover:bg-[#2a2a2d] active:translate-y-0",
        secondary:
          "border border-border/80 bg-card text-foreground hover:border-border hover:bg-secondary/85",
        outline:
          "border border-transparent bg-transparent px-0 text-[#0066cc] shadow-none hover:bg-secondary/70 hover:px-5",
        ghost:
          "bg-transparent text-foreground shadow-none hover:bg-secondary/80",
        link: "bg-transparent px-0 text-[#0066cc] shadow-none hover:underline hover:underline-offset-4",
        destructive:
          "bg-destructive text-destructive-foreground shadow-[0_18px_34px_-24px_rgba(182,68,0,0.8)] hover:-translate-y-px hover:bg-destructive/90",
      },
      size: {
        default: "h-11 px-[22px] text-[17px] leading-[1.1764805882]",
        sm: "h-8 px-4 text-[12px] leading-[1.3333733333] tracking-[-0.01em]",
        lg: "h-12 px-[31px] text-[17px] leading-[1.1764805882]",
        xl: "h-14 px-10 text-[17px] leading-[1.1764805882]",
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

interface CompatButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
}

const GlowButton = React.forwardRef<HTMLButtonElement, CompatButtonProps>(
  ({ className, children, ...props }, ref) => (
    <Button
      ref={ref}
      variant="primary"
      size="lg"
      className={cn(className)}
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
      className={cn(className)}
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
      className={cn(className)}
      {...props}
    >
      {children}
    </Button>
  )
);
OutlineButton.displayName = "OutlineButton";

export { Button, buttonVariants, GlowButton, BeamButton, OutlineButton };
