import { Moon, Sun, Laptop } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";
import { cn } from "@/lib/utils";

/**
 * ThemeToggle — segmented control for the editorial DS theme modes.
 *
 * Three options: Light / System / Dark. Click cycles through them and
 * updates the `.light` / `.dark` class on <html> via `ThemeProvider`.
 */

const ORDER = ["light", "system", "dark"] as const;
type Mode = (typeof ORDER)[number];

interface ThemeToggleProps {
  /** When true, renders a compact icon-only button instead of the segmented control. */
  compact?: boolean;
  className?: string;
}

export function ThemeToggle({ compact = false, className }: ThemeToggleProps) {
  const { theme, setTheme, resolvedTheme } = useTheme();

  if (compact) {
    // Icon button that cycles through the three modes
    const nextMode = (): Mode => {
      const idx = ORDER.indexOf(theme as Mode);
      return ORDER[(idx + 1) % ORDER.length];
    };

    const Icon = theme === "system" ? Laptop : resolvedTheme === "dark" ? Moon : Sun;

    return (
      <button
        type="button"
        aria-label={`Tema: ${theme}`}
        onClick={() => setTheme(nextMode())}
        className={cn(
          "inline-flex items-center justify-center h-9 w-9 rounded-full border border-border",
          "bg-surface-container text-foreground hover:bg-muted transition-colors",
          className
        )}
      >
        <Icon className="w-4 h-4" />
      </button>
    );
  }

  return (
    <div
      role="radiogroup"
      aria-label="Tema"
      className={cn(
        "inline-flex items-center gap-1 p-1 rounded-full border border-border bg-surface-container",
        className
      )}
    >
      {ORDER.map((mode) => {
        const active = theme === mode;
        const Icon = mode === "light" ? Sun : mode === "dark" ? Moon : Laptop;
        return (
          <button
            key={mode}
            type="button"
            role="radio"
            aria-checked={active}
            aria-label={mode}
            onClick={() => setTheme(mode)}
            className={cn(
              "inline-flex items-center justify-center h-8 w-8 rounded-full transition-colors",
              active
                ? "bg-foreground text-background"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            <Icon className="w-[14px] h-[14px]" />
          </button>
        );
      })}
    </div>
  );
}
