import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useOnboarding } from "./useOnboarding";

describe("useOnboarding", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.useFakeTimers();
  });

  it("does not show onboarding when already completed", () => {
    (window.localStorage.getItem as ReturnType<typeof vi.fn>).mockReturnValue("true");
    const { result } = renderHook(() => useOnboarding());
    act(() => {
      vi.advanceTimersByTime(1000);
    });
    expect(result.current.showOnboarding).toBe(false);
  });

  it("shows onboarding after delay when flag not set", () => {
    (window.localStorage.getItem as ReturnType<typeof vi.fn>).mockReturnValue(null);
    const { result } = renderHook(() => useOnboarding());
    expect(result.current.showOnboarding).toBe(false);

    act(() => {
      vi.advanceTimersByTime(1000);
    });

    expect(result.current.showOnboarding).toBe(true);
  });

  it("closeOnboarding persists the flag and hides the modal", () => {
    (window.localStorage.getItem as ReturnType<typeof vi.fn>).mockReturnValue(null);
    const setItem = window.localStorage.setItem as ReturnType<typeof vi.fn>;
    const { result } = renderHook(() => useOnboarding());

    act(() => {
      vi.advanceTimersByTime(1000);
    });

    act(() => {
      result.current.closeOnboarding();
    });

    expect(setItem).toHaveBeenCalledWith("totum_onboarded_v2", "true");
    expect(result.current.showOnboarding).toBe(false);
  });

  it("resetOnboarding removes the flag and shows again", () => {
    (window.localStorage.getItem as ReturnType<typeof vi.fn>).mockReturnValue("true");
    const removeItem = window.localStorage.removeItem as ReturnType<typeof vi.fn>;
    const { result } = renderHook(() => useOnboarding());

    act(() => {
      result.current.resetOnboarding();
    });

    expect(removeItem).toHaveBeenCalledWith("totum_onboarded_v2");
    expect(result.current.showOnboarding).toBe(true);
  });
});
