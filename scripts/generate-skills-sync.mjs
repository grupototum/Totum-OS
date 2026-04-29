import { createHash } from "node:crypto";
import { mkdir, readFile, readdir, rm, writeFile } from "node:fs/promises";
import path from "node:path";

const root = process.cwd();
const registryPath = path.join(root, "src/lib/skills-registry.json");
const skillsDir = path.join(root, "src/skills");
const exportsDir = path.join(root, "exports");

const registry = JSON.parse(await readFile(registryPath, "utf8"));
const generatedAt = new Date().toISOString();
const skillOverrides = {
  skill_router: {
    id: "skill_router",
    name: "Skill Router",
    emoji: "🚦",
    description: "Descobre, prioriza e recomenda quais skills devem ser usadas para cada objetivo antes da execução.",
    version: "1.0.0",
    category: "automation",
    model_preference: "claude",
    prompt_template: "prompts/skill_router.md",
    status: "active",
    is_primary: true,
    routing_priority: 1000,
    tags: ["router", "planner", "orchestration", "skills", "alexandria"],
  },
};

const markdownById = {};
for (const entry of await readdir(skillsDir, { withFileTypes: true })) {
  if (!entry.isDirectory()) continue;
  const skillPath = path.join(skillsDir, entry.name, "SKILL.md");
  try {
    markdownById[entry.name] = (await readFile(skillPath, "utf8")).trim();
  } catch {
    // Skip folders without SKILL.md
  }
}

const entries = [];
for (const [id, skill] of Object.entries({ ...registry, ...skillOverrides })) {
  if (skill.status !== "active") continue;
  const markdown = markdownById[id];
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
    content_hash: createHash("sha256").update(payload).digest("hex"),
    updated_at: skill.updated_at || generatedAt,
  });
}

entries.sort((a, b) => {
  if (a.is_primary !== b.is_primary) return a.is_primary ? -1 : 1;
  return b.routing_priority - a.routing_priority || a.category.localeCompare(b.category) || a.name.localeCompare(b.name);
});

const manifest = {
  generated_at: generatedAt,
  scope: "all_active",
  total_skills: entries.length,
  entries,
};

await rm(exportsDir, { recursive: true, force: true });

const providerConfigs = [
  { id: "claude-web", label: "Claude Web", intro: "Esta skill foi exportada pela Alexandria/Totum OS para consumo via GitHub integration no Claude." },
  { id: "chatgpt", label: "ChatGPT", intro: "Esta skill foi exportada pela Alexandria/Totum OS para consumo via GitHub connector/synced connector no ChatGPT." },
  { id: "kimi", label: "Kimi", intro: "Esta skill foi exportada pela Alexandria/Totum OS para upload na Files API do Kimi." },
];

await writeText(path.join(exportsDir, "skills-sync", "manifest.json"), `${JSON.stringify(manifest, null, 2)}\n`);

for (const provider of providerConfigs) {
  const providerDir = path.join(exportsDir, provider.id);
  const primaryEntry = entries.find((entry) => entry.is_primary);
  const lines = [
    `# ${provider.label} Skills Index`,
    "",
    `- Scope: ${manifest.scope}`,
    `- Skills ativas exportadas: ${manifest.total_skills}`,
    `- Gerado em: ${manifest.generated_at}`,
    ...(primaryEntry ? [`- Skill principal: [${primaryEntry.name}](./skills/${slugifySegment(primaryEntry.category)}/${primaryEntry.id}.md)`] : []),
    "",
    "## Categorias",
    "",
  ];

  for (const [category, categoryEntries] of Object.entries(groupByCategory(entries))) {
    const categorySlug = slugifySegment(category);
    lines.push(`- [${category}](./categories/${categorySlug}.md) · ${categoryEntries.length} skill(s)`);

    const categoryContent = [
      `# ${provider.label} · ${category}`,
      "",
      `- Skills nesta categoria: ${categoryEntries.length}`,
      "",
      ...categoryEntries.map(renderIndexEntry),
      "",
    ].join("\n");

    await writeText(path.join(providerDir, "categories", `${categorySlug}.md`), categoryContent);
  }

  lines.push(
    "",
    "## Skills",
    "",
  );

  for (const entry of entries) {
    const content = [
      "---",
      `skill_id: ${entry.id}`,
      `name: ${JSON.stringify(entry.name)}`,
      `provider_target: ${provider.id.replace("-", "_")}`,
      `status: ${entry.status}`,
      `category: ${entry.category}`,
      `is_primary: ${entry.is_primary}`,
      `routing_priority: ${entry.routing_priority}`,
      `model_preference: ${entry.model_preference || "unspecified"}`,
      `tags: [${entry.tags.map((tag) => JSON.stringify(tag)).join(", ")}]`,
      `content_hash: ${entry.content_hash}`,
      `updated_at: ${entry.updated_at}`,
      ...(entry.prompt_template_path ? [`prompt_template_path: ${entry.prompt_template_path}`] : []),
      "---",
      "",
      provider.intro,
      "",
      entry.skill_markdown,
      "",
    ].join("\n");

    await writeText(path.join(providerDir, "skills", slugifySegment(entry.category), `${entry.id}.md`), content);
    lines.push(renderIndexEntry(entry));
  }

  lines.push("");
  await writeText(path.join(providerDir, "INDEX.md"), lines.join("\n"));
}

console.log(`Generated skills sync exports for ${entries.length} active skills.`);

async function writeText(filePath, content) {
  await mkdir(path.dirname(filePath), { recursive: true });
  await writeFile(filePath, content, "utf8");
}

function slugifySegment(value) {
  return String(value)
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "") || "uncategorized";
}

function groupByCategory(entries) {
  return entries.reduce((acc, entry) => {
    const key = entry.category || "uncategorized";
    acc[key] ||= [];
    acc[key].push(entry);
    return acc;
  }, {});
}

function renderIndexEntry(entry) {
  const prefix = entry.is_primary ? "principal · " : "";
  return `- [${entry.name}](./skills/${slugifySegment(entry.category)}/${entry.id}.md) · ${prefix}\`${entry.id}\` · ${entry.category} · ${entry.model_preference || "unspecified"}`;
}
