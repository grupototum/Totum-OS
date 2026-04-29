import type { Skill } from "../types/agents";

export type SkillSyncScope = "all_active";
export type SkillSyncProvider = "claude_web" | "chatgpt" | "kimi";
export type SkillSyncStatus =
  | "queued"
  | "preparing"
  | "github_published"
  | "waiting_connector_sync"
  | "kimi_uploaded"
  | "partial_success"
  | "failed";

export interface SkillSyncManifestEntry {
  id: string;
  name: string;
  status: string;
  model_preference: string | null;
  category: string;
  is_primary: boolean;
  routing_priority: number;
  tags: string[];
  skill_markdown: string;
  prompt_template_path: string | null;
  content_hash: string;
  updated_at: string;
}

export interface SkillSyncManifest {
  generated_at: string;
  scope: SkillSyncScope;
  total_skills: number;
  entries: SkillSyncManifestEntry[];
}

export interface SkillSyncFile {
  path: string;
  content: string;
  provider: SkillSyncProvider | "shared";
}

export interface SkillSyncTargetStatus {
  provider: SkillSyncProvider;
  status: SkillSyncStatus;
  message: string;
  exported_skills?: number;
  exported_files?: number;
  details?: Record<string, unknown>;
  external_ids?: Record<string, unknown>;
}

export interface SkillSyncRun {
  run_id: string;
  status: SkillSyncStatus;
  git_branch: string | null;
  git_pr_url: string | null;
  targets: SkillSyncTargetStatus[];
}

export interface NormalizeSkillSyncOptions {
  scope?: SkillSyncScope;
  generatedAt?: string;
}

export const DEFAULT_SKILL_SYNC_PROVIDERS: SkillSyncProvider[] = [
  "claude_web",
  "chatgpt",
  "kimi",
];

export async function sha256Hex(value: string): Promise<string> {
  const data = new TextEncoder().encode(value);
  const digest = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(digest))
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
}

export async function createSkillSyncManifest(
  registry: Record<string, Skill>,
  markdownById: Record<string, string>,
  options: NormalizeSkillSyncOptions = {}
): Promise<SkillSyncManifest> {
  const scope = options.scope || "all_active";
  const generatedAt = options.generatedAt || new Date().toISOString();
  const entries: SkillSyncManifestEntry[] = [];

  for (const [id, skill] of Object.entries(registry)) {
    if (scope === "all_active" && skill.status !== "active") continue;

    const markdown = (markdownById[id] || "").trim();
    if (!markdown) continue;

    const payload = JSON.stringify({
      id,
      name: skill.name,
      status: skill.status,
      model_preference: skill.model_preference || null,
      category: skill.category,
      is_primary: !!skill.is_primary,
      routing_priority: skill.routing_priority || 0,
      tags: skill.tags || [],
      prompt_template_path: skill.prompt_template || null,
      skill_markdown: markdown,
    });

    entries.push({
      id,
      name: skill.name,
      status: skill.status,
      model_preference: skill.model_preference || null,
      category: skill.category,
      is_primary: !!skill.is_primary,
      routing_priority: skill.routing_priority || 0,
      tags: skill.tags || [],
      skill_markdown: markdown,
      prompt_template_path: skill.prompt_template || null,
      content_hash: await sha256Hex(payload),
      updated_at: skill.updated_at || generatedAt,
    });
  }

  entries.sort((a, b) => {
    if (a.is_primary !== b.is_primary) return a.is_primary ? -1 : 1;
    return b.routing_priority - a.routing_priority || a.category.localeCompare(b.category) || a.name.localeCompare(b.name);
  });

  return {
    generated_at: generatedAt,
    scope,
    total_skills: entries.length,
    entries,
  };
}

export function buildSkillSyncFiles(
  manifest: SkillSyncManifest,
  providers: SkillSyncProvider[] = DEFAULT_SKILL_SYNC_PROVIDERS
): SkillSyncFile[] {
  const uniqueProviders = Array.from(new Set(providers));
  const files: SkillSyncFile[] = [
    {
      path: "exports/skills-sync/manifest.json",
      content: `${JSON.stringify(manifest, null, 2)}\n`,
      provider: "shared",
    },
  ];

  for (const provider of uniqueProviders) {
    files.push(...buildProviderFiles(manifest, provider));
  }

  return files.sort((a, b) => a.path.localeCompare(b.path));
}

export function buildProviderFiles(
  manifest: SkillSyncManifest,
  provider: SkillSyncProvider
): SkillSyncFile[] {
  const dir = providerDirectory(provider);
  const skillFiles = manifest.entries.map((entry) => ({
    path: `${dir}/skills/${slugifySegment(entry.category)}/${entry.id}.md`,
    content: renderProviderSkill(entry, provider),
    provider,
  }));
  const categoryFiles = buildProviderCategoryFiles(manifest, provider, dir);

  const indexFile: SkillSyncFile = {
    path: `${dir}/INDEX.md`,
    content: renderProviderIndex(manifest, provider),
    provider,
  };

  return [indexFile, ...categoryFiles, ...skillFiles];
}

export function providerDirectory(provider: SkillSyncProvider): string {
  switch (provider) {
    case "claude_web":
      return "exports/claude-web";
    case "chatgpt":
      return "exports/chatgpt";
    case "kimi":
      return "exports/kimi";
  }
}

export function providerLabel(provider: SkillSyncProvider): string {
  switch (provider) {
    case "claude_web":
      return "Claude Web";
    case "chatgpt":
      return "ChatGPT";
    case "kimi":
      return "Kimi";
  }
}

export function renderProviderSkill(
  entry: SkillSyncManifestEntry,
  provider: SkillSyncProvider
): string {
  const header = [
    "---",
    `skill_id: ${entry.id}`,
    `name: ${escapeYaml(entry.name)}`,
    `provider_target: ${provider}`,
    `status: ${entry.status}`,
    `category: ${entry.category}`,
    `is_primary: ${entry.is_primary}`,
    `routing_priority: ${entry.routing_priority}`,
    `model_preference: ${entry.model_preference || "unspecified"}`,
    `tags: [${entry.tags.map((tag) => escapeYaml(tag)).join(", ")}]`,
    `content_hash: ${entry.content_hash}`,
    `updated_at: ${entry.updated_at}`,
    ...(entry.prompt_template_path ? [`prompt_template_path: ${entry.prompt_template_path}`] : []),
    "---",
    "",
  ];

  const destinationCopy = providerSpecificIntro(provider, entry);
  return [...header, destinationCopy, "", entry.skill_markdown.trim(), ""].join("\n");
}

export function renderProviderIndex(
  manifest: SkillSyncManifest,
  provider: SkillSyncProvider
): string {
  const primaryEntry = manifest.entries.find((entry) => entry.is_primary) || null;
  const entriesByCategory = groupEntriesByCategory(manifest.entries);
  const lines = [
    `# ${providerLabel(provider)} Skills Index`,
    "",
    `- Scope: ${manifest.scope}`,
    `- Skills ativas exportadas: ${manifest.total_skills}`,
    `- Gerado em: ${manifest.generated_at}`,
    ...(primaryEntry
      ? [
          `- Skill principal: [${primaryEntry.name}](./skills/${slugifySegment(primaryEntry.category)}/${primaryEntry.id}.md)`,
        ]
      : []),
    "",
    "## Categorias",
    "",
    ...Object.entries(entriesByCategory).map(
      ([category, entries]) =>
        `- [${category}](./categories/${slugifySegment(category)}.md) · ${entries.length} skill(s)`
    ),
    "",
    "## Skills",
    "",
    ...manifest.entries.map((entry) => renderIndexEntry(entry)),
    "",
  ];

  return lines.join("\n");
}

export function renderProviderCategoryIndex(
  provider: SkillSyncProvider,
  category: string,
  entries: SkillSyncManifestEntry[]
): string {
  const lines = [
    `# ${providerLabel(provider)} · ${category}`,
    "",
    `- Skills nesta categoria: ${entries.length}`,
    "",
    ...entries.map((entry) => renderIndexEntry(entry)),
    "",
  ];

  return lines.join("\n");
}

function providerSpecificIntro(
  provider: SkillSyncProvider,
  entry: SkillSyncManifestEntry
): string {
  switch (provider) {
    case "claude_web":
      return [
        "Esta skill foi exportada pela Alexandria/Totum OS para consumo via GitHub integration no Claude.",
        `Use esta skill como contexto de referência para \`${entry.name}\`, preservando a instrução original abaixo.`,
      ].join("\n");
    case "chatgpt":
      return [
        "Esta skill foi exportada pela Alexandria/Totum OS para consumo via GitHub connector/synced connector no ChatGPT.",
        `Use este documento como contexto operacional da skill \`${entry.name}\`.`,
      ].join("\n");
    case "kimi":
      return [
        "Esta skill foi exportada pela Alexandria/Totum OS para upload na Files API do Kimi.",
        `Trate o conteúdo abaixo como instrução operacional da skill \`${entry.name}\`.`,
      ].join("\n");
  }
}

function escapeYaml(value: string): string {
  return JSON.stringify(value);
}

function buildProviderCategoryFiles(
  manifest: SkillSyncManifest,
  provider: SkillSyncProvider,
  dir: string
): SkillSyncFile[] {
  return Object.entries(groupEntriesByCategory(manifest.entries)).map(([category, entries]) => ({
    path: `${dir}/categories/${slugifySegment(category)}.md`,
    content: renderProviderCategoryIndex(provider, category, entries),
    provider,
  }));
}

function groupEntriesByCategory(entries: SkillSyncManifestEntry[]): Record<string, SkillSyncManifestEntry[]> {
  return entries.reduce<Record<string, SkillSyncManifestEntry[]>>((acc, entry) => {
    const key = entry.category || "uncategorized";
    acc[key] ||= [];
    acc[key].push(entry);
    return acc;
  }, {});
}

function renderIndexEntry(entry: SkillSyncManifestEntry): string {
  const prefix = entry.is_primary ? "principal · " : "";
  return `- [${entry.name}](./skills/${slugifySegment(entry.category)}/${entry.id}.md) · ${prefix}\`${entry.id}\` · ${entry.category} · ${entry.model_preference || "unspecified"}`;
}

function slugifySegment(value: string): string {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "") || "uncategorized";
}
