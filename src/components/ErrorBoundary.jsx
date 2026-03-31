import React from 'react';

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center p-6 text-center text-white font-sans">
          <div className="bg-slate-800 p-8 rounded-3xl border border-slate-700 max-w-lg shadow-2xl">
            <h1 className="text-3xl font-bold text-red-500 mb-4">Something went wrong.</h1>
            <p className="text-slate-300 mb-6">A critical error crashed the React tree. Our engineers have been notified.</p>
            <p className="text-sm bg-slate-900 p-4 rounded-xl text-red-400 overflow-x-auto text-left break-all font-mono">
              {this.state.error?.toString()}
            </p>
            <button 
              onClick={() => window.location.reload()} 
              className="mt-8 px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-medium rounded-full shadow-lg transition-colors"
            >
              Reload Page
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
