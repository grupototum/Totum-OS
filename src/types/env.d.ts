/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_URL: string;
  readonly VITE_SUPABASE_URL: string;
  readonly VITE_SUPABASE_PUBLISHABLE_KEY: string;
  readonly VITE_OPENCLAW_URL?: string;
  readonly VITE_OPENCLAW_MOCK?: string;
  readonly VITE_KIMI_API_KEY?: string;
  readonly VITE_GROQ_API_KEY?: string;
  readonly VITE_OPENAI_API_KEY?: string;
  readonly VITE_ACTION_PLAN_PASSWORD?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
