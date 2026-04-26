-- Hermione/Alexandria consultative knowledge layer
-- Stores uploaded sources, generated artifacts, versions, relationships and consultation logs.

CREATE EXTENSION IF NOT EXISTS vector;

CREATE TABLE IF NOT EXISTS public.hermione_sources (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  file_name TEXT NOT NULL,
  source_type TEXT NOT NULL DEFAULT 'markdown',
  origin TEXT DEFAULT 'upload',
  author TEXT DEFAULT 'upload',
  content TEXT NOT NULL,
  content_hash TEXT NOT NULL UNIQUE,
  detected_type TEXT NOT NULL DEFAULT 'document'
    CHECK (detected_type IN ('skill', 'pop', 'prompt', 'decision', 'summary', 'document', 'context_pack')),
  tags TEXT[] DEFAULT '{}',
  metadata JSONB DEFAULT '{}',
  embedding VECTOR(768),
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.hermione_artifacts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  artifact_type TEXT NOT NULL DEFAULT 'document'
    CHECK (artifact_type IN ('skill', 'pop', 'prompt', 'decision', 'summary', 'document', 'context_pack')),
  status TEXT NOT NULL DEFAULT 'draft'
    CHECK (status IN ('draft', 'review', 'approved', 'deprecated', 'superseded')),
  scope TEXT NOT NULL DEFAULT 'totum',
  content TEXT NOT NULL,
  summary TEXT,
  tags TEXT[] DEFAULT '{}',
  metadata JSONB DEFAULT '{}',
  version INTEGER NOT NULL DEFAULT 1,
  embedding VECTOR(768),
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.hermione_artifact_versions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  artifact_id UUID NOT NULL REFERENCES public.hermione_artifacts(id) ON DELETE CASCADE,
  version INTEGER NOT NULL,
  content TEXT NOT NULL,
  change_note TEXT,
  metadata JSONB DEFAULT '{}',
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (artifact_id, version)
);

CREATE TABLE IF NOT EXISTS public.hermione_artifact_sources (
  artifact_id UUID NOT NULL REFERENCES public.hermione_artifacts(id) ON DELETE CASCADE,
  source_id UUID NOT NULL REFERENCES public.hermione_sources(id) ON DELETE CASCADE,
  contribution_type TEXT NOT NULL DEFAULT 'source',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (artifact_id, source_id)
);

CREATE TABLE IF NOT EXISTS public.hermione_relationships (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  from_artifact_id UUID REFERENCES public.hermione_artifacts(id) ON DELETE CASCADE,
  to_artifact_id UUID REFERENCES public.hermione_artifacts(id) ON DELETE CASCADE,
  relationship_type TEXT NOT NULL,
  notes TEXT,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.hermione_consultations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  query TEXT NOT NULL,
  response TEXT,
  source_ids UUID[] DEFAULT '{}',
  artifact_ids UUID[] DEFAULT '{}',
  feedback INTEGER CHECK (feedback BETWEEN 1 AND 5),
  metadata JSONB DEFAULT '{}',
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_hermione_sources_hash ON public.hermione_sources(content_hash);
CREATE INDEX IF NOT EXISTS idx_hermione_sources_detected_type ON public.hermione_sources(detected_type);
CREATE INDEX IF NOT EXISTS idx_hermione_sources_tags ON public.hermione_sources USING GIN(tags);
CREATE INDEX IF NOT EXISTS idx_hermione_artifacts_type ON public.hermione_artifacts(artifact_type);
CREATE INDEX IF NOT EXISTS idx_hermione_artifacts_status ON public.hermione_artifacts(status);
CREATE INDEX IF NOT EXISTS idx_hermione_artifacts_tags ON public.hermione_artifacts USING GIN(tags);
CREATE INDEX IF NOT EXISTS idx_hermione_artifact_versions_artifact ON public.hermione_artifact_versions(artifact_id);
CREATE INDEX IF NOT EXISTS idx_hermione_consultations_created_at ON public.hermione_consultations(created_at DESC);

CREATE OR REPLACE FUNCTION public.update_hermione_artifacts_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_hermione_artifacts_updated_at ON public.hermione_artifacts;
CREATE TRIGGER trigger_hermione_artifacts_updated_at
  BEFORE UPDATE ON public.hermione_artifacts
  FOR EACH ROW
  EXECUTE FUNCTION public.update_hermione_artifacts_updated_at();

ALTER TABLE public.hermione_sources ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.hermione_artifacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.hermione_artifact_versions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.hermione_artifact_sources ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.hermione_relationships ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.hermione_consultations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can read hermione_sources"
  ON public.hermione_sources FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated users can manage hermione_sources"
  ON public.hermione_sources FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Authenticated users can read hermione_artifacts"
  ON public.hermione_artifacts FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated users can manage hermione_artifacts"
  ON public.hermione_artifacts FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Authenticated users can read hermione_artifact_versions"
  ON public.hermione_artifact_versions FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated users can manage hermione_artifact_versions"
  ON public.hermione_artifact_versions FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Authenticated users can read hermione_artifact_sources"
  ON public.hermione_artifact_sources FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated users can manage hermione_artifact_sources"
  ON public.hermione_artifact_sources FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Authenticated users can read hermione_relationships"
  ON public.hermione_relationships FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated users can manage hermione_relationships"
  ON public.hermione_relationships FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Authenticated users can read hermione_consultations"
  ON public.hermione_consultations FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated users can manage hermione_consultations"
  ON public.hermione_consultations FOR ALL TO authenticated USING (true) WITH CHECK (true);

COMMENT ON TABLE public.hermione_sources IS 'Arquivos e textos enviados para análise consultiva da Hermione.';
COMMENT ON TABLE public.hermione_artifacts IS 'Artefatos gerados pela Hermione: skills, POPs, prompts, decisões, documentos e pacotes de contexto.';
COMMENT ON TABLE public.hermione_consultations IS 'Logs de consultas do chat consultivo da Hermione.';
