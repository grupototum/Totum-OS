
-- Content pipeline table
CREATE TABLE public.content_pipeline (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  stage TEXT NOT NULL DEFAULT 'ideas',
  approval_status TEXT NOT NULL DEFAULT 'pending',
  assignee TEXT,
  image_url TEXT,
  sort_order INTEGER NOT NULL DEFAULT 0,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.content_pipeline ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own content" ON public.content_pipeline
  FOR SELECT TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own content" ON public.content_pipeline
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own content" ON public.content_pipeline
  FOR UPDATE TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own content" ON public.content_pipeline
  FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- Storage bucket for thumbnails
INSERT INTO storage.buckets (id, name, public) VALUES ('content-thumbnails', 'content-thumbnails', true);

CREATE POLICY "Authenticated users can upload thumbnails" ON storage.objects
  FOR INSERT TO authenticated WITH CHECK (bucket_id = 'content-thumbnails');

CREATE POLICY "Anyone can view thumbnails" ON storage.objects
  FOR SELECT USING (bucket_id = 'content-thumbnails');

CREATE POLICY "Users can delete own thumbnails" ON storage.objects
  FOR DELETE TO authenticated USING (bucket_id = 'content-thumbnails');
