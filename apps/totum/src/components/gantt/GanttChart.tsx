import { useEffect, useRef, useMemo, useState } from 'react';
import { Tarefa, RESPONSAVEIS } from '@/hooks/useTasks';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { format, addDays, differenceInDays, startOfWeek, endOfWeek, startOfMonth, endOfMonth } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { ChevronLeft, ChevronRight, CalendarDays, Calendar, CalendarRange } from 'lucide-react';

// ============================================
// COMPONENTE GANTT CHART CUSTOMIZADO
// ============================================

type ViewMode = 'dia' | 'semana' | 'mes';

interface GanttChartProps {
  tarefas: Tarefa[];
  onTaskClick?: (tarefa: Tarefa) => void;
  onDateChange?: (tarefaId: string, novaDataInicio: string, novaDataFim: string) => void;
  onProgressChange?: (tarefaId: string, novoProgresso: number) => void;
  readOnly?: boolean;
}

export function GanttChart({ 
  tarefas, 
  onTaskClick, 
  onDateChange,
  onProgressChange,
  readOnly = false 
}: GanttChartProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [viewMode, setViewMode] = useState<ViewMode>('semana');
  const [startDate, setStartDate] = useState<Date>(() => {
    // Começar na semana atual ou na data da primeira tarefa
    return startOfWeek(new Date(), { weekStartsOn: 1 });
  });
  
  // Filtrar apenas tarefas com datas (para o Gantt)
  const tarefasComDatas = useMemo(() => {
    return tarefas.filter(t => t.data_inicio && t.data_fim);
  }, [tarefas]);

  // Calcular range de datas visível
  const visibleDays = useMemo(() => {
    switch (viewMode) {
      case 'dia': return 14; // 2 semanas
      case 'semana': return 42; // 6 semanas
      case 'mes': return 90; // 3 meses
      default: return 42;
    }
  }, [viewMode]);

  const endDate = addDays(startDate, visibleDays);
  
  // Gerar array de datas
  const dates = useMemo(() => {
    const d: Date[] = [];
    for (let i = 0; i < visibleDays; i++) {
      d.push(addDays(startDate, i));
    }
    return d;
  }, [startDate, visibleDays]);

  // Largura de cada célula de dia
  const dayWidth = viewMode === 'dia' ? 60 : viewMode === 'semana' ? 40 : 30;

  // Calcular posição de uma tarefa
  const getTaskPosition = (tarefa: Tarefa) => {
    if (!tarefa.data_inicio || !tarefa.data_fim) return null;
    
    const taskStart = new Date(tarefa.data_inicio);
    const taskEnd = new Date(tarefa.data_fim);
    
    const daysFromStart = differenceInDays(taskStart, startDate);
    const duration = differenceInDays(taskEnd, taskStart) + 1;
    
    if (daysFromStart + duration < 0 || daysFromStart > visibleDays) {
      return null; // Fora da visão
    }
    
    return {
      left: Math.max(0, daysFromStart * dayWidth),
      width: Math.max(dayWidth, duration * dayWidth),
    };
  };

  // Navegação
  const goPrevious = () => {
    const offset = viewMode === 'dia' ? 7 : viewMode === 'semana' ? 14 : 30;
    setStartDate(addDays(startDate, -offset));
  };

  const goNext = () => {
    const offset = viewMode === 'dia' ? 7 : viewMode === 'semana' ? 14 : 30;
    setStartDate(addDays(startDate, offset));
  };

  const goToday = () => {
    setStartDate(startOfWeek(new Date(), { weekStartsOn: 1 }));
  };

  // Cor do responsável
  const getResponsavelColor = (responsavel?: string) => {
    const resp = RESPONSAVEIS.find(r => r.id === responsavel);
    return resp?.cor || '#78716C';
  };

  // Header formatado
  const formatHeader = (date: Date) => {
    switch (viewMode) {
      case 'dia':
        return format(date, 'dd/MM', { locale: ptBR });
      case 'semana':
        const isStartOfWeek = date.getDay() === 1;
        return isStartOfWeek ? format(date, "dd 'de' MMM", { locale: ptBR }) : format(date, 'dd');
      case 'mes':
        const isStartOfMonth = date.getDate() === 1;
        return isStartOfMonth ? format(date, "MMM", { locale: ptBR }) : format(date, 'dd');
      default:
        return format(date, 'dd/MM');
    }
  };

  // Verificar se é hoje
  const isToday = (date: Date) => {
    const today = new Date();
    return format(date, 'yyyy-MM-dd') === format(today, 'yyyy-MM-dd');
  };

  // Verificar se é fim de semana
  const isWeekend = (date: Date) => {
    const day = date.getDay();
    return day === 0 || day === 6;
  };

  return (
    <Card className="border-stone-300 overflow-hidden">
      {/* Toolbar */}
      <div className="flex items-center justify-between p-4 border-b border-stone-200 bg-stone-50/50">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={goPrevious}>
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <Button variant="outline" size="sm" onClick={goToday}>
            Hoje
          </Button>
          <Button variant="outline" size="sm" onClick={goNext}>
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>

        <div className="text-sm font-medium text-stone-700">
          {format(startDate, "dd 'de' MMMM", { locale: ptBR })} - {format(endDate, "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
        </div>

        <div className="flex items-center gap-1 bg-stone-100 rounded-lg p-1">
          <Button
            variant={viewMode === 'dia' ? 'secondary' : 'ghost'}
            size="sm"
            onClick={() => setViewMode('dia')}
            className="h-7 px-2"
          >
            <CalendarDays className="w-3.5 h-3.5 mr-1" />
            Dia
          </Button>
          <Button
            variant={viewMode === 'semana' ? 'secondary' : 'ghost'}
            size="sm"
            onClick={() => setViewMode('semana')}
            className="h-7 px-2"
          >
            <Calendar className="w-3.5 h-3.5 mr-1" />
            Semana
          </Button>
          <Button
            variant={viewMode === 'mes' ? 'secondary' : 'ghost'}
            size="sm"
            onClick={() => setViewMode('mes')}
            className="h-7 px-2"
          >
            <CalendarRange className="w-3.5 h-3.5 mr-1" />
            Mês
          </Button>
        </div>
      </div>

      {/* Gantt Container */}
      <div 
        ref={containerRef}
        className="overflow-x-auto overflow-y-hidden"
        style={{ maxHeight: '600px' }}
      >
        <div style={{ minWidth: `${visibleDays * dayWidth + 200}px` }}>
          {/* Header de Datas */}
          <div className="flex border-b border-stone-200 sticky top-0 bg-white z-10">
            {/* Coluna de Títulos */}
            <div className="w-[200px] flex-shrink-0 p-3 border-r border-stone-200 bg-stone-50 font-medium text-sm text-stone-700">
              Tarefa
            </div>
            
            {/* Datas */}
            <div className="flex">
              {dates.map((date, idx) => (
                <div
                  key={idx}
                  className={`flex-shrink-0 border-r border-stone-100 text-center py-2 text-xs ${
                    isToday(date) ? 'bg-blue-50 font-semibold text-blue-700' : 
                    isWeekend(date) ? 'bg-stone-50/50 text-stone-400' : 'text-stone-600'
                  }`}
                  style={{ width: dayWidth }}
                >
                  <div>{formatHeader(date)}</div>
                  <div className="text-[10px] uppercase">
                    {format(date, 'EEE', { locale: ptBR })}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Grid de Tarefas */}
          <div className="relative">
            {/* Linha "Hoje" */}
            {dates.some(isToday) && (
              <div 
                className="absolute top-0 bottom-0 w-0.5 bg-blue-500 z-20 pointer-events-none"
                style={{ 
                  left: `${200 + (dates.findIndex(isToday) * dayWidth) + (dayWidth / 2)}px` 
                }}
              >
                <div className="absolute -top-1 -left-1.5 w-3 h-3 bg-blue-500 rounded-full" />
              </div>
            )}

            {/* Tarefas */}
            {tarefasComDatas.length === 0 ? (
              <div className="p-8 text-center text-stone-500">
                Nenhuma tarefa com datas definidas.
                <br />
                <span className="text-sm text-stone-400">
                  Adicione datas de início e fim às tarefas para visualizá-las no Gantt.
                </span>
              </div>
            ) : (
              tarefasComDatas.map((tarefa, idx) => {
                const position = getTaskPosition(tarefa);
                if (!position) return null;

                const respColor = getResponsavelColor(tarefa.responsavel);
                const isDone = tarefa.status === 'feito';

                return (
                  <div 
                    key={tarefa.id}
                    className="flex border-b border-stone-100 hover:bg-stone-50/50 transition-colors"
                  >
                    {/* Título da Tarefa */}
                    <div 
                      className="w-[200px] flex-shrink-0 p-3 border-r border-stone-200 truncate cursor-pointer"
                      onClick={() => onTaskClick?.(tarefa)}
                    >
                      <div className="text-sm font-medium text-stone-800 truncate">
                        {tarefa.titulo}
                      </div>
                      <div className="flex items-center gap-2 mt-1">
                        <span 
                          className="text-[10px] px-1.5 py-0.5 rounded text-white"
                          style={{ backgroundColor: respColor }}
                        >
                          {tarefa.responsavel || 'Israel'}
                        </span>
                        <span className="text-xs text-stone-400">
                          {tarefa.progresso}%
                        </span>
                      </div>
                    </div>

                    {/* Barra de Timeline */}
                    <div className="flex relative" style={{ height: '50px' }}>
                      {/* Fundo com grid */}
                      {dates.map((date, dIdx) => (
                        <div
                          key={dIdx}
                          className={`flex-shrink-0 border-r border-stone-50 ${
                            isWeekend(date) ? 'bg-stone-50/30' : ''
                          }`}
                          style={{ width: dayWidth }}
                        />
                      ))}

                      {/* Barra da Tarefa */}
                      <div
                        className={`absolute top-2 h-7 rounded-md shadow-sm cursor-pointer transition-all hover:shadow-md ${
                          isDone ? 'opacity-70' : ''
                        }`}
                        style={{
                          left: position.left,
                          width: position.width,
                          backgroundColor: respColor,
                        }}
                        onClick={() => onTaskClick?.(tarefa)}
                      >
                        {/* Progresso */}
                        <div
                          className="h-full rounded-md bg-white/30"
                          style={{ width: `${tarefa.progresso || 0}%` }}
                        />
                        
                        {/* Label */}
                        {position.width > 60 && (
                          <div className="absolute inset-0 flex items-center px-2 text-xs font-medium text-white truncate">
                            {tarefa.titulo}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>

      {/* Legenda */}
      <div className="flex flex-wrap items-center gap-4 p-3 border-t border-stone-200 bg-stone-50/50 text-xs">
        <span className="text-stone-500 font-medium">Responsáveis:</span>
        {RESPONSAVEIS.map(resp => (
          <div key={resp.id} className="flex items-center gap-1.5">
            <div 
              className="w-3 h-3 rounded"
              style={{ backgroundColor: resp.cor }}
            />
            <span className="text-stone-600">{resp.nome}</span>
          </div>
        ))}
      </div>
    </Card>
  );
}

// ============================================
// MINI GANTT (Para dashboards compactos)
// ============================================

interface MiniGanttProps {
  tarefas: Tarefa[];
  dias?: number;
}

export function MiniGantt({ tarefas, dias = 14 }: MiniGanttProps) {
  const startDate = startOfWeek(new Date(), { weekStartsOn: 1 });
  const dayWidth = 24;
  
  const tarefasComDatas = tarefas.filter(t => t.data_inicio && t.data_fim);

  return (
    <div className="overflow-x-auto">
      <div style={{ minWidth: `${dias * dayWidth}px` }}>
        {/* Header */}
        <div className="flex text-[10px] text-stone-400 mb-1">
          {Array.from({ length: dias }).map((_, i) => {
            const date = addDays(startDate, i);
            return (
              <div 
                key={i} 
                className="flex-shrink-0 text-center"
                style={{ width: dayWidth }}
              >
                {format(date, 'dd')}
              </div>
            );
          })}
        </div>

        {/* Tarefas */}
        <div className="space-y-1">
          {tarefasComDatas.slice(0, 5).map(tarefa => {
            const taskStart = new Date(tarefa.data_inicio!);
            const taskEnd = new Date(tarefa.data_fim!);
            const daysFromStart = differenceInDays(taskStart, startDate);
            const duration = differenceInDays(taskEnd, taskStart) + 1;
            
            if (daysFromStart + duration < 0 || daysFromStart > dias) return null;

            const resp = RESPONSAVEIS.find(r => r.id === tarefa.responsavel);
            
            return (
              <div
                key={tarefa.id}
                className="h-4 rounded-full"
                style={{
                  marginLeft: `${Math.max(0, daysFromStart * dayWidth)}px`,
                  width: `${Math.max(dayWidth, duration * dayWidth)}px`,
                  backgroundColor: resp?.cor || '#78716C',
                  opacity: tarefa.status === 'feito' ? 0.6 : 1,
                }}
                title={`${tarefa.titulo} (${tarefa.responsavel || 'Israel'})`}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}
