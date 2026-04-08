// src/components/agents/SkillsManager.tsx
import React, { useState } from 'react';
import { AgentConfig, Skill } from '@/types/agents';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, Trash2, Plus, GripVertical } from 'lucide-react';

interface SkillsManagerProps {
  agentId: string;
  config: AgentConfig;
  allSkills: Skill[];
  onAdd: (skillId: string) => Promise<void>;
  onRemove: (skillId: string) => Promise<void>;
  onReorder: (skillIds: string[]) => Promise<void>;
}

export const SkillsManager: React.FC<SkillsManagerProps> = ({
  agentId,
  config,
  allSkills,
  onAdd,
  onRemove,
  onReorder,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [draggedId, setDraggedId] = useState<string | null>(null);

  const currentSkills = config.skills || [];
  const availableSkills = allSkills.filter(
    skill => !currentSkills.some(cs => cs.skill_id === skill.id)
  );

  const handleRemove = async (skillId: string) => {
    setIsLoading(true);
    try {
      await onRemove(skillId);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAdd = async (skillId: string) => {
    setIsLoading(true);
    try {
      await onAdd(skillId);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDragStart = (skillId: string) => {
    setDraggedId(skillId);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (targetId: string) => {
    if (!draggedId || draggedId === targetId) return;

    const newOrder = currentSkills.map(s => s.skill_id);
    const draggedIndex = newOrder.indexOf(draggedId);
    const targetIndex = newOrder.indexOf(targetId);

    if (draggedIndex !== -1 && targetIndex !== -1) {
      [newOrder[draggedIndex], newOrder[targetIndex]] = [newOrder[targetIndex], newOrder[draggedIndex]];
      onReorder(newOrder);
    }
    setDraggedId(null);
  };

  return (
    <div className="space-y-4">
      {/* Current Skills */}
      <div>
        <h3 className="font-semibold mb-3">Skills Ativas ({currentSkills.length})</h3>
        <div className="space-y-2">
          {currentSkills.length === 0 ? (
            <p className="text-sm text-muted-foreground p-4 bg-muted rounded-md">
              Nenhuma skill adicionada
            </p>
          ) : (
            currentSkills.map((skill) => (
              <Card
                key={skill.skill_id}
                className="p-3 flex items-center gap-3 cursor-move hover:shadow-md transition-shadow"
                draggable
                onDragStart={() => handleDragStart(skill.skill_id)}
                onDragOver={handleDragOver}
                onDrop={() => handleDrop(skill.skill_id)}
              >
                <GripVertical className="h-4 w-4 text-muted-foreground" />
                <div className="flex-1">
                  <p className="font-semibold text-sm">{skill.skill_id}</p>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleRemove(skill.skill_id)}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Trash2 className="h-4 w-4 text-destructive" />
                  )}
                </Button>
              </Card>
            ))
          )}
        </div>
      </div>

      {/* Available Skills */}
      {availableSkills.length > 0 && (
        <div>
          <h3 className="font-semibold mb-3">Adicionar Skills</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {availableSkills.map((skill) => (
              <Button
                key={skill.id}
                variant="outline"
                className="justify-start"
                onClick={() => handleAdd(skill.id)}
                disabled={isLoading}
              >
                <Plus className="h-4 w-4 mr-2" />
                {skill.name}
              </Button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default SkillsManager;
