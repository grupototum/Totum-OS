declare const Deno: {
  env: { get(key: string): string | undefined };
  serve(handler: (req: Request) => Response | Promise<Response>): void;
};

import type {
  SkillSyncManifest,
  SkillSyncProvider,
  SkillSyncRun,
  SkillSyncStatus,
  SkillSyncTargetStatus,
} from "../../../src/lib/skillsSync.ts";
import { DEFAULT_SKILL_SYNC_PROVIDERS } from "../../../src/lib/skillsSync.ts";
import {
  buildSkillSyncBranchName,
  prepareSyncFiles,
  publishExportsToGithub,
  uploadFilesToKimi,
} from "./shared.ts";

interface SkillsSyncRequest {
  scope?: "all_active";
  providers?: SkillSyncProvider[];
  triggeredBy?: string | null;
  manifest?: SkillSyncManifest;
}

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const SUPABASE_URL = Deno.env.get("SUPABASE_URL") || "";
const SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";
const GITHUB_TOKEN = Deno.env.get("GITHUB_TOKEN") || "";
const GITHUB_REPO = Deno.env.get("GITHUB_REPO") || "grupototum/Totum-OS";
const GITHUB_BASE_BRANCH = Deno.env.get("GITHUB_BASE_BRANCH") || "main";
const MOONSHOT_API_KEY = Deno.env.get("MOONSHOT_API_KEY") || "";

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return json({ ok: true });
  }

  if (req.method !== "POST") {
    return json({ error: "Method not allowed" }, 405);
  }

  if (!SUPABASE_URL || !SERVICE_ROLE_KEY) {
    return json({ error: "Supabase service credentials are not configured." }, 500);
  }

  try {
    const body = (await req.json().catch(() => ({}))) as SkillsSyncRequest;
    const scope = body.scope || "all_active";
    const providers = sanitizeProviders(body.providers);
    const manifest = body.manifest;

    if (!manifest || !Array.isArray(manifest.entries)) {
      return json({ error: "A manifest payload is required for skills sync." }, 400);
    }

    const runId = await insertRun({
      triggered_by: body.triggeredBy || null,
      scope,
      status: "queued",
    });

    await insertTargets(runId, providers);
    await updateRun(runId, { status: "preparing" });
    await updateTargets(runId, providers, { status: "preparing" });

    const syncFiles = prepareSyncFiles(manifest, providers);
    const targets: SkillSyncTargetStatus[] = [];
    let gitBranch: string | null = null;
    let gitPrUrl: string | null = null;

    const githubProviders = providers.filter((provider) => provider === "claude_web" || provider === "chatgpt");
    if (githubProviders.length) {
      try {
        if (!GITHUB_TOKEN) {
          throw new Error("GITHUB_TOKEN is not configured for skills sync.");
        }

        const branchName = buildSkillSyncBranchName();
        const githubResult = await publishExportsToGithub({
          fetchImpl: fetch,
          token: GITHUB_TOKEN,
          repo: GITHUB_REPO,
          baseBranch: GITHUB_BASE_BRANCH,
          branchName,
          files: syncFiles,
          providers: githubProviders,
          manifest,
        });

        gitBranch = githubResult.branch;
        gitPrUrl = githubResult.prUrl;

        for (const provider of githubProviders) {
          const message =
            provider === "claude_web"
              ? "Conteúdo publicado no GitHub. Use Sync no Project do Claude quando quiser forçar atualização imediata."
              : "Conteúdo publicado no GitHub. O conector/index do ChatGPT pode levar alguns minutos para refletir a atualização.";
          const target: SkillSyncTargetStatus = {
            provider,
            status: "waiting_connector_sync",
            message,
            exported_skills: manifest.total_skills,
            exported_files: syncFiles.filter((file) => file.provider === provider || file.provider === "shared").length,
            details: {
              branch: githubResult.branch,
              pr_url: githubResult.prUrl,
              files_published: githubResult.filesPublished,
            },
            external_ids: {
              branch: githubResult.branch,
              pr_url: githubResult.prUrl,
              commit_sha: githubResult.commitSha,
            },
          };
          targets.push(target);
          await updateTarget(runId, provider, target);
        }
      } catch (error) {
        const message = error instanceof Error ? error.message : "GitHub publication failed.";
        for (const provider of githubProviders) {
          const target: SkillSyncTargetStatus = {
            provider,
            status: "failed",
            message,
          };
          targets.push(target);
          await updateTarget(runId, provider, target);
        }
      }
    }

    if (providers.includes("kimi")) {
      try {
        if (!MOONSHOT_API_KEY) {
          throw new Error("MOONSHOT_API_KEY is not configured for skills sync.");
        }

        const kimiResult = await uploadFilesToKimi({
          fetchImpl: fetch,
          apiKey: MOONSHOT_API_KEY,
          files: syncFiles,
        });

        const target: SkillSyncTargetStatus = {
          provider: "kimi",
          status: "kimi_uploaded",
          message: "Arquivos enviados com sucesso e IDs registrados.",
          exported_skills: manifest.total_skills,
          exported_files: kimiResult.uploaded,
          details: {
            uploaded: kimiResult.uploaded,
          },
          external_ids: {
            files: kimiResult.files,
          },
        };
        targets.push(target);
        await updateTarget(runId, "kimi", target);
      } catch (error) {
        const target: SkillSyncTargetStatus = {
          provider: "kimi",
          status: "failed",
          message: error instanceof Error ? error.message : "Kimi upload failed.",
        };
        targets.push(target);
        await updateTarget(runId, "kimi", target);
      }
    }

    const status = deriveRunStatus(providers, targets);
    await updateRun(runId, {
      status,
      git_branch: gitBranch,
      git_pr_url: gitPrUrl,
    });

    return json({
      run_id: runId,
      status,
      git_branch: gitBranch,
      git_pr_url: gitPrUrl,
      targets,
    } satisfies SkillSyncRun);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown skills sync error.";
    return json({ error: message }, 500);
  }
});

function sanitizeProviders(providers?: SkillSyncProvider[]): SkillSyncProvider[] {
  if (!providers?.length) return DEFAULT_SKILL_SYNC_PROVIDERS;
  return Array.from(new Set(providers)).filter((provider): provider is SkillSyncProvider =>
    provider === "claude_web" || provider === "chatgpt" || provider === "kimi"
  );
}

function deriveRunStatus(
  providers: SkillSyncProvider[],
  targets: SkillSyncTargetStatus[]
): SkillSyncStatus {
  const statuses = new Map(targets.map((target) => [target.provider, target.status]));
  const resolved = providers.map((provider) => statuses.get(provider)).filter(Boolean);

  if (!resolved.length) return "failed";
  if (resolved.every((status) => status === "failed")) return "failed";
  if (resolved.some((status) => status === "failed")) return "partial_success";
  if (providers.length !== targets.length) return "partial_success";
  if (resolved.includes("waiting_connector_sync")) return "waiting_connector_sync";
  if (resolved.every((status) => status === "kimi_uploaded")) return "kimi_uploaded";
  if (resolved.every((status) => status === "github_published")) return "github_published";
  return "partial_success";
}

async function insertRun(input: {
  triggered_by: string | null;
  scope: string;
  status: SkillSyncStatus;
}) {
  const rows = await supabaseRest("/rest/v1/skills_sync_runs?select=id", {
    method: "POST",
    body: {
      triggered_by: input.triggered_by,
      scope: input.scope,
      status: input.status,
    },
    prefer: "return=representation",
  });

  if (!Array.isArray(rows) || !rows[0]?.id) {
    throw new Error("Could not create skills sync run.");
  }

  return rows[0].id as string;
}

async function insertTargets(runId: string, providers: SkillSyncProvider[]) {
  const payload = providers.map((provider) => ({
    run_id: runId,
    provider,
    status: "queued",
  }));

  await supabaseRest("/rest/v1/skills_sync_run_targets", {
    method: "POST",
    body: payload,
    prefer: "return=minimal",
  });
}

async function updateRun(
  runId: string,
  patch: {
    status?: SkillSyncStatus;
    git_branch?: string | null;
    git_pr_url?: string | null;
  }
) {
  await supabaseRest(`/rest/v1/skills_sync_runs?id=eq.${runId}`, {
    method: "PATCH",
    body: patch,
    prefer: "return=minimal",
  });
}

async function updateTargets(runId: string, providers: SkillSyncProvider[], patch: { status: SkillSyncStatus }) {
  for (const provider of providers) {
    await updateTarget(runId, provider, {
      provider,
      status: patch.status,
      message: "Preparando sincronização.",
    });
  }
}

async function updateTarget(runId: string, provider: SkillSyncProvider, target: SkillSyncTargetStatus) {
  await supabaseRest(`/rest/v1/skills_sync_run_targets?run_id=eq.${runId}&provider=eq.${provider}`, {
    method: "PATCH",
    body: {
      status: target.status,
      details_json: target.details || {},
      external_ids_json: target.external_ids || {},
      started_at: target.status === "preparing" ? new Date().toISOString() : undefined,
      finished_at: target.status !== "preparing" ? new Date().toISOString() : undefined,
    },
    prefer: "return=minimal",
  });
}

async function supabaseRest(
  path: string,
  init?: {
    method?: string;
    body?: unknown;
    prefer?: string;
  }
) {
  const response = await fetch(`${SUPABASE_URL}${path}`, {
    method: init?.method || "GET",
    headers: {
      apikey: SERVICE_ROLE_KEY,
      authorization: `Bearer ${SERVICE_ROLE_KEY}`,
      "Content-Type": "application/json",
      ...(init?.prefer ? { Prefer: init.prefer } : {}),
    },
    body: init?.body ? JSON.stringify(init.body) : undefined,
  });

  const payload = await response.json().catch(() => null);
  if (!response.ok) {
    throw new Error(payload?.message || payload?.error || `Supabase REST ${response.status}`);
  }

  return payload;
}

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      ...corsHeaders,
      "Content-Type": "application/json",
    },
  });
}
