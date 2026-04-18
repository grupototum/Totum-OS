/**
 * Agent DNA Loader
 * Loads system prompts from markdown DNA files in DNAS_AGENCY_AGENTS/ and DNAS_39_AGENTES/.
 * Uses Vite's import.meta.glob so all .md files are bundled at build time.
 */

// Vite glob — loads all DNA files as raw strings
const AA_DNAS = import.meta.glob('/DNAS_AGENCY_AGENTS/aa-*.md', { query: '?raw', import: 'default', eager: false });
const TOTUM_DNAS = import.meta.glob('/DNAS_39_AGENTES/*.md', { query: '?raw', import: 'default', eager: false });

// Slug → file path map for agency-agents (aa-) files
const AA_SLUG_MAP: Record<string, string> = {
  'seo-specialist':      '/DNAS_AGENCY_AGENTS/aa-marketing-seo-specialist.md',
  'ppc-strategist':      '/DNAS_AGENCY_AGENTS/aa-paid-media-ppc-strategist.md',
  'paid-social':         '/DNAS_AGENCY_AGENTS/aa-paid-media-paid-social-strategist.md',
  'ad-creative':         '/DNAS_AGENCY_AGENTS/aa-paid-media-creative-strategist.md',
  'tracking-specialist': '/DNAS_AGENCY_AGENTS/aa-paid-media-tracking-specialist.md',
  'content-creator':     '/DNAS_AGENCY_AGENTS/aa-marketing-content-creator.md',
  'instagram-curator':   '/DNAS_AGENCY_AGENTS/aa-marketing-instagram-curator.md',
  'tiktok-strategist':   '/DNAS_AGENCY_AGENTS/aa-marketing-tiktok-strategist.md',
  'analytics-reporter':  '/DNAS_AGENCY_AGENTS/aa-support-analytics-reporter.md',
  'outbound-strategist': '/DNAS_AGENCY_AGENTS/aa-sales-outbound-strategist.md',
};

// Name → file path map for Totum's 39 agents (case-insensitive match)
const TOTUM_NAME_MAP: Record<string, string> = {
  'radar':       '/DNAS_39_AGENTES/ARCHIMEDES.md',  // placeholder — update as needed
  'pablo':       '/DNAS_39_AGENTES/PABLO.md',
  'scrivo':      '/DNAS_39_AGENTES/SCRIVO.md',
  'auditor':     '/DNAS_39_AGENTES/AUDITOR.md',
  'visu':        '/DNAS_39_AGENTES/VISU.md',
  'einstein':    '/DNAS_39_AGENTES/EINSTEIN.md',
  'sherlock':    '/DNAS_39_AGENTES/SHERLOCK.md',
  'guardian':    '/DNAS_39_AGENTES/GUARDIAN.md',
  'minerva':     '/DNAS_39_AGENTES/MINERVA.md',
  'mentor':      '/DNAS_39_AGENTES/MENTOR.md',
  'loki':        '/DNAS_39_AGENTES/LOKI.md',
};

/** Strips YAML frontmatter (--- ... ---) from markdown content */
function stripFrontmatter(raw: string): string {
  return raw.replace(/^---[\s\S]*?---\n?/, '').trim();
}

/**
 * Loads the DNA (system prompt) for an agent by slug or name.
 * Returns null if no DNA file is registered for this agent.
 */
export async function loadAgentDna(agentSlug?: string | null, agentName?: string | null): Promise<string | null> {
  // 1. Try by slug (agency-agents)
  if (agentSlug) {
    const path = AA_SLUG_MAP[agentSlug];
    if (path && AA_DNAS[path]) {
      try {
        const raw = await AA_DNAS[path]() as string;
        return stripFrontmatter(raw);
      } catch { /* fall through */ }
    }
  }

  // 2. Try by name (Totum 39)
  if (agentName) {
    const key = agentName.toLowerCase();
    const path = TOTUM_NAME_MAP[key];
    if (path && TOTUM_DNAS[path]) {
      try {
        const raw = await TOTUM_DNAS[path]() as string;
        return stripFrontmatter(raw);
      } catch { /* fall through */ }
    }
  }

  return null;
}

/** Returns true if a DNA file exists for this agent */
export function hasAgentDna(slug?: string | null, name?: string | null): boolean {
  if (slug && slug in AA_SLUG_MAP) return true;
  if (name && name.toLowerCase() in TOTUM_NAME_MAP) return true;
  return false;
}
