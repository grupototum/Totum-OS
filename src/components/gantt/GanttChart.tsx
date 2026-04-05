import { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

interface GanttTask {
  id: string;
  title: string;
  dayStart: number;
  dayEnd: number;
  progress: number;
  status: string;
  responsible?: string;
  phase?: number;
  color?: string;
}

interface GanttChartProps {
  tasks: GanttTask[];
  totalDays?: number;
  currentDay?: number;
  title?: string;
}

const statusColors: Record<string, string> = {
  pending: 'bg-muted',
  'in-progress': 'bg-primary',
  completed: 'bg-emerald-500',
  blocked: 'bg-destructive',
};

export function GanttChart({ tasks, totalDays = 30, currentDay = 1, title = 'Cronograma Gantt' }: GanttChartProps) {
  const days = useMemo(() => Array.from({ length: totalDays }, (_, i) => i + 1), [totalDays]);

  return (
    <Card className="bg-card/50 border-border/40">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base font-semibold text-foreground">{title}</CardTitle>
          <Badge variant="outline" className="text-xs">
            Dia {currentDay}/{totalDays}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="p-0 overflow-x-auto">
        <div className="min-w-[800px]">
          {/* Header - Day numbers */}
          <div className="flex border-b border-border/40 px-4">
            <div className="w-48 shrink-0 py-2 text-xs font-medium text-muted-foreground">Tarefa</div>
            <div className="flex-1 flex">
              {days.map(d => (
                <div
                  key={d}
                  className={`flex-1 text-center text-[9px] py-2 ${d === currentDay ? 'text-primary font-bold' : 'text-muted-foreground'}`}
                >
                  {d % 5 === 0 || d === 1 ? d : ''}
                </div>
              ))}
            </div>
          </div>

          {/* Tasks */}
          {tasks.map(task => {
            const barColor = task.color || statusColors[task.status] || 'bg-primary';
            const startPct = ((task.dayStart - 1) / totalDays) * 100;
            const widthPct = ((task.dayEnd - task.dayStart + 1) / totalDays) * 100;

            return (
              <div key={task.id} className="flex items-center border-b border-border/20 px-4 hover:bg-muted/20 transition-colors">
                <div className="w-48 shrink-0 py-2">
                  <p className="text-xs font-medium text-foreground truncate">{task.title}</p>
                  {task.responsible && (
                    <p className="text-[10px] text-muted-foreground">{task.responsible}</p>
                  )}
                </div>
                <div className="flex-1 relative h-8">
                  {/* Current day marker */}
                  <div
                    className="absolute top-0 bottom-0 w-px bg-primary/40 z-10"
                    style={{ left: `${((currentDay - 0.5) / totalDays) * 100}%` }}
                  />

                  {/* Task bar */}
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div
                        className={`absolute top-1.5 h-5 rounded-full ${barColor} opacity-80 hover:opacity-100 transition-opacity cursor-pointer`}
                        style={{
                          left: `${startPct}%`,
                          width: `${widthPct}%`,
                          minWidth: '8px',
                        }}
                      >
                        {/* Progress fill */}
                        <div
                          className="h-full rounded-full bg-foreground/20"
                          style={{ width: `${task.progress}%` }}
                        />
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="font-medium">{task.title}</p>
                      <p className="text-xs">Dias {task.dayStart}-{task.dayEnd} • {task.progress}%</p>
                    </TooltipContent>
                  </Tooltip>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}

/* Mini version for dashboard widgets */
interface MiniGanttProps {
  tasks: GanttTask[];
  totalDays?: number;
  currentDay?: number;
}

export function MiniGantt({ tasks, totalDays = 30, currentDay = 1 }: MiniGanttProps) {
  return (
    <div className="space-y-1.5">
      {tasks.slice(0, 8).map(task => {
        const startPct = ((task.dayStart - 1) / totalDays) * 100;
        const widthPct = ((task.dayEnd - task.dayStart + 1) / totalDays) * 100;
        const barColor = task.color || statusColors[task.status] || 'bg-primary';

        return (
          <div key={task.id} className="flex items-center gap-2">
            <span className="text-[9px] text-muted-foreground w-24 truncate">{task.title}</span>
            <div className="flex-1 relative h-3 bg-muted/30 rounded-full overflow-hidden">
              <div
                className={`absolute top-0 h-full rounded-full ${barColor} opacity-70`}
                style={{ left: `${startPct}%`, width: `${widthPct}%`, minWidth: '4px' }}
              />
              <div
                className="absolute top-0 bottom-0 w-px bg-primary"
                style={{ left: `${((currentDay - 0.5) / totalDays) * 100}%` }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}
