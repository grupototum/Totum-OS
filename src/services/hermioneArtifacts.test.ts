import { describe, expect, it, vi } from "vitest";
import { analyzeSourceContent, consolidateSourceInputs } from "./hermioneArtifacts";

vi.mock("@/integrations/supabase/client", () => ({
  supabase: {},
}));

describe("hermioneArtifacts", () => {
  it("detects skill-like markdown and extracts reusable signals", () => {
    const analysis = analyzeSourceContent(
      "notebooklm-skill.md",
      `# Skill de Pesquisa

## Quando Usar
Use quando precisar analisar documentos de várias IAs.

## Entrada
- documentos

## Saída
- resumo consolidado

Evitar duplicação entre fontes.`
    );

    expect(analysis.detectedType).toBe("skill");
    expect(analysis.recommendedOutput).toBe("skill");
    expect(analysis.conflicts.join(" ")).toMatch(/Evitar duplicação/);
    expect(analysis.tags).toContain("skill");
  });

  it("consolidates multiple AI documents into one artifact draft", () => {
    const result = consolidateSourceInputs([
      {
        name: "claude-alexandria.md",
        content: "# Alexandria\nA central deve unificar conhecimento, contexto e documentos.",
      },
      {
        name: "kimi-alexandria.md",
        content: "# Hermione\nA bibliotecária precisa gerar skill, prompt e documento para download.",
      },
    ]);

    expect(result.title).toMatch(/consolidad/i);
    expect(result.content).toMatch(/Fontes/);
    expect(result.content).toMatch(/claude-alexandria.md/);
    expect(result.content).toMatch(/kimi-alexandria.md/);
    expect(result.tags.length).toBeGreaterThan(0);
  });
});
