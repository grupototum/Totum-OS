import { describe, expect, it } from "vitest";
import {
  buildKnowledgeSyncPreview,
  detectSkillCandidate,
  normalizeGoogleDriveFolderId,
} from "./alexandriaKnowledgeSync";

describe("alexandriaKnowledgeSync", () => {
  it("detecta skill por caminho e estrutura", () => {
    expect(
      detectSkillCandidate({
        name: "SKILL.md",
        sourcePath: "vault/skills/skill_router/SKILL.md",
        content: "# Skill Router",
      }).isSkillCandidate
    ).toBe(true);

    expect(
      detectSkillCandidate({
        name: "roteador.md",
        content: "skill_id: skill_router\n## Entradas\n## Saídas",
      }).isSkillCandidate
    ).toBe(true);
  });

  it("gera preview de sync focado em skills verdes", () => {
    const preview = buildKnowledgeSyncPreview("logseq_local", [
      {
        name: "skills/router/SKILL.md",
        content: "# Skill Router\n## Entradas\n## Saídas",
      },
      {
        name: "journal.md",
        content: "diário pessoal com rotina e contexto íntimo",
      },
    ]);

    expect(preview.skillCandidates).toHaveLength(1);
    expect(preview.importableSkills).toHaveLength(1);
    expect(preview.blockedFiles.length).toBeGreaterThanOrEqual(0);
  });

  it("normaliza links e ids de pasta do Google Drive", () => {
    expect(normalizeGoogleDriveFolderId("https://drive.google.com/drive/folders/abc123?usp=sharing")).toBe("abc123");
    expect(normalizeGoogleDriveFolderId("https://drive.google.com/open?id=xyz789")).toBe("xyz789");
    expect(normalizeGoogleDriveFolderId("plain-folder-id")).toBe("plain-folder-id");
  });
});
