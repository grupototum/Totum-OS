import { describe, expect, it } from "vitest";
import {
  buildProviderFiles,
  buildSkillSyncFiles,
  createSkillSyncManifest,
  type SkillSyncManifest,
} from "./skillsSync";
import type { Skill } from "@/types/agents";

const registry: Record<string, Skill> = {
  gmail: {
    id: "gmail",
    name: "Gmail",
    emoji: "📧",
    description: "Integra Gmail",
    category: "integration",
    model_preference: "claude",
    prompt_template: "prompts/gmail.md",
    status: "active",
    tags: ["email"],
  },
  skill_router: {
    id: "skill_router",
    name: "Skill Router",
    emoji: "🚦",
    description: "Roteia skills",
    category: "automation",
    model_preference: "claude",
    prompt_template: "prompts/skill_router.md",
    status: "active",
    is_primary: true,
    routing_priority: 1000,
    tags: ["router", "planner"],
  },
  archived: {
    id: "archived",
    name: "Archived",
    emoji: "🗃️",
    description: "Skill inativa",
    category: "integration",
    model_preference: "kimi",
    status: "inactive",
  },
};

describe("skillsSync", () => {
  it("inclui skill com SKILL.md e registry válidos", async () => {
    const manifest = await createSkillSyncManifest(
      registry,
      {
        gmail: "# Gmail\nConteúdo da skill.",
        skill_router: "# Skill Router\nRoteamento principal.",
      },
      { generatedAt: "2026-04-29T12:00:00.000Z" }
    );

    expect(manifest.total_skills).toBe(2);
    expect(manifest.entries[0].id).toBe("skill_router");
    expect(manifest.entries[0].is_primary).toBe(true);
    expect(manifest.entries[1].prompt_template_path).toBe("prompts/gmail.md");
  });

  it("não inclui skills inativas no escopo all_active", async () => {
    const manifest = await createSkillSyncManifest(
      registry,
      {
        gmail: "# Gmail\nConteúdo da skill.",
        skill_router: "# Skill Router\nRoteamento principal.",
        archived: "# Archived\nNão deve entrar.",
      },
      { generatedAt: "2026-04-29T12:00:00.000Z" }
    );

    expect(manifest.entries.map((entry) => entry.id)).toEqual(["skill_router", "gmail"]);
  });

  it("muda o hash quando o conteúdo da skill muda", async () => {
    const first = await createSkillSyncManifest(registry, {
      gmail: "# Gmail\nVersão A",
      skill_router: "# Skill Router\nRoteamento principal.",
    });
    const second = await createSkillSyncManifest(registry, {
      gmail: "# Gmail\nVersão B",
      skill_router: "# Skill Router\nRoteamento principal.",
    });

    expect(first.entries.find((entry) => entry.id === "gmail")?.content_hash).not.toBe(
      second.entries.find((entry) => entry.id === "gmail")?.content_hash
    );
  });

  it("gera arquivos esperados por provider e índice consolidado", () => {
    const manifest: SkillSyncManifest = {
      generated_at: "2026-04-29T12:00:00.000Z",
      scope: "all_active",
      total_skills: 1,
      entries: [
        {
          id: "skill_router",
          name: "Skill Router",
          status: "active",
          model_preference: "claude",
          category: "automation",
          is_primary: true,
          routing_priority: 1000,
          tags: ["router", "planner"],
          skill_markdown: "# Skill Router\nRoteamento principal.",
          prompt_template_path: "prompts/skill_router.md",
          content_hash: "router123",
          updated_at: "2026-04-29T12:00:00.000Z",
        },
        {
          id: "gmail",
          name: "Gmail",
          status: "active",
          model_preference: "claude",
          category: "integration",
          is_primary: false,
          routing_priority: 0,
          tags: ["email"],
          skill_markdown: "# Gmail\nConteúdo da skill.",
          prompt_template_path: "prompts/gmail.md",
          content_hash: "abc123",
          updated_at: "2026-04-29T12:00:00.000Z",
        },
      ],
    };

    const claudeFiles = buildProviderFiles(manifest, "claude_web");
    const allFiles = buildSkillSyncFiles(manifest, ["claude_web", "kimi"]);

    expect(claudeFiles.some((file) => file.path === "exports/claude-web/INDEX.md")).toBe(true);
    expect(claudeFiles.some((file) => file.path === "exports/claude-web/categories/automation.md")).toBe(true);
    expect(claudeFiles.some((file) => file.path === "exports/claude-web/skills/automation/skill_router.md")).toBe(true);
    expect(claudeFiles.some((file) => file.path === "exports/claude-web/skills/integration/gmail.md")).toBe(true);
    expect(allFiles.some((file) => file.path === "exports/skills-sync/manifest.json")).toBe(true);
    expect(claudeFiles[0].content.includes("undefined")).toBe(false);
  });
});
