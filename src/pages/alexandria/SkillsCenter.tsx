import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skill } from '@/types/alexandria';
import { Search, Zap } from 'lucide-react';
import { Input } from '@/components/ui/input';

interface SkillsCenterProps {
  skills: Skill[];
}

const categories = {
  all: 'Todas',
  content: 'Conteúdo',
  analytics: 'Análise',
  automation: 'Automação',
  communication: 'Comunicação',
} as const;

type CategoryKey = keyof typeof categories;

// Mapeia categorias do banco para chaves internas
const mapCategory = (category: string): CategoryKey => {
  const map: Record<string, CategoryKey> = {
    'Criação de Conteúdo': 'content',
    'Análise & Inteligência': 'analytics',
    'Automação': 'automation',
    'Comunicação': 'communication',
  };
  return map[category] || 'all';
};

export default function SkillsCenter({ skills }: SkillsCenterProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState<CategoryKey>('all');

  const filteredSkills = skills.filter((skill) => {
    const matchesSearch =
      skill.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      skill.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTab = activeTab === 'all' || mapCategory(skill.category) === activeTab;
    return matchesSearch && matchesTab;
  });

  return (
    <div className="space-y-6">
      {/* Busca */}
      <div className="relative">
        <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Buscar skills..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Abas por Categoria */}
      <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as CategoryKey)}>
        <TabsList className="grid w-full grid-cols-5">
          {(Object.entries(categories) as [CategoryKey, string][]).map(([key, label]) => (
            <TabsTrigger key={key} value={key} className="text-xs">
              {label}
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value={activeTab} className="space-y-4 mt-6">
          {filteredSkills.length === 0 ? (
            <Card className="p-8 text-center">
              <p className="text-muted-foreground">Nenhuma skill encontrada</p>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredSkills.map((skill) => (
                <Card
                  key={skill.id}
                  className="p-6 hover:shadow-lg transition-shadow cursor-pointer"
                >
                  {/* Cabeçalho */}
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{skill.emoji}</span>
                      <div>
                        <h3 className="font-semibold text-sm">{skill.name}</h3>
                      </div>
                    </div>
                    <Badge
                      className={
                        skill.status === 'active'
                          ? 'bg-green-100 text-green-700 border-0'
                          : 'bg-yellow-100 text-yellow-700 border-0'
                      }
                    >
                      {skill.status === 'active' ? 'Ativa' : 'Beta'}
                    </Badge>
                  </div>

                  {/* Descrição */}
                  <p className="text-xs text-muted-foreground mb-3 line-clamp-2">
                    {skill.description}
                  </p>

                  {/* Categoria e Modelo */}
                  <div className="space-y-2 mb-3">
                    <Badge variant="outline" className="text-xs">
                      {skill.category}
                    </Badge>
                    {skill.model_preference && (
                      <p className="text-xs text-muted-foreground">
                        Modelo: <span className="font-semibold">{skill.model_preference}</span>
                      </p>
                    )}
                  </div>

                  {/* Estatísticas */}
                  <div className="pt-3 border-t space-y-2">
                    <div className="flex justify-between text-xs">
                      <span className="text-muted-foreground">Taxa de Sucesso</span>
                      <span className="font-semibold text-green-600">
                        {skill.success_rate || 0}%
                      </span>
                    </div>
                    {skill.cost_per_call !== undefined && skill.cost_per_call !== null && (
                      <div className="flex justify-between text-xs">
                        <span className="text-muted-foreground">Custo</span>
                        <span className="font-semibold">${skill.cost_per_call.toFixed(2)}</span>
                      </div>
                    )}
                  </div>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Rodapé */}
      <Card className="p-4 bg-muted flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          {filteredSkills.length} skill{filteredSkills.length !== 1 ? 's' : ''} encontrada
          {filteredSkills.length !== 1 ? 's' : ''}
        </p>
        <div className="flex items-center gap-2 text-sm">
          <Zap className="h-4 w-4 text-amber-500" />
          <span className="font-semibold">Pronta pra usar</span>
        </div>
      </Card>
    </div>
  );
}
