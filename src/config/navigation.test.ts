import { navigationSections, getAllNavPaths, getSectionForPath, isPathInSection } from "./navigation";

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
});
