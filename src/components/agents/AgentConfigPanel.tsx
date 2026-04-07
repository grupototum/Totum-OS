import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  getAgentConfig, 
  updateAgentConfig,
  getAgentSkills 
} from '@/services/skillsService';
import type { AgentConfig, Skill } from '@/types/agents';
import { Bot, Settings, Wrench, FileText, Save, Loader2 } from 'lucide-react';

interface AgentConfigPanelProps {
  agentId: string;
  onSave?: (config: AgentConfig) => void;
}

export function AgentConfigPanel({ agentId, onSave }: AgentConfigPanelProps) {
  const [config, setConfig] = useState<AgentConfig | null>(null);
  const [skills, setSkills] = useState<Array<Skill & { position: number }>>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  // Form states
  const [name, setName] = useState('');
  const [emoji, setEmoji] = useState('🤖');
  const [modelOverride, setModelOverride] = useState('');
  const [systemPrompt, setSystemPrompt] = useState('');
  const [status, setStatus] = useState<'active' | 'inactive'>('active');

  useEffect(() => {
    loadConfig();
  }, [agentId]);

  const loadConfig = async () => {
    setLoading(true);
    try {
      const [agentConfig, agentSkills] = await Promise.all([
        getAgentConfig(agentId),
        getAgentSkills(agentId),
      ]);

      if (agentConfig) {
        setConfig(agentConfig);
        setName(agentConfig.name);
        setEmoji(agentConfig.emoji);
        setModelOverride(agentConfig.model_override || '');
        setSystemPrompt(agentConfig.system_prompt);
        setStatus(agentConfig.status as 'active' | 'inactive');
      }

      setSkills(agentSkills);
    } catch (error) {
      console.error('Error loading config:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!config) return;
    
    setSaving(true);
    try {
      const updated = await updateAgentConfig(agentId, {
        name,
        emoji,
        model_override: modelOverride || undefined,
        system_prompt: systemPrompt,
        status,
      });

      if (updated) {
        setConfig(updated);
        setHasChanges(false);
        onSave?.(updated);
      }
    } catch (error) {
      console.error('Error saving config:', error);
    } finally {
      setSaving(false);
    }
  };

  const calculateTotalCost = () => {
    return skills.reduce((total, skill) => total + skill.cost_per_call, 0);
  };

  if (loading) {
    return (
      <Card className="w-full max-w-4xl">
        <CardContent className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    );
  }

  if (!config) {
    return (
      <Card className="w-full max-w-4xl">
        <CardContent className="py-12 text-center">
          <p className="text-muted-foreground">Agente não encontrado</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-4xl">
      <CardHeader className="flex flex-row items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-3xl">{emoji}</span>
          <div>
            <CardTitle className="text-xl">{name}</CardTitle>
            <p className="text-sm text-muted-foreground">ID: {agentId}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant={status === 'active' ? 'default' : 'secondary'}>
            {status === 'active' ? 'Ativo' : 'Inativo'}
          </Badge>
          {hasChanges && (
            <Button 
              size="sm" 
              onClick={handleSave}
              disabled={saving}
            >
              {saving ? (
                <Loader2 className="h-4 w-4 animate-spin mr-1" />
              ) : (
                <Save className="h-4 w-4 mr-1" />
              )}
              Salvar
            </Button>
          )}
        </div>
      </CardHeader>

      <CardContent>
        <Tabs defaultValue="info" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="info" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              Informações
            </TabsTrigger>
            <TabsTrigger value="skills" className="flex items-center gap-2">
              <Wrench className="h-4 w-4" />
              Skills
              <Badge variant="secondary" className="ml-1">{skills.length}</Badge>
            </TabsTrigger>
            <TabsTrigger value="prompt" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              System Prompt
            </TabsTrigger>
          </TabsList>

          {/* Tab: Informações */}
          <TabsContent value="info" className="space-y-6 pt-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nome do Agente</Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    setHasChanges(true);
                  }}
                  placeholder="Ex: WANDA - Social Planner"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="emoji">Emoji</Label>
                <Input
                  id="emoji"
                  value={emoji}
                  onChange={(e) => {
                    setEmoji(e.target.value);
                    setHasChanges(true);
                  }}
                  placeholder="🤖"
                  maxLength={2}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="model">Model Override (opcional)</Label>
              <Select
                value={modelOverride}
                onValueChange={(value) => {
                  setModelOverride(value);
                  setHasChanges(true);
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Usar modelo padrão" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Usar padrão da skill</SelectItem>
                  <SelectItem value="claude">Claude 3.5 Sonnet</SelectItem>
                  <SelectItem value="groq">Groq Llama 3</SelectItem>
                  <SelectItem value="gemini">Gemini Pro</SelectItem>
                  <SelectItem value="kimi">Kimi K2.5</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select
                value={status}
                onValueChange={(value: 'active' | 'inactive') => {
                  setStatus(value);
                  setHasChanges(true);
                }}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">🟢 Ativo</SelectItem>
                  <SelectItem value="inactive">🔴 Inativo</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Separator />

            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Tier</span>
              <Badge variant="outline">{config.tier}</Badge>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Criado em</span>
              <span>{new Date(config.created_at).toLocaleDateString('pt-BR')}</span>
            </div>
          </TabsContent>

          {/* Tab: Skills */}
          <TabsContent value="skills" className="pt-4">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-medium">Skills Configuradas</h3>
                <div className="text-sm text-muted-foreground">
                  Custo estimado: <span className="font-medium text-foreground">R$ {calculateTotalCost().toFixed(2)}</span> por execução
                </div>
              </div>

              {skills.length === 0 ? (
                <div className="rounded-lg border border-dashed p-8 text-center">
                  <Bot className="mx-auto h-8 w-8 text-muted-foreground mb-2" />
                  <p className="text-sm text-muted-foreground">
                    Nenhuma skill configurada
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Adicione skills para este agente poder executar tarefas
                  </p>
                </div>
              ) : (
                <div className="space-y-2">
                  {skills.map((skill, index) => (
                    <div
                      key={skill.id}
                      className="flex items-center gap-3 rounded-lg border p-3"
                    >
                      <span className="text-lg">{skill.emoji}</span>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{skill.name}</span>
                          <Badge variant="secondary" className="text-xs">
                            {skill.category}
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground truncate">
                          {skill.description}
                        </p>
                      </div>
                      <div className="text-right text-sm">
                        <div className="font-medium">R$ {skill.cost_per_call.toFixed(2)}</div>
                        <div className="text-xs text-muted-foreground">
                          {(skill.success_rate * 100).toFixed(0)}% sucesso
                        </div>
                      </div>
                      <Badge variant="outline" className="text-xs">
                        {index + 1}º
                      </Badge>
                    </div>
                  ))}
                </div>
              )}

              <Button className="w-full" variant="outline">
                + Adicionar Skill
              </Button>
            </div>
          </TabsContent>

          {/* Tab: System Prompt */}
          <TabsContent value="prompt" className="space-y-4 pt-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="system-prompt">System Prompt (DNA do Agente)</Label>
                <span className="text-xs text-muted-foreground">
                  {systemPrompt.length} caracteres
                </span>
              </div>
              <Textarea
                id="system-prompt"
                value={systemPrompt}
                onChange={(e) => {
                  setSystemPrompt(e.target.value);
                  setHasChanges(true);
                }}
                placeholder="Você é um agente especializado em..."
                className="min-h-[300px] font-mono text-sm"
              />
              <p className="text-xs text-muted-foreground">
                Este prompt define a personalidade e comportamento do agente. 
                Ele será combinado com as skills na hora da execução.
              </p>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
