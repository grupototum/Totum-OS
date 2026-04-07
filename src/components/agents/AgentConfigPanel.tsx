import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Icon } from '@iconify/react';

export interface AgentConfig {
  id: string;
  name: string;
  emoji: string;
  modelOverride?: string;
  systemPrompt: string;
  status: 'online' | 'offline' | 'idle' | 'maintenance';
  created_at?: string;
  updated_at?: string;
}

interface AgentConfigPanelProps {
  agentId: string;
  onSave?: (config: AgentConfig) => void;
}

const statusColors = {
  online: 'bg-emerald-500',
  offline: 'bg-stone-400',
  idle: 'bg-amber-500',
  maintenance: 'bg-red-500',
};

const statusLabels = {
  online: 'Online',
  offline: 'Offline',
  idle: 'Em espera',
  maintenance: 'Manutenção',
};

const availableModels = [
  { value: 'gpt-4', label: 'GPT-4' },
  { value: 'gpt-4-turbo', label: 'GPT-4 Turbo' },
  { value: 'gpt-3.5', label: 'GPT-3.5' },
  { value: 'claude-3', label: 'Claude 3' },
  { value: 'gemini', label: 'Gemini' },
];

export function AgentConfigPanel({ agentId, onSave }: AgentConfigPanelProps) {
  const [config, setConfig] = useState<AgentConfig>({
    id: agentId,
    name: 'Novo Agente',
    emoji: '🤖',
    modelOverride: 'gpt-4',
    systemPrompt: '',
    status: 'offline',
  });

  const [loading, setLoading] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [savedMessage, setSavedMessage] = useState('');

  useEffect(() => {
    // Simular carregamento de dados do agente
    setLoading(true);
    setTimeout(() => {
      setConfig((prev) => ({
        ...prev,
        name: `Agente ${agentId.slice(0, 4)}`.toUpperCase(),
        created_at: new Date().toISOString(),
      }));
      setLoading(false);
    }, 500);
  }, [agentId]);

  const handleNameChange = (value: string) => {
    setConfig((prev) => ({ ...prev, name: value }));
    setHasChanges(true);
  };

  const handleEmojiChange = (value: string) => {
    setConfig((prev) => ({ ...prev, emoji: value }));
    setHasChanges(true);
  };

  const handleModelChange = (value: string) => {
    setConfig((prev) => ({ ...prev, modelOverride: value }));
    setHasChanges(true);
  };

  const handleSystemPromptChange = (value: string) => {
    setConfig((prev) => ({ ...prev, systemPrompt: value }));
    setHasChanges(true);
  };

  const handleStatusChange = (value: string) => {
    setConfig((prev) => ({ ...prev, status: value as AgentConfig['status'] }));
    setHasChanges(true);
  };

  const handleSave = async () => {
    setLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 800));
    
    if (onSave) {
      onSave(config);
    }
    
    setHasChanges(false);
    setSavedMessage('Configurações salvas com sucesso!');
    setLoading(false);
    
    setTimeout(() => {
      setSavedMessage('');
    }, 3000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
    >
      <Card className="border-stone-300 bg-[#EAEAE5]">
        <CardHeader className="border-b border-stone-300">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-stone-200 flex items-center justify-center text-2xl border border-stone-300">
                {config.emoji}
              </div>
              <div>
                <CardTitle className="text-lg text-stone-900">{config.name}</CardTitle>
                <CardDescription className="text-stone-500">
                  ID: {agentId}
                </CardDescription>
              </div>
            </div>
            <Badge variant="outline" className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${statusColors[config.status]}`} />
              {statusLabels[config.status]}
            </Badge>
          </div>
        </CardHeader>

        <CardContent className="pt-6">
          <Tabs defaultValue="info" className="w-full">
            <TabsList className="grid w-full grid-cols-3 bg-stone-100">
              <TabsTrigger value="info" className="data-[state=active]:bg-white">
                <Icon icon="mdi:information" className="w-4 h-4 mr-2" />
                Informações
              </TabsTrigger>
              <TabsTrigger value="skills" className="data-[state=active]:bg-white">
                <Icon icon="mdi:puzzle" className="w-4 h-4 mr-2" />
                Skills
              </TabsTrigger>
              <TabsTrigger value="prompt" className="data-[state=active]:bg-white">
                <Icon icon="mdi:file-document" className="w-4 h-4 mr-2" />
                System Prompt
              </TabsTrigger>
            </TabsList>

            {/* Info Tab */}
            <TabsContent value="info" className="space-y-6 mt-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-stone-700">Nome do Agente</label>
                <Input
                  value={config.name}
                  onChange={(e) => handleNameChange(e.target.value)}
                  placeholder="Digite o nome do agente"
                  className="bg-white border-stone-300"
                  disabled={loading}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-stone-700">Emoji</label>
                <Input
                  value={config.emoji}
                  onChange={(e) => handleEmojiChange(e.target.value)}
                  placeholder="🤖"
                  maxLength={2}
                  className="bg-white border-stone-300 text-center text-2xl"
                  disabled={loading}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-stone-700">Status</label>
                <Select value={config.status} onValueChange={handleStatusChange} disabled={loading}>
                  <SelectTrigger className="bg-white border-stone-300">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="online">Online</SelectItem>
                    <SelectItem value="offline">Offline</SelectItem>
                    <SelectItem value="idle">Em espera</SelectItem>
                    <SelectItem value="maintenance">Manutenção</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {config.created_at && (
                <div className="pt-4 border-t border-stone-300 space-y-2">
                  <p className="text-xs text-stone-500 uppercase tracking-wider">Criado em</p>
                  <p className="text-sm text-stone-700">
                    {new Date(config.created_at).toLocaleString('pt-BR')}
                  </p>
                </div>
              )}
            </TabsContent>

            {/* Skills Tab */}
            <TabsContent value="skills" className="space-y-4 mt-6">
              <div className="rounded-lg bg-stone-100 p-4 border border-stone-300">
                <p className="text-sm text-stone-600">
                  <Icon icon="mdi:information" className="w-4 h-4 inline mr-2" />
                  Gerencie as skills do agente na aba "Skills Manager"
                </p>
              </div>
              <Button 
                className="w-full bg-stone-900 hover:bg-stone-800 text-white"
                disabled={loading}
              >
                <Icon icon="mdi:plus" className="w-4 h-4 mr-2" />
                Abrir Skills Manager
              </Button>
            </TabsContent>

            {/* System Prompt Tab */}
            <TabsContent value="prompt" className="space-y-4 mt-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-stone-700">Modelo LLM</label>
                <Select value={config.modelOverride} onValueChange={handleModelChange} disabled={loading}>
                  <SelectTrigger className="bg-white border-stone-300">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {availableModels.map((model) => (
                      <SelectItem key={model.value} value={model.value}>
                        {model.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-stone-700">System Prompt</label>
                <Textarea
                  value={config.systemPrompt}
                  onChange={(e) => handleSystemPromptChange(e.target.value)}
                  placeholder="Digite as instruções do sistema para o agente..."
                  className="bg-white border-stone-300 min-h-40 font-mono text-sm"
                  disabled={loading}
                />
                <p className="text-xs text-stone-500">
                  {config.systemPrompt.length} caracteres
                </p>
              </div>
            </TabsContent>
          </Tabs>

          {/* Footer */}
          <div className="flex items-center justify-between gap-4 mt-8 pt-6 border-t border-stone-300">
            <div className="flex-1">
              {hasChanges && (
                <p className="text-xs text-amber-600 flex items-center gap-1">
                  <Icon icon="mdi:alert-circle" className="w-4 h-4" />
                  Existem alterações não salvas
                </p>
              )}
              {savedMessage && (
                <p className="text-xs text-emerald-600 flex items-center gap-1">
                  <Icon icon="mdi:check-circle" className="w-4 h-4" />
                  {savedMessage}
                </p>
              )}
            </div>
            <Button
              onClick={handleSave}
              disabled={!hasChanges || loading}
              className="bg-stone-900 hover:bg-stone-800 text-white"
            >
              {loading ? (
                <>
                  <Icon icon="mdi:loading" className="w-4 h-4 mr-2 animate-spin" />
                  Salvando...
                </>
              ) : (
                <>
                  <Icon icon="mdi:check" className="w-4 h-4 mr-2" />
                  Salvar Alterações
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
