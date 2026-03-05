import React, { useState } from "react";
import { BookOpen } from "lucide-react";

/**
 * Portada de llibre amb fallback a placeholder quan la URL és buida o falla la càrrega.
 * Manté la mateixa mida per evitar layout shift.
 */
export function BookCover({ src, alt = "Portada no disponible", className = "w-full h-48 object-cover rounded-xl shadow-md" }) {
  const [error, setError] = useState(false);
  const showPlaceholder = !src || error;

  if (showPlaceholder) {
    return (
      <div
        className={`${className} flex items-center justify-center bg-slate-200 rounded-xl shadow-md`}
        role="img"
        aria-label={alt}
      >
        <BookOpen className="w-12 h-12 text-slate-400" aria-hidden />
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      className={className}
      onError={() => setError(true)}
    />
  );
}
