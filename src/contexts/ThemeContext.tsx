import { createContext, useContext, useEffect } from "react";

type Theme = "dark";

interface ThemeContextType {
  theme: Theme;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  // Always dark mode - no toggle
  const theme: Theme = "dark";

  useEffect(() => {
    const root = document.documentElement;
    // Force dark mode
    root.classList.remove("light");
    root.classList.add("dark");
    // Set background to black
    document.body.style.backgroundColor = "#000000";
    localStorage.setItem("totum-theme", "dark");
  }, []);

  return (
    <ThemeContext.Provider value={{ theme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used within ThemeProvider");
  return ctx;
}
