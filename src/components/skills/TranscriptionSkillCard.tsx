import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ChevronDown, ChevronUp, CheckCircle, XCircle, Loader2, Clock } from 'lucide-react';
import { SkillExecutionResult } from '@/types/transcription';

interface TranscriptionSkillCardProps {
  skillName: string;
  emoji: string;
  description: string;
  category: string;
  successRate: number;
  result?: SkillExecutionResult;
  isRunning?: boolean;
  onRun?: () => void;
}

export default function TranscriptionSkillCard({
  skillName, emoji, description, category, successRate, result, isRunning, onRun,
}: TranscriptionSkillCardProps) {
  const [expanded, setExpanded] = useState(false);

  const hasResult = result !== undefined;
  const isSuccess = result?.success;

  return (
    <Card className="p-4 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3 flex-1 min-w-0">
          <span className="text-2xl shrink-0">{emoji}</span>
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h4 className="font-semibold text-sm">{skillName}</h4>
              {hasResult && (
                isSuccess
                  ? <CheckCircle className="h-4 w-4 text-green-500" />
                  : <XCircle className="h-4 w-4 text-red-500" />
              )}
              {isRunning && <Loader2 className="h-4 w-4 text-primary animate-spin" />}
            </div>
            <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">{description}</p>
          </div>
        </div>

        <div className="flex flex-col items-end gap-1 shrink-0">
          <Badge variant="outline" className="text-xs">{category}</Badge>
          <span className="text-xs text-muted-foreground">{successRate}% sucesso</span>
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between mt-3 pt-3 border-t">
        <div className="flex items-center gap-2">
          {result?.execution_ms && (
            <span className="text-xs text-muted-foreground flex items-center gap-1">
              <Clock className="h-3 w-3" />{result.execution_ms}ms
            </span>
          )}
          {result?.model && (
            <Badge variant="outline" className="text-xs">{result.model}</Badge>
          )}
        </div>

        <div className="flex items-center gap-2">
          {hasResult && (
            <Button
              variant="ghost"
              size="sm"
              className="h-6 px-2 text-xs"
              onClick={() => setExpanded(!expanded)}
            >
              {expanded ? <><ChevronUp className="h-3 w-3 mr-1" />Ocultar</> : <><ChevronDown className="h-3 w-3 mr-1" />Ver resultado</>}
            </Button>
          )}
          {onRun && (
            <Button size="sm" className="h-6 px-3 text-xs" onClick={onRun} disabled={isRunning}>
              {isRunning ? 'Processando...' : 'Executar'}
            </Button>
          )}
        </div>
      </div>

      {/* Resultado expandido */}
      {expanded && result?.output && (
        <div className="mt-3 pt-3 border-t">
          <pre className="bg-muted rounded p-3 text-xs overflow-auto max-h-48 whitespace-pre-wrap">
            {JSON.stringify(result.output, null, 2)}
          </pre>
        </div>
      )}

      {expanded && result?.error && (
        <div className="mt-3 pt-3 border-t">
          <p className="text-xs text-destructive bg-red-50 rounded p-2">{result.error}</p>
        </div>
      )}
    </Card>
  );
}
