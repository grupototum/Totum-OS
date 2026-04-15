import { Component, ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
  errorInfo?: React.ErrorInfo;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('ErrorBoundary caught:', error);
    console.error('Error info:', errorInfo);
    this.setState({ errorInfo });
  }

  handleReset = () => {
    this.setState({ hasError: false, error: undefined, errorInfo: undefined });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-zinc-950">
          <div className="max-w-md w-full mx-auto text-center p-6 bg-zinc-900 rounded-lg border border-zinc-800">
            <h1 className="text-2xl font-bold text-white mb-4">⚠️ Algo deu errado</h1>

            <p className="text-zinc-400 mb-6 text-sm">
              {this.state.error?.message || 'Um erro inesperado ocorreu'}
            </p>

            {process.env.NODE_ENV === 'development' && this.state.errorInfo && (
              <details className="mb-6 text-left bg-zinc-800 p-3 rounded text-xs text-zinc-300 overflow-auto max-h-32">
                <summary className="cursor-pointer font-mono mb-2">Stack trace</summary>
                <pre className="whitespace-pre-wrap break-words">
                  {this.state.errorInfo.componentStack}
                </pre>
              </details>
            )}

            <div className="flex gap-3">
              <button
                onClick={this.handleReset}
                className="flex-1 px-4 py-2 bg-[#ef233c] text-white rounded hover:bg-[#d91e2f] transition font-medium"
              >
                Tentar novamente
              </button>
              <button
                onClick={() => window.location.href = '/'}
                className="flex-1 px-4 py-2 bg-zinc-800 text-white rounded hover:bg-zinc-700 transition font-medium"
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
