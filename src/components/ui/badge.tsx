/**
 * TOTUM BADGE COMPONENT
 * Replica exata do design system Digital Architect
 * 
 * Características:
 * - Glass badge: backdrop-blur-md, border-white/40, rounded-full
 * - Status badges: bg com transparência
 * - Font: mono, uppercase, tracking-wider
 * - Variantes: default, primary, success, warning, error, info, outline, glass
 */

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  // Base styles
  "inline-flex items-center gap-1 font-mono text-xs font-medium uppercase tracking-wider rounded-full transition-colors",
  {
    variants: {
      variant: {
        // Default: stone-200 bg
        default: 
          "bg-stone-200 text-stone-800 border-transparent px-2.5 py-0.5",
        
        // Primary: stone-900 bg
        primary: 
          "bg-stone-900 text-white border-transparent px-2.5 py-0.5",
        
        // Glass: backdrop-blur, border
        glass: 
          "bg-transparent border border-white/40 text-white backdrop-blur-md px-3 py-1",
        
        // Glass dark: para fundos claros
        "glass-dark": 
          "bg-transparent border border-stone-300 text-stone-600 backdrop-blur-md px-3 py-1",
        
        // Success: verde com transparência
        success: 
          "bg-green-500/15 text-green-700 border-transparent px-2.5 py-0.5",
        
        // Warning: amarelo com transparência
        warning: 
          "bg-amber-500/15 text-amber-700 border-transparent px-2.5 py-0.5",
        
        // Error: vermelho com transparência
        error: 
          "bg-red-500/15 text-red-700 border-transparent px-2.5 py-0.5",
        
        // Info: azul com transparência
        info: 
          "bg-blue-500/15 text-blue-700 border-transparent px-2.5 py-0.5",
        
        // Outline: transparente com borda
        outline: 
          "bg-transparent border border-stone-300 text-stone-600 px-2.5 py-0.5",
        
        // Subtle: fundo sutil
        subtle: 
          "bg-stone-100 text-stone-600 border-transparent px-2.5 py-0.5",
        
        // Secondary: alias for subtle
        secondary:
          "bg-stone-100 text-stone-600 border-transparent px-2.5 py-0.5",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {
  icon?: React.ReactNode;
}

function Badge({ className, variant, icon, children, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props}>
      {icon && <span className="inline-flex items-center">{icon}</span>}
      {children}
    </div>
  );
}

// Status Badge - para indicar status (online, offline, etc)
interface StatusBadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  status: "online" | "offline" | "away" | "busy";
  label?: string;
}

const statusConfig = {
  online: { color: "bg-green-500", variant: "success" as const },
  offline: { color: "bg-stone-400", variant: "subtle" as const },
  away: { color: "bg-amber-500", variant: "warning" as const },
  busy: { color: "bg-red-500", variant: "error" as const },
};

function StatusBadge({ className, status, label, ...props }: StatusBadgeProps) {
  const config = statusConfig[status];
  const statusLabel = label || status;
  
  return (
    <div 
      className={cn(
        "inline-flex items-center gap-2 font-mono text-xs font-medium uppercase tracking-wider",
        className
      )}
      {...props}
    >
      <span className={cn("w-2 h-2 rounded-full", config.color)} />
      <span className="text-stone-600">{statusLabel}</span>
    </div>
  );
}

// Count Badge - para notificações/contadores
interface CountBadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  count: number;
  max?: number;
}

function CountBadge({ className, count, max = 99, ...props }: CountBadgeProps) {
  const display = count > max ? `${max}+` : count.toString();
  
  return (
    <span
      className={cn(
        "inline-flex items-center justify-center",
        "min-w-[1.25rem] h-5 px-1",
        "bg-stone-900 text-white",
        "text-[10px] font-bold font-mono",
        "rounded-full",
        className
      )}
      {...props}
    >
      {display}
    </span>
  );
}

export { Badge, badgeVariants, StatusBadge, CountBadge };
