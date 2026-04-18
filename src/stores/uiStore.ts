import { create } from "zustand";

interface UIState {
  commandPaletteOpen: boolean;
  openCommandPalette: () => void;
  closeCommandPalette: () => void;
  toggleCommandPalette: () => void;

  mobileSidebarOpen: boolean;
  setMobileSidebarOpen: (open: boolean) => void;

  onboardingOpen: boolean;
  setOnboardingOpen: (open: boolean) => void;
}

export const useUIStore = create<UIState>((set) => ({
  commandPaletteOpen: false,
  openCommandPalette: () => set({ commandPaletteOpen: true }),
  closeCommandPalette: () => set({ commandPaletteOpen: false }),
  toggleCommandPalette: () => set((state) => ({ commandPaletteOpen: !state.commandPaletteOpen })),

  mobileSidebarOpen: false,
  setMobileSidebarOpen: (open) => set({ mobileSidebarOpen: open }),

  onboardingOpen: false,
  setOnboardingOpen: (open) => set({ onboardingOpen: open }),
}));
