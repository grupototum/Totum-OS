import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { AgentAdapter } from '@/lib/agents/adapter';

export interface ChannelConfig {
  type: 'telegram' | 'discord' | 'twitter' | 'whatsapp' | 'email';
  enabled: boolean;
  config: {
    token?: string;
    [key: string]: any;
  };
}

export interface AgentFormData {
  id?: string;
  name: string;
  bio: string;
  emoji: string;
  lore: string;
  adjectives: string[];
  system_prompt: string;
  tier: 1 | 2 | 3;
  temperature: number;
  max_tokens: number;
  channels: ChannelConfig[];
  knowledge_sources: string[];
  rag_mode: 'static' | 'dynamic';
  plugins: string[];
}

const defaultFormData: AgentFormData = {
  name: '',
  bio: '',
  emoji: '🤖',
  lore: '',
  adjectives: [],
  system_prompt: '',
  tier: 2,
  temperature: 0.7,
  max_tokens: 2000,
  channels: [
    { type: 'telegram', enabled: false, config: {} },
    { type: 'discord', enabled: false, config: {} },
  ],
  knowledge_sources: [],
  rag_mode: 'static',
  plugins: ['@elizaos/plugin-bootstrap'],
};

export const useAgentForm = (initialData?: Partial<AgentFormData>) => {
  const [formData, setFormData] = useState<AgentFormData>({
    ...defaultFormData,
    ...initialData,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const updateField = <K extends keyof AgentFormData>(
    field: K,
    value: AgentFormData[K]
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const updateChannel = (type: ChannelConfig['type'], updates: Partial<ChannelConfig>) => {
    setFormData((prev) => ({
      ...prev,
      channels: prev.channels.map((ch) =>
        ch.type === type ? { ...ch, ...updates } : ch
      ),
    }));
  };

  const toggleChannel = (type: ChannelConfig['type'], enabled: boolean) => {
    updateChannel(type, { enabled });
  };

  const updateChannelConfig = (type: ChannelConfig['type'], config: Record<string, any>) => {
    updateChannel(type, { config });
  };

  const addKnowledgeSource = (docId: string) => {
    setFormData((prev) => ({
      ...prev,
      knowledge_sources: [...prev.knowledge_sources, docId],
    }));
  };

  const removeKnowledgeSource = (docId: string) => {
    setFormData((prev) => ({
      ...prev,
      knowledge_sources: prev.knowledge_sources.filter((id) => id !== docId),
    }));
  };

  const saveAgent = async (): Promise<boolean> => {
    if (!formData.name || !formData.bio || !formData.system_prompt) {
      toast.error('Preencha todos os campos obrigatórios: Nome, Bio e System Prompt');
      return false;
    }

    const hasEnabledChannel = formData.channels.some((ch) => ch.enabled);
    if (!hasEnabledChannel) {
      toast.error('Selecione pelo menos um canal (Telegram)');
      return false;
    }

    setIsSaving(true);

    try {
      const agentPayload = {
        agent_id: AgentAdapter.generateAgentId(formData.name),
        name: formData.name,
        bio: formData.bio,
        emoji: formData.emoji,
        lore: formData.lore,
        adjectives: formData.adjectives,
        system_prompt: formData.system_prompt,
        tier: formData.tier,
        temperature: formData.temperature,
        max_tokens: formData.max_tokens,
        knowledge_enabled: formData.knowledge_sources.length > 0,
        knowledge_sources: formData.knowledge_sources,
        rag_mode: formData.rag_mode,
        plugins: formData.plugins,
        status: 'offline',
      };

      let agentId = formData.id;

      if (formData.id) {
        // Update existing
        const { error } = await supabase
          .from('agents_config')
          .update(agentPayload)
          .eq('id', formData.id);

        if (error) throw error;
      } else {
        // Create new
        const { data, error } = await supabase
          .from('agents_config')
          .insert(agentPayload)
          .select('id')
          .single();

        if (error) throw error;
        agentId = data.id;
      }

      // Save channels
      if (agentId) {
        const { error: deleteError } = await supabase
          .from('agent_channels')
          .delete()
          .eq('agent_id', agentId);

        if (deleteError) throw deleteError;

        const enabledChannels = formData.channels.filter((ch) => ch.enabled);
        if (enabledChannels.length > 0) {
          const { error: channelsError } = await supabase
            .from('agent_channels')
            .insert(
              enabledChannels.map((ch) => ({
                agent_id: agentId,
                channel_type: ch.type,
                is_enabled: ch.enabled,
                config: ch.config,
              }))
            );

          if (channelsError) throw channelsError;
        }

        // Save knowledge access
        const { error: knowledgeDeleteError } = await supabase
          .from('agent_knowledge_access')
          .delete()
          .eq('agent_id', agentId);

        if (knowledgeDeleteError) throw knowledgeDeleteError;

        if (formData.knowledge_sources.length > 0) {
          const { error: knowledgeError } = await supabase
            .from('agent_knowledge_access')
            .insert(
              formData.knowledge_sources.map((docId) => ({
                agent_id: agentId,
                document_id: docId,
                access_level: 'read',
              }))
            );

          if (knowledgeError) throw knowledgeError;
        }
      }

      toast.success(formData.id ? 'Agente atualizado!' : 'Agente criado!');
      return true;
    } catch (error: any) {
      console.error('Erro ao salvar agente:', error);
      toast.error('Erro ao salvar agente: ' + error.message);
      return false;
    } finally {
      setIsSaving(false);
    }
  };

  const loadAgent = async (id: string) => {
    setIsLoading(true);
    try {
      const { data: agent, error } = await supabase
        .from('agents_config')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;

      const { data: channels } = await supabase
        .from('agent_channels')
        .select('*')
        .eq('agent_id', id);

      const { data: knowledgeAccess } = await supabase
        .from('agent_knowledge_access')
        .select('document_id')
        .eq('agent_id', id);

      setFormData({
        id: agent.id,
        name: agent.name,
        bio: agent.bio,
        emoji: agent.emoji || '🤖',
        lore: agent.lore || '',
        adjectives: agent.adjectives || [],
        system_prompt: agent.system_prompt,
        tier: agent.tier as 1 | 2 | 3,
        temperature: agent.temperature || 0.7,
        max_tokens: agent.max_tokens || 2000,
        channels: [
          {
            type: 'telegram',
            enabled: channels?.some((c) => c.channel_type === 'telegram') || false,
            config: channels?.find((c) => c.channel_type === 'telegram')?.config || {},
          },
          {
            type: 'discord',
            enabled: channels?.some((c) => c.channel_type === 'discord') || false,
            config: channels?.find((c) => c.channel_type === 'discord')?.config || {},
          },
        ],
        knowledge_sources: knowledgeAccess?.map((k) => k.document_id) || [],
        rag_mode: (agent.rag_mode as 'static' | 'dynamic') || 'static',
        plugins: agent.plugins || ['@elizaos/plugin-bootstrap'],
      });
    } catch (error: any) {
      console.error('Erro ao carregar agente:', error);
      toast.error('Erro ao carregar agente');
    } finally {
      setIsLoading(false);
    }
  };

  return {
    formData,
    isLoading,
    isSaving,
    updateField,
    updateChannel,
    toggleChannel,
    updateChannelConfig,
    addKnowledgeSource,
    removeKnowledgeSource,
    saveAgent,
    loadAgent,
    setFormData,
  };
};
