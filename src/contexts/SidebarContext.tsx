/**
 * SidebarContext — shared collapsed state between AppSidebar and AppLayout
 * Allows the main content area to respond to sidebar collapse/expand.
 */
import { createContext, useContext, useState, type ReactNode } from 'react';

interface SidebarCtx {
  collapsed: boolean;
  toggle: () => void;
}

const SidebarContext = createContext<SidebarCtx>({
  collapsed: false,
  toggle: () => {},
});

export function SidebarProvider({ children }: { children: ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);
  return (
    <SidebarContext.Provider value={{ collapsed, toggle: () => setCollapsed((c) => !c) }}>
      {children}
    </SidebarContext.Provider>
  );
}

export function useSidebarCollapse() {
  return useContext(SidebarContext);
}
