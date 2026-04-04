import { Evento } from '../../../types';
import { cn } from '../../../lib/utils';
import { Info, CheckCircle, AlertTriangle, XCircle } from 'lucide-react';

interface TimelineProps {
  events: Evento[];
  className?: string;
}

const typeIcons = {
  info: Info,
  sucesso: CheckCircle,
  alerta: AlertTriangle,
  erro: XCircle
};

const typeStyles = {
  info: 'text-tot-info bg-tot-info/10',
  sucesso: 'text-tot-success bg-tot-success/10',
  alerta: 'text-tot-warning bg-tot-warning/10',
  erro: 'text-tot-danger bg-tot-danger/10'
};

function formatTime(timestamp: string): string {
  const date = new Date(timestamp);
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (minutes < 1) return 'Agora';
  if (minutes < 60) return `${minutes}m atrás`;
  if (hours < 24) return `${hours}h atrás`;
  return `${days}d atrás`;
}

export function Timeline({ events, className }: TimelineProps) {
  return (
    <div className={cn('space-y-3', className)}>
      {events.map((event) => {
        const Icon = typeIcons[event.tipo];
        return (
          <div key={event.id} className="flex gap-3 items-start">
            <div className={cn('p-2 rounded-lg shrink-0', typeStyles[event.tipo])}>
              <Icon className="w-4 h-4" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm text-tot-text">{event.mensagem}</p>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-xs text-tot-muted">{formatTime(event.timestamp)}</span>
                {event.agente && (
                  <>
                    <span className="text-tot-muted">•</span>
                    <span className="text-xs text-tot-muted">{event.agente}</span>
                  </>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
