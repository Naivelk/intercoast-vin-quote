import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
  errorInfo?: ErrorInfo;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Error capturado en ErrorBoundary:", error, errorInfo);
    this.setState({ error, errorInfo });
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="bg-red-50 p-6 rounded-lg max-w-2xl mx-auto my-12">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-600" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">
                Algo salió mal
              </h3>
              <div className="mt-2 text-sm text-red-700">
                <p>Lo sentimos, ha ocurrido un error inesperado. Por favor, recarga la página o inténtalo de nuevo más tarde.</p>
                {process.env.NODE_ENV === 'development' && (
                  <details className="mt-2 text-xs text-red-600">
                    <summary>Detalles del error</summary>
                    <div className="mt-1 p-2 bg-red-100 rounded">
                      {this.state.error?.toString()}
                      <br />
                      {this.state.errorInfo?.componentStack}
                    </div>
                  </details>
                )}
              </div>
              <div className="mt-4">
                <button
                  type="button"
                  className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-red-700 bg-red-100 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                  onClick={() => window.location.reload()}
                >
                  Recargar página
                </button>
              </div>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
