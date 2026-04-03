/**
 * TOTUM NAVIGATION COMPONENT
 * Replica exata do design system
 * 
 * Características:
 * - sticky top-0
 * - border-b border-stone-300
 * - bg-[#EAEAE5]
 * - nav-load animation
 * - Brand no centro com ícone
 */

import * as React from "react";
import { cn } from "@/lib/utils";

interface NavLinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  active?: boolean;
}

const NavLink = React.forwardRef<HTMLAnchorElement, NavLinkProps>(
  ({ className, active, ...props }, ref) => (
    <a
      ref={ref}
      className={cn(
        "text-xs font-medium uppercase tracking-widest",
        "text-stone-900 hover:text-stone-500",
        "transition-colors duration-150",
        active && "text-stone-500",
        className
      )}
      {...props}
    />
  )
);
NavLink.displayName = "NavLink";

interface NavigationProps extends React.HTMLAttributes<HTMLElement> {
  brand?: {
    icon?: React.ReactNode;
    name: string;
  };
  leftLinks?: Array<{ label: string; href: string; hidden?: boolean }>;
  rightLinks?: Array<{ label: string; href: string; hidden?: boolean }>;
  loaded?: boolean;
}

const Navigation = React.forwardRef<HTMLElement, NavigationProps>(
  ({ className, brand, leftLinks = [], rightLinks = [], loaded = true, ...props }, ref) => (
    <header
      ref={ref}
      className={cn(
        "relative z-50 border-b border-stone-300 sticky top-0 bg-[#EAEAE5]",
        "nav-load",
        loaded && "loaded",
        className
      )}
      {...props}
    >
      <div className="flex justify-between items-center px-4 md:px-6 py-5">
        {/* Left links */}
        <div className="flex items-center gap-6 md:gap-12">
          {leftLinks.map((link) => (
            <NavLink
              key={link.href}
              href={link.href}
              className={cn(link.hidden && "hidden md:block")}
            >
              {link.label}
            </NavLink>
          ))}
        </div>

        {/* Brand - centered */}
        {brand && (
          <a
            href="/"
            className="absolute left-1/2 -translate-x-1/2 flex items-center gap-2 group cursor-pointer"
          >
            {brand.icon && (
              <span className="text-xl group-hover:rotate-180 transition-transform duration-700">
                {brand.icon}
              </span>
            )}
            <span className="font-bold tracking-tighter text-lg text-stone-900">
              {brand.name}
            </span>
          </a>
        )}

        {/* Right links */}
        <div className="flex items-center gap-6 md:gap-12">
          {rightLinks.map((link) => (
            <NavLink
              key={link.href}
              href={link.href}
              className={cn(link.hidden && "hidden md:block")}
            >
              {link.label}
            </NavLink>
          ))}
        </div>
      </div>
    </header>
  )
);
Navigation.displayName = "Navigation";

// Section Header - usado em páginas de seção
interface SectionHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  number?: string;
  title: string;
  subtitle?: string;
}

const SectionHeader = React.forwardRef<HTMLDivElement, SectionHeaderProps>(
  ({ className, number, title, subtitle, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "p-8 md:p-12 border-b border-stone-300 bg-stone-100/50",
        className
      )}
      {...props}
    >
      {number && (
        <span className="font-mono text-xs uppercase text-stone-500 block mb-2">{number}</span>
      )}
      <h2 className="text-4xl font-medium tracking-tight text-stone-900">{title}</h2>
      {subtitle && (
        <p className="mt-2 text-stone-500 text-lg">{subtitle}</p>
      )}
    </div>
  )
);
SectionHeader.displayName = "SectionHeader";

export { Navigation, NavLink, SectionHeader };
