import { useState } from 'react';
import AppLayout from '@/components/layout/AppLayout';
import { PageBreadcrumb } from '@/components/navigation/PageBreadcrumb';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
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
  XCircle
} from 'lucide-react';
import { listSkills, getSkillCategories } from '@/services/skillsService';
import type { Skill } from '@/types/agents';

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
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategoria, setSelectedCategoria] = useState<string | null>(null);
  const [selectedAgent, setSelectedAgent] = useState<string | null>(null);
  const [selectedModel, setSelectedModel] = useState<string | null>(null);

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
          <Button>
            <Plus size={18} className="mr-2" />
            Nova Skill
          </Button>
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
    </AppLayout>
  );
}
