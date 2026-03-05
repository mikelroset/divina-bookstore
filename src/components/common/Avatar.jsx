import React, { useState } from "react";
import { User } from "lucide-react";

/**
 * Avatar d'usuari amb fallback a placeholder (inicials o icona) quan la URL és buida o falla.
 */
export function Avatar({ src, alt = "Avatar no disponible", displayName, className = "w-10 h-10 rounded-full border-2 border-primary-500" }) {
  const [error, setError] = useState(false);
  const showPlaceholder = !src || error;

  const initials = displayName?.trim()
    ? displayName.trim().charAt(0).toUpperCase()
    : null;

  if (showPlaceholder) {
    return (
      <div
        className={`${className} flex items-center justify-center bg-slate-200 text-slate-600 font-medium text-sm overflow-hidden`}
        role="img"
        aria-label={alt}
      >
        {initials ? (
          <span aria-hidden>{initials}</span>
        ) : (
          <User className="w-1/2 h-1/2 text-slate-400" aria-hidden />
        )}
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      className={className}
      loading="lazy"
      onError={() => setError(true)}
    />
  );
}
