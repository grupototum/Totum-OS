import { describe, expect, it, vi } from "vitest";
import {
  analyzeSourceContent,
  consolidateSourceInputs,
  sanitizeSourceInput,
  simulateAssimilation,
} from "./hermioneArtifacts";

const mocks = vi.hoisted(() => ({
  existingSources: [] as any[],
  artifacts: [] as any[],
}));

vi.mock("@/integrations/supabase/client", () => ({
  supabase: {
    from: (table: string) => ({
      select: () => {
        if (table === "hermione_sources") {
          return {
            in: () => Promise.resolve({ data: mocks.existingSources, error: null }),
          };
        }

        return {
          order: () => ({
            limit: () => {
              const result = Promise.resolve({ data: mocks.artifacts, error: null }) as any;
              result.or = () => Promise.resolve({ data: mocks.artifacts, error: null });
              return result;
            },
          }),
        };
      },
    }),
  },
}));

describe("hermioneArtifacts", () => {
  it("sanitizes control characters that break Postgres JSON/Unicode handling", async () => {
    const sanitized = await sanitizeSourceInput({
      name: "unicode-problem.md",
      content: "# Teste\u0000\nConteúdo válido\u0008 com controle.",
    });

    expect(sanitized.content).not.toContain("\u0000");
    expect(sanitized.content).not.toContain("\u0008");
    expect(sanitized.sanitizationWarnings.length).toBeGreaterThan(0);
  });

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

  it("simulates exact duplicates against existing sources before saving", async () => {
    const duplicated = await sanitizeSourceInput({
      name: "skill.md",
      content: "# Skill\nUse esta skill para organizar conhecimento.",
    });
    mocks.existingSources = [{ file_name: "old/skill.md", content_hash: duplicated.contentHash }];
    mocks.artifacts = [];

    const preview = await simulateAssimilation([
      { name: "new/skill.md", content: "# Skill\nUse esta skill para organizar conhecimento." },
    ]);

    expect(preview.exactDuplicates).toHaveLength(1);
    expect(preview.exactDuplicates[0].match).toBe("old/skill.md");
    mocks.existingSources = [];
  });

  it("keeps conflicts in review and writes them into the assimilation report", async () => {
    mocks.existingSources = [];
    mocks.artifacts = [];

    const preview = await simulateAssimilation([
      {
        name: "claude-planejamento.md",
        content: "# Planejamento\nNão usar Gemini neste fluxo por conflito operacional.",
      },
    ]);

    expect(preview.conflicts.length).toBeGreaterThan(0);
    expect(preview.recommendedStatus).toBe("review");
    expect(preview.reportMarkdown).toMatch(/Conflitos/);
  });
});
