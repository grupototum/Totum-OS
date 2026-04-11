// src/components/agents/AgentConfigPanel.tsx
import React, { useState } from 'react';
import { AgentConfig } from '@/types/agents';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Loader2, Save, X } from 'lucide-react';

interface AgentConfigPanelProps {
  agentId: string;
  config: AgentConfig;
  onSave: (config: Partial<AgentConfig>) => Promise<void>;
  onClose: () => void;
}

export const AgentConfigPanel: React.FC<AgentConfigPanelProps> = ({
  agentId,
  config,
  onSave,
  onClose,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: config.name,
    emoji: config.emoji,
    system_prompt: config.system_prompt,
  });

  const handleSave = async () => {
    setIsLoading(true);
    try {
      await onSave(formData);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">Configurar {config.emoji} {config.name}</h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Form */}
        <div className="space-y-6">
          {/* Nome */}
          <div>
            <label className="block text-sm font-semibold mb-2">Nome do Agente</label>
            <Input
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              placeholder="Ex: WANDA - Social Planner"
            />
          </div>

          {/* Emoji */}
          <div>
            <label className="block text-sm font-semibold mb-2">Emoji</label>
            <Input
              value={formData.emoji}
              onChange={(e) => setFormData(prev => ({ ...prev, emoji: e.target.value }))}
              placeholder="Ex: 🔴"
              maxLength={2}
              className="max-w-[100px]"
            />
          </div>

          {/* System Prompt */}
          <div>
            <label className="block text-sm font-semibold mb-2">System Prompt</label>
            <textarea
              value={formData.system_prompt}
              onChange={(e) => setFormData(prev => ({ ...prev, system_prompt: e.target.value }))}
              placeholder="Descrição do comportamento do agente..."
              className="w-full h-40 p-3 border rounded-md font-mono text-sm"
            />
          </div>

          {/* Metadata */}
          <div>
            <label className="block text-sm font-semibold mb-2">Informações</label>
            <div className="grid grid-cols-2 gap-4 p-4 bg-muted rounded-md">
              <div>
                <p className="text-xs text-muted-foreground">Tier</p>
                <p className="font-semibold">{config.tier}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Status</p>
                <p className="font-semibold capitalize">{config.status}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Skills</p>
                <p className="font-semibold">{config.skills?.length || 0}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Criado em</p>
                <p className="font-semibold text-xs">
                  {new Date(config.created_at).toLocaleDateString('pt-BR')}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3 mt-8">
          <Button variant="outline" onClick={onClose} disabled={isLoading}>
            Cancelar
          </Button>
          <Button onClick={handleSave} disabled={isLoading} className="gap-2">
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Salvando...
              </>
            ) : (
              <>
                <Save className="h-4 w-4" />
                Salvar Alterações
              </>
            )}
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default AgentConfigPanel;
