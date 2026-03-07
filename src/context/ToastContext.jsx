import React, { createContext, useContext, useState, useCallback } from "react";

const ToastContext = createContext();

/**
 * Provider que ofereix una funció per mostrar missatges toast (errors o informatius) a la UI.
 * Substituïble per alert() per una experiència més consistent.
 */
export function ToastProvider({ children }) {
  const [toast, setToast] = useState(null);

  const showError = useCallback((message) => {
    setToast({ type: "error", message });
    setTimeout(() => setToast(null), 5000);
  }, []);

  const showSuccess = useCallback((message) => {
    setToast({ type: "success", message });
    setTimeout(() => setToast(null), 3000);
  }, []);

  const dismiss = useCallback(() => setToast(null), []);

  return (
    <ToastContext.Provider value={{ showError, showSuccess, dismiss }}>
      {children}
      {toast && (
        <div
          role="alert"
          className={`fixed bottom-24 left-4 right-4 z-[100] mx-auto max-w-md rounded-lg px-4 py-3 shadow-lg ${
            toast.type === "error"
              ? "bg-red-600 text-white"
              : "bg-emerald-600 text-white"
          }`}
        >
          <div className="flex items-center justify-between gap-2">
            <p className="text-sm font-medium">{toast.message}</p>
            <button
              type="button"
              onClick={dismiss}
              className="shrink-0 rounded p-1 hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-white/50"
              aria-label="Tancar"
            >
              ×
            </button>
          </div>
        </div>
      )}
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) {
    return {
      showError: (msg) => console.error("[Toast fallback]", msg),
      showSuccess: () => {},
      dismiss: () => {},
    };
  }
  return ctx;
}
