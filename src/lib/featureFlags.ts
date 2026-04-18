/**
 * Feature Flags — zero-dependency toggle system.
 *
 * Flags can be set from three sources, in priority order:
 *   1. Runtime override (window.localStorage key `totum_ff_<flag>` = "1" / "0")
 *   2. Build-time env var (`VITE_FF_<FLAG>=1` in .env)
 *   3. In-code default (`DEFAULTS` below)
 *
 * Use `enableFlag("newHub")` in the browser console to toggle a flag without
 * rebuilding. Flags are intentionally boolean-only — add a second system if
 * you need variants.
 *
 * Usage:
 *   import { isEnabled } from "@/lib/featureFlags";
 *   if (isEnabled("newHub")) { ... }
 */

// ─── Registry ────────────────────────────────────────────────────────────────
// Add new flags here. The name drives both the env var and the localStorage key.
export type FeatureFlag =
  | "newHub"
  | "commandPaletteExtras"
  | "n8nLiveExecutions"
  | "analyticsOptOutBanner";

const DEFAULTS: Record<FeatureFlag, boolean> = {
  newHub: false,
  commandPaletteExtras: true,
  n8nLiveExecutions: true,
  analyticsOptOutBanner: false,
};

// ─── Resolution ──────────────────────────────────────────────────────────────

const LS_PREFIX = "totum_ff_";

function envKey(flag: FeatureFlag): string {
  // newHub → VITE_FF_NEW_HUB
  const snake = flag.replace(/([A-Z])/g, "_$1").toUpperCase();
  return `VITE_FF_${snake}`;
}

function parseBool(v: string | null | undefined): boolean | null {
  if (v === "1" || v === "true") return true;
  if (v === "0" || v === "false") return false;
  return null;
}

function readLocalOverride(flag: FeatureFlag): boolean | null {
  if (typeof window === "undefined") return null;
  try {
    return parseBool(window.localStorage.getItem(`${LS_PREFIX}${flag}`));
  } catch {
    return null;
  }
}

function readEnvOverride(flag: FeatureFlag): boolean | null {
  try {
    const value = (import.meta.env as Record<string, string | undefined>)[envKey(flag)];
    return parseBool(value);
  } catch {
    return null;
  }
}

export function isEnabled(flag: FeatureFlag): boolean {
  const local = readLocalOverride(flag);
  if (local !== null) return local;

  const env = readEnvOverride(flag);
  if (env !== null) return env;

  return DEFAULTS[flag];
}

export function enableFlag(flag: FeatureFlag): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(`${LS_PREFIX}${flag}`, "1");
}

export function disableFlag(flag: FeatureFlag): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(`${LS_PREFIX}${flag}`, "0");
}

export function clearFlagOverride(flag: FeatureFlag): void {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(`${LS_PREFIX}${flag}`);
}

export function getAllFlags(): Record<FeatureFlag, boolean> {
  const result = {} as Record<FeatureFlag, boolean>;
  for (const key of Object.keys(DEFAULTS) as FeatureFlag[]) {
    result[key] = isEnabled(key);
  }
  return result;
}

// Dev-time helper: expose on window so people can poke flags from DevTools.
if (typeof window !== "undefined") {
  try {
    const devOnly =
      // Vite marks DEV at build time
      (import.meta.env as Record<string, unknown>).DEV === true;
    if (devOnly) {
      (window as unknown as Record<string, unknown>).__totumFlags = {
        isEnabled,
        enable: enableFlag,
        disable: disableFlag,
        clear: clearFlagOverride,
        all: getAllFlags,
      };
    }
  } catch {
    /* noop */
  }
}
