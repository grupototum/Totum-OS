/** Compute a simple SHA-256 hex digest of a string (Web Crypto API). */
export async function sha256(text: string): Promise<string> {
  const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(text));
  return Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, '0')).join('');
}

export interface LogseqFrontmatter {
  title: string;
  createdAt?: string;
  updatedAt?: string;
  tags?: string[];
  extra: Record<string, string>;
}

/** Parse Logseq page frontmatter.
 *  Supports both #+KEY: VALUE (org-mode) and YAML --- blocks.
 */
export function parseLogseqFrontmatter(raw: string, fallbackTitle: string): LogseqFrontmatter {
  const result: LogseqFrontmatter = { title: fallbackTitle, extra: {} };

  // Org-mode style: lines starting with #+
  const orgLines = raw.split('\n').filter(l => l.startsWith('#+')).slice(0, 20);
  for (const line of orgLines) {
    const m = line.match(/^#\+(\S+?):\s*(.+)$/);
    if (!m) continue;
    const [, key, val] = m;
    switch (key.toLowerCase()) {
      case 'title':       result.title = val.trim(); break;
      case 'date':
      case 'created-at':  result.createdAt = val.trim(); break;
      case 'updated-at':  result.updatedAt = val.trim(); break;
      case 'tags':        result.tags = val.split(',').map(t => t.trim()); break;
      default:            result.extra[key.toLowerCase()] = val.trim();
    }
  }
  if (result.title !== fallbackTitle) return result;

  // YAML frontmatter: between --- delimiters
  const yamlMatch = raw.match(/^---\n([\s\S]*?)\n---/);
  if (yamlMatch) {
    for (const line of yamlMatch[1].split('\n')) {
      const m = line.match(/^(\S+?):\s*(.+)$/);
      if (!m) continue;
      const [, key, val] = m;
      switch (key.toLowerCase()) {
        case 'title':       result.title = val.replace(/^["']|["']$/g, '').trim(); break;
        case 'created-at':
        case 'date':        result.createdAt = val.trim(); break;
        case 'updated-at':  result.updatedAt = val.trim(); break;
        case 'tags':        result.tags = val.split(',').map(t => t.trim()); break;
        default:            result.extra[key.toLowerCase()] = val.trim();
      }
    }
  }

  return result;
}

/** Strip frontmatter and return clean content. */
export function stripFrontmatter(raw: string): string {
  // Remove YAML block
  let content = raw.replace(/^---\n[\s\S]*?\n---\n?/, '');
  // Remove org-mode lines
  content = content.replace(/^#\+\S+:.*\n/gm, '');
  return content.trim();
}

/** Infer Alexandria doc_type from path or tags. */
export function inferDocType(path: string, tags: string[] = []): 'skill' | 'pop' | 'doc' | 'context' | 'template' {
  const lower = path.toLowerCase();
  if (lower.includes('/skill') || tags.includes('skill')) return 'skill';
  if (lower.includes('/pop') || lower.includes('/procedimento') || tags.includes('pop')) return 'pop';
  if (lower.includes('/template') || tags.includes('template')) return 'template';
  if (lower.includes('/context') || lower.includes('/cliente') || tags.includes('context')) return 'context';
  return 'doc';
}
