import skillsRegistry from "@/lib/skills-registry.json";
import { supabase } from "@/integrations/supabase/client";
import { skillOverrides } from "@/lib/skillsOverrides";
import type { Skill } from "@/types/agents";
import {
  createSkillSyncManifest,
  DEFAULT_SKILL_SYNC_PROVIDERS,
  type SkillSyncManifest,
  type SkillSyncProvider,
  type SkillSyncRun,
  type SkillSyncScope,
} from "@/lib/skillsSync";

const skillMarkdownModules = import.meta.glob("../skills/*/SKILL.md", {
  eager: true,
  import: "default",
  query: "?raw",
});

export interface SyncSkillsRequest {
  scope?: SkillSyncScope;
  providers?: SkillSyncProvider[];
  triggeredBy?: string | null;
}

export async function buildCurrentSkillSyncManifest(
  scope: SkillSyncScope = "all_active"
): Promise<SkillSyncManifest> {
  const markdownById = Object.entries(skillMarkdownModules).reduce<Record<string, string>>((acc, [path, raw]) => {
    const match = path.match(/\/skills\/([^/]+)\/SKILL\.md$/);
    if (match) {
      acc[match[1]] = String(raw || "");
    }
    return acc;
  }, {});

  return createSkillSyncManifest(skillsRegistry as Record<string, Skill>, markdownById, {
    scope,
  });
}

export async function buildCurrentSkillSyncManifestWithOverrides(
  scope: SkillSyncScope = "all_active"
): Promise<SkillSyncManifest> {
  const markdownById = Object.entries(skillMarkdownModules).reduce<Record<string, string>>((acc, [path, raw]) => {
    const match = path.match(/\/skills\/([^/]+)\/SKILL\.md$/);
    if (match) {
      acc[match[1]] = String(raw || "");
    }
    return acc;
  }, {});

  return createSkillSyncManifest({
    ...(skillsRegistry as Record<string, Skill>),
    ...skillOverrides,
  }, markdownById, {
    scope,
  });
}

export async function syncSkills({
  scope = "all_active",
  providers = DEFAULT_SKILL_SYNC_PROVIDERS,
  triggeredBy = null,
}: SyncSkillsRequest = {}): Promise<SkillSyncRun> {
  const manifest = await buildCurrentSkillSyncManifestWithOverrides(scope);
  const { data, error } = await supabase.functions.invoke("skills-sync", {
    body: {
      scope,
      providers,
      triggeredBy,
      manifest,
    },
  });

  if (error) {
    throw new Error(error.message || "A função de sincronização de skills não respondeu.");
  }

  return data as SkillSyncRun;
}
