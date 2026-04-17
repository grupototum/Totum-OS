/**
 * MermaidDiagram — renderiza código Mermaid num SVG interativo
 */
import { useEffect, useRef, useState } from 'react';
import mermaid from 'mermaid';
import { Loader2, ZoomIn, ZoomOut, Maximize2, Copy, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

mermaid.initialize({
  startOnLoad: false,
  theme: 'dark',
  themeVariables: {
    primaryColor: '#7c3aed',
    primaryTextColor: '#f0f0f0',
    primaryBorderColor: '#5b21b6',
    lineColor: '#6b7280',
    secondaryColor: '#1f2937',
    tertiaryColor: '#111827',
    background: '#0f172a',
    mainBkg: '#1e1b4b',
    nodeBorder: '#4c1d95',
    clusterBkg: '#1e1b4b',
    titleColor: '#e2e8f0',
    edgeLabelBackground: '#1e1b4b',
    fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace',
  },
  flowchart: { curve: 'basis', padding: 20 },
  securityLevel: 'loose',
});

interface MermaidDiagramProps {
  code: string;
  repo?: string;
}

export default function MermaidDiagram({ code, repo }: MermaidDiagramProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [svgContent, setSvgContent] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [rendering, setRendering] = useState(true);
  const [scale, setScale] = useState(1);

  useEffect(() => {
    if (!code) return;
    setRendering(true);
    setError(null);

    const id = `mermaid-${Date.now()}`;

    mermaid
      .render(id, code)
      .then(({ svg }) => {
        // Remove dimensões fixas para tornar responsivo
        const responsive = svg
          .replace(/width="[^"]*"/, 'width="100%"')
          .replace(/height="[^"]*"/, 'height="100%"');
        setSvgContent(responsive);
        setRendering(false);
      })
      .catch(err => {
        setError('Não foi possível renderizar o diagrama: ' + err.message);
        setRendering(false);
      });
  }, [code]);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    toast.success('Código Mermaid copiado!');
  };

  const handleDownload = () => {
    if (!svgContent) return;
    const blob = new Blob([svgContent], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${(repo || 'diagram').replace('/', '-')}-architecture.svg`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success('SVG baixado!');
  };

  const openFullscreen = () => {
    if (!containerRef.current) return;
    if (document.fullscreenElement) {
      document.exitFullscreen();
    } else {
      containerRef.current.requestFullscreen();
    }
  };

  if (rendering) {
    return (
      <div className="flex items-center justify-center h-64 gap-3 text-muted-foreground">
        <Loader2 className="w-5 h-5 animate-spin text-purple-400" />
        <span className="text-sm">Renderizando diagrama…</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-xl border border-destructive/30 bg-destructive/5 p-4">
        <p className="text-sm text-destructive font-medium mb-2">Erro na renderização</p>
        <p className="text-xs text-muted-foreground mb-3">{error}</p>
        <p className="text-xs text-muted-foreground">Código Mermaid gerado (pode conter erros de sintaxe):</p>
        <pre className="mt-2 text-xs font-mono bg-muted/50 p-3 rounded-lg overflow-auto max-h-48 whitespace-pre-wrap">
          {code}
        </pre>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {/* Toolbar */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1">
          <Button size="icon" variant="ghost" className="h-7 w-7" onClick={() => setScale(s => Math.max(0.4, s - 0.15))}>
            <ZoomOut className="w-3.5 h-3.5" />
          </Button>
          <span className="text-xs text-muted-foreground w-10 text-center">{Math.round(scale * 100)}%</span>
          <Button size="icon" variant="ghost" className="h-7 w-7" onClick={() => setScale(s => Math.min(2.5, s + 0.15))}>
            <ZoomIn className="w-3.5 h-3.5" />
          </Button>
          <Button size="icon" variant="ghost" className="h-7 w-7" onClick={() => setScale(1)}>
            <span className="text-[10px] font-mono">1:1</span>
          </Button>
        </div>
        <div className="flex items-center gap-1">
          <Button size="sm" variant="ghost" className="h-7 text-xs gap-1.5" onClick={handleCopy}>
            <Copy className="w-3.5 h-3.5" />
            Mermaid
          </Button>
          <Button size="sm" variant="ghost" className="h-7 text-xs gap-1.5" onClick={handleDownload}>
            <Download className="w-3.5 h-3.5" />
            SVG
          </Button>
          <Button size="icon" variant="ghost" className="h-7 w-7" onClick={openFullscreen}>
            <Maximize2 className="w-3.5 h-3.5" />
          </Button>
        </div>
      </div>

      {/* Diagram container */}
      <div
        ref={containerRef}
        className="relative rounded-xl border border-purple-500/20 bg-[#0f0f1a] overflow-auto"
        style={{ minHeight: '400px', maxHeight: '640px' }}
      >
        <div
          className="p-6 transition-transform duration-200 origin-top-left"
          style={{ transform: `scale(${scale})`, transformOrigin: 'center top' }}
          dangerouslySetInnerHTML={{ __html: svgContent }}
        />
      </div>
    </div>
  );
}
