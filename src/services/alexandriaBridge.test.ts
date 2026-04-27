import { describe, expect, it, vi } from "vitest";
import { analyzeBridgeFiles, createBridgeManifestTemplate } from "./alexandriaBridge";

vi.mock("@/integrations/supabase/client", () => ({
  supabase: {},
}));

describe("alexandriaBridge", () => {
  it("blocks sensitive Bulma files before Alexandria import", () => {
    const bridgePackage = analyzeBridgeFiles([
      {
        name: "contexto-sanitizado.md",
        content: "# Totum\nContexto permitido sobre skills e POPs.",
      },
      {
        name: "Financas/app/dados.md",
        content: "Dados bancarios e localStorage do app financeiro pessoal.",
      },
    ]);

    expect(bridgePackage.allowedFiles).toHaveLength(1);
    expect(bridgePackage.blockedFiles).toHaveLength(1);
    expect(bridgePackage.blockedFiles[0].zone).toBe("red");
  });

  it("marks personal summaries as yellow instead of blocking them", () => {
    const bridgePackage = analyzeBridgeFiles([
      {
        name: "preferencias-permitidas.md",
        content: "Resumo sanitizado de preferencias de rotina de trabalho.",
      },
    ]);

    expect(bridgePackage.allowedFiles[0].zone).toBe("yellow");
    expect(bridgePackage.allowedFiles[0].tags).toContain("privacy:yellow");
  });

  it("generates a manifest template for Bulma exports", () => {
    const template = JSON.parse(createBridgeManifestTemplate());

    expect(template.source).toBe("bulma_logseq_bridge");
    expect(template.files).toContain("contexto-sanitizado.md");
    expect(template.privacy_policy.red).toMatch(/Nunca/);
  });
});
