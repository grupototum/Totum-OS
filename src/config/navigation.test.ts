import {
  navigationSections,
  getAllNavPaths,
  getSectionForPath,
  isPathInSection,
  getCommandPaletteEntries,
} from "./navigation";

describe("navigation config", () => {
  it("has Totum OS workspaces", () => {
    expect(navigationSections).toHaveLength(7);
  });

  it("has correct workspace labels", () => {
    const labels = navigationSections.map((s) => s.label);
    expect(labels).toEqual(["Início", "AI Command", "Agentes", "Alexandria", "Fluxos", "Operação", "Sistema"]);
  });

  it("has correct workspace ids", () => {
    const ids = navigationSections.map((s) => s.id);
    expect(ids).toEqual(["inicio", "command", "agentes", "conhecimento", "fluxos", "operacoes", "sistema"]);
  });

  it("Início has 2 items", () => {
    const inicio = navigationSections.find((s) => s.id === "inicio");
    expect(inicio?.items).toHaveLength(2);
  });

  it("AI Command has 2 items", () => {
    const command = navigationSections.find((s) => s.id === "command");
    expect(command?.items).toHaveLength(2);
  });

  it("Agentes has expandable with 7 sub-items", () => {
    const agentes = navigationSections.find((s) => s.id === "agentes");
    expect(agentes?.expandable).toBeDefined();
    expect(agentes?.expandable?.subItems).toHaveLength(7);
  });

  it("Alexandria has expandable with 8 sub-items", () => {
    const conhecimento = navigationSections.find((s) => s.id === "conhecimento");
    expect(conhecimento?.expandable).toBeDefined();
    expect(conhecimento?.expandable?.subItems).toHaveLength(8);
  });

  it("Fluxos has expandable with 4 sub-items", () => {
    const fluxos = navigationSections.find((s) => s.id === "fluxos");
    expect(fluxos?.expandable).toBeDefined();
    expect(fluxos?.expandable?.subItems).toHaveLength(4);
  });

  it("Operação has 5 items", () => {
    const operacoes = navigationSections.find((s) => s.id === "operacoes");
    expect(operacoes?.items).toHaveLength(5);
  });

  it("Sistema has 7 items including approvals badge", () => {
    const sistema = navigationSections.find((s) => s.id === "sistema");
    expect(sistema?.items).toHaveLength(7);
    const approvals = sistema?.items.find((i) => i.path === "/admin/approvals");
    expect(approvals?.badge).toBe("approvals");
  });

  it("getAllNavPaths returns all paths", () => {
    const paths = getAllNavPaths();
    expect(paths).toContain("/ai-command-center");
    expect(paths).toContain("/agents");
    expect(paths).toContain("/ai-command-center?agent=radar");
    expect(paths).toContain("/hermione");
    expect(paths).toContain("/alexandria/bridges");
    expect(paths).toContain("/tasks");
    expect(paths).toContain("/docs");
    expect(paths.length).toBeGreaterThan(20);
  });

  it("getSectionForPath returns correct section", () => {
    expect(getSectionForPath("/dashboard")).toBe("inicio");
    expect(getSectionForPath("/ai-command-center?agent=radar")).toBe("agentes");
    expect(getSectionForPath("/hermione")).toBe("conhecimento");
    expect(getSectionForPath("/tasks")).toBe("operacoes");
    expect(getSectionForPath("/docs")).toBe("sistema");
  });

  it("isPathInSection works correctly", () => {
    expect(isPathInSection("/dashboard", "inicio")).toBe(true);
    expect(isPathInSection("/dashboard", "agentes")).toBe(false);
    expect(isPathInSection("/hermione", "conhecimento")).toBe(true);
  });

  // ── CommandPalette integration ───────────────────────────────────────────
  describe("getCommandPaletteEntries", () => {
    it("returns entries for all top-level items", () => {
      const entries = getCommandPaletteEntries();
      expect(entries.find((e) => e.path === "/ai-command-center")).toBeDefined();
      expect(entries.find((e) => e.path === "/tasks")).toBeDefined();
      expect(entries.find((e) => e.path === "/docs")).toBeDefined();
    });

    it("includes expandable parents and subitems", () => {
      const entries = getCommandPaletteEntries();
      expect(entries.find((e) => e.path === "/agents")).toBeDefined();
      expect(entries.find((e) => e.path === "/ai-command-center?agent=radar")).toBeDefined();
      expect(entries.find((e) => e.path === "/hermione")).toBeDefined();
      expect(entries.find((e) => e.path === "/alexandria/pops")).toBeDefined();
    });

    it("groups entries by pillar label", () => {
      const entries = getCommandPaletteEntries();
      const hub = entries.find((e) => e.path === "/dashboard");
      const radar = entries.find((e) => e.path === "/ai-command-center?agent=radar");
      const hermione = entries.find((e) => e.path === "/hermione");
      expect(hub?.group).toBe("Início");
      expect(radar?.group).toBe("Agentes");
      expect(hermione?.group).toBe("Alexandria");
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
