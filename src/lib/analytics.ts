/**
 * Analytics — lightweight, env-gated event tracking.
 *
 * Supports three back-ends, all optional:
 *   • Vercel Analytics  — window.va("track", event, payload)
 *   • Plausible         — window.plausible(event, { props })
 *   • Development logs  — console.debug when VITE_ANALYTICS_DEBUG=1
 *
 * Usage:
 *   import { track } from "@/lib/analytics";
 *   track("agent_opened", { agent: "radar" });
 *
 * All calls are no-ops when analytics providers aren't loaded — safe to call
 * from any code path.
 */

type EventProps = Record<string, string | number | boolean | null | undefined>;

declare global {
  interface Window {
    va?: (event: "track", name: string, payload?: EventProps) => void;
    plausible?: (event: string, options?: { props?: EventProps }) => void;
  }
}

function isDebug(): boolean {
  if (typeof window === "undefined") return false;
  try {
    return import.meta.env.DEV || import.meta.env.VITE_ANALYTICS_DEBUG === "1";
  } catch {
    return false;
  }
}

export function track(event: string, props?: EventProps): void {
  if (typeof window === "undefined") return;

  try {
    // Vercel Analytics
    if (typeof window.va === "function") {
      window.va("track", event, props);
    }

    // Plausible
    if (typeof window.plausible === "function") {
      window.plausible(event, props ? { props } : undefined);
    }

    if (isDebug()) {
      // eslint-disable-next-line no-console
      console.debug("[analytics]", event, props ?? {});
    }
  } catch (err) {
    if (isDebug()) {
      // eslint-disable-next-line no-console
      console.warn("[analytics] failed to track", event, err);
    }
  }
}

export function trackPageView(path: string): void {
  track("page_view", { path });
}

export function identify(userId: string, traits?: EventProps): void {
  // Plausible doesn't identify; Vercel Analytics doesn't either by default.
  // We track a dedicated event so dashboards can group by user if desired.
  track("user_identified", { userId, ...traits });
}

/**
 * Check whether any analytics provider is actually connected.
 * Useful for conditional UI ("only show opt-out banner if provider loaded").
 */
export function isAnalyticsEnabled(): boolean {
  if (typeof window === "undefined") return false;
  return typeof window.va === "function" || typeof window.plausible === "function";
}
