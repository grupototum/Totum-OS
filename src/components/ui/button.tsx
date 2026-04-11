/**
 * TOTUM BUTTON COMPONENT v5 - EXACT DS IMPLEMENTATION
 * Design System Digital Architect - Dark Only
 * 
 * All buttons use exact classes from design-system.html
 */

import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  // Base styles - focus on accessibility
  "inline-flex items-center justify-center gap-2 whitespace-nowrap font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ef233c]/50 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        // Primary: brand red, sharp corners
        primary: 
          "bg-[#ef233c] text-white rounded-none border-none hover:bg-[#dc2626] active:scale-[0.98]",
        
        // Secondary: zinc background
        secondary: 
          "bg-zinc-800 text-white rounded-none border-none hover:bg-zinc-700 active:scale-[0.98]",
        
        // Outline: brand red border
        outline: 
          "bg-transparent border border-[#ef233c] text-[#ef233c] rounded-none uppercase tracking-widest text-[11px] font-bold hover:bg-[#ef233c] hover:text-white active:scale-[0.98]",
        
        // Ghost: transparent
        ghost: 
          "bg-transparent text-zinc-400 rounded-none border-none hover:text-white hover:bg-zinc-900 active:scale-[0.98]",
        
        // Link: text with underline
        link: 
          "bg-transparent text-zinc-400 underline-offset-4 hover:text-white hover:underline rounded-none border-none",
      },
      size: {
        default: "h-10 px-6 py-2 text-sm",
        sm: "h-9 px-4 py-2 text-xs",
        lg: "h-12 px-8 py-3 text-base",
        icon: "h-10 w-10",
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

/**
 * GLOW BUTTON - Primary CTA with rotating border
 * Exact implementation from design-system.html
 */
interface GlowButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
}

const GlowButton = React.forwardRef<HTMLButtonElement, GlowButtonProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn("btn-glow", className)}
        {...props}
      >
        <div className="glow-layer-1" />
        <div className="glow-layer-2" />
        <div className="glow-stroke-1" />
        <div className="glow-stroke-2" />
        <div className="spin-border" />
        <div className="btn-bg" />
        <span className="btn-text">{children}</span>
      </button>
    );
  }
);
GlowButton.displayName = "GlowButton";

/**
 * BEAM BUTTON - Secondary CTA with red beam on hover
 * Exact implementation from design-system.html
 */
interface BeamButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
}

const BeamButton = React.forwardRef<HTMLButtonElement, BeamButtonProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn("btn-beam", className)}
        {...props}
      >
        <div className="beam-layer" />
        <div className="beam-bg" />
        <div className="beam-fill" />
        <div className="beam-glow" />
        <span className="btn-text">{children}</span>
      </button>
    );
  }
);
BeamButton.displayName = "BeamButton";

/**
 * OUTLINE RED BUTTON - Simple outline with red
 * Exact implementation from design-system.html
 */
interface OutlineButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
}

const OutlineButton = React.forwardRef<HTMLButtonElement, OutlineButtonProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn("btn-outline-red", className)}
        {...props}
      >
        {children}
      </button>
    );
  }
);
OutlineButton.displayName = "OutlineButton";

export { Button, buttonVariants, GlowButton, BeamButton, OutlineButton };
