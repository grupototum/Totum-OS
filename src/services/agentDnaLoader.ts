/**
 * Agent DNA Loader
 * Loads system prompts from markdown DNA files in DNAS_AGENCY_AGENTS/ and DNAS_39_AGENTES/.
 * Uses Vite's import.meta.glob so all .md files are bundled at build time.
 */

// All files under each directory (broader than aa-* to include custom Totum agents)
const AGENCY_DNAS = import.meta.glob('/DNAS_AGENCY_AGENTS/*.md', { query: '?raw', import: 'default', eager: false });
const TOTUM_DNAS  = import.meta.glob('/DNAS_39_AGENTES/*.md',    { query: '?raw', import: 'default', eager: false });

// ── Slug maps ────────────────────────────────────────────────────────────────

// agency-agents MIT originals (aa-* prefix)
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

// Totum custom agents (DNAS_AGENCY_AGENTS, no aa- prefix)
const TOTUM_AGENCY_SLUG_MAP: Record<string, string> = {
  'radar-seo':           '/DNAS_AGENCY_AGENTS/RADAR-SEO.md',
  'radar-growth':        '/DNAS_AGENCY_AGENTS/RADAR-GROWTH.md',
  'radar-aeo':           '/DNAS_AGENCY_AGENTS/RADAR-AEO.md',
  'fignaldo':            '/DNAS_AGENCY_AGENTS/FIGNALDO.md',
  'atlas':               '/DNAS_AGENCY_AGENTS/ATLAS.md',
  'auditor-paid':        '/DNAS_AGENCY_AGENTS/AUDITOR-PAID.md',
  'brand-guardian':      '/DNAS_AGENCY_AGENTS/BRAND-GUARDIAN.md',
  'chaplin':             '/DNAS_AGENCY_AGENTS/CHAPLIN.md',
  'community-builder':   '/DNAS_AGENCY_AGENTS/COMMUNITY-BUILDER.md',
  'content-strategist':  '/DNAS_AGENCY_AGENTS/CONTENT-STRATEGIST.md',
  'email-specialist':    '/DNAS_AGENCY_AGENTS/EMAIL-SPECIALIST.md',
  'experiment-tracker':  '/DNAS_AGENCY_AGENTS/EXPERIMENT-TRACKER.md',
  'linkedin-creator':    '/DNAS_AGENCY_AGENTS/LINKEDIN-CREATOR.md',
  'product-manager':     '/DNAS_AGENCY_AGENTS/PRODUCT-MANAGER.md',
  'solutions-consultant':'/DNAS_AGENCY_AGENTS/SOLUTIONS-CONSULTANT.md',
  'tot-social':          '/DNAS_AGENCY_AGENTS/TOT-SOCIAL.md',
  'visu-ads':            '/DNAS_AGENCY_AGENTS/VISU-ADS.md',
  'aso-specialist':      '/DNAS_AGENCY_AGENTS/ASO-SPECIALIST.md',
};

// ElizaOS Tier 1/2/3 agents (DNAS_39_AGENTES) — keyed by slug = lowercase name
const TOTUM_SLUG_MAP: Record<string, string> = {
  // Tier 1
  'loki':              '/DNAS_39_AGENTES/LOKI.md',
  'minerva':           '/DNAS_39_AGENTES/MINERVA.md',
  'archimedes':        '/DNAS_39_AGENTES/ARCHIMEDES.md',
  'sherlock':          '/DNAS_39_AGENTES/SHERLOCK.md',
  'einstein':          '/DNAS_39_AGENTES/EINSTEIN.md',
  // Tier 2
  'wanda':             '/DNAS_39_AGENTES/WANDA.md',
  'kvirtualoso':       '/DNAS_39_AGENTES/KVIRTUALOSO.md',
  'scrivo':            '/DNAS_39_AGENTES/SCRIVO.md',
  'visu':              '/DNAS_39_AGENTES/VISU.md',
  'auditor':           '/DNAS_39_AGENTES/AUDITOR.md',
  'pablo':             '/DNAS_39_AGENTES/PABLO.md',
  'analyst':           '/DNAS_39_AGENTES/ANALYST.md',
  'mentor':            '/DNAS_39_AGENTES/MENTOR.md',
  'guardian':          '/DNAS_39_AGENTES/GUARDIAN.md',
  'translator':        '/DNAS_39_AGENTES/TRANSLATOR.md',
  // Tier 3
  'scraper-web':       '/DNAS_39_AGENTES/SCRAPER-WEB.md',
  'processor-csv':     '/DNAS_39_AGENTES/PROCESSOR-CSV.md',
  'monitor-news':      '/DNAS_39_AGENTES/MONITOR-NEWS.md',
  'scheduler':         '/DNAS_39_AGENTES/SCHEDULER.md',
  'validator':         '/DNAS_39_AGENTES/VALIDATOR.md',
  'cleaner':           '/DNAS_39_AGENTES/CLEANER.md',
  'tagger':            '/DNAS_39_AGENTES/TAGGER.md',
  'formatter':         '/DNAS_39_AGENTES/FORMATTER.md',
  'logger':            '/DNAS_39_AGENTES/LOGGER.md',
  'retry-handler':     '/DNAS_39_AGENTES/RETRY-HANDLER.md',
  'extractor-pdf':     '/DNAS_39_AGENTES/EXTRACTOR-PDF.md',
  'summarizer':        '/DNAS_39_AGENTES/SUMMARIZER.md',
  'classifier':        '/DNAS_39_AGENTES/CLASSIFIER.md',
  'entity-extractor':  '/DNAS_39_AGENTES/ENTITY-EXTRACTOR.md',
  'dedupe':            '/DNAS_39_AGENTES/DEDUPE.md',
  'enricher':          '/DNAS_39_AGENTES/ENRICHER.md',
  'notifier-email':    '/DNAS_39_AGENTES/NOTIFIER-EMAIL.md',
  'notifier-slack':    '/DNAS_39_AGENTES/NOTIFIER-SLACK.md',
  'backup-manager':    '/DNAS_39_AGENTES/BACKUP-MANAGER.md',
  'quality-checker':   '/DNAS_39_AGENTES/QUALITY-CHECKER.md',
  'transformer':       '/DNAS_39_AGENTES/TRANSFORMER.md',
  'analyzer-metrics':  '/DNAS_39_AGENTES/ANALYZER-METRICS.md',
  'router':            '/DNAS_39_AGENTES/ROUTER.md',
  'queue-manager':     '/DNAS_39_AGENTES/QUEUE-MANAGER.md',
};

/** Strips YAML frontmatter (--- ... ---) from markdown content */
function stripFrontmatter(raw: string): string {
  return raw.replace(/^---[\s\S]*?---\n?/, '').trim();
}

async function tryLoad(
  map: Record<string, string>,
  dnas: Record<string, () => Promise<unknown>>,
  key: string,
): Promise<string | null> {
  const path = map[key];
  if (!path || !dnas[path]) return null;
  try {
    const raw = await dnas[path]() as string;
    return stripFrontmatter(raw);
  } catch {
    return null;
  }
}

/**
 * Loads the DNA (system prompt) for an agent by slug or name.
 * Lookup order: aa-* agency-agents → Totum custom (agency dir) → Tier 1/2/3 (totum dir) → name fallback
 * Returns null if no DNA file is registered for this agent.
 */
export async function loadAgentDna(agentSlug?: string | null, agentName?: string | null): Promise<string | null> {
  const slug = agentSlug?.toLowerCase() ?? null;
  const name = agentName?.toLowerCase() ?? null;

  // 1. agency-agents MIT (aa-* files)
  if (slug) {
    const result = await tryLoad(AA_SLUG_MAP, AGENCY_DNAS, slug);
    if (result) return result;
  }

  // 2. Totum custom agents (DNAS_AGENCY_AGENTS, no prefix)
  if (slug) {
    const result = await tryLoad(TOTUM_AGENCY_SLUG_MAP, AGENCY_DNAS, slug);
    if (result) return result;
  }

  // 3. ElizaOS Tier 1/2/3 by slug
  if (slug) {
    const result = await tryLoad(TOTUM_SLUG_MAP, TOTUM_DNAS, slug);
    if (result) return result;
  }

  // 4. Fallback: Tier 1/2/3 by name (for agents where slug differs from map key)
  if (name) {
    const result = await tryLoad(TOTUM_SLUG_MAP, TOTUM_DNAS, name);
    if (result) return result;
  }

  return null;
}

/** Returns true if a DNA file exists for this agent */
export function hasAgentDna(slug?: string | null, name?: string | null): boolean {
  const s = slug?.toLowerCase();
  const n = name?.toLowerCase();
  if (s) {
    if (s in AA_SLUG_MAP) return true;
    if (s in TOTUM_AGENCY_SLUG_MAP) return true;
    if (s in TOTUM_SLUG_MAP) return true;
  }
  if (n && n in TOTUM_SLUG_MAP) return true;
  return false;
}
