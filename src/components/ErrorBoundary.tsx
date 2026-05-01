import { Component, ReactNode } from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';

interface Props {
  children: ReactNode;
  fallbackTitle?: string;
}

interface State {
  hasError: boolean;
  error?: Error;
  errorInfo?: React.ErrorInfo;
}

// Global full-screen ErrorBoundary (used at App root)
export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('ErrorBoundary caught:', error);
    this.setState({ errorInfo });
  }

  handleReset = () => {
    this.setState({ hasError: false, error: undefined, errorInfo: undefined });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-surface-container-high px-4">
          <div className="mx-auto w-full max-w-md rounded-[28px] border border-border bg-card p-8 text-center shadow-[0_30px_70px_-48px_rgba(29,29,31,0.32)]">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-destructive/10">
              <AlertTriangle className="w-7 h-7 text-destructive" />
            </div>
            <h1 className="mb-3 font-['SF_Pro_Display','SF_Pro_Icons','Helvetica_Neue',Helvetica,Arial,sans-serif] text-2xl font-semibold tracking-[-0.03em] text-foreground">Algo deu errado</h1>
            <p className="mb-6 text-sm text-muted-foreground">
              {this.state.error?.message || 'Um erro inesperado ocorreu'}
            </p>
            {import.meta.env.DEV && this.state.errorInfo && (
              <details className="mb-6 max-h-32 overflow-auto rounded-[18px] border border-border bg-muted p-3 text-left text-xs text-foreground">
                <summary className="cursor-pointer font-medium mb-2">Stack trace</summary>
                <pre className="whitespace-pre-wrap break-words">
                  {this.state.errorInfo.componentStack}
                </pre>
              </details>
            )}
            <div className="flex gap-3">
              <button
                onClick={this.handleReset}
                className="flex-1 rounded-full bg-primary px-4 text-sm font-medium text-primary-foreground transition hover:bg-primary/90 h-11"
              >
                Tentar novamente
              </button>
              <button
                onClick={() => (window.location.href = '/')}
                className="flex-1 rounded-full border border-border px-4 text-sm font-medium text-foreground transition hover:bg-muted h-11"
              >
                Voltar ao início
              </button>
            </div>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

// ─────────────────────────────────────────────────────────────
// PageErrorBoundary — inline, non-intrusive, per-page
// Shows inside the current layout without full-screen takeover
// ─────────────────────────────────────────────────────────────
export class PageErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('[PageErrorBoundary]', error, errorInfo);
    this.setState({ errorInfo });
  }

  handleReset = () => {
    this.setState({ hasError: false, error: undefined, errorInfo: undefined });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] p-8 text-center">
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full border border-destructive/20 bg-destructive/10">
            <AlertTriangle className="w-6 h-6 text-destructive" />
          </div>
          <h2 className="text-lg font-semibold text-foreground mb-2">
            {this.props.fallbackTitle || 'Erro ao carregar página'}
          </h2>
          <p className="text-sm text-muted-foreground mb-6 max-w-sm">
            {this.state.error?.message || 'Ocorreu um erro inesperado. Tente novamente.'}
          </p>
          {import.meta.env.DEV && this.state.error && (
            <pre className="mb-4 max-w-lg overflow-auto rounded-[18px] border border-border bg-muted p-3 text-left text-xs">
              {this.state.error.stack}
            </pre>
          )}
          <div className="flex gap-3">
            <button
              onClick={this.handleReset}
              className="flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition hover:opacity-90"
            >
              <RefreshCw className="w-4 h-4" />
              Tentar novamente
            </button>
            <button
              onClick={() => (window.location.href = '/dashboard')}
              className="flex items-center gap-2 rounded-full border border-border px-4 py-2 text-sm font-medium transition hover:bg-muted"
            >
              <Home className="w-4 h-4" />
              Ir para o Hub
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
