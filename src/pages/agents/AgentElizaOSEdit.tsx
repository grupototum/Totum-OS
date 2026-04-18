import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import AppLayout from '@/components/layout/AppLayout';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import {
  ArrowLeft,
  Save,
  Copy,
  Download,
  Bot,
  MessageSquare,
  Brain,
  BookOpen,
  Zap,
  Eye,
  Send,
  Play,
  Pause,
} from 'lucide-react';
import { useAgentForm } from '@/hooks/useAgentForm';
import { supabase } from '@/integrations/supabase/client';

const tiers = [
  { value: 1, label: 'Laboratório', desc: 'Claude/Gemini - Decisões estratégicas', color: 'bg-purple-500' },
  { value: 2, label: 'Midtier', desc: 'Groq Free - Execução constante', color: 'bg-blue-500' },
  { value: 3, label: 'Fábrica', desc: 'Ollama Local - Automação mecânica', color: 'bg-green-500' },
];

const modelsByTier: Record<number, string[]> = {
  1: ['claude-3-5-sonnet', 'claude-3-opus', 'gemini-pro'],
  2: ['groq-mixtral', 'groq-llama3', 'groq-gemma'],
  3: ['ollama-qwen3-coder', 'ollama-mistral', 'ollama-llama3'],
};

export default function AgentElizaOSEdit() {
  const { agentId } = useParams();
  const navigate = useNavigate();
  const isNew = agentId === 'new';
  
  const {
    formData,
    isLoading,
    isSaving,
    updateField,
    toggleChannel,
    updateChannelConfig,
    addKnowledgeSource,
    removeKnowledgeSource,
    saveAgent,
    loadAgent,
  } = useAgentForm();

  const [activeTab, setActiveTab] = useState('identity');
  const [documents, setDocuments] = useState<any[]>([]);
  const [previewMessages, setPreviewMessages] = useState<{role: string; content: string}[]>([]);
  const [previewInput, setPreviewInput] = useState('');
  const [isBotRunning, setIsBotRunning] = useState(false);

  useEffect(() => {
    if (!isNew && agentId) {
      loadAgent(agentId);
    }
    loadDocuments();
  }, [agentId]);

  const loadDocuments = async () => {
    const { data } = await supabase.from('rag_documents').select('*').eq('status', 'active');
    if (data) setDocuments(data);
  };

  const handleSave = async () => {
    const success = await saveAgent();
    if (success) {
      navigate('/agents');
    }
  };

  const handleClone = () => {
    const cloned = { ...formData, id: undefined, name: `${formData.name} (Cópia)` };
    toast.success('Agente clonado! Edite e salve.');
    navigate('/agents/new');
  };

  const handleExport = () => {
    const character = {
      id: formData.id || 'new',
      name: formData.name,
      bio: formData.bio,
      lore: formData.lore ? [formData.lore] : [],
      adjectives: formData.adjectives,
      system: formData.system_prompt,
      modelProvider: formData.tier === 1 ? 'anthropic' : formData.tier === 2 ? 'groq' : 'ollama',
      models: modelsByTier[formData.tier],
      plugins: formData.plugins,
      clients: formData.channels.filter(c => c.enabled).map(c => c.type),
      settings: {
        temperature: formData.temperature,
        max_tokens: formData.max_tokens,
        tier: formData.tier,
      },
      knowledge: formData.knowledge_sources.map(id => ({ path: `alexandria:${id}` })),
    };
    
    const blob = new Blob([JSON.stringify(character, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${formData.name || 'agent'}-character.json`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success('Character.json exportado!');
  };

  const handlePreviewSend = async () => {
    if (!previewInput.trim()) return;
    setPreviewMessages(prev => [...prev, { role: 'user', content: previewInput }]);
    setPreviewInput('');
    
    if (!hasAIConfig()) {
      setTimeout(() => {
        setPreviewMessages(prev => [...prev, { 
          role: 'agent', 
          content: `Configure uma API key (Kimi, Groq ou OpenAI) para ver respostas reais no preview.` 
        }]);
      }, 500);
      return;
    }

    try {
      const response = await sendMessageToAI([
        { role: 'system', content: formData.system_prompt || 'Você é um assistente útil.' },
        { role: 'user', content: previewInput },
      ]);

      setPreviewMessages(prev => [...prev, { 
        role: 'agent', 
        content: response.error 
          ? `Erro: ${response.error}` 
          : response.content || 'Sem resposta.'
      }]);
    } catch (err: any) {
      setPreviewMessages(prev => [...prev, { 
        role: 'agent', 
        content: `Erro ao chamar IA: ${err.message}` 
      }]);
    }
  };

  const toggleBot = async () => {
    if (isBotRunning) {
      setIsBotRunning(false);
      toast.success('Bot parado');
    } else {
      setIsBotRunning(true);
      toast.success('Bot iniciado!');
    }
  };

  if (isLoading && !isNew) {
    return (
      <AppLayout>
        <div className="p-8 text-center">
          <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full mx-auto" />
          <p className="mt-4 text-muted-foreground">Carregando agente...</p>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="min-h-screen bg-background">
        <div className="max-w-7xl mx-auto p-6">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 mb-6"
          >
            <div className="flex items-center gap-4">
              <Button variant="outline" size="icon" onClick={() => navigate('/agents')}>
                <ArrowLeft className="w-4 h-4" />
              </Button>
              <div>
                <h1 className="text-2xl font-semibold">
                  {isNew ? 'Novo Agente' : `Editar: ${formData.name || 'Agente'}`}
                </h1>
                <p className="text-sm text-muted-foreground">
                  Configure seu agente elizaOS
                </p>
              </div>
            </div>

            <div className="flex gap-2">
              <Button variant="outline" onClick={handleClone}>
                <Copy className="w-4 h-4 mr-2" />
                Clonar
              </Button>
              <Button variant="outline" onClick={handleExport}>
                <Download className="w-4 h-4 mr-2" />
                Exportar JSON
              </Button>
              <Button 
                variant={isBotRunning ? 'destructive' : 'default'}
                onClick={toggleBot}
              >
                {isBotRunning ? <Pause className="w-4 h-4 mr-2" /> : <Play className="w-4 h-4 mr-2" />}
                {isBotRunning ? 'Parar Bot' : 'Iniciar Bot'}
              </Button>
              <Button onClick={handleSave} disabled={isSaving}>
                <Save className="w-4 h-4 mr-2" />
                {isSaving ? 'Salvando...' : 'Publicar'}
              </Button>
            </div>
          </motion.div>

          {/* Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid grid-cols-6 w-full">
              <TabsTrigger value="identity" className="gap-2">
                <Bot className="w-4 h-4" />
                Identidade
              </TabsTrigger>
              <TabsTrigger value="channels" className="gap-2">
                <MessageSquare className="w-4 h-4" />
                Canais
              </TabsTrigger>
              <TabsTrigger value="brain" className="gap-2">
                <Brain className="w-4 h-4" />
                Cérebro
              </TabsTrigger>
              <TabsTrigger value="alexandria" className="gap-2">
                <BookOpen className="w-4 h-4" />
                Alexandria
              </TabsTrigger>
              <TabsTrigger value="actions" className="gap-2">
                <Zap className="w-4 h-4" />
                Ações
              </TabsTrigger>
              <TabsTrigger value="preview" className="gap-2">
                <Eye className="w-4 h-4" />
                Preview
              </TabsTrigger>
            </TabsList>

            {/* TAB 1: Identidade */}
            <TabsContent value="identity">
              <Card>
                <CardHeader>
                  <CardTitle>Identidade do Agente</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Nome *</Label>
                      <Input
                        value={formData.name}
                        onChange={(e) => updateField('name', e.target.value)}
                        placeholder="ex: LOKI, WANDA, VISU"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Emoji</Label>
                      <Input
                        value={formData.emoji}
                        onChange={(e) => updateField('emoji', e.target.value)}
                        maxLength={2}
                        className="text-2xl w-20"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Bio *</Label>
                    <Textarea
                      value={formData.bio}
                      onChange={(e) => updateField('bio', e.target.value)}
                      placeholder="Descrição breve do agente"
                      rows={2}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Lore (Background)</Label>
                    <Textarea
                      value={formData.lore}
                      onChange={(e) => updateField('lore', e.target.value)}
                      placeholder="História e contexto do agente"
                      rows={3}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Adjetivos (separados por vírgula)</Label>
                    <Input
                      value={formData.adjectives.join(', ')}
                      onChange={(e) => updateField('adjectives', e.target.value.split(',').map(s => s.trim()).filter(Boolean))}
                      placeholder="ex: criativo, analítico, direto"
                    />
                    <div className="flex gap-2 flex-wrap">
                      {formData.adjectives.map((adj, i) => (
                        <Badge key={i} variant="secondary">{adj}</Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* TAB 2: Canais */}
            <TabsContent value="channels">
              <Card>
                <CardHeader>
                  <CardTitle>Canais de Comunicação</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Telegram */}
                  <div className="border rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center text-white">
                          <MessageSquare className="w-5 h-5" />
                        </div>
                        <div>
                          <h3 className="font-medium">Telegram</h3>
                          <p className="text-sm text-muted-foreground">Bot do Telegram</p>
                        </div>
                      </div>
                      <Switch
                        checked={formData.channels.find(c => c.type === 'telegram')?.enabled}
                        onCheckedChange={(checked) => toggleChannel('telegram', checked)}
                      />
                    </div>
                    {formData.channels.find(c => c.type === 'telegram')?.enabled && (
                      <div className="mt-4 space-y-2">
                        <Label>Bot Token</Label>
                        <Input
                          type="password"
                          value={formData.channels.find(c => c.type === 'telegram')?.config.token || ''}
                          onChange={(e) => updateChannelConfig('telegram', { token: e.target.value })}
                          placeholder="123456:ABCxyz..."
                        />
                        <p className="text-xs text-muted-foreground">
                          Obtenha o token com @BotFather no Telegram
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Discord */}
                  <div className="border rounded-lg p-4 opacity-60">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-indigo-500 rounded-lg flex items-center justify-center text-white">
                          <MessageSquare className="w-5 h-5" />
                        </div>
                        <div>
                          <h3 className="font-medium">Discord</h3>
                          <p className="text-sm text-muted-foreground">Bot do Discord (V2)</p>
                        </div>
                      </div>
                      <Switch disabled />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* TAB 3: Cérebro */}
            <TabsContent value="brain">
              <Card>
                <CardHeader>
                  <CardTitle>Configuração do Cérebro</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Tier Selection */}
                  <div className="space-y-2">
                    <Label>Tier</Label>
                    <div className="grid grid-cols-3 gap-3">
                      {tiers.map((tier) => (
                        <button
                          key={tier.value}
                          onClick={() => updateField('tier', tier.value)}
                          className={`p-4 rounded-lg border text-left transition-all ${
                            formData.tier === tier.value
                              ? 'border-primary bg-primary/10'
                              : 'border-border hover:border-primary/50'
                          }`}
                        >
                          <div className={`w-3 h-3 rounded-full ${tier.color} mb-2`} />
                          <div className="font-medium">{tier.label}</div>
                          <div className="text-xs text-muted-foreground">{tier.desc}</div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Model Override */}
                  <div className="space-y-2">
                    <Label>Modelo (opcional)</Label>
                    <select
                      value={formData.model_override || ''}
                      onChange={(e) => updateField('model_override', e.target.value)}
                      className="w-full p-2 border rounded-md bg-background"
                    >
                      <option value="">Padrão do Tier</option>
                      {modelsByTier[formData.tier].map(model => (
                        <option key={model} value={model}>{model}</option>
                      ))}
                    </select>
                  </div>

                  {/* Temperature */}
                  <div className="space-y-2">
                    <Label>Temperature: {formData.temperature}</Label>
                    <Slider
                      value={[formData.temperature]}
                      onValueChange={(value) => updateField('temperature', value[0])}
                      min={0}
                      max={1}
                      step={0.1}
                    />
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>Preciso</span>
                      <span>Criativo</span>
                    </div>
                  </div>

                  {/* Max Tokens */}
                  <div className="space-y-2">
                    <Label>Max Tokens</Label>
                    <Input
                      type="number"
                      value={formData.max_tokens}
                      onChange={(e) => updateField('max_tokens', parseInt(e.target.value))}
                      min={100}
                      max={8000}
                    />
                  </div>

                  {/* System Prompt */}
                  <div className="space-y-2">
                    <Label>System Prompt *</Label>
                    <Textarea
                      value={formData.system_prompt}
                      onChange={(e) => updateField('system_prompt', e.target.value)}
                      placeholder="Você é um agente especializado em..."
                      rows={10}
                      className="font-mono text-sm"
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* TAB 4: Alexandria */}
            <TabsContent value="alexandria">
              <Card>
                <CardHeader>
                  <CardTitle>Alexandria Intelligence</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* RAG Mode */}
                  <div className="space-y-2">
                    <Label>Modo de Acesso</Label>
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        onClick={() => updateField('rag_mode', 'static')}
                        className={`p-4 rounded-lg border text-left transition-all ${
                          formData.rag_mode === 'static'
                            ? 'border-primary bg-primary/10'
                            : 'border-border'
                        }`}
                      >
                        <div className="font-medium">Cache Estático</div>
                        <div className="text-xs text-muted-foreground">MVP - Documentos carregados uma vez</div>
                      </button>
                      <button
                        disabled
                        className="p-4 rounded-lg border text-left opacity-50 cursor-not-allowed"
                      >
                        <div className="font-medium">RAG Dinâmico</div>
                        <div className="text-xs text-muted-foreground">V2 - Busca em tempo real</div>
                      </button>
                    </div>
                  </div>

                  {/* Documents List */}
                  <div className="space-y-2">
                    <Label>Documentos Disponíveis</Label>
                    <div className="border rounded-lg divide-y">
                      {documents.length === 0 ? (
                        <div className="p-4 text-center text-muted-foreground">
                          Nenhum documento disponível
                        </div>
                      ) : (
                        documents.map((doc) => (
                          <label key={doc.id} className="flex items-center gap-3 p-3 hover:bg-muted cursor-pointer">
                            <input
                              type="checkbox"
                              checked={formData.knowledge_sources.includes(doc.id)}
                              onChange={(e) => {
                                if (e.target.checked) addKnowledgeSource(doc.id);
                                else removeKnowledgeSource(doc.id);
                              }}
                              className="w-4 h-4"
                            />
                            <div className="flex-1">
                              <div className="font-medium">{doc.title}</div>
                              <div className="text-xs text-muted-foreground">{doc.source}</div>
                            </div>
                          </label>
                        ))
                      )}
                    </div>
                  </div>

                  {/* Preview */}
                  <div className="bg-muted p-4 rounded-lg">
                    <Label>Preview do Contexto</Label>
                    <pre className="mt-2 text-xs text-muted-foreground overflow-auto max-h-40">
                      {formData.knowledge_sources.length === 0 
                        ? 'Nenhum documento selecionado'
                        : `Documentos selecionados:\n${formData.knowledge_sources.map(id => {
                          const doc = documents.find(d => d.id === id);
                          return doc ? `  • ${doc.title}` : `  • ${id}`;
                        }).join('\n')}`
                      }
                    </pre>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* TAB 5: Ações */}
            <TabsContent value="actions">
              <Card>
                <CardHeader>
                  <CardTitle>Ações & Skills</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-12">
                    <Zap className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                    <h3 className="text-lg font-medium mb-2">Recursos de Ações</h3>
                    <p className="text-muted-foreground max-w-md mx-auto">
                      Na V2, o agente poderá executar workflows, skills e integrações.
                      Por enquanto, o agente pode:
                    </p>
                    <ul className="text-left max-w-md mx-auto mt-4 space-y-2 text-sm">
                      <li className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
                        Responder mensagens no Telegram
                      </li>
                      <li className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
                        Usar Alexandria como contexto
                      </li>
                      <li className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
                        Exportar character.json
                      </li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* TAB 6: Preview */}
            <TabsContent value="preview">
              <Card>
                <CardHeader>
                  <CardTitle>Preview em Tempo Real</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="border rounded-lg">
                    {/* Messages */}
                    <div className="h-96 overflow-y-auto p-4 space-y-4 bg-muted/30">
                      {previewMessages.length === 0 ? (
                        <div className="text-center text-muted-foreground py-12">
                          <Bot className="w-12 h-12 mx-auto mb-2" />
                          <p>Envie uma mensagem para testar o agente</p>
                          <p className="text-xs mt-1">O preview usa o system prompt configurado</p>
                        </div>
                      ) : (
                        previewMessages.map((msg, i) => (
                          <div
                            key={i}
                            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                          >
                            <div
                              className={`max-w-[80%] px-4 py-2 rounded-lg ${
                                msg.role === 'user'
                                  ? 'bg-primary text-primary-foreground'
                                  : 'bg-muted'
                              }`}
                            >
                              {msg.content}
                            </div>
                          </div>
                        ))
                      )}
                    </div>

                    {/* Input */}
                    <div className="p-4 border-t flex gap-2">
                      <Input
                        value={previewInput}
                        onChange={(e) => setPreviewInput(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handlePreviewSend()}
                        placeholder="Digite uma mensagem..."
                      />
                      <Button onClick={handlePreviewSend}>
                        <Send className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </AppLayout>
  );
}
