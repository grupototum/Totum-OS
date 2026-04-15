import { AlertCircle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ErrorDisplayProps {
  title?: string;
  message: string;
  onRetry?: () => void;
  showHome?: boolean;
}

/**
 * Error Display Component
 * Shows user-friendly error messages with retry and home button options
 */
export function ErrorDisplay({
  title = 'Erro ao carregar',
  message,
  onRetry,
  showHome = true,
}: ErrorDisplayProps) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="max-w-md w-full mx-auto text-center p-6 bg-card rounded-lg border border-border">
        <div className="flex justify-center mb-4">
          <AlertCircle className="w-12 h-12 text-destructive" />
        </div>

        <h2 className="text-xl font-bold text-foreground mb-2">{title}</h2>

        <p className="text-sm text-muted-foreground mb-6">
          {message}
        </p>

        <div className="flex gap-3">
          {onRetry && (
            <Button
              onClick={onRetry}
              className="flex-1 bg-primary hover:bg-primary/90"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Tentar novamente
            </Button>
          )}
          {showHome && (
            <Button
              onClick={() => window.location.href = '/'}
              variant="outline"
              className="flex-1"
            >
              Voltar ao início
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
