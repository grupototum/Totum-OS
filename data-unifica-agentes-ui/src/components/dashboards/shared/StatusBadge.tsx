import { cn } from '../../lib/utils';

type StatusType = 'online' | 'offline' | 'degradado' | 'ativo' | 'inativo' | 'pausado' | 'erro' | 'success' | 'warning' | 'info';

interface StatusBadgeProps {
  status: StatusType;
  children?: React.ReactNode;
  className?: string;
}

const statusStyles: Record<StatusType, string> = {
  online: 'bg-tot-success/10 text-tot-success border-tot-success/20',
  offline: 'bg-tot-danger/10 text-tot-danger border-tot-danger/20',
  degradado: 'bg-tot-warning/10 text-tot-warning border-tot-warning/20',
  ativo: 'bg-tot-success/10 text-tot-success border-tot-success/20',
  inativo: 'bg-tot-muted/10 text-tot-muted border-tot-muted/20',
  pausado: 'bg-tot-warning/10 text-tot-warning border-tot-warning/20',
  erro: 'bg-tot-danger/10 text-tot-danger border-tot-danger/20',
  success: 'bg-tot-success/10 text-tot-success border-tot-success/20',
  warning: 'bg-tot-warning/10 text-tot-warning border-tot-warning/20',
  info: 'bg-tot-info/10 text-tot-info border-tot-info/20'
};

export function StatusBadge({ status, children, className }: StatusBadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border',
        statusStyles[status],
        className
      )}
    >
      <span className={cn('w-1.5 h-1.5 rounded-full mr-1.5', {
        'bg-tot-success': status === 'online' || status === 'ativo' || status === 'success',
        'bg-tot-danger': status === 'offline' || status === 'erro',
        'bg-tot-warning': status === 'degradado' || status === 'pausado' || status === 'warning',
        'bg-tot-muted': status === 'inativo',
        'bg-tot-info': status === 'info'
      })} />
      {children || status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
}
