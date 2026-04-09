/**
 * TOTUM BUTTON COMPONENT
 * Replica exata do design system Digital Architect
 * 
 * Variantes:
 * - primary: bg-stone-900, text-white, rounded-md
 * - outline: border, rounded-full, uppercase tracking-widest
 * - ghost: transparente
 * - link: text com border-bottom
 */

import * as React from "react";
import { Slot, Slottable } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  // Base styles
  "inline-flex items-center justify-center gap-2 whitespace-nowrap font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-stone-400 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        // Primary: bg-stone-900, text-white, rounded-md
        primary: 
          "bg-stone-900 text-white rounded-md hover:bg-stone-700",
        
        // Outline: border, rounded-full, uppercase
        outline: 
          "border border-stone-900 rounded-full bg-transparent text-stone-900 uppercase tracking-widest text-sm hover:bg-stone-900 hover:text-white",
        
        // Secondary: stone-200 bg
        secondary: 
          "bg-stone-200 text-stone-900 rounded-md hover:bg-stone-300",
        
        // Ghost: transparente
        ghost: 
          "hover:bg-stone-200 text-stone-700 rounded-md",
        
        // Link: text com border-bottom
        link: 
          "text-stone-600 border-b border-stone-400 pb-0.5 rounded-none hover:text-stone-900 hover:border-stone-900 underline-offset-0",
      },
      size: {
        default: "px-6 py-3 text-sm",
        sm: "px-4 py-2 text-xs",
        lg: "px-8 py-4 text-base",
        icon: "h-10 w-10",
        "icon-sm": "h-8 w-8",
        "icon-lg": "h-12 w-12",
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
  icon?: React.ReactNode;
  iconPosition?: "left" | "right";
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, icon, iconPosition = "right", children, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      >
        {icon && iconPosition === "left" && (
          <span className="inline-flex items-center justify-center transition-transform duration-200 group-hover:translate-y-0.5">
            {icon}
          </span>
        )}
        <Slottable>{children}</Slottable>
        {icon && iconPosition === "right" && (
          <span className="inline-flex items-center justify-center transition-transform duration-200 group-hover:translate-y-0.5">
            {icon}
          </span>
        )}
      </Comp>
    );
  }
);

Button.displayName = "Button";

export { Button, buttonVariants };
