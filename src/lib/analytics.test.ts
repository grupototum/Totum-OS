import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { track, trackPageView, identify, isAnalyticsEnabled } from "./analytics";

describe("analytics", () => {
  beforeEach(() => {
    // Clean slate per test
    delete (window as any).va;
    delete (window as any).plausible;
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("is a no-op when no provider is loaded", () => {
    expect(() => track("any_event")).not.toThrow();
    expect(isAnalyticsEnabled()).toBe(false);
  });

  it("forwards to window.va when present", () => {
    const va = vi.fn();
    (window as any).va = va;
    track("agent_opened", { agent: "radar" });
    expect(va).toHaveBeenCalledWith("track", "agent_opened", { agent: "radar" });
  });

  it("forwards to window.plausible when present", () => {
    const plausible = vi.fn();
    (window as any).plausible = plausible;
    track("signup_completed", { plan: "pro" });
    expect(plausible).toHaveBeenCalledWith("signup_completed", { props: { plan: "pro" } });
  });

  it("forwards to plausible without options when no props", () => {
    const plausible = vi.fn();
    (window as any).plausible = plausible;
    track("ping");
    expect(plausible).toHaveBeenCalledWith("ping", undefined);
  });

  it("isAnalyticsEnabled returns true when a provider is attached", () => {
    (window as any).va = vi.fn();
    expect(isAnalyticsEnabled()).toBe(true);
  });

  it("trackPageView records path", () => {
    const va = vi.fn();
    (window as any).va = va;
    trackPageView("/hub");
    expect(va).toHaveBeenCalledWith("track", "page_view", { path: "/hub" });
  });

  it("identify records the userId", () => {
    const va = vi.fn();
    (window as any).va = va;
    identify("user-42", { plan: "pro" });
    expect(va).toHaveBeenCalledWith("track", "user_identified", {
      userId: "user-42",
      plan: "pro",
    });
  });

  it("swallows provider errors", () => {
    (window as any).va = () => {
      throw new Error("boom");
    };
    expect(() => track("x")).not.toThrow();
  });
});
