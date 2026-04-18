import { create } from "zustand";
import { persist } from "zustand/middleware";

interface SidebarState {
  collapsed: boolean;
  expandedSections: Record<string, boolean>;
  toggleCollapsed: () => void;
  setCollapsed: (value: boolean) => void;
  toggleSection: (id: string) => void;
  setSectionExpanded: (id: string, expanded: boolean) => void;
}

export const useSidebarStore = create<SidebarState>()(
  persist(
    (set) => ({
      collapsed: false,
      expandedSections: {
        agentes: true,
        conhecimento: false,
      },
      toggleCollapsed: () => set((state) => ({ collapsed: !state.collapsed })),
      setCollapsed: (value) => set({ collapsed: value }),
      toggleSection: (id) =>
        set((state) => ({
          expandedSections: {
            ...state.expandedSections,
            [id]: !state.expandedSections[id],
          },
        })),
      setSectionExpanded: (id, expanded) =>
        set((state) => ({
          expandedSections: {
            ...state.expandedSections,
            [id]: expanded,
          },
        })),
    }),
    {
      name: "totum-sidebar",
      partialize: (state) => ({
        collapsed: state.collapsed,
        expandedSections: state.expandedSections,
      }),
    }
  )
);
