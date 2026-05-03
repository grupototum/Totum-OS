import { useState } from 'react';
import AppLayout from '@/components/layout/AppLayout';
import { PageBreadcrumb } from '@/components/navigation/PageBreadcrumb';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Loader2, RefreshCw, Trash2, Upload, Search, FileText, Zap, BookOpen, Database, Clock, Sparkles, FolderOpen, HardDrive, PenLine } from 'lucide-react';
import { useAlexandriaRAG, type RAGDocType, type IngestPayload } from '@/hooks/useAlexandriaRAG';
import { toast } from 'sonner';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const DOC_TYPE_CONFIG: Record<RAGDocType, { label: string; color: string; icon: React.ElementType }> = {
  skill:    { label: 'Skill',    color: 'bg-blue-500/10 text-blue-600 border-blue-500/20',   icon: Zap },
  pop:      { label: 'POP',     color: 'bg-amber-500/10 text-amber-600 border-amber-500/20', icon: FileText },
  doc:      { label: 'Doc',     color: 'bg-emerald-500/10 text-emerald-700 border-emerald-500/20', icon: BookOpen },
  context:  { label: 'Contexto', color: 'bg-purple-500/10 text-purple-600 border-purple-500/20', icon: Database },
  template: { label: 'Template', color: 'bg-rose-500/10 text-rose-600 border-rose-500/20',   icon: Sparkles },
};

const SOURCE_CONFIG: Record<string, { label: string; color: string; icon: React.ElementType }> = {
  manual:       { label: 'Manual',  color: 'text-slate-500 border-slate-200',          icon: PenLine },
  logseq:       { label: 'Logseq',  color: 'text-violet-600 border-violet-200',        icon: FolderOpen },
  google_drive: { label: 'Drive',   color: 'text-blue-600 border-blue-200',            icon: HardDrive },
};

const ACTION_LABELS: Record<string, string> = {
  read_skill_first:         'Leia antes de agir',
  read_skill_as_context:    'Use como contexto',
  proceed_with_caution:     'Proceda com cautela',
  proceed_with_base_knowledge: 'Conhecimento base',
};

const RELEVANCE_COLOR = (r: number) =>
  r >= 0.8 ? 'text-emerald-600' : r >= 0.5 ? 'text-amber-600' : 'text-slate-400';

export default function RAGManager() {
  const { documents, isLoading, error, stats, refetch, ingest, deleteDoc, discover } = useAlexandriaRAG();

  // Ingest form
  const [form, setForm] = useState<IngestPayload>({ title: '', content: '', doc_type: 'skill', path: '' });
  const [ingesting, setIngesting] = useState(false);

  // Search playground
  const [query, setQuery] = useState('');
  const [searchTypes, setSearchTypes] = useState<RAGDocType[]>(['skill', 'pop', 'doc']);
  const [searching, setSearching] = useState(false);
  const [searchResult, setSearchResult] = useState<Awaited<ReturnType<typeof discover>> | null>(null);

  // Filter
  const [filterType, setFilterType] = useState<RAGDocType | 'all'>('all');
  const [filterQuery, setFilterQuery] = useState('');

  const filtered = documents.filter(d => {
    if (filterType !== 'all' && d.doc_type !== filterType) return false;
    if (filterQuery && !d.title.toLowerCase().includes(filterQuery.toLowerCase())) return false;
    return true;
  });

  const handleIngest = async () => {
    if (!form.title.trim() || !form.content.trim()) {
      toast.error('Título e conteúdo são obrigatórios');
      return;
    }
    setIngesting(true);
    try {
      const payload: IngestPayload = { ...form };
      if (!payload.path) delete payload.path;
      await ingest(payload);
      toast.success(`"${form.title}" ingerido com sucesso`);
      setForm({ title: '', content: '', doc_type: 'skill', path: '' });
    } catch (e) {
      toast.error((e as Error).message);
    } finally {
      setIngesting(false);
    }
  };

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Remover "${title}" da Alexandria?`)) return;
    try {
      await deleteDoc(id);
      toast.success('Documento removido');
    } catch (e) {
      toast.error((e as Error).message);
    }
  };

  const handleSearch = async () => {
    if (!query.trim()) return;
    setSearching(true);
    setSearchResult(null);
    try {
      const res = await discover(query, searchTypes);
      setSearchResult(res);
    } catch (e) {
      toast.error((e as Error).message);
    } finally {
      setSearching(false);
    }
  };

  const toggleType = (t: RAGDocType) =>
    setSearchTypes(prev => prev.includes(t) ? prev.filter(x => x !== t) : [...prev, t]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Card className="p-8 text-center max-w-md">
          <p className="text-destructive font-semibold mb-2">Erro ao carregar</p>
          <p className="text-sm text-muted-foreground mb-4">{error.message}</p>
          <Button onClick={refetch} variant="outline" size="sm">
            <RefreshCw className="h-4 w-4 mr-2" />Tentar novamente
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <AppLayout>
      <PageBreadcrumb />
      <div className="space-y-6 p-4 sm:p-6">

        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Base RAG</h1>
            <p className="text-sm text-muted-foreground mt-0.5">
              Documentos vetorizados que alimentam o Skill Discovery da Alexandria
            </p>
          </div>
          <Button onClick={refetch} variant="outline" size="sm">
            <RefreshCw className="h-4 w-4 mr-2" />Atualizar
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          <Card>
            <CardContent className="p-4">
              <p className="text-2xl font-bold">{stats.total}</p>
              <p className="text-xs text-muted-foreground mt-0.5">Total</p>
            </CardContent>
          </Card>
          {(Object.keys(DOC_TYPE_CONFIG) as RAGDocType[]).map(type => {
            const cfg = DOC_TYPE_CONFIG[type];
            const Icon = cfg.icon;
            return (
              <Card key={type}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <Icon className="h-4 w-4 text-muted-foreground" />
                    <span className="text-2xl font-bold">{stats.byType[type] || 0}</span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5">{cfg.label}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {stats.lastIngested && (
          <p className="text-xs text-muted-foreground flex items-center gap-1">
            <Clock className="h-3 w-3" />
            Último ingerido {formatDistanceToNow(new Date(stats.lastIngested), { addSuffix: true, locale: ptBR })}
          </p>
        )}

        <Tabs defaultValue="documents">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="documents">Documentos</TabsTrigger>
            <TabsTrigger value="ingest">Ingerir</TabsTrigger>
            <TabsTrigger value="search">Busca RAG</TabsTrigger>
          </TabsList>

          {/* DOCUMENTOS */}
          <TabsContent value="documents" className="mt-4 space-y-3">
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Filtrar por título..."
                  value={filterQuery}
                  onChange={e => setFilterQuery(e.target.value)}
                  className="pl-9"
                />
              </div>
              <Select value={filterType} onValueChange={v => setFilterType(v as RAGDocType | 'all')}>
                <SelectTrigger className="w-36">
                  <SelectValue placeholder="Tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os tipos</SelectItem>
                  {(Object.keys(DOC_TYPE_CONFIG) as RAGDocType[]).map(t => (
                    <SelectItem key={t} value={t}>{DOC_TYPE_CONFIG[t].label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {filtered.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center text-muted-foreground">
                  <Database className="h-10 w-10 mx-auto mb-3 opacity-30" />
                  <p className="text-sm">Nenhum documento encontrado</p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-2">
                {filtered.map(doc => {
                  const cfg = DOC_TYPE_CONFIG[doc.doc_type] || DOC_TYPE_CONFIG.doc;
                  const Icon = cfg.icon;
                  const src = SOURCE_CONFIG[doc.source_type] || SOURCE_CONFIG.manual;
                  const SrcIcon = src.icon;
                  return (
                    <Card key={doc.id} className="hover:bg-muted/30 transition-colors">
                      <CardContent className="p-4 flex items-start justify-between gap-4">
                        <div className="flex items-start gap-3 min-w-0">
                          <div className={`mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-lg border ${cfg.color.split(' ').slice(0,2).join(' ')}`}>
                            <Icon className="h-4 w-4" />
                          </div>
                          <div className="min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="font-medium text-sm">{doc.title}</span>
                              <Badge variant="outline" className={`text-[11px] ${cfg.color}`}>
                                {cfg.label}
                              </Badge>
                              <Badge variant="outline" className={`text-[11px] flex items-center gap-1 ${src.color}`}>
                                <SrcIcon className="h-2.5 w-2.5" />
                                {src.label}
                              </Badge>
                            </div>
                            {doc.path && (
                              <p className="text-xs text-muted-foreground mt-0.5 font-mono truncate">{doc.path}</p>
                            )}
                            <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{doc.content}</p>
                            {doc.last_synced_at && (
                              <p className="text-[11px] text-muted-foreground mt-1 flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                Sync {formatDistanceToNow(new Date(doc.last_synced_at), { addSuffix: true, locale: ptBR })}
                              </p>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          <span className="text-xs text-muted-foreground whitespace-nowrap">
                            {formatDistanceToNow(new Date(doc.created_at), { addSuffix: true, locale: ptBR })}
                          </span>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7 text-destructive hover:text-destructive"
                            onClick={() => handleDelete(doc.id, doc.title)}
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            )}
          </TabsContent>

          {/* INGERIR */}
          <TabsContent value="ingest" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Ingerir novo documento</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-1.5">
                    <Label>Título *</Label>
                    <Input
                      placeholder="Ex: POP-002 Deploy na VPS"
                      value={form.title}
                      onChange={e => setForm(p => ({ ...p, title: e.target.value }))}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label>Tipo *</Label>
                    <Select
                      value={form.doc_type}
                      onValueChange={v => setForm(p => ({ ...p, doc_type: v as RAGDocType }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {(Object.keys(DOC_TYPE_CONFIG) as RAGDocType[]).map(t => (
                          <SelectItem key={t} value={t}>{DOC_TYPE_CONFIG[t].label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-1.5">
                  <Label>Path (opcional)</Label>
                  <Input
                    placeholder="Ex: planos/POP-002.md"
                    value={form.path}
                    onChange={e => setForm(p => ({ ...p, path: e.target.value }))}
                    className="font-mono text-sm"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label>Conteúdo *</Label>
                  <Textarea
                    placeholder="Cole o conteúdo do documento aqui..."
                    value={form.content}
                    onChange={e => setForm(p => ({ ...p, content: e.target.value }))}
                    rows={10}
                    className="font-mono text-sm resize-y"
                  />
                  <p className="text-xs text-muted-foreground">{form.content.length} caracteres</p>
                </div>
                <Button
                  onClick={handleIngest}
                  disabled={ingesting || !form.title.trim() || !form.content.trim()}
                  className="w-full sm:w-auto"
                >
                  {ingesting
                    ? <><Loader2 className="h-4 w-4 mr-2 animate-spin" />Vetorizando e salvando...</>
                    : <><Upload className="h-4 w-4 mr-2" />Ingerir na Alexandria</>
                  }
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* BUSCA RAG */}
          <TabsContent value="search" className="mt-4 space-y-4">
            <Card>
              <CardContent className="p-4 space-y-4">
                <div className="space-y-1.5">
                  <Label>Query de descoberta</Label>
                  <div className="flex gap-2">
                    <Input
                      placeholder="Ex: criar agente, backup banco, tom de voz..."
                      value={query}
                      onChange={e => setQuery(e.target.value)}
                      onKeyDown={e => e.key === 'Enter' && handleSearch()}
                    />
                    <Button onClick={handleSearch} disabled={searching || !query.trim()}>
                      {searching
                        ? <Loader2 className="h-4 w-4 animate-spin" />
                        : <Search className="h-4 w-4" />
                      }
                    </Button>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  {(Object.keys(DOC_TYPE_CONFIG) as RAGDocType[]).map(t => (
                    <Button
                      key={t}
                      size="sm"
                      variant={searchTypes.includes(t) ? 'secondary' : 'outline'}
                      onClick={() => toggleType(t)}
                      className="text-xs"
                    >
                      {DOC_TYPE_CONFIG[t].label}
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>

            {searchResult && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <p className="text-sm text-muted-foreground">
                    {searchResult.discovered.length} resultado(s) para <strong>"{searchResult.query_used}"</strong>
                  </p>
                  <Badge variant="outline" className="text-xs">
                    {ACTION_LABELS[searchResult.recommended_action] || searchResult.recommended_action}
                  </Badge>
                </div>
                {searchResult.discovered.length === 0 ? (
                  <Card>
                    <CardContent className="py-8 text-center text-sm text-muted-foreground">
                      Nenhum resultado acima do threshold. Tente uma query diferente.
                    </CardContent>
                  </Card>
                ) : (
                  searchResult.discovered.map((r, i) => {
                    const cfg = DOC_TYPE_CONFIG[r.doc_type as RAGDocType] || DOC_TYPE_CONFIG.doc;
                    const Icon = cfg.icon;
                    const pct = Math.round(r.relevance * 100);
                    return (
                      <Card key={r.id} className={i === 0 ? 'border-primary/30' : ''}>
                        <CardContent className="p-4 flex items-start gap-3">
                          <div className={`mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-lg border ${cfg.color.split(' ').slice(0,2).join(' ')}`}>
                            <Icon className="h-4 w-4" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between gap-2">
                              <span className="font-medium text-sm">{r.title}</span>
                              <span className={`text-sm font-bold shrink-0 ${RELEVANCE_COLOR(r.relevance)}`}>
                                {pct}%
                              </span>
                            </div>
                            <div className="flex items-center gap-2 mt-0.5">
                              <Badge variant="outline" className={`text-[11px] ${cfg.color}`}>{cfg.label}</Badge>
                              {r.path && <span className="text-xs text-muted-foreground font-mono truncate">{r.path}</span>}
                            </div>
                            <p className="text-xs text-muted-foreground mt-1.5 line-clamp-3">{r.content}</p>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })
                )}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
}
