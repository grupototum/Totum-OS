import { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { Icon } from '@iconify/react';

export interface ExecutionStep {
  id: string;
  skillName: string;
  skillEmoji: string;
  status: 'success' | 'error' | 'pending' | 'running';
  startTime: string;
  endTime?: string;
  duration: number; // em ms
  tokensUsed?: number;
  costTokens?: number;
  input?: string;
  output?: string;
  errorMessage?: string;
  order: number;
}

export interface ExecutionResult {
  id: string;
  agentId: string;
  agentName: string;
  status: 'completed' | 'failed' | 'running' | 'pending';
  startTime: string;
  endTime?: string;
  totalDuration: number; // em ms
  steps: ExecutionStep[];
  totalTokensUsed: number;
  totalCost: number;
}

interface ExecutionLogProps {
  execution: ExecutionResult;
}

const statusColors = {
  success: 'bg-emerald-100 text-emerald-700 border-emerald-300',
  error: 'bg-red-100 text-red-700 border-red-300',
  pending: 'bg-stone-100 text-stone-700 border-stone-300',
  running: 'bg-amber-100 text-amber-700 border-amber-300',
};

const statusIcons = {
  success: 'mdi:check-circle',
  error: 'mdi:alert-circle',
  pending: 'mdi:clock-outline',
  running: 'mdi:loading',
};

const executionStatusColors = {
  completed: 'bg-emerald-500',
  failed: 'bg-red-500',
  running: 'bg-amber-500',
  pending: 'bg-stone-400',
};

const executionStatusLabels = {
  completed: 'Concluído',
  failed: 'Falhou',
  running: 'Em Execução',
  pending: 'Pendente',
};

export function ExecutionLog({ execution }: ExecutionLogProps) {
  const [expandedSteps, setExpandedSteps] = useState<Set<string>>(new Set());

  const toggleStepExpanded = (stepId: string) => {
    const newExpanded = new Set(expandedSteps);
    if (newExpanded.has(stepId)) {
      newExpanded.delete(stepId);
    } else {
      newExpanded.add(stepId);
    }
    setExpandedSteps(newExpanded);
  };

  const formatDuration = (ms: number): string => {
    if (ms < 1000) return `${ms}ms`;
    return `${(ms / 1000).toFixed(2)}s`;
  };

  const sortedSteps = [...execution.steps].sort((a, b) => a.order - b.order);

  const successCount = execution.steps.filter((s) => s.status === 'success').length;
  const errorCount = execution.steps.filter((s) => s.status === 'error').length;
  const runningCount = execution.steps.filter((s) => s.status === 'running').length;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
    >
      <Card className="border-stone-300 bg-[#EAEAE5]">
        <CardHeader className="border-b border-stone-300">
          <div className="flex items-center justify-between mb-4">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Icon icon="mdi:history" className="w-5 h-5" />
                Histórico de Execução
              </CardTitle>
              <p className="text-sm text-stone-500 mt-1">{execution.agentName}</p>
            </div>
            <Badge
              className={`${executionStatusColors[execution.status]} text-white border-0 px-3 py-1 text-sm font-medium`}
            >
              {executionStatusLabels[execution.status]}
            </Badge>
          </div>

          {/* Stats Summary */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
            <div className="rounded bg-white border border-stone-300 p-2">
              <p className="text-[9px] uppercase tracking-widest text-stone-500">Status</p>
              <p className="text-sm font-medium text-stone-900">
                {execution.steps.length} steps
              </p>
            </div>
            <div className="rounded bg-white border border-stone-300 p-2">
              <p className="text-[9px] uppercase tracking-widest text-emerald-600">Sucesso</p>
              <p className="text-sm font-medium text-emerald-700">{successCount}</p>
            </div>
            <div className="rounded bg-white border border-stone-300 p-2">
              <p className="text-[9px] uppercase tracking-widest text-red-600">Erro</p>
              <p className="text-sm font-medium text-red-700">{errorCount}</p>
            </div>
            <div className="rounded bg-white border border-stone-300 p-2">
              <p className="text-[9px] uppercase tracking-widest text-stone-500">Duração</p>
              <p className="text-sm font-medium text-stone-900">
                {formatDuration(execution.totalDuration)}
              </p>
            </div>
            <div className="rounded bg-white border border-stone-300 p-2">
              <p className="text-[9px] uppercase tracking-widest text-stone-500">Tokens</p>
              <p className="text-sm font-medium text-stone-900">{execution.totalTokensUsed}</p>
            </div>
          </div>
        </CardHeader>

        <CardContent className="pt-6">
          {/* Timeline */}
          <div className="space-y-3">
            {sortedSteps.map((step, index) => (
              <motion.div
                key={step.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Collapsible
                  open={expandedSteps.has(step.id)}
                  onOpenChange={() => toggleStepExpanded(step.id)}
                >
                  <CollapsibleTrigger asChild>
                    <div className="w-full cursor-pointer group rounded-lg border border-stone-300 bg-white hover:bg-stone-50 transition-colors p-4">
                      <div className="flex items-center justify-between gap-4">
                        {/* Left: Timeline dot and step info */}
                        <div className="flex items-center gap-4 flex-1 min-w-0">
                          <div className="flex flex-col items-center">
                            <div
                              className={`w-8 h-8 rounded-full border-2 flex items-center justify-center ${
                                step.status === 'success'
                                  ? 'bg-emerald-100 border-emerald-500'
                                  : step.status === 'error'
                                    ? 'bg-red-100 border-red-500'
                                    : step.status === 'running'
                                      ? 'bg-amber-100 border-amber-500'
                                      : 'bg-stone-100 border-stone-400'
                              }`}
                            >
                              <Icon
                                icon={statusIcons[step.status]}
                                className={`w-4 h-4 ${
                                  step.status === 'running' ? 'animate-spin' : ''
                                }`}
                              />
                            </div>
                            {index < sortedSteps.length - 1 && (
                              <div className="w-0.5 h-8 bg-stone-300 mt-1" />
                            )}
                          </div>

                          {/* Step details */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <span className="text-xl">{step.skillEmoji}</span>
                              <span className="font-medium text-stone-900 truncate">
                                {step.skillName}
                              </span>
                              <Badge
                                variant="outline"
                                className={`${statusColors[step.status]} text-[10px] ml-auto flex-shrink-0`}
                              >
                                {step.status}
                              </Badge>
                            </div>
                            <div className="flex items-center gap-3 mt-2 text-xs text-stone-500">
                              <span>⏱ {formatDuration(step.duration)}</span>
                              {step.tokensUsed !== undefined && (
                                <span>🔤 {step.tokensUsed}</span>
                              )}
                              {step.costTokens !== undefined && (
                                <span>💰 {step.costTokens.toFixed(4)}</span>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Right: Expand button */}
                        <Button
                          variant="ghost"
                          size="sm"
                          className={`flex-shrink-0 transition-transform ${
                            expandedSteps.has(step.id) ? 'rotate-180' : ''
                          }`}
                        >
                          <Icon icon="mdi:chevron-down" className="w-5 h-5" />
                        </Button>
                      </div>
                    </div>
                  </CollapsibleTrigger>

                  {/* Expanded content */}
                  <CollapsibleContent className="mt-2 ml-12 border-l-2 border-stone-300 pl-4 space-y-3">
                    {step.input && (
                      <div className="rounded bg-stone-50 border border-stone-300 p-3">
                        <p className="text-xs font-medium text-stone-600 mb-2 uppercase tracking-wider">
                          ⬇ Input
                        </p>
                        <pre className="text-xs text-stone-700 bg-white rounded p-2 overflow-auto max-h-32 border border-stone-200 font-mono">
                          {typeof step.input === 'string'
                            ? step.input
                            : JSON.stringify(step.input, null, 2)}
                        </pre>
                      </div>
                    )}

                    {step.output && (
                      <div className="rounded bg-stone-50 border border-stone-300 p-3">
                        <p className="text-xs font-medium text-stone-600 mb-2 uppercase tracking-wider">
                          ⬆ Output
                        </p>
                        <pre className="text-xs text-stone-700 bg-white rounded p-2 overflow-auto max-h-32 border border-stone-200 font-mono">
                          {typeof step.output === 'string'
                            ? step.output
                            : JSON.stringify(step.output, null, 2)}
                        </pre>
                      </div>
                    )}

                    {step.errorMessage && (
                      <div className="rounded bg-red-50 border border-red-300 p-3">
                        <p className="text-xs font-medium text-red-600 mb-2 uppercase tracking-wider">
                          ⚠ Erro
                        </p>
                        <p className="text-xs text-red-700 font-mono">{step.errorMessage}</p>
                      </div>
                    )}

                    {step.status === 'success' && (
                      <div className="flex items-center gap-2 text-xs text-emerald-700 bg-emerald-50 border border-emerald-200 rounded p-2">
                        <Icon icon="mdi:check-circle" className="w-4 h-4" />
                        Executado com sucesso
                      </div>
                    )}
                  </CollapsibleContent>
                </Collapsible>
              </motion.div>
            ))}
          </div>

          {sortedSteps.length === 0 && (
            <div className="flex flex-col items-center justify-center py-12 text-center rounded-lg bg-stone-50 border border-stone-300">
              <Icon icon="mdi:history" className="w-12 h-12 text-stone-300 mb-3" />
              <p className="text-stone-600 font-medium">Nenhuma execução registrada</p>
              <p className="text-xs text-stone-500 mt-1">
                Os históricos de execução aparecerão aqui
              </p>
            </div>
          )}

          {/* Footer Summary */}
          {sortedSteps.length > 0 && (
            <div className="mt-6 pt-6 border-t border-stone-300">
              <div className="grid grid-cols-3 gap-4">
                <div className="rounded-lg bg-stone-100 p-4 border border-stone-300">
                  <p className="text-[10px] uppercase tracking-widest text-stone-500 mb-1">
                    Tempo Total
                  </p>
                  <p className="text-lg font-medium text-stone-900">
                    {formatDuration(execution.totalDuration)}
                  </p>
                </div>
                <div className="rounded-lg bg-stone-100 p-4 border border-stone-300">
                  <p className="text-[10px] uppercase tracking-widest text-stone-500 mb-1">
                    Tokens Usados
                  </p>
                  <p className="text-lg font-medium text-stone-900">
                    {execution.totalTokensUsed}
                  </p>
                </div>
                <div className="rounded-lg bg-stone-100 p-4 border border-stone-300">
                  <p className="text-[10px] uppercase tracking-widest text-stone-500 mb-1">
                    Custo Total
                  </p>
                  <p className="text-lg font-medium text-stone-900">
                    ${execution.totalCost.toFixed(4)}
                  </p>
                </div>
              </div>

              {/* Timeline info */}
              <div className="mt-4 rounded bg-stone-50 border border-stone-300 p-3">
                <div className="flex items-center justify-between text-xs text-stone-600">
                  <div>
                    <span className="font-mono">Início:</span>{' '}
                    {new Date(execution.startTime).toLocaleTimeString('pt-BR', {
                      hour: '2-digit',
                      minute: '2-digit',
                      second: '2-digit',
                    })}
                  </div>
                  {execution.endTime && (
                    <div>
                      <span className="font-mono">Fim:</span>{' '}
                      {new Date(execution.endTime).toLocaleTimeString('pt-BR', {
                        hour: '2-digit',
                        minute: '2-digit',
                        second: '2-digit',
                      })}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}
