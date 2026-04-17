/**
 * MarkdownRenderer — lightweight inline markdown renderer
 * Handles: **bold**, *italic*, `code`, ```blocks```, # headers, - lists, 1. lists, links
 * No external dependencies.
 */
import { cn } from "@/lib/utils";

interface Props {
  content: string;
  className?: string;
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function parseInline(text: string): string {
  return text
    // **bold**
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    // *italic* or _italic_
    .replace(/(?<!\*)\*(?!\*)(.+?)(?<!\*)\*(?!\*)/g, "<em>$1</em>")
    .replace(/\b_(.+?)_\b/g, "<em>$1</em>")
    // `inline code`
    .replace(/`([^`]+)`/g, '<code class="bg-muted px-1 py-0.5 rounded text-xs font-mono">$1</code>')
    // [label](url)
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer" class="text-primary underline underline-offset-2 hover:opacity-80">$1</a>');
}

function parseMarkdown(raw: string): string {
  const lines = raw.split("\n");
  const output: string[] = [];
  let inCodeBlock = false;
  let inUl = false;
  let inOl = false;
  let codeBuffer: string[] = [];

  const closeList = () => {
    if (inUl) { output.push("</ul>"); inUl = false; }
    if (inOl) { output.push("</ol>"); inOl = false; }
  };

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // Code block toggle
    if (line.trimStart().startsWith("```")) {
      if (inCodeBlock) {
        output.push(
          `<pre class="bg-muted rounded-lg p-3 my-2 overflow-x-auto text-xs font-mono border border-border"><code>${escapeHtml(codeBuffer.join("\n"))}</code></pre>`
        );
        codeBuffer = [];
        inCodeBlock = false;
      } else {
        closeList();
        inCodeBlock = true;
      }
      continue;
    }

    if (inCodeBlock) {
      codeBuffer.push(line);
      continue;
    }

    // Headers
    const h3 = line.match(/^###\s+(.+)/);
    const h2 = line.match(/^##\s+(.+)/);
    const h1 = line.match(/^#\s+(.+)/);
    if (h1) { closeList(); output.push(`<h1 class="text-lg font-semibold mt-4 mb-1">${parseInline(h1[1])}</h1>`); continue; }
    if (h2) { closeList(); output.push(`<h2 class="text-base font-semibold mt-3 mb-1">${parseInline(h2[1])}</h2>`); continue; }
    if (h3) { closeList(); output.push(`<h3 class="text-sm font-semibold mt-2 mb-1">${parseInline(h3[1])}</h3>`); continue; }

    // Unordered list
    const ulMatch = line.match(/^[-*+]\s+(.+)/);
    if (ulMatch) {
      if (inOl) { output.push("</ol>"); inOl = false; }
      if (!inUl) { output.push('<ul class="list-disc list-inside space-y-0.5 my-1 pl-2">'); inUl = true; }
      output.push(`<li>${parseInline(ulMatch[1])}</li>`);
      continue;
    }

    // Ordered list
    const olMatch = line.match(/^\d+\.\s+(.+)/);
    if (olMatch) {
      if (inUl) { output.push("</ul>"); inUl = false; }
      if (!inOl) { output.push('<ol class="list-decimal list-inside space-y-0.5 my-1 pl-2">'); inOl = true; }
      output.push(`<li>${parseInline(olMatch[1])}</li>`);
      continue;
    }

    // Horizontal rule
    if (line.match(/^---+$/) || line.match(/^\*\*\*+$/)) {
      closeList();
      output.push('<hr class="border-border my-3" />');
      continue;
    }

    // Blank line
    if (line.trim() === "") {
      closeList();
      output.push('<div class="h-2" />');
      continue;
    }

    // Paragraph
    closeList();
    output.push(`<p class="leading-relaxed">${parseInline(line)}</p>`);
  }

  closeList();
  if (inCodeBlock && codeBuffer.length) {
    output.push(`<pre class="bg-muted rounded-lg p-3 my-2 overflow-x-auto text-xs font-mono border border-border"><code>${escapeHtml(codeBuffer.join("\n"))}</code></pre>`);
  }

  return output.join("\n");
}

export function MarkdownRenderer({ content, className }: Props) {
  const html = parseMarkdown(content);
  return (
    <div
      className={cn("text-sm prose-tight", className)}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
