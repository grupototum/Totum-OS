import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skill } from '@/types/alexandria';

interface SkillCardProps {
  skill: Skill;
  onClick?: () => void;
}

export default function SkillCard({ skill, onClick }: SkillCardProps) {
  return (
    <Card
      className="p-4 cursor-pointer hover:shadow-md transition-shadow"
      onClick={onClick}
    >
      <div className="flex items-start gap-3">
        <span className="text-2xl">{skill.emoji}</span>
        <div className="flex-1">
          <h4 className="font-semibold text-sm">{skill.name}</h4>
          <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
            {skill.description}
          </p>
        </div>
      </div>

      <div className="mt-3 pt-3 border-t flex justify-between items-center">
        <Badge variant="outline" className="text-xs">
          {skill.success_rate || 0}%
        </Badge>
        <Badge
          className={
            skill.status === 'active'
              ? 'text-xs bg-green-100 text-green-700 border-0'
              : 'text-xs bg-yellow-100 text-yellow-700 border-0'
          }
        >
          {skill.status === 'active' ? 'Ativa' : skill.status === 'beta' ? 'Beta' : 'Inativa'}
        </Badge>
      </div>
    </Card>
  );
}
