import React from "react";
import { TOKENS } from "../tokens";

/**
 * TextInput - camp d'entrada de text del Design System.
 *
 * Ús: formularis, cerca, camps de text d'una línia.
 * Variants: suporta label, placeholder, error, disabled.
 */
export function TextInput({
  label,
  id,
  error,
  className = "",
  ...props
}) {
  const inputId = id || `text-input-${Math.random().toString(36).slice(2)}`;
  const inputClasses = [
    TOKENS.input.base,
    error && TOKENS.input.error,
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className="space-y-1">
      {label && (
        <label
          htmlFor={inputId}
          className="block text-sm font-medium text-slate-700"
        >
          {label}
        </label>
      )}
      <input
        id={inputId}
        type="text"
        className={inputClasses}
        aria-invalid={!!error}
        aria-describedby={error ? `${inputId}-error` : undefined}
        {...props}
      />
      {error && (
        <p
          id={`${inputId}-error`}
          className="text-sm text-red-600"
          role="alert"
        >
          {error}
        </p>
      )}
    </div>
  );
}
