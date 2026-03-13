import React from "react";
import { ChevronDown } from "lucide-react";

/**
 * Select - selector del Design System.
 *
 * Fletxa amb espai (padding-right) per no quedar enganxada a la dreta.
 * Ús: selector de comunitat, filtres, etc.
 */
export function Select({
  label,
  id,
  error,
  className = "",
  options = [],
  children,
  value,
  onChange,
  "aria-label": ariaLabel,
  ...props
}) {
  const selectId = id || `select-${Math.random().toString(36).slice(2)}`;
  const baseClasses =
    "w-full sm:w-auto px-4 py-2.5 pr-10 bg-white/80 border border-primary-500 rounded-xl focus:outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-200 text-slate-700 appearance-none cursor-pointer";
  const classes = [baseClasses, error && "border-red-500", className]
    .filter(Boolean)
    .join(" ");

  return (
    <div>
      {label && (
        <label
          htmlFor={selectId}
          className="block text-sm font-medium text-slate-700 mb-1"
        >
          {label}
        </label>
      )}
      <div className="relative inline-block">
        <select
          id={selectId}
          value={value}
          onChange={onChange}
          className={classes}
          aria-label={ariaLabel || label}
          aria-invalid={!!error}
          {...props}
        >
          {options.length > 0
            ? options.map((opt) => (
                <option
                  key={opt.value}
                  value={opt.value}
                  disabled={opt.disabled}
                >
                  {opt.label}
                </option>
              ))
            : children}
        </select>
        <ChevronDown
          className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 pointer-events-none"
          aria-hidden
        />
      </div>
      {error && (
        <p className="text-sm text-red-600 mt-1" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
