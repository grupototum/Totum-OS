CREATE TABLE IF NOT EXISTS public.skills_sync_runs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  triggered_by uuid REFERENCES auth.users (id) ON DELETE SET NULL,
  scope text NOT NULL DEFAULT 'all_active',
  git_branch text,
  git_pr_url text,
  status text NOT NULL DEFAULT 'queued'
    CHECK (status IN ('queued', 'preparing', 'github_published', 'waiting_connector_sync', 'kimi_uploaded', 'partial_success', 'failed')),
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.skills_sync_run_targets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  run_id uuid NOT NULL REFERENCES public.skills_sync_runs (id) ON DELETE CASCADE,
  provider text NOT NULL
    CHECK (provider IN ('claude_web', 'chatgpt', 'kimi')),
  status text NOT NULL DEFAULT 'queued'
    CHECK (status IN ('queued', 'preparing', 'github_published', 'waiting_connector_sync', 'kimi_uploaded', 'partial_success', 'failed')),
  details_json jsonb NOT NULL DEFAULT '{}'::jsonb,
  external_ids_json jsonb NOT NULL DEFAULT '{}'::jsonb,
  started_at timestamptz,
  finished_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (run_id, provider)
);

CREATE INDEX IF NOT EXISTS idx_skills_sync_runs_created_at
  ON public.skills_sync_runs (created_at DESC);

CREATE INDEX IF NOT EXISTS idx_skills_sync_targets_run_id
  ON public.skills_sync_run_targets (run_id);

ALTER TABLE public.skills_sync_runs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.skills_sync_run_targets ENABLE ROW LEVEL SECURITY;

COMMENT ON TABLE public.skills_sync_runs IS 'Execuções de sincronização de skills para Claude, ChatGPT e Kimi.';
COMMENT ON TABLE public.skills_sync_run_targets IS 'Status por provider em cada execução de sincronização de skills.';
