import { describe, expect, it, vi } from "vitest";
import type { SkillSyncManifest } from "../../../src/lib/skillsSync";
import {
  buildSkillSyncBranchName,
  publishExportsToGithub,
  uploadFilesToKimi,
} from "./shared";

const manifest: SkillSyncManifest = {
  generated_at: "2026-04-29T12:00:00.000Z",
  scope: "all_active",
  total_skills: 1,
  entries: [
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

describe("skills-sync shared helpers", () => {
  it("buildSkillSyncBranchName usa o padrão esperado", () => {
    const branch = buildSkillSyncBranchName(new Date("2026-04-29T12:34:56.000Z"));
    expect(branch).toBe("sync/skills/20260429-123456");
  });

  it("publishExportsToGithub cria branch e PR com fetch mockado", async () => {
    const responses = [
      { object: { sha: "base-ref-sha" } },
      { tree: { sha: "base-tree-sha" } },
      { tree: [] },
      { sha: "blob-sha-1" },
      { sha: "blob-sha-2" },
      { sha: "new-tree-sha" },
      { sha: "new-commit-sha" },
      { ref: "refs/heads/sync/skills/20260429-123456" },
      { html_url: "https://github.com/grupototum/Totum-OS/pull/123" },
    ];

    const fetchImpl = vi.fn(async () => {
      const payload = responses.shift();
      return new Response(JSON.stringify(payload), { status: 200 });
    }) as unknown as typeof fetch;

    const result = await publishExportsToGithub({
      fetchImpl,
      token: "ghs_test",
      repo: "grupototum/Totum-OS",
      baseBranch: "main",
      branchName: "sync/skills/20260429-123456",
      providers: ["claude_web"],
      manifest,
      files: [
        { path: "exports/skills-sync/manifest.json", content: "{}", provider: "shared" },
        { path: "exports/claude-web/categories/integration.md", content: "# Integração", provider: "claude_web" },
        { path: "exports/claude-web/INDEX.md", content: "# Index", provider: "claude_web" },
      ],
    });

    expect(result.branch).toBe("sync/skills/20260429-123456");
    expect(result.prUrl).toContain("/pull/123");
    expect(fetchImpl).toHaveBeenCalled();
  });

  it("uploadFilesToKimi faz upload e retorna os file_ids", async () => {
    const fetchImpl = vi.fn(async () => {
      return new Response(JSON.stringify({ id: "file_123", filename: "gmail.md" }), { status: 200 });
    }) as unknown as typeof fetch;

    const result = await uploadFilesToKimi({
      fetchImpl,
      apiKey: "moonshot_test",
      files: [
        { path: "exports/kimi/skills/integration/gmail.md", content: "# Gmail", provider: "kimi" },
      ],
    });

    expect(result.uploaded).toBe(1);
    expect(result.files[0].file_id).toBe("file_123");
  });

  it("uploadFilesToKimi falha quando a API da Kimi retorna erro", async () => {
    const fetchImpl = vi.fn(async () => {
      return new Response(JSON.stringify({ message: "boom" }), { status: 500 });
    }) as unknown as typeof fetch;

    await expect(
      uploadFilesToKimi({
        fetchImpl,
        apiKey: "moonshot_test",
        files: [{ path: "exports/kimi/skills/integration/gmail.md", content: "# Gmail", provider: "kimi" }],
      })
    ).rejects.toThrow("boom");
  });
});
