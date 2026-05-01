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
        "text-[12px] tracking-[-0.01em]",
        "text-foreground hover:text-[#0066cc]",
        "transition-colors duration-150",
        active && "text-[#0066cc]",
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
        "sticky top-0 z-50 border-b border-border/70 bg-white/85 backdrop-blur-2xl",
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
              <span className="text-xl transition-transform duration-700 group-hover:rotate-180">
                {brand.icon}
              </span>
            )}
            <span className="font-['SF_Pro_Display','SF_Pro_Icons','Helvetica_Neue',Helvetica,Arial,sans-serif] text-lg font-semibold tracking-[-0.03em] text-foreground">
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
        "border-b border-border/70 bg-secondary/50 p-8 md:p-12",
        className
      )}
      {...props}
    >
      {number && (
        <span className="mb-2 block text-[12px] tracking-[-0.01em] text-[#0066cc]">{number}</span>
      )}
      <h2 className="font-['SF_Pro_Display','SF_Pro_Icons','Helvetica_Neue',Helvetica,Arial,sans-serif] text-4xl font-semibold tracking-[-0.03em] text-foreground">{title}</h2>
      {subtitle && (
        <p className="mt-2 text-lg text-muted-foreground">{subtitle}</p>
      )}
    </div>
  )
);
SectionHeader.displayName = "SectionHeader";

export { Navigation, NavLink, SectionHeader };
