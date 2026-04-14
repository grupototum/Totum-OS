/**
 * Documentation Management Library
 * Handles loading, parsing, and indexing of markdown documentation
 */

export interface DocPage {
  id: string;
  title: string;
  slug: string;
  content: string;
  order: number;
  sections: DocSection[];
}

export interface DocSection {
  id: string;
  title: string;
  level: number;
  content: string;
}

export interface DocumentationIndex {
  [key: string]: DocPage;
}

// Import all markdown files
const docModules = {
  'getting-started': () => import('../content/01-getting-started.md?raw'),
  'agents-guide': () => import('../content/02-agents-guide.md?raw'),
  'workflows-guide': () => import('../content/03-workflows-guide.md?raw'),
  'alexandria-guide': () => import('../content/04-alexandria-guide.md?raw'),
  'troubleshooting': () => import('../content/05-troubleshooting.md?raw'),
  'api-reference': () => import('../content/06-api-reference.md?raw'),
};

export const DOCUMENTATION_ORDER = [
  'getting-started',
  'agents-guide',
  'workflows-guide',
  'alexandria-guide',
  'troubleshooting',
  'api-reference',
];

export class DocumentationManager {
  private docs: DocumentationIndex = {};
  private loaded: boolean = false;

  async load(): Promise<void> {
    if (this.loaded) return;

    try {
      // Load all documentation files
      const loadPromises = DOCUMENTATION_ORDER.map(async (slug, index) => {
        const moduleLoader = docModules[slug as keyof typeof docModules];
        if (!moduleLoader) {
          console.warn(`No module found for ${slug}`);
          return;
        }

        const module = await moduleLoader();
        const content = typeof module.default === 'string'
          ? module.default
          : '';

        const title = this.extractTitle(content) || this.slugToTitle(slug);
        const sections = this.extractSections(content);

        this.docs[slug] = {
          id: slug,
          title,
          slug,
          content,
          order: index,
          sections,
        };
      });

      await Promise.all(loadPromises);
      this.loaded = true;
    } catch (error) {
      console.error('Failed to load documentation:', error);
      this.loaded = false;
    }
  }

  getDoc(slug: string): DocPage | null {
    return this.docs[slug] || null;
  }

  getAllDocs(): DocPage[] {
    return DOCUMENTATION_ORDER
      .map(slug => this.docs[slug])
      .filter(Boolean);
  }

  search(query: string): DocPage[] {
    const lowerQuery = query.toLowerCase();
    return this.getAllDocs().filter(doc =>
      doc.title.toLowerCase().includes(lowerQuery) ||
      doc.content.toLowerCase().includes(lowerQuery)
    );
  }

  private extractTitle(content: string): string | null {
    const match = content.match(/^#\s+(.+)$/m);
    return match ? match[1].trim() : null;
  }

  private extractSections(content: string): DocSection[] {
    const sections: DocSection[] = [];
    const headingRegex = /^(#+)\s+(.+)$/gm;
    let match;

    while ((match = headingRegex.exec(content)) !== null) {
      const level = match[1].length;
      const title = match[2].trim();

      sections.push({
        id: this.slugify(title),
        title,
        level,
        content: '',
      });
    }

    return sections;
  }

  private slugToTitle(slug: string): string {
    return slug
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }

  private slugify(text: string): string {
    return text
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-');
  }
}

// Singleton instance
let instance: DocumentationManager | null = null;

export function getDocumentationManager(): DocumentationManager {
  if (!instance) {
    instance = new DocumentationManager();
  }
  return instance;
}
