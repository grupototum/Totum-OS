import { parseLogseqFrontmatter, stripFrontmatter, inferDocType, sha256 } from './sync-utils';

export interface LogseqPage {
  fileName: string;       // e.g. "POP-001.md"
  title: string;
  content: string;
  rawContent: string;
  docType: 'skill' | 'pop' | 'doc' | 'context' | 'template';
  tags: string[];
  hash: string;
  sourcePath: string;     // relative path inside graph
  lastModified: number;
}

/** Open a directory picker and return a FileSystemDirectoryHandle. */
export async function pickLogseqGraph(): Promise<FileSystemDirectoryHandle> {
  if (!('showDirectoryPicker' in window)) {
    throw new Error('File System Access API não suportada neste browser. Use Chrome ou Edge.');
  }
  return (window as any).showDirectoryPicker({ mode: 'read' });
}

/** List all .md files in a directory handle (recursive). */
async function collectMdFiles(
  dir: FileSystemDirectoryHandle,
  prefix = ''
): Promise<{ handle: FileSystemFileHandle; path: string }[]> {
  const results: { handle: FileSystemFileHandle; path: string }[] = [];
  for await (const [name, entry] of (dir as any).entries()) {
    if (entry.kind === 'directory' && !name.startsWith('.')) {
      const sub = await dir.getDirectoryHandle(name);
      results.push(...await collectMdFiles(sub, `${prefix}${name}/`));
    } else if (entry.kind === 'file' && name.endsWith('.md')) {
      results.push({ handle: entry as FileSystemFileHandle, path: `${prefix}${name}` });
    }
  }
  return results;
}

/** Read all pages from a Logseq graph directory handle. */
export async function readLogseqPages(
  dir: FileSystemDirectoryHandle,
  graphName: string
): Promise<LogseqPage[]> {
  // Try to enter /pages sub-directory if it exists, else use root
  let pagesDir: FileSystemDirectoryHandle;
  try {
    pagesDir = await dir.getDirectoryHandle('pages');
  } catch {
    pagesDir = dir;
  }

  const files = await collectMdFiles(pagesDir);
  const pages: LogseqPage[] = [];

  for (const { handle, path } of files) {
    const file = await handle.getFile();
    const rawContent = await file.text();
    const fallbackTitle = path.replace(/\.md$/, '').replace(/\//g, ' / ');
    const meta = parseLogseqFrontmatter(rawContent, fallbackTitle);
    const content = stripFrontmatter(rawContent);
    if (!content.trim()) continue; // skip empty pages

    const hash = await sha256(rawContent);
    pages.push({
      fileName: handle.name,
      title: meta.title,
      content,
      rawContent,
      docType: inferDocType(path, meta.tags || []),
      tags: meta.tags || [],
      hash,
      sourcePath: `logseq:${graphName}/${path}`,
      lastModified: file.lastModified,
    });
  }

  return pages;
}
