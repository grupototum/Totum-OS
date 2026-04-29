import { useState } from 'react';
import AppLayout from '@/components/layout/AppLayout';
import { PageBreadcrumb } from '@/components/navigation/PageBreadcrumb';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Progress } from '@/components/ui/progress';
import {
  Zap,
  Search,
  Plus,
  Settings,
  BarChart3,
  Puzzle,
  Workflow,
  Shield,
  ImageIcon,
  FlaskConical,
  ChevronRight,
  Loader2,
  Edit,
  Trash2,
  CheckCircle2,
  XCircle,
  RefreshCcw,
  GitPullRequestArrow,
  ExternalLink,
} from 'lucide-react';
import { listSkills, getSkillCategories } from '@/services/skillsService';
import type { Skill } from '@/types/agents';
import { syncSkills } from '@/services/skillsSync';
import type { SkillSyncRun, SkillSyncTargetStatus } from '@/lib/skillsSync';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

// Load real data from skills-registry.json
const allSkills: Skill[] = listSkills();
const allCategories: string[] = getSkillCategories();
const allModels: string[] = [...new Set(allSkills.map(s => s.model_preference).filter(Boolean))].sort();

const categoriaIcons: Record<string, React.ElementType> = {
  automacao: Workflow,
  automation: Workflow,
  analise: BarChart3,
  analytics: BarChart3,
  criacao: Puzzle,
  content: Puzzle,
  integracao: Settings,
  validacao: Shield,
  validation: Shield,
  image: ImageIcon,
  research: FlaskConical
};

const categoriaLabels: Record<string, string> = {
  automacao: 'Automação',
  automation: 'Automação',
  analise: 'Análise',
  analytics: 'Análise',
  criacao: 'Criação',
  content: 'Conteúdo',
  integracao: 'Integração',
  validacao: 'Validação',
  validation: 'Validação',
  image: 'Imagem',
  research: 'Pesquisa'
};

const categoriaColors: Record<string, string> = {
  automacao: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
  automation: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
  analise: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
  analytics: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
  criacao: 'bg-orange-500/10 text-orange-400 border-orange-500/20',
  content: 'bg-orange-500/10 text-orange-400 border-orange-500/20',
  integracao: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
  validacao: 'bg-red-500/10 text-red-400 border-red-500/20',
  validation: 'bg-red-500/10 text-red-400 border-red-500/20',
  image: 'bg-pink-500/10 text-pink-400 border-pink-500/20',
  research: 'bg-teal-500/10 text-teal-400 border-teal-500/20'
};

const modelColors: Record<string, string> = {
  claude: 'bg-violet-500/10 text-violet-400 border-violet-500/20',
  groq: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20',
  gemini: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20',
  kimi: 'bg-amber-500/10 text-amber-400 border-amber-500/20'
};

export default function SkillsCentral() {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategoria, setSelectedCategoria] = useState<string | null>(null);
  const [selectedAgent, setSelectedAgent] = useState<string | null>(null);
  const [selectedModel, setSelectedModel] = useState<string | null>(null);
  const [syncDialogOpen, setSyncDialogOpen] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [syncRun, setSyncRun] = useState<SkillSyncRun | null>(null);
  const [syncError, setSyncError] = useState<string | null>(null);

  // Stats: count per category from real data
  const statsByCategory = allCategories.reduce<Record<string, number>>((acc, cat) => {
    acc[cat] = allSkills.filter(s => s.category === cat).length;
    return acc;
  }, {});

  const filteredSkills = allSkills.filter(skill => {
    if (selectedCategoria && skill.category !== selectedCategoria) return false;
    if (selectedModel && skill.model_preference !== selectedModel) return false;
    if (searchQuery && !skill.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !skill.description.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  const activeSkillsCount = allSkills.filter((skill) => skill.status === 'active').length;
  const completedTargets = syncRun?.targets.filter((target) => target.status !== 'preparing' && target.status !== 'queued').length || 0;
  const progressValue = syncing
    ? 35
    : syncRun?.targets.length
      ? Math.round((completedTargets / syncRun.targets.length) * 100)
      : 0;

  const handleSyncSkills = async () => {
    setSyncDialogOpen(true);
    setSyncing(true);
    setSyncError(null);
    setSyncRun(null);

    try {
      const result = await syncSkills({
        triggeredBy: user?.id || null,
      });
      setSyncRun(result);
      toast.success('Sincronização de skills concluída.');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Falha ao sincronizar as skills.';
      setSyncError(message);
      toast.error(message);
    } finally {
      setSyncing(false);
    }
  };

  return (
    <AppLayout>
      <PageBreadcrumb />
      <div className="p-8 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Central de Skills</h1>
            <p className="text-slate-600 mt-1">
              Catálogo de habilidades com recomendações inteligentes
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" onClick={handleSyncSkills} disabled={syncing}>
              {syncing ? <Loader2 size={18} className="mr-2 animate-spin" /> : <RefreshCcw size={18} className="mr-2" />}
              Sincronizar skills
            </Button>
            <Button>
              <Plus size={18} className="mr-2" />
              Nova Skill
            </Button>
          </div>
        </div>

        {/* Stats cards — one per real category */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {allCategories.map((cat) => {
            const Icon = categoriaIcons[cat] || Zap;
            const count = statsByCategory[cat] || 0;
            return (
              <Card
                key={cat}
                className={`cursor-pointer transition-all ${
                  selectedCategoria === cat ? 'ring-2 ring-purple-500' : ''
                }`}
                onClick={() => setSelectedCategoria(selectedCategoria === cat ? null : cat)}
              >
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <Icon size={20} className="text-slate-400" />
                    <span className="text-2xl font-bold">{count}</span>
                  </div>
                  <p className="text-sm text-slate-600 mt-2">{categoriaLabels[cat] || cat}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Search */}
        <Card>
          <CardContent className="p-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={18} />
              <Input
                placeholder="Buscar skills..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardContent>
        </Card>

        {/* Filters — replaced Tarefas/Clientes with Por Agente/Por Modelo */}
        <Tabs defaultValue="categoria" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="categoria">Por Categoria</TabsTrigger>
            <TabsTrigger value="agente">Por Agente</TabsTrigger>
            <TabsTrigger value="modelo">Por Modelo</TabsTrigger>
          </TabsList>

          <TabsContent value="categoria" className="space-y-4">
            <div className="flex gap-2 flex-wrap pt-2">
              <Button
                variant={selectedCategoria === null ? 'secondary' : 'outline'}
                size="sm"
                onClick={() => setSelectedCategoria(null)}
              >
                Todas
              </Button>
              {allCategories.map((cat) => (
                <Button
                  key={cat}
                  variant={selectedCategoria === cat ? 'secondary' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedCategoria(selectedCategoria === cat ? null : cat)}
                >
                  {categoriaLabels[cat] || cat}
                </Button>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="agente" className="pt-2">
            <div className="flex gap-2 flex-wrap">
              <Button
                variant={selectedAgent === null ? 'secondary' : 'outline'}
                size="sm"
                onClick={() => setSelectedAgent(null)}
              >
                Todos
              </Button>
              {allModels.map((model) => (
                <Button
                  key={model}
                  variant={selectedModel === model ? 'secondary' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedModel(selectedModel === model ? null : model)}
                  className="capitalize"
                >
                  {model}
                </Button>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="modelo" className="pt-2">
            <div className="flex gap-2 flex-wrap">
              <Button
                variant={selectedModel === null ? 'secondary' : 'outline'}
                size="sm"
                onClick={() => setSelectedModel(null)}
              >
                Todos
              </Button>
              {allModels.map((model) => (
                <Button
                  key={model}
                  variant={selectedModel === model ? 'secondary' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedModel(selectedModel === model ? null : model)}
                  className="capitalize"
                >
                  {model}
                </Button>
              ))}
            </div>
          </TabsContent>
        </Tabs>

        {/* Skills List */}
        <Card>
          <CardHeader>
            <CardTitle>Skills ({filteredSkills.length})</CardTitle>
          </CardHeader>
          <CardContent>
            {filteredSkills.length === 0 ? (
              <div className="text-center py-12 text-slate-500">
                <Zap size={48} className="mx-auto mb-4 text-slate-300" />
                <p>Nenhuma skill encontrada</p>
              </div>
            ) : (
              <div className="space-y-3">
                {filteredSkills.map((skill) => {
                  const Icon = categoriaIcons[skill.category] || Zap;
                  const isActive = skill.status === 'active';
                  return (
                    <div
                      key={skill.id}
                      className="flex items-center justify-between p-4 border rounded-lg hover:bg-slate-50 transition-colors"
                    >
                      <div className="flex items-center gap-4">
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
                          categoriaColors[skill.category]?.split(' ')[0] || 'bg-slate-100'
                        }`}>
                          <Icon className={categoriaColors[skill.category]?.split(' ')[1] || 'text-slate-600'} size={20} />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="mr-1">{skill.emoji}</span>
                            <h4 className="font-medium text-slate-900">{skill.name}</h4>
                            {skill.is_primary ? (
                              <Badge className="bg-amber-500/10 text-amber-600 border-amber-500/20">
                                Principal
                              </Badge>
                            ) : null}
                            {isActive ? (
                              <CheckCircle2 size={16} className="text-green-500" />
                            ) : (
                              <XCircle size={16} className="text-red-500" />
                            )}
                          </div>
                          <p className="text-sm text-slate-500">{skill.description}</p>
                          <div className="flex items-center gap-2 mt-1 flex-wrap">
                            <Badge variant="outline" className={`capitalize ${modelColors[skill.model_preference] || 'bg-slate-100'}`}>
                              {skill.model_preference}
                            </Badge>
                            <Badge className={categoriaColors[skill.category] || 'bg-slate-100'}>
                              {categoriaLabels[skill.category] || skill.category}
                            </Badge>
                            {skill.routing_priority ? (
                              <Badge variant="outline">
                                prioridade {skill.routing_priority}
                              </Badge>
                            ) : null}
                            <span className="text-xs text-slate-400">
                              v{skill.version} · ${skill.cost_per_call.toFixed(2)}/call · {Math.round(skill.success_rate * 100)}% sucesso
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <Button variant="ghost" size="sm">
                          <Edit size={16} />
                        </Button>
                        <Button variant="ghost" size="sm" className="text-red-600">
                          <Trash2 size={16} />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <ChevronRight size={18} />
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Dialog open={syncDialogOpen} onOpenChange={setSyncDialogOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Sincronização de skills</DialogTitle>
            <DialogDescription>
              Publica {activeSkillsCount} skill(s) ativa(s) para Claude Web, ChatGPT e Kimi.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-5">
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm text-slate-600">
                <span>{syncing ? 'Sincronizando agora...' : 'Status da última execução'}</span>
                <span>{progressValue}%</span>
              </div>
              <Progress value={progressValue} />
            </div>

            {syncError ? (
              <Card className="border-red-200 bg-red-50">
                <CardContent className="p-4 text-sm text-red-700">
                  {syncError}
                </CardContent>
              </Card>
            ) : null}

            {syncRun ? (
              <div className="grid gap-4">
                <Card>
                  <CardContent className="p-4 space-y-3">
                    <div className="flex flex-wrap items-center gap-3 text-sm text-slate-600">
                      <Badge variant="outline">Run {syncRun.run_id.slice(0, 8)}</Badge>
                      <Badge variant="outline" className="capitalize">{syncRun.status.replaceAll('_', ' ')}</Badge>
                    </div>
                    <div className="grid gap-2 text-sm text-slate-700">
                      <p><span className="font-medium">Branch:</span> {syncRun.git_branch || 'não criada'}</p>
                      <div className="flex items-center gap-2">
                        <span className="font-medium">PR:</span>
                        {syncRun.git_pr_url ? (
                          <a href={syncRun.git_pr_url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-blue-600 hover:underline">
                            Abrir pull request
                            <ExternalLink size={14} />
                          </a>
                        ) : (
                          <span>não criada</span>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <div className="grid gap-3">
                  {syncRun.targets.map((target) => (
                    <TargetStatusCard key={target.provider} target={target} />
                  ))}
                </div>
              </div>
            ) : syncing ? (
              <Card>
                <CardContent className="p-6 flex items-center gap-3 text-sm text-slate-600">
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Preparando manifest, exports e publicação por provider.
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardContent className="p-6 text-sm text-slate-600">
                  Clique em <strong>Sincronizar skills</strong> para publicar os exports no GitHub e enviar os arquivos da Kimi.
                </CardContent>
              </Card>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </AppLayout>
  );
}

function TargetStatusCard({ target }: { target: SkillSyncTargetStatus }) {
  const uploadedFiles = Array.isArray(target.external_ids?.files) ? target.external_ids.files.length : undefined;

  return (
    <Card className="border-slate-200">
      <CardContent className="p-4 space-y-3">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <GitPullRequestArrow size={18} className="text-slate-400" />
            <div>
              <p className="font-medium text-slate-900">
                {target.provider === 'claude_web' ? 'Claude Web' : target.provider === 'chatgpt' ? 'ChatGPT' : 'Kimi'}
              </p>
              <p className="text-sm text-slate-500">{target.message}</p>
            </div>
          </div>
          <Badge variant="outline" className="capitalize">
            {target.status.replaceAll('_', ' ')}
          </Badge>
        </div>

        <div className="grid gap-1 text-sm text-slate-700">
          <p><span className="font-medium">Skills exportadas:</span> {target.exported_skills ?? 0}</p>
          <p><span className="font-medium">Arquivos processados:</span> {target.exported_files ?? 0}</p>
          {typeof uploadedFiles === 'number' ? (
            <p><span className="font-medium">Uploads Kimi:</span> {uploadedFiles}</p>
          ) : null}
        </div>
      </CardContent>
    </Card>
  );
}
