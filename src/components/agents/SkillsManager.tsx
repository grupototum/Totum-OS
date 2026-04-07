import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  getSkillById, 
  listSkills,
  calculateSkillsCost,
  estimateSkillsDuration 
} from '@/services/skillsService';
import type { Skill, AgentSkillConfig } from '@/types/agents';
import { 
  GripVertical, 
  X, 
  Plus, 
  Search,
  Clock,
  Coins,
  Zap
} from 'lucide-react';

interface SkillsManagerProps {
  agentId: string;
  currentSkills: AgentSkillConfig[];
  onSkillsChange: (skills: AgentSkillConfig[]) => void;
}

export function SkillsManager({ 
  agentId, 
  currentSkills, 
  onSkillsChange 
}: SkillsManagerProps) {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

  // Load full skill data for current skills
  const skillsWithData = currentSkills
    .map((s) => ({
      ...s,
      skill: getSkillById(s.skill_id),
    }))
    .filter((s) => s.skill !== undefined)
    .sort((a, b) => a.position - b.position);

  // Available skills to add (not already in agent)
  const availableSkills = listSkills({ status: 'active' }).filter(
    (skill) => !currentSkills.some((s) => s.skill_id === skill.id)
  );

  const filteredAvailable = availableSkills.filter(
    (skill) =>
      skill.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      skill.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      skill.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAddSkill = (skillId: string) => {
    const newSkills = [
      ...currentSkills,
      { skill_id: skillId, position: currentSkills.length },
    ];
    onSkillsChange(newSkills);
    setIsAddDialogOpen(false);
  };

  const handleRemoveSkill = (skillId: string) => {
    const newSkills = currentSkills
      .filter((s) => s.skill_id !== skillId)
      .map((s, index) => ({ ...s, position: index }));
    onSkillsChange(newSkills);
  };

  const handleDragStart = (index: number) => {
    setDraggedIndex(index);
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === index) return;

    const newSkills = [...currentSkills];
    const draggedItem = newSkills[draggedIndex];
    newSkills.splice(draggedIndex, 1);
    newSkills.splice(index, 0, draggedItem);

    // Update positions
    const reordered = newSkills.map((s, idx) => ({
      ...s,
      position: idx,
    }));

    onSkillsChange(reordered);
    setDraggedIndex(index);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
  };

  const skillIds = skillsWithData.map((s) => s.skill_id);
  const totalCost = calculateSkillsCost(skillIds);
  const estimatedDuration = estimateSkillsDuration(skillIds);

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      content: 'bg-blue-100 text-blue-800',
      research: 'bg-green-100 text-green-800',
      image: 'bg-purple-100 text-purple-800',
      validation: 'bg-orange-100 text-orange-800',
      automation: 'bg-gray-100 text-gray-800',
      analytics: 'bg-pink-100 text-pink-800',
    };
    return colors[category] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="space-y-4">
      {/* Summary */}
      <div className="flex items-center justify-between rounded-lg border p-4">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <Zap className="h-4 w-4 text-yellow-500" />
            <span className="text-sm font-medium">
              {skillsWithData.length} skills
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Coins className="h-4 w-4 text-green-500" />
            <span className="text-sm font-medium">
              R$ {totalCost.toFixed(2)} / exec
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-blue-500" />
            <span className="text-sm font-medium">
              ~{Math.round(estimatedDuration / 1000)}s
            </span>
          </div>
        </div>

        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button size="sm">
              <Plus className="h-4 w-4 mr-1" />
              Adicionar Skill
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[80vh]">
            <DialogHeader>
              <DialogTitle>Adicionar Skill</DialogTitle>
            </DialogHeader>
            
            <div className="space-y-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar skills..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>

              <ScrollArea className="h-[400px]">
                <div className="space-y-2">
                  {filteredAvailable.length === 0 ? (
                    <p className="text-center text-muted-foreground py-8">
                      Nenhuma skill encontrada
                    </p>
                  ) : (
                    filteredAvailable.map((skill) => (
                      <Card
                        key={skill.id}
                        className="cursor-pointer hover:border-primary transition-colors"
                        onClick={() => handleAddSkill(skill.id)}
                      >
                        <CardContent className="p-4">
                          <div className="flex items-start gap-3">
                            <span className="text-2xl">{skill.emoji}</span>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2">
                                <span className="font-medium">{skill.name}</span>
                                <Badge 
                                  variant="secondary" 
                                  className={`text-xs ${getCategoryColor(skill.category)}`}
                                >
                                  {skill.category}
                                </Badge>
                              </div>
                              <p className="text-sm text-muted-foreground mt-1">
                                {skill.description}
                              </p>
                              <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                                <span>R$ {skill.cost_per_call.toFixed(2)}</span>
                                <span>{(skill.success_rate * 100).toFixed(0)}% sucesso</span>
                                <span>~{Math.round(skill.estimated_duration_ms / 1000)}s</span>
                              </div>
                            </div>
                            <Plus className="h-5 w-5 text-muted-foreground" />
                          </div>
                        </CardContent>
                      </Card>
                    ))
                  )}
                </div>
              </ScrollArea>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Skills List */}
      {skillsWithData.length === 0 ? (
        <div className="rounded-lg border border-dashed p-8 text-center">
          <p className="text-muted-foreground">
            Nenhuma skill configurada
          </p>
          <p className="text-sm text-muted-foreground mt-1">
            Clique em "Adicionar Skill" para começar
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {skillsWithData.map((item, index) => {
            const skill = item.skill!;
            return (
              <Card
                key={skill.id}
                draggable
                onDragStart={() => handleDragStart(index)}
                onDragOver={(e) => handleDragOver(e, index)}
                onDragEnd={handleDragEnd}
                className={`cursor-move transition-all ${
                  draggedIndex === index ? 'opacity-50' : ''
                }`}
              >
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <GripVertical className="h-5 w-5 text-muted-foreground" />
                    
                    <span className="text-xl">{skill.emoji}</span>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{skill.name}</span>
                        <Badge 
                          variant="secondary" 
                          className={`text-xs ${getCategoryColor(skill.category)}`}
                        >
                          {skill.category}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground truncate">
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

                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-muted-foreground hover:text-destructive"
                      onClick={() => handleRemoveSkill(skill.id)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      <p className="text-xs text-muted-foreground">
        Arraste os cards para reordenar a execução das skills. 
        A ordem afeta como o agente processa as tarefas.
      </p>
    </div>
  );
}
