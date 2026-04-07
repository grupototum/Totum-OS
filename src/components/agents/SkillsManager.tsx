import { useState } from 'react';
import { motion, Reorder } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Icon } from '@iconify/react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export interface Skill {
  id: string;
  name: string;
  emoji: string;
  category: string;
  cost: number;
  successRate: number;
  description?: string;
  agentId?: string;
}

interface SkillsManagerProps {
  agentId: string;
  currentSkills?: Skill[];
  onSkillsChange?: (skills: Skill[]) => void;
}

const skillCategories = [
  { value: 'communication', label: 'Comunicação', color: 'bg-blue-100 text-blue-700 border-blue-300' },
  { value: 'data', label: 'Dados', color: 'bg-purple-100 text-purple-700 border-purple-300' },
  { value: 'automation', label: 'Automação', color: 'bg-orange-100 text-orange-700 border-orange-300' },
  { value: 'analytics', label: 'Analytics', color: 'bg-green-100 text-green-700 border-green-300' },
  { value: 'integration', label: 'Integração', color: 'bg-pink-100 text-pink-700 border-pink-300' },
  { value: 'security', label: 'Segurança', color: 'bg-red-100 text-red-700 border-red-300' },
];

const mockSkills: Skill[] = [
  {
    id: 'skill-001',
    name: 'Enviar Email',
    emoji: '📧',
    category: 'communication',
    cost: 0.1,
    successRate: 98.5,
    description: 'Envia emails para contatos especificados',
  },
  {
    id: 'skill-002',
    name: 'Processar Dados',
    emoji: '📊',
    category: 'data',
    cost: 0.3,
    successRate: 95.2,
    description: 'Processa e analisa conjuntos de dados',
  },
  {
    id: 'skill-003',
    name: 'Integração API',
    emoji: '🔗',
    category: 'integration',
    cost: 0.5,
    successRate: 92.1,
    description: 'Integra com APIs de terceiros',
  },
];

export function SkillsManager({
  agentId,
  currentSkills = mockSkills,
  onSkillsChange,
}: SkillsManagerProps) {
  const [skills, setSkills] = useState<Skill[]>(currentSkills);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newSkill, setNewSkill] = useState<Partial<Skill>>({
    name: '',
    emoji: '🔧',
    category: 'automation',
    cost: 0,
    successRate: 100,
  });

  const getCategoryColor = (categoryId: string) => {
    const cat = skillCategories.find((c) => c.value === categoryId);
    return cat?.color || 'bg-stone-100 text-stone-700 border-stone-300';
  };

  const getCategoryLabel = (categoryId: string) => {
    const cat = skillCategories.find((c) => c.value === categoryId);
    return cat?.label || categoryId;
  };

  const handleRemoveSkill = (skillId: string) => {
    const updatedSkills = skills.filter((s) => s.id !== skillId);
    setSkills(updatedSkills);
    if (onSkillsChange) {
      onSkillsChange(updatedSkills);
    }
  };

  const handleAddSkill = () => {
    if (!newSkill.name) return;

    const skill: Skill = {
      id: `skill-${Date.now()}`,
      name: newSkill.name || 'Nova Skill',
      emoji: newSkill.emoji || '🔧',
      category: newSkill.category || 'automation',
      cost: newSkill.cost || 0,
      successRate: newSkill.successRate || 100,
      description: newSkill.description,
      agentId,
    };

    const updatedSkills = [...skills, skill];
    setSkills(updatedSkills);
    if (onSkillsChange) {
      onSkillsChange(updatedSkills);
    }

    setNewSkill({
      name: '',
      emoji: '🔧',
      category: 'automation',
      cost: 0,
      successRate: 100,
    });
    setIsDialogOpen(false);
  };

  const handleReorder = (newOrder: Skill[]) => {
    setSkills(newOrder);
    if (onSkillsChange) {
      onSkillsChange(newOrder);
    }
  };

  const totalCost = skills.reduce((sum, skill) => sum + skill.cost, 0);
  const avgSuccessRate =
    skills.length > 0
      ? (skills.reduce((sum, skill) => sum + skill.successRate, 0) / skills.length).toFixed(1)
      : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
    >
      <Card className="border-stone-300 bg-[#EAEAE5]">
        <CardHeader className="border-b border-stone-300">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Icon icon="mdi:puzzle-multiple" className="w-5 h-5" />
                Gerenciador de Skills
              </CardTitle>
              <p className="text-sm text-stone-500 mt-1">
                Agente: <span className="font-mono">{agentId}</span>
              </p>
            </div>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-stone-900 hover:bg-stone-800 text-white">
                  <Icon icon="mdi:plus" className="w-4 h-4 mr-2" />
                  Adicionar Skill
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-[#EAEAE5] border-stone-300">
                <DialogHeader>
                  <DialogTitle className="text-stone-900">Adicionar Nova Skill</DialogTitle>
                  <DialogDescription className="text-stone-600">
                    Configure os detalhes da nova skill
                  </DialogDescription>
                </DialogHeader>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-stone-700">Nome</label>
                    <Input
                      value={newSkill.name || ''}
                      onChange={(e) => setNewSkill({ ...newSkill, name: e.target.value })}
                      placeholder="Ex: Enviar Notificação"
                      className="bg-white border-stone-300"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-stone-700">Emoji</label>
                    <Input
                      value={newSkill.emoji || ''}
                      onChange={(e) => setNewSkill({ ...newSkill, emoji: e.target.value })}
                      placeholder="🔧"
                      maxLength={2}
                      className="bg-white border-stone-300 text-center text-2xl"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-stone-700">Categoria</label>
                    <Select
                      value={newSkill.category}
                      onValueChange={(value) =>
                        setNewSkill({ ...newSkill, category: value })
                      }
                    >
                      <SelectTrigger className="bg-white border-stone-300">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {skillCategories.map((cat) => (
                          <SelectItem key={cat.value} value={cat.value}>
                            {cat.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-stone-700">Custo (créditos)</label>
                    <Input
                      type="number"
                      value={newSkill.cost || 0}
                      onChange={(e) =>
                        setNewSkill({ ...newSkill, cost: parseFloat(e.target.value) })
                      }
                      placeholder="0.00"
                      step="0.01"
                      className="bg-white border-stone-300"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-stone-700">Taxa de Sucesso (%)</label>
                    <Input
                      type="number"
                      value={newSkill.successRate || 100}
                      onChange={(e) =>
                        setNewSkill({ ...newSkill, successRate: parseFloat(e.target.value) })
                      }
                      placeholder="100"
                      min="0"
                      max="100"
                      step="0.1"
                      className="bg-white border-stone-300"
                    />
                  </div>

                  <div className="flex gap-2 pt-4">
                    <Button
                      onClick={() => setIsDialogOpen(false)}
                      variant="outline"
                      className="flex-1 border-stone-300"
                    >
                      Cancelar
                    </Button>
                    <Button
                      onClick={handleAddSkill}
                      className="flex-1 bg-stone-900 hover:bg-stone-800 text-white"
                    >
                      Adicionar
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>

        <CardContent className="pt-6">
          {/* Stats */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="rounded-lg bg-stone-100 p-4 border border-stone-300">
              <p className="text-[10px] uppercase tracking-widest text-stone-500 mb-1">
                Total de Skills
              </p>
              <p className="text-2xl font-medium text-stone-900">{skills.length}</p>
            </div>
            <div className="rounded-lg bg-stone-100 p-4 border border-stone-300">
              <p className="text-[10px] uppercase tracking-widest text-stone-500 mb-1">
                Custo Total
              </p>
              <p className="text-2xl font-medium text-stone-900">{totalCost.toFixed(2)}</p>
            </div>
            <div className="rounded-lg bg-stone-100 p-4 border border-stone-300">
              <p className="text-[10px] uppercase tracking-widest text-stone-500 mb-1">
                Taxa de Sucesso
              </p>
              <p className="text-2xl font-medium text-emerald-600">{avgSuccessRate}%</p>
            </div>
            <div className="rounded-lg bg-stone-100 p-4 border border-stone-300">
              <p className="text-[10px] uppercase tracking-widest text-stone-500 mb-1">
                Categoria Principal
              </p>
              <p className="text-lg font-medium text-stone-700">
                {skills.length > 0
                  ? getCategoryLabel(skills[0].category)
                  : 'Nenhuma'}
              </p>
            </div>
          </div>

          {/* Skills List */}
          {skills.length > 0 ? (
            <Reorder.Group
              axis="y"
              values={skills}
              onReorder={handleReorder}
              className="space-y-3"
            >
              {skills.map((skill, index) => (
                <Reorder.Item key={skill.id} value={skill}>
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ delay: index * 0.05 }}
                    className="group cursor-grab active:cursor-grabbing bg-white border border-stone-300 rounded-lg p-4 hover:shadow-md transition-all"
                  >
                    <div className="flex items-start gap-4">
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        <Icon
                          icon="mdi:drag"
                          className="w-5 h-5 text-stone-400 opacity-0 group-hover:opacity-100 transition-opacity"
                        />
                        <div className="text-3xl">{skill.emoji}</div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-medium text-stone-900 truncate">{skill.name}</h3>
                          <div className="flex flex-wrap gap-2 mt-1">
                            <Badge
                              variant="outline"
                              className={`${getCategoryColor(skill.category)} text-[10px]`}
                            >
                              {getCategoryLabel(skill.category)}
                            </Badge>
                            <Badge variant="outline" className="border-stone-300 text-[10px]">
                              💰 {skill.cost.toFixed(2)}
                            </Badge>
                            <Badge
                              variant="outline"
                              className={`text-[10px] ${
                                skill.successRate >= 95
                                  ? 'border-emerald-300 bg-emerald-50'
                                  : 'border-stone-300'
                              }`}
                            >
                              ✓ {skill.successRate.toFixed(1)}%
                            </Badge>
                          </div>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemoveSkill(skill.id)}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <Icon icon="mdi:close" className="w-5 h-5" />
                      </Button>
                    </div>
                    {skill.description && (
                      <p className="text-xs text-stone-500 mt-3 pl-11">{skill.description}</p>
                    )}
                  </motion.div>
                </Reorder.Item>
              ))}
            </Reorder.Group>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-center rounded-lg bg-stone-50 border border-stone-300">
              <Icon icon="mdi:puzzle-outline" className="w-12 h-12 text-stone-300 mb-3" />
              <p className="text-stone-600 font-medium mb-2">Nenhuma skill adicionada</p>
              <p className="text-xs text-stone-500 mb-4">
                Adicione skills para expandir as capacidades do agente
              </p>
              <Button
                onClick={() => setIsDialogOpen(true)}
                className="bg-stone-900 hover:bg-stone-800 text-white"
              >
                <Icon icon="mdi:plus" className="w-4 h-4 mr-2" />
                Adicionar Primeira Skill
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}
