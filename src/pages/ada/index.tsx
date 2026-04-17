import { useState, useEffect } from 'react';
import AppLayout from '@/components/layout/AppLayout';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import {
  Code2,
  GitBranch,
  Zap,
  Cpu,
  FileCode,
  Network,
  Loader2,
  Sparkles,
  History,
  BookOpen,
  ChevronRight,
  CheckCircle2,
  AlertCircle,
  BarChart3,
} from 'lucide-react';
import { toast } from 'sonner';
import MermaidDiagram from '@/components/ada/MermaidDiagram';
import { generateRepoDiagram, type DiagramResult, type DiagramProgress } from '@/services/adaDiagram';

// ─── Types ────────────────────────────────────────────────────────────────────

interface ParsedFunction {
  id: string;
  name: string;
  file: string;
  type: string;
  line: number;
  return_type: string;
  docstring: string;
  calls: string[];
}

interface Intent {
  id: string;
  name: string;
  handler_fn_id: string;
  type: string;
}

interface ParsedRepo {
  schema_version: string;
  repo: string;
  branch: string;
  functions: ParsedFunction[];
  intents: Intent[];
  file_count: number;
  parsed_at: string;
}

// ─── How it works steps ───────────────────────────────────────────────────────

const HOW_IT_WORKS = [
  {
    icon: GitBranch,
    title: 'Você informa o repositório',
    desc: 'Cole o caminho owner/repo de qualquer projeto público no GitHub.',
  },
  {
    icon: Cpu,
    title: 'Codeflow analisa o código',
    desc: 'Um parser server-side percorre todos os arquivos e extrai funções, tipos de retorno, docstrings e o grafo de chamadas entre funções.',
  },
  {
    icon: FileCode,
    title: 'Mapa compacto é gerado',
    desc: 'Em vez de enviar o código bruto para uma IA, a ADA gera um JSON estruturado com apenas assinaturas e metadados — até 87% menor.',
  },
  {
    icon: BarChart3,
    title: 'Diagrama de arquitetura',
    desc: 'O Gemini analisa a árvore de arquivos em 2 passos e gera um diagrama Mermaid interativo da arquitetura do projeto.',
  },
];

// ─── Diagram progress steps ───────────────────────────────────────────────────

const DIAGRAM_STEPS = [
  { step: 1, label: 'Buscando árvore de arquivos no GitHub…' },
  { step: 2, label: 'Analisando arquitetura com Gemini…' },
  { step: 3, label: 'Gerando diagrama Mermaid…' },
];

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function AdaPage() {
  const [repoUrl, setRepoUrl]         = useState('');
  const [loading, setLoading]         = useState(false);
  const [result, setResult]           = useState<ParsedRepo | null>(null);
  const [error, setError]             = useState<string | null>(null);
  const [history, setHistory]         = useState<string[]>([]);
  const [showHow, setShowHow]         = useState(false);
  const [activeTab, setActiveTab]     = useState('overview');

  // Codeflow health check
  const [codeflowOnline, setCodeflowOnline] = useState<boolean | null>(null);

  useEffect(() => {
    fetch('/api/ada/health')
      .then(r => r.json())
      .then(d => setCodeflowOnline(d.online))
      .catch(() => setCodeflowOnline(false));
  }, []);

  // Diagram state
  const [diagramLoading, setDiagramLoading] = useState(false);
  const [diagramStep, setDiagramStep]       = useState<DiagramProgress | null>(null);
  const [diagram, setDiagram]               = useState<DiagramResult | null>(null);
  const [diagramError, setDiagramError]     = useState<string | null>(null);

  // ── Codeflow parse ──────────────────────────────────────────────────────────
  const parseRepo = async () => {
    if (!repoUrl.trim()) {
      toast.error('Digite o repositório para analisar');
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);
    toast.info('ADA está analisando o código…');

    try {
      const response = await fetch('/api/ada/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ repo: repoUrl.trim() }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || `Erro ${response.status}`);

      setResult(data);
      const clean = repoUrl.replace(/https?:\/\/github\.com\//i, '').replace(/\.git$/, '').trim();
      setHistory(prev => [clean, ...prev.filter(h => h !== clean)].slice(0, 5));
      toast.success(`ADA encontrou ${data.functions?.length ?? 0} funções em ${data.file_count ?? 0} arquivos`);
    } catch (err) {
      const msg = (err as Error).message;
      setError(msg);
      toast.error('ADA encontrou um problema: ' + msg);
    } finally {
      setLoading(false);
    }
  };

  // ── Diagram generate ────────────────────────────────────────────────────────
  const generateDiagram = async () => {
    const repo = repoUrl.trim() || result?.repo;
    if (!repo) {
      toast.error('Digite o repositório primeiro');
      return;
    }

    setDiagramLoading(true);
    setDiagramError(null);
    setDiagram(null);
    setActiveTab('diagram');

    try {
      const clean = repo.replace(/https?:\/\/github\.com\//i, '').replace(/\.git$/, '').trim();
      const res = await generateRepoDiagram(clean, (p) => setDiagramStep(p));
      setDiagram(res);
      toast.success('Diagrama gerado com sucesso!');
    } catch (err) {
      const msg = (err as Error).message;
      setDiagramError(msg);
      toast.error('Erro ao gerar diagrama: ' + msg);
    } finally {
      setDiagramLoading(false);
      setDiagramStep(null);
    }
  };

  const loadExample = (repo: string) => {
    setRepoUrl(repo);
    setError(null);
  };

  const cleanRepo = repoUrl.replace(/https?:\/\/github\.com\//i, '').replace(/\.git$/, '').trim();

  return (
    <AppLayout>
      <div className="container mx-auto p-6 max-w-5xl">

        {/* ── Header ────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center gap-4 mb-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shadow-lg shadow-purple-500/20">
              <Cpu className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent tracking-tight">
                ADA
              </h1>
              <p className="text-xs text-muted-foreground uppercase tracking-widest">
                Ana De Arquitetura · Code Intelligence
              </p>
            </div>
            <div className="ml-auto flex gap-2 items-center">
              <Badge className="bg-purple-500/10 text-purple-400 border-purple-500/20 text-xs">
                até 87% menos tokens
              </Badge>
              {/* Codeflow status */}
              <Badge className={`text-xs border ${
                codeflowOnline === null
                  ? 'bg-zinc-500/10 text-zinc-400 border-zinc-500/20'
                  : codeflowOnline
                  ? 'bg-green-500/10 text-green-400 border-green-500/20'
                  : 'bg-red-500/10 text-red-400 border-red-500/20'
              }`}>
                <span className={`w-1.5 h-1.5 rounded-full mr-1.5 inline-block ${
                  codeflowOnline === null ? 'bg-zinc-400 animate-pulse' :
                  codeflowOnline ? 'bg-green-400 animate-pulse' : 'bg-red-400'
                }`} />
                Codeflow {codeflowOnline === null ? '…' : codeflowOnline ? 'online' : 'offline'}
              </Badge>
            </div>
          </div>

          <p className="text-sm text-muted-foreground max-w-2xl leading-relaxed">
            Em homenagem a <strong className="text-foreground">Ada Lovelace</strong>, a primeira programadora do mundo.
            Analisa repositórios GitHub, mapeia funções e gera{' '}
            <strong className="text-foreground">diagramas de arquitetura interativos</strong> com IA —
            contexto pronto para qualquer agente da Trindade.
          </p>

          <button
            className="mt-3 flex items-center gap-1.5 text-xs text-purple-400 hover:text-purple-300 transition-colors"
            onClick={() => setShowHow(v => !v)}
          >
            <BookOpen className="w-3.5 h-3.5" />
            {showHow ? 'Ocultar' : 'Como funciona?'}
            <ChevronRight className={`w-3.5 h-3.5 transition-transform ${showHow ? 'rotate-90' : ''}`} />
          </button>
        </motion.div>

        {/* ── How it works ──────────────────────────────── */}
        <AnimatePresence>
          {showHow && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden mb-6"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                {HOW_IT_WORKS.map((step, i) => (
                  <div
                    key={i}
                    className="rounded-xl border border-border/50 bg-card/50 p-4 flex flex-col gap-2"
                  >
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-lg bg-purple-500/10 flex items-center justify-center">
                        <step.icon className="w-4 h-4 text-purple-400" />
                      </div>
                      <span className="text-[10px] font-mono uppercase tracking-widest text-purple-400">
                        {String(i + 1).padStart(2, '0')}
                      </span>
                    </div>
                    <p className="text-xs font-medium text-foreground">{step.title}</p>
                    <p className="text-xs text-muted-foreground leading-relaxed">{step.desc}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── Input Section ─────────────────────────────── */}
        <Card className="mb-6 border-border/50">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base">
              <GitBranch className="w-4 h-4 text-purple-400" />
              Repositório para Análise
            </CardTitle>
            <CardDescription className="text-xs">
              Cole a URL completa do GitHub ou apenas{' '}
              <code className="bg-muted px-1 rounded">owner/repo</code>
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex gap-2">
              <Input
                placeholder="owner/repo  ou  https://github.com/owner/repo"
                value={repoUrl}
                onChange={e => setRepoUrl(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && parseRepo()}
                className="flex-1 font-mono text-sm"
              />
              <Button
                onClick={parseRepo}
                disabled={loading || diagramLoading || codeflowOnline === false}
                title={codeflowOnline === false ? 'Codeflow offline — use o Diagrama IA (funciona sem VPS)' : undefined}
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 shrink-0 disabled:opacity-40"
              >
                {loading ? (
                  <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Analisando…</>
                ) : (
                  <><Sparkles className="w-4 h-4 mr-2" />Analisar</>
                )}
              </Button>
              <Button
                onClick={generateDiagram}
                disabled={loading || diagramLoading}
                variant="outline"
                className="border-purple-500/30 hover:border-purple-500/60 hover:bg-purple-500/10 text-purple-400 shrink-0"
              >
                {diagramLoading ? (
                  <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Gerando…</>
                ) : (
                  <><BarChart3 className="w-4 h-4 mr-2" />Diagrama</>
                )}
              </Button>
            </div>

            {/* Codeflow offline banner */}
            {codeflowOnline === false && (
              <div className="flex items-start gap-2 rounded-lg border border-amber-500/20 bg-amber-500/5 p-3">
                <AlertCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <div className="text-xs text-amber-300">
                  <strong>Codeflow offline</strong> — o serviço de análise de funções (VPS) não está acessível.
                  O <strong>Diagrama IA</strong> funciona normalmente sem ele — usa GitHub API + Gemini diretamente.
                </div>
              </div>
            )}

            {/* Exemplos */}
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs text-muted-foreground">Exemplos:</span>
              {['grupototum/upixelcrm', 'facebook/react', 'tiangolo/fastapi'].map(repo => (
                <Badge
                  key={repo}
                  variant="outline"
                  className="cursor-pointer hover:bg-purple-500/10 hover:border-purple-500/40 text-xs font-mono transition-colors"
                  onClick={() => loadExample(repo)}
                >
                  {repo}
                </Badge>
              ))}
            </div>

            {/* Recentes */}
            {history.length > 0 && (
              <div className="flex items-center gap-2 flex-wrap">
                <History className="w-3.5 h-3.5 text-muted-foreground" />
                <span className="text-xs text-muted-foreground">Recentes:</span>
                {history.map((h, i) => (
                  <Badge
                    key={i}
                    variant="secondary"
                    className="cursor-pointer hover:bg-purple-500/10 text-xs font-mono transition-colors"
                    onClick={() => loadExample(h)}
                  >
                    {h}
                  </Badge>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* ── Error state ───────────────────────────────── */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="mb-6 flex items-start gap-3 rounded-xl border border-destructive/30 bg-destructive/5 p-4"
            >
              <AlertCircle className="w-4 h-4 text-destructive mt-0.5 shrink-0" />
              <div>
                <p className="text-sm font-medium text-destructive">ADA encontrou um problema</p>
                <p className="text-xs text-muted-foreground mt-1">{error}</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── Loading state ─────────────────────────────── */}
        <AnimatePresence>
          {loading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="mb-6 rounded-xl border border-purple-500/20 bg-purple-500/5 p-6 text-center"
            >
              <Loader2 className="w-8 h-8 text-purple-400 animate-spin mx-auto mb-3" />
              <p className="text-sm text-purple-300 font-medium">ADA está percorrendo o repositório…</p>
              <p className="text-xs text-muted-foreground mt-1">
                Isso pode levar alguns segundos dependendo do tamanho do projeto.
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── Diagram loading state ─────────────────────── */}
        <AnimatePresence>
          {diagramLoading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="mb-6 rounded-xl border border-purple-500/20 bg-purple-500/5 p-6"
            >
              <div className="flex items-center gap-3 mb-4">
                <Loader2 className="w-5 h-5 text-purple-400 animate-spin shrink-0" />
                <p className="text-sm text-purple-300 font-medium">
                  {diagramStep?.label ?? 'Iniciando análise…'}
                </p>
              </div>
              {/* Progress steps */}
              <div className="flex gap-3">
                {DIAGRAM_STEPS.map(s => (
                  <div key={s.step} className="flex items-center gap-2 flex-1">
                    <div
                      className={`w-2 h-2 rounded-full shrink-0 transition-colors ${
                        (diagramStep?.step ?? 0) >= s.step
                          ? 'bg-purple-400'
                          : 'bg-muted-foreground/30'
                      }`}
                    />
                    <span
                      className={`text-[11px] transition-colors ${
                        (diagramStep?.step ?? 0) >= s.step
                          ? 'text-purple-300'
                          : 'text-muted-foreground/40'
                      }`}
                    >
                      {s.label.split('…')[0]}
                    </span>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── Results ───────────────────────────────────── */}
        <AnimatePresence>
          {(result || diagram) && (
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
            >
              {/* Summary bar */}
              {result && (
                <div className="flex items-center gap-3 mb-4 p-3 rounded-xl border border-green-500/20 bg-green-500/5">
                  <CheckCircle2 className="w-4 h-4 text-green-400 shrink-0" />
                  <span className="text-sm text-green-300 font-medium">
                    {result.repo} · branch {result.branch}
                  </span>
                  <div className="ml-auto flex gap-2 flex-wrap">
                    <Badge className="bg-purple-500/10 text-purple-400 border-purple-500/20 text-xs">
                      {result.functions?.length ?? 0} funções
                    </Badge>
                    <Badge className="bg-blue-500/10 text-blue-400 border-blue-500/20 text-xs">
                      {result.file_count ?? 0} arquivos
                    </Badge>
                    <Badge className="bg-amber-500/10 text-amber-400 border-amber-500/20 text-xs">
                      {result.intents?.length ?? 0} intenções
                    </Badge>
                  </div>
                </div>
              )}

              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid w-full grid-cols-5 mb-4">
                  <TabsTrigger value="overview">Visão Geral</TabsTrigger>
                  <TabsTrigger value="functions">Funções {result ? `(${result.functions?.length ?? 0})` : ''}</TabsTrigger>
                  <TabsTrigger value="intents">Intenções {result ? `(${result.intents?.length ?? 0})` : ''}</TabsTrigger>
                  <TabsTrigger value="diagram" className="relative">
                    Diagrama
                    {diagram && (
                      <span className="ml-1.5 w-1.5 h-1.5 rounded-full bg-purple-400 inline-block" />
                    )}
                  </TabsTrigger>
                  <TabsTrigger value="raw">JSON Bruto</TabsTrigger>
                </TabsList>

                {/* ── Overview ── */}
                <TabsContent value="overview">
                  {result ? (
                    <>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                        {[
                          { label: 'Funções', value: result.functions?.length ?? 0, icon: Code2, color: 'text-purple-400' },
                          { label: 'Intenções', value: result.intents?.length ?? 0, icon: Zap, color: 'text-amber-400' },
                          { label: 'Arquivos', value: result.file_count ?? 0, icon: FileCode, color: 'text-blue-400' },
                        ].map(({ label, value, icon: Icon, color }) => (
                          <Card key={label} className="border-border/50">
                            <CardHeader className="flex flex-row items-center justify-between pb-2">
                              <CardTitle className="text-sm font-medium text-muted-foreground">{label}</CardTitle>
                              <Icon className={`w-4 h-4 ${color}`} />
                            </CardHeader>
                            <CardContent>
                              <div className="text-3xl font-bold">{value}</div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                      <Card className="border-border/50">
                        <CardHeader>
                          <CardTitle className="flex items-center gap-2 text-sm">
                            <Network className="w-4 h-4 text-purple-400" />
                            Próximos passos
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="text-sm text-muted-foreground space-y-2">
                          <p>Veja o <strong className="text-foreground">call graph</strong> na aba Funções, ou clique em <strong className="text-foreground">Diagrama</strong> para gerar uma visualização arquitetural com IA.</p>
                          <p>Copie o <strong className="text-foreground">JSON Bruto</strong> para usar como contexto em qualquer agente da Trindade.</p>
                        </CardContent>
                      </Card>
                    </>
                  ) : (
                    <div className="text-center py-16 text-muted-foreground text-sm">
                      Execute uma análise Codeflow para ver a visão geral.
                    </div>
                  )}
                </TabsContent>

                {/* ── Functions ── */}
                <TabsContent value="functions">
                  {result?.functions?.length ? (
                    <div className="space-y-2">
                      {result.functions.slice(0, 60).map(fn => (
                        <Card key={fn.id} className="border-border/40 hover:border-purple-500/30 transition-colors">
                          <CardHeader className="py-3 px-4">
                            <div className="flex items-center justify-between gap-2">
                              <span className="font-mono text-sm text-foreground font-medium truncate">{fn.name}</span>
                              <Badge
                                variant={fn.type === 'route' ? 'default' : 'secondary'}
                                className="text-[10px] shrink-0"
                              >
                                {fn.type}
                              </Badge>
                            </div>
                            <p className="font-mono text-[11px] text-muted-foreground">
                              {fn.file}:{fn.line}
                            </p>
                          </CardHeader>
                          {(fn.docstring || fn.calls?.length > 0) && (
                            <CardContent className="pt-0 pb-3 px-4 space-y-2">
                              {fn.docstring && (
                                <p className="text-xs text-muted-foreground">{fn.docstring}</p>
                              )}
                              {fn.calls?.length > 0 && (
                                <div className="flex flex-wrap gap-1 items-center">
                                  <span className="text-[11px] text-muted-foreground mr-1">Chama:</span>
                                  {fn.calls.slice(0, 6).map((call, i) => (
                                    <Badge key={i} variant="outline" className="text-[10px] font-mono">
                                      {call.length > 24 ? call.slice(0, 24) + '…' : call}
                                    </Badge>
                                  ))}
                                  {fn.calls.length > 6 && (
                                    <Badge variant="outline" className="text-[10px]">+{fn.calls.length - 6}</Badge>
                                  )}
                                </div>
                              )}
                            </CardContent>
                          )}
                        </Card>
                      ))}
                      {result.functions.length > 60 && (
                        <p className="text-center text-xs text-muted-foreground py-4">
                          … e mais {result.functions.length - 60} funções
                        </p>
                      )}
                    </div>
                  ) : (
                    <div className="text-center py-16 text-muted-foreground text-sm">
                      Execute uma análise Codeflow para ver as funções.
                    </div>
                  )}
                </TabsContent>

                {/* ── Intents ── */}
                <TabsContent value="intents">
                  {result?.intents?.length ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {result.intents.map(intent => (
                        <Card key={intent.id} className="border-border/40">
                          <CardHeader className="py-3 px-4">
                            <CardTitle className="text-sm font-medium">{intent.name}</CardTitle>
                            <CardDescription className="text-xs">Tipo: {intent.type}</CardDescription>
                          </CardHeader>
                          <CardContent className="pt-0 pb-3 px-4">
                            <Badge variant="outline" className="text-[10px] font-mono">
                              Handler: {intent.handler_fn_id?.slice(0, 28)}…
                            </Badge>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-16 text-muted-foreground text-sm">
                      {result ? 'Nenhuma intenção detectada neste repositório.' : 'Execute uma análise Codeflow para ver as intenções.'}
                    </div>
                  )}
                </TabsContent>

                {/* ── Diagram ── */}
                <TabsContent value="diagram">
                  {diagram ? (
                    <div className="space-y-4">
                      {/* Explanation */}
                      <Card className="border-border/50">
                        <CardHeader className="pb-2">
                          <CardTitle className="text-sm flex items-center gap-2">
                            <BookOpen className="w-4 h-4 text-purple-400" />
                            Análise Arquitetural — {diagram.repo}
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="text-xs text-muted-foreground whitespace-pre-line leading-relaxed">
                            {diagram.explanation}
                          </p>
                        </CardContent>
                      </Card>

                      {/* Mermaid diagram */}
                      <MermaidDiagram code={diagram.mermaid} repo={diagram.repo} />
                    </div>
                  ) : diagramError ? (
                    <div className="flex items-start gap-3 rounded-xl border border-destructive/30 bg-destructive/5 p-4">
                      <AlertCircle className="w-4 h-4 text-destructive mt-0.5 shrink-0" />
                      <div>
                        <p className="text-sm font-medium text-destructive">Erro ao gerar diagrama</p>
                        <p className="text-xs text-muted-foreground mt-1">{diagramError}</p>
                        <Button
                          size="sm"
                          variant="outline"
                          className="mt-3 text-xs"
                          onClick={generateDiagram}
                        >
                          Tentar novamente
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-16 space-y-4">
                      <div className="w-16 h-16 rounded-2xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center mx-auto">
                        <BarChart3 className="w-8 h-8 text-purple-400" />
                      </div>
                      <div>
                        <p className="text-sm text-foreground font-medium mb-1">Diagrama de Arquitetura</p>
                        <p className="text-xs text-muted-foreground max-w-sm mx-auto">
                          Clique em <strong>Diagrama</strong> na barra de input para gerar um diagrama
                          interativo da arquitetura do repositório com Gemini AI.
                        </p>
                      </div>
                      <Button
                        onClick={generateDiagram}
                        disabled={!repoUrl.trim() && !result}
                        className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500"
                      >
                        <BarChart3 className="w-4 h-4 mr-2" />
                        Gerar Diagrama{cleanRepo ? ` para ${cleanRepo}` : ''}
                      </Button>
                    </div>
                  )}
                </TabsContent>

                {/* ── Raw JSON ── */}
                <TabsContent value="raw">
                  {result ? (
                    <div className="relative">
                      <Textarea
                        value={JSON.stringify(result, null, 2)}
                        readOnly
                        className="font-mono text-xs h-[600px] resize-none"
                      />
                      <Button
                        size="sm"
                        variant="outline"
                        className="absolute top-2 right-2 text-xs"
                        onClick={() => {
                          navigator.clipboard.writeText(JSON.stringify(result, null, 2));
                          toast.success('JSON copiado!');
                        }}
                      >
                        Copiar
                      </Button>
                    </div>
                  ) : (
                    <div className="text-center py-16 text-muted-foreground text-sm">
                      Execute uma análise Codeflow para ver o JSON bruto.
                    </div>
                  )}
                </TabsContent>
              </Tabs>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── Footer ────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-12 text-center"
        >
          <p className="text-xs text-muted-foreground/50">
            💜 Em memória de <strong>Ada Lovelace</strong> (1815–1852) —
            Matemática, escritora e a <em>primeira programadora</em> da história.
          </p>
          <p className="text-[11px] text-muted-foreground/30 mt-1">
            Análise via{' '}
            <a
              href="https://github.com/onedownz01/Thirdwheel-codeflow"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-purple-400 transition-colors"
            >
              Codeflow
            </a>
            {' · '}Diagramas via Gemini
          </p>
        </motion.div>

      </div>
    </AppLayout>
  );
}
