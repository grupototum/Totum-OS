import {
  navigationSections,
  getAllNavPaths,
  getSectionForPath,
  isPathInSection,
  getCommandPaletteEntries,
} from "./navigation";

describe("navigation config", () => {
  it("has exactly 5 pillars", () => {
    expect(navigationSections).toHaveLength(5);
  });

  it("has correct pillar labels", () => {
    const labels = navigationSections.map((s) => s.label);
    expect(labels).toEqual(["Visão", "Agentes", "Conhecimento", "Operações", "Sistema"]);
  });

  it("has correct pillar ids", () => {
    const ids = navigationSections.map((s) => s.id);
    expect(ids).toEqual(["visao", "agentes", "conhecimento", "operacoes", "sistema"]);
  });

  it("Visão has 3 items", () => {
    const visao = navigationSections.find((s) => s.id === "visao");
    expect(visao?.items).toHaveLength(3);
  });

  it("Agentes has expandable with 7 sub-items", () => {
    const agentes = navigationSections.find((s) => s.id === "agentes");
    expect(agentes?.expandable).toBeDefined();
    expect(agentes?.expandable?.subItems).toHaveLength(7);
  });

  it("Conhecimento has expandable with 7 sub-items", () => {
    const conhecimento = navigationSections.find((s) => s.id === "conhecimento");
    expect(conhecimento?.expandable).toBeDefined();
    expect(conhecimento?.expandable?.subItems).toHaveLength(7);
  });

  it("Operações has 6 items", () => {
    const operacoes = navigationSections.find((s) => s.id === "operacoes");
    expect(operacoes?.items).toHaveLength(6);
  });

  it("Sistema has 8 items including approvals badge", () => {
    const sistema = navigationSections.find((s) => s.id === "sistema");
    expect(sistema?.items).toHaveLength(8);
    const approvals = sistema?.items.find((i) => i.path === "/admin/approvals");
    expect(approvals?.badge).toBe("approvals");
  });

  it("getAllNavPaths returns all paths", () => {
    const paths = getAllNavPaths();
    expect(paths).toContain("/hub");
    expect(paths).toContain("/agents");
    expect(paths).toContain("/agents/radar/chat");
    expect(paths).toContain("/hermione");
    expect(paths).toContain("/tasks");
    expect(paths).toContain("/docs");
    expect(paths.length).toBeGreaterThan(20);
  });

  it("getSectionForPath returns correct section", () => {
    expect(getSectionForPath("/hub")).toBe("visao");
    expect(getSectionForPath("/agents/radar/chat")).toBe("agentes");
    expect(getSectionForPath("/hermione")).toBe("conhecimento");
    expect(getSectionForPath("/tasks")).toBe("operacoes");
    expect(getSectionForPath("/docs")).toBe("sistema");
  });

  it("isPathInSection works correctly", () => {
    expect(isPathInSection("/hub", "visao")).toBe(true);
    expect(isPathInSection("/hub", "agentes")).toBe(false);
    expect(isPathInSection("/hermione", "conhecimento")).toBe(true);
  });

  // ── CommandPalette integration ───────────────────────────────────────────
  describe("getCommandPaletteEntries", () => {
    it("returns entries for all top-level items", () => {
      const entries = getCommandPaletteEntries();
      expect(entries.find((e) => e.path === "/hub")).toBeDefined();
      expect(entries.find((e) => e.path === "/tasks")).toBeDefined();
      expect(entries.find((e) => e.path === "/docs")).toBeDefined();
    });

    it("includes expandable parents and subitems", () => {
      const entries = getCommandPaletteEntries();
      expect(entries.find((e) => e.path === "/agents")).toBeDefined();
      expect(entries.find((e) => e.path === "/agents/radar/chat")).toBeDefined();
      expect(entries.find((e) => e.path === "/hermione")).toBeDefined();
      expect(entries.find((e) => e.path === "/alexandria/pops")).toBeDefined();
    });

    it("groups entries by pillar label", () => {
      const entries = getCommandPaletteEntries();
      const hub = entries.find((e) => e.path === "/hub");
      const radar = entries.find((e) => e.path === "/agents/radar/chat");
      const hermione = entries.find((e) => e.path === "/hermione");
      expect(hub?.group).toBe("Visão");
      expect(radar?.group).toBe("Agentes");
      expect(hermione?.group).toBe("Conhecimento");
    });

    it("has unique ids", () => {
      const entries = getCommandPaletteEntries();
      const ids = entries.map((e) => e.id);
      expect(new Set(ids).size).toBe(ids.length);
    });

    it("provides an icon for every entry", () => {
      const entries = getCommandPaletteEntries();
      entries.forEach((e) => expect(e.icon).toBeDefined());
    });
  });
});
