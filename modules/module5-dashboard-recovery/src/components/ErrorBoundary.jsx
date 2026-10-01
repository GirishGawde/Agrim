import React from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Agrim Application Error Boundary caught:', error, errorInfo);
  }

  handleReload = () => {
    window.location.reload();
  };

  handleReset = () => {
    this.setState({ hasError: false, error: null });
    window.location.href = '/dashboard';
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] p-6 text-center">
          <div className="p-4 rounded-2xl bg-amber-950/40 border border-amber-700/50 max-w-lg w-full space-y-4 shadow-xl">
            <div className="w-12 h-12 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center mx-auto">
              <AlertTriangle size={24} />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-100">Something went wrong</h2>
              <p className="text-xs text-slate-400 mt-1">
                The recovery dashboard encountered an unexpected error while displaying this view.
              </p>
              {this.state.error?.message && (
                <pre className="mt-3 p-2.5 rounded-lg bg-slate-900 text-red-400 text-[11px] font-mono text-left overflow-x-auto border border-surface-border">
                  {this.state.error.message}
                </pre>
              )}
            </div>
            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                onClick={this.handleReload}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-primary-600 hover:bg-primary-500 text-white font-medium text-xs shadow-sm transition-all"
              >
                <RefreshCw size={13} /> Reload Page
              </button>
              <button
                onClick={this.handleReset}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-surface-border font-medium text-xs transition-all"
              >
                <Home size={13} /> Return to Dashboard
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
