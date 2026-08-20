import React, { Component, type ErrorInfo, type ReactNode } from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';
import { Button } from './ui/Button';

interface Props {
  children: ReactNode;
  fallback?: React.ComponentType<{ error: Error; resetErrorBoundary: () => void }>;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  private resetErrorBoundary = () => {
    this.setState({ hasError: false, error: null });
  };

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        const FallbackComponent = this.props.fallback;
        return <FallbackComponent error={this.state.error!} resetErrorBoundary={this.resetErrorBoundary} />;
      }

      return (
        <div className="flex flex-col items-center justify-center min-h-[300px] p-6 text-center">
          <div className="w-16 h-16 rounded-full bg-rose-500/10 flex items-center justify-center mb-4">
            <AlertTriangle size={32} className="text-rose-600 dark:text-rose-400" />
          </div>
          <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50 mb-2">
            Something went wrong
          </h2>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-6 max-w-md">
            We encountered an unexpected error. Please try refreshing the page or contact support if the problem persists.
          </p>
          <div className="flex items-center justify-center gap-3">
            <Button variant="primary" onClick={this.resetErrorBoundary} className="cursor-pointer">
              <RefreshCw size={16} />
              Try Again
            </Button>
            <Button variant="secondary" onClick={() => window.location.reload()} className="cursor-pointer">
              <Home size={16} />
              Reload Page
            </Button>
          </div>
          {import.meta.env.DEV && this.state.error && (
            <details className="mt-6 w-full max-w-md text-left">
              <summary className="text-xs text-zinc-400 dark:text-zinc-500 cursor-pointer mb-2">
                Error Details (Development)
              </summary>
              <pre className="bg-zinc-900 text-zinc-100 p-3 rounded-lg text-[10px] overflow-auto max-h-64">
                {this.state.error.toString()}
                {this.state.error.stack && `\n\nStack Trace:\n${this.state.error.stack}`}
              </pre>
            </details>
          )}
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;