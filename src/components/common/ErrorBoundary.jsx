import React from "react";

/**
 * Error Boundary que captura errors de render i mostra una pantalla de fallada.
 * Permet retry recarregant el component.
 */
export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught:", error, errorInfo);
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-[var(--color-bg)]">
          <div className="max-w-md w-full bg-[var(--color-surface)] rounded-2xl p-8 border border-[var(--color-border)] shadow-lg text-center">
            <h1 className="text-xl font-serif text-[var(--color-text-primary)] mb-2">
              Alguna cosa ha fallat
            </h1>
            <p className="text-[var(--color-text-secondary)] mb-6">
              S'ha produït un error inesperat. Torna-ho a intentar o recarrega la pàgina.
            </p>
            <button
              type="button"
              onClick={this.handleRetry}
              className="px-6 py-3 bg-[var(--color-primary)] hover:opacity-90 text-white font-medium rounded-xl transition-colors"
            >
              Tornar a intentar
            </button>
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="mt-3 block w-full px-6 py-2 text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] text-sm"
            >
              Recarregar la pàgina
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
