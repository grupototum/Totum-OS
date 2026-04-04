import { ReactNode } from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { cn } from '../../lib/utils';

interface MetricCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  trend?: 'up' | 'down' | 'neutral';
  trendValue?: string;
  icon?: ReactNode;
  className?: string;
}

export function MetricCard({
  title,
  value,
  subtitle,
  trend,
  trendValue,
  icon,
  className
}: MetricCardProps) {
  return (
    <div className={cn('tot-card p-5', className)}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-tot-muted">{title}</p>
          <p className="text-2xl font-bold text-tot-text mt-1">{value}</p>
          {subtitle && (
            <p className="text-xs text-tot-muted mt-1">{subtitle}</p>
          )}
          {trend && (
            <div className="flex items-center gap-1 mt-2">
              {trend === 'up' && (
                <TrendingUp className="w-4 h-4 text-tot-success" />
              )}
              {trend === 'down' && (
                <TrendingDown className="w-4 h-4 text-tot-danger" />
              )}
              {trend === 'neutral' && (
                <Minus className="w-4 h-4 text-tot-muted" />
              )}
              <span
                className={cn(
                  'text-xs font-medium',
                  trend === 'up' && 'text-tot-success',
                  trend === 'down' && 'text-tot-danger',
                  trend === 'neutral' && 'text-tot-muted'
                )}
              >
                {trendValue}
              </span>
            </div>
          )}
        </div>
        {icon && (
          <div className="p-2 bg-tot-bg rounded-lg text-tot-primary">
            {icon}
          </div>
        )}
      </div>
    </div>
  );
}
