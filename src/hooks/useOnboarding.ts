import { useState, useEffect } from "react";

const STORAGE_KEY = "totum_onboarded_v2";

export function useOnboarding() {
  const [showOnboarding, setShowOnboarding] = useState(false);

  useEffect(() => {
    const done = localStorage.getItem(STORAGE_KEY);
    if (!done) {
      const t = setTimeout(() => setShowOnboarding(true), 800);
      return () => clearTimeout(t);
    }
  }, []);

  const closeOnboarding = () => {
    localStorage.setItem(STORAGE_KEY, "true");
    setShowOnboarding(false);
  };

  const resetOnboarding = () => {
    localStorage.removeItem(STORAGE_KEY);
    setShowOnboarding(true);
  };

  return {
    showOnboarding,
    closeOnboarding,
    resetOnboarding,
  };
}
