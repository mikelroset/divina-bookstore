import React from "react";
import { Star } from "lucide-react";

/**
 * StarRating - visualització d'estrelles (1-5) del Design System.
 *
 * Ús: BookCard, BookForm, ressenyes.
 * Variants: readOnly (default), interactive (per seleccionar valor).
 */
export function StarRating({
  value = 0,
  max = 5,
  size = "md",
  readOnly = true,
  onChange,
  className = "",
}) {
  const sizeClasses = { sm: "w-4 h-4", md: "w-5 h-5", lg: "w-6 h-6" };
  const s = sizeClasses[size] || sizeClasses.md;

  return (
    <div
      className={`flex items-center gap-1 ${className}`}
      role={readOnly ? "img" : "group"}
      aria-label={`Valoració: ${value} de ${max} estrelles`}
    >
      {[...Array(max)].map((_, i) => {
        const filled = i < Math.round(value);
        const star = (
          <Star
            key={i}
            className={`${s} shrink-0 ${
              filled ? "fill-[var(--color-primary)] text-[var(--color-primary)]" : "text-[var(--color-border)]"
            }`}
          />
        );
        if (readOnly) return star;
        return (
          <button
            key={i}
            type="button"
            onClick={() => onChange?.(i + 1)}
            className="p-0.5 rounded focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/30"
            aria-label={`${i + 1} estrelles`}
          >
            {star}
          </button>
        );
      })}
    </div>
  );
}
