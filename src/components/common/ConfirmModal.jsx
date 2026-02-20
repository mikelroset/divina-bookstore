import React, { useEffect } from "react";

/**
 * Modal de confirmació reutilitzable.
 * @param {boolean} open - Si el modal és visible
 * @param {string} title - Títol del modal
 * @param {string} message - Text del cos
 * @param {string} [confirmLabel="Confirmar"] - Text del botó principal
 * @param {string} [cancelLabel="Cancel·lar"] - Text del botó secundari
 * @param {string} [confirmVariant="danger"] - "danger" (vermell) o "primary"
 * @param {() => void} onConfirm - Cridat en confirmar
 * @param {() => void} onCancel - Cridat en cancel·lar o tancar
 */
export const ConfirmModal = ({
  open,
  title,
  message,
  confirmLabel = "Confirmar",
  cancelLabel = "Cancel·lar",
  confirmVariant = "danger",
  onConfirm,
  onCancel,
}) => {
  useEffect(() => {
    if (!open) return;
    const handleEscape = (e) => {
      if (e.key === "Escape") onCancel();
    };
    document.addEventListener("keydown", handleEscape);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "";
    };
  }, [open, onCancel]);

  if (!open) return null;

  const confirmClass =
    confirmVariant === "danger"
      ? "bg-red-600 hover:bg-red-700 focus:ring-red-500"
      : "bg-primary-600 hover:bg-primary-700 focus:ring-primary-500";

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="confirm-modal-title"
      aria-describedby="confirm-modal-desc"
    >
      <div
        className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm"
        onClick={onCancel}
        aria-hidden="true"
      />
      <div className="relative w-full max-w-md rounded-2xl bg-white p-6 shadow-xl border border-slate-200">
        <h2
          id="confirm-modal-title"
          className="text-lg font-semibold text-slate-800 mb-2"
        >
          {title}
        </h2>
        <p id="confirm-modal-desc" className="text-slate-600 mb-6">
          {message}
        </p>
        <div className="flex gap-3 justify-end">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 rounded-xl font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2"
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className={`px-4 py-2 rounded-xl font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2 ${confirmClass}`}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
};
