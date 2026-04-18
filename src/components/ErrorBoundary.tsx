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
          <div className="max-w-md w-full mx-auto text-center p-8 bg-card rounded-3xl border border-border shadow-editorial">
            <div className="w-14 h-14 rounded-full bg-destructive/10 flex items-center justify-center mx-auto mb-4">
              <AlertTriangle className="w-7 h-7 text-destructive" />
            </div>
            <h1 className="font-display text-2xl font-semibold text-foreground mb-3">Algo deu errado</h1>
            <p className="text-muted-foreground mb-6 text-sm">
              {this.state.error?.message || 'Um erro inesperado ocorreu'}
            </p>
            {import.meta.env.DEV && this.state.errorInfo && (
              <details className="mb-6 text-left bg-muted p-3 rounded-2xl text-xs text-foreground overflow-auto max-h-32 border border-border">
                <summary className="cursor-pointer font-medium mb-2">Stack trace</summary>
                <pre className="whitespace-pre-wrap break-words">
                  {this.state.errorInfo.componentStack}
                </pre>
              </details>
            )}
            <div className="flex gap-3">
              <button
                onClick={this.handleReset}
                className="flex-1 h-11 px-4 bg-primary text-primary-foreground rounded-full hover:bg-primary/90 transition font-medium text-sm"
              >
                Tentar novamente
              </button>
              <button
                onClick={() => (window.location.href = '/')}
                className="flex-1 h-11 px-4 border border-border text-foreground rounded-full hover:bg-muted transition font-medium text-sm"
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
          <div className="w-12 h-12 rounded-2xl bg-destructive/10 border border-destructive/20 flex items-center justify-center mb-4">
            <AlertTriangle className="w-6 h-6 text-destructive" />
          </div>
          <h2 className="text-lg font-semibold text-foreground mb-2">
            {this.props.fallbackTitle || 'Erro ao carregar página'}
          </h2>
          <p className="text-sm text-muted-foreground mb-6 max-w-sm">
            {this.state.error?.message || 'Ocorreu um erro inesperado. Tente novamente.'}
          </p>
          {import.meta.env.DEV && this.state.error && (
            <pre className="mb-4 text-left text-xs bg-muted p-3 rounded-lg border border-border max-w-lg overflow-auto">
              {this.state.error.stack}
            </pre>
          )}
          <div className="flex gap-3">
            <button
              onClick={this.handleReset}
              className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:opacity-90 transition"
            >
              <RefreshCw className="w-4 h-4" />
              Tentar novamente
            </button>
            <button
              onClick={() => (window.location.href = '/hub')}
              className="flex items-center gap-2 px-4 py-2 border border-border rounded-lg text-sm font-medium hover:bg-muted transition"
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
