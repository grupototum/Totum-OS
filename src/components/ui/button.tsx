/**
 * TOTUM BUTTON COMPONENT v5
 * Design System Digital Architect - Dark Only
 * 
 * Variantes:
 * - primary: bg-[#ef233c], text-white
 * - outline: border-[#ef233c], text-[#ef233c], hover:bg-[#ef233c]
 * - ghost: transparente com hover
 * - glow: botão com efeito de brilho (novo)
 * - beam: botão com efeito de raio vermelho (novo)
 */

import * as React from "react";
import { Slot, Slottable } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  // Base styles
  "inline-flex items-center justify-center gap-2 whitespace-nowrap font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ef233c]/50 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        // Primary: brand red
        primary: 
          "bg-[#ef233c] text-white rounded-none hover:bg-[#dc2626]",
        
        // Secondary: zinc background
        secondary: 
          "bg-zinc-800 text-white rounded-none hover:bg-zinc-700",
        
        // Outline: brand red border
        outline: 
          "border border-[#ef233c] bg-transparent text-[#ef233c] rounded-none uppercase tracking-widest text-xs font-bold hover:bg-[#ef233c] hover:text-white",
        
        // Ghost: transparente
        ghost: 
          "bg-transparent text-zinc-400 rounded-none hover:text-white hover:bg-zinc-900",
        
        // Link: text com underline
        link: 
          "text-zinc-400 underline-offset-4 hover:text-white hover:underline rounded-none bg-transparent",
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
          <span className="inline-flex items-center justify-center transition-transform duration-200 group-hover:translate-x-0.5">
            {icon}
          </span>
        )}
        <Slottable>{children}</Slottable>
        {icon && iconPosition === "right" && (
          <span className="inline-flex items-center justify-center transition-transform duration-200 group-hover:translate-x-0.5">
            {icon}
          </span>
        )}
      </Comp>
    );
  }
);

Button.displayName = "Button";

export { Button, buttonVariants };
