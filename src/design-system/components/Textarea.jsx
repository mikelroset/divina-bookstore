import React from "react";
import { TOKENS } from "../tokens";

/**
 * Textarea - camp de text multilínia del Design System.
 *
 * Ús: descripcions, comentaris, sinopsis.
 * Variants: suporta label, placeholder, error, disabled.
 */
export function Textarea({
  label,
  id,
  error,
  className = "",
  rows = 4,
  ...props
}) {
  const inputId = id || `textarea-${Math.random().toString(36).slice(2)}`;
  const inputClasses = [
    TOKENS.input.base,
    error && TOKENS.input.error,
    "resize-y min-h-[6rem]",
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
      <textarea
        id={inputId}
        rows={rows}
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
