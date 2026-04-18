import { useSidebarStore } from "./sidebarStore";

describe("sidebarStore", () => {
  beforeEach(() => {
    // Reset store to initial state
    useSidebarStore.setState({
      collapsed: false,
      expandedSections: { agentes: true, conhecimento: false },
    });
  });

  it("starts with collapsed false", () => {
    expect(useSidebarStore.getState().collapsed).toBe(false);
  });

  it("toggles collapsed", () => {
    useSidebarStore.getState().toggleCollapsed();
    expect(useSidebarStore.getState().collapsed).toBe(true);
    useSidebarStore.getState().toggleCollapsed();
    expect(useSidebarStore.getState().collapsed).toBe(false);
  });

  it("sets collapsed directly", () => {
    useSidebarStore.getState().setCollapsed(true);
    expect(useSidebarStore.getState().collapsed).toBe(true);
  });

  it("toggles sections", () => {
    expect(useSidebarStore.getState().expandedSections.agentes).toBe(true);
    useSidebarStore.getState().toggleSection("agentes");
    expect(useSidebarStore.getState().expandedSections.agentes).toBe(false);
    useSidebarStore.getState().toggleSection("agentes");
    expect(useSidebarStore.getState().expandedSections.agentes).toBe(true);
  });

  it("sets section expanded directly", () => {
    useSidebarStore.getState().setSectionExpanded("conhecimento", true);
    expect(useSidebarStore.getState().expandedSections.conhecimento).toBe(true);
  });
});
