import { describe, it, expect, beforeEach, vi } from "vitest";
import {
  isEnabled,
  enableFlag,
  disableFlag,
  clearFlagOverride,
  getAllFlags,
} from "./featureFlags";

describe("featureFlags", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Default mock: no local overrides
    (window.localStorage.getItem as ReturnType<typeof vi.fn>).mockReturnValue(null);
  });

  it("returns defaults when no overrides are set", () => {
    // commandPaletteExtras has default true
    expect(isEnabled("commandPaletteExtras")).toBe(true);
    // newHub has default false
    expect(isEnabled("newHub")).toBe(false);
  });

  it("localStorage override wins over defaults (truthy)", () => {
    (window.localStorage.getItem as ReturnType<typeof vi.fn>).mockImplementation(
      (key: string) => (key === "totum_ff_newHub" ? "1" : null)
    );
    expect(isEnabled("newHub")).toBe(true);
  });

  it("localStorage override wins over defaults (falsy)", () => {
    (window.localStorage.getItem as ReturnType<typeof vi.fn>).mockImplementation(
      (key: string) => (key === "totum_ff_commandPaletteExtras" ? "0" : null)
    );
    expect(isEnabled("commandPaletteExtras")).toBe(false);
  });

  it("enableFlag writes '1' to the prefixed key", () => {
    const setItem = window.localStorage.setItem as ReturnType<typeof vi.fn>;
    enableFlag("newHub");
    expect(setItem).toHaveBeenCalledWith("totum_ff_newHub", "1");
  });

  it("disableFlag writes '0' to the prefixed key", () => {
    const setItem = window.localStorage.setItem as ReturnType<typeof vi.fn>;
    disableFlag("commandPaletteExtras");
    expect(setItem).toHaveBeenCalledWith("totum_ff_commandPaletteExtras", "0");
  });

  it("clearFlagOverride removes the key", () => {
    const removeItem = window.localStorage.removeItem as ReturnType<typeof vi.fn>;
    clearFlagOverride("newHub");
    expect(removeItem).toHaveBeenCalledWith("totum_ff_newHub");
  });

  it("getAllFlags returns a full record", () => {
    const all = getAllFlags();
    expect(all).toHaveProperty("newHub");
    expect(all).toHaveProperty("commandPaletteExtras");
    expect(all).toHaveProperty("n8nLiveExecutions");
    expect(all).toHaveProperty("analyticsOptOutBanner");
  });
});
