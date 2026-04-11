import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { 
  CheckCircle2, 
  XCircle, 
  Clock, 
  ChevronDown, 
  ChevronUp,
  Coins,
  Cpu,
  Terminal
} from 'lucide-react';
import type { ExecutionResult, SkillExecution } from '@/types/agents';

interface ExecutionLogProps {
  execution: ExecutionResult;
  className?: string;
}

export function ExecutionLog({ execution, className }: ExecutionLogProps) {
  const [expandedSkills, setExpandedSkills] = useState<Set<string>>(new Set());

  const toggleSkill = (skillId: string) => {
    const newSet = new Set(expandedSkills);
    if (newSet.has(skillId)) {
      newSet.delete(skillId);
    } else {
      newSet.add(skillId);
    }
    setExpandedSkills(newSet);
  };

  const getStatusIcon = (status: SkillExecution['status']) => {
    switch (status) {
      case 'success':
        return <CheckCircle2 className="h-5 w-5 text-green-500" />;
      case 'error':
        return <XCircle className="h-5 w-5 text-red-500" />;
      case 'running':
        return <Clock className="h-5 w-5 text-blue-500 animate-pulse" />;
      default:
        return <Clock className="h-5 w-5 text-gray-400" />;
    }
  };

  const getStatusBadge = (status: SkillExecution['status']) => {
    switch (status) {
      case 'success':
        return <Badge variant="default" className="bg-green-500">Sucesso</Badge>;
      case 'error':
        return <Badge variant="error">Erro</Badge>;
      case 'running':
        return <Badge variant="secondary" className="animate-pulse">Executando...</Badge>;
      default:
        return <Badge variant="outline">Pendente</Badge>;
    }
  };

  const formatDuration = (ms: number) => {
    if (ms < 1000) return `${ms}ms`;
    return `${(ms / 1000).toFixed(1)}s`;
  };

  const formatCost = (cost: number) => {
    return `R$ ${cost.toFixed(4)}`;
  };

  return (
    <Card className={className}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base flex items-center gap-2">
            <Terminal className="h-4 w-4" />
            Log de Execução
          </CardTitle>
          <Badge variant={execution.success ? 'default' : 'error'}>
            {execution.success ? 'Concluído' : 'Falhou'}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="space-y-2">
          {execution.logs.map((log, index) => (
            <Collapsible
              key={`${log.skill_id}-${index}`}
              open={expandedSkills.has(log.skill_id)}
              onOpenChange={() => toggleSkill(log.skill_id)}
            >
              <div className="rounded-lg border">
                <CollapsibleTrigger asChild>
                  <button className="w-full">
                    <div className="flex items-center gap-3 p-3 hover:bg-muted/50 transition-colors">
                      {getStatusIcon(log.status)}
                      <div className="flex-1 min-w-0 text-left">
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-sm">{log.name}</span>
                          {getStatusBadge(log.status)}
                        </div>
                        <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {formatDuration(log.duration_ms)}
                          </span>
                          {log.tokens_used && (
                            <span className="flex items-center gap-1">
                              <Cpu className="h-3 w-3" />
                              {log.tokens_used} tokens
                            </span>
                          )}
                          {log.cost !== undefined && (
                            <span className="flex items-center gap-1">
                              <Coins className="h-3 w-3" />
                              {formatCost(log.cost)}
                            </span>
                          )}
                        </div>
                      </div>
                      {expandedSkills.has(log.skill_id) ? (
                        <ChevronUp className="h-4 w-4 text-muted-foreground" />
                      ) : (
                        <ChevronDown className="h-4 w-4 text-muted-foreground" />
                      )}
                    </div>
                  </button>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <div className="px-3 pb-3 space-y-3">
                    <div className="rounded bg-muted p-2 text-xs">
                      <span className="font-medium text-muted-foreground">Input:</span>
                      <pre className="mt-1 overflow-x-auto">
                        {JSON.stringify(log.input, null, 2)}
                      </pre>
                    </div>
                    {log.output && (
                      <div className="rounded bg-muted p-2 text-xs">
                        <span className="font-medium text-muted-foreground">Output:</span>
                        <pre className="mt-1 overflow-x-auto">
                          {JSON.stringify(log.output, null, 2)}
                        </pre>
                      </div>
                    )}
                    {log.error && (
                      <div className="rounded bg-red-50 p-2 text-xs text-red-600">
                        <span className="font-medium">Erro:</span>
                        <p className="mt-1">{log.error}</p>
                      </div>
                    )}
                  </div>
                </CollapsibleContent>
              </div>
            </Collapsible>
          ))}
        </div>

        <div className="rounded-lg border bg-muted/50 p-3">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium">{formatDuration(execution.duration_ms)}</span>
                <span className="text-muted-foreground">total</span>
              </span>
              <span className="flex items-center gap-1">
                <Cpu className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium">{execution.total_tokens}</span>
                <span className="text-muted-foreground">tokens</span>
              </span>
              <span className="flex items-center gap-1">
                <Coins className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium">{formatCost(execution.total_cost)}</span>
                <span className="text-muted-foreground">custo</span>
              </span>
            </div>
            <span className="text-xs text-muted-foreground">
              {new Date(execution.created_at).toLocaleString('pt-BR')}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
