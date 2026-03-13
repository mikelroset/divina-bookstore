import React from "react";

/**
 * ProgressBar - barra de progrés del Design System.
 *
 * Variants:
 * - primary: bloc de progrés de lectura de l'inici (track slate-100, fill slate-700)
 * - secondary: llegint ara a inici, punts totals al perfil (track slate-200, fill primary-500)
 *
 * Ús: ReadingBookBlock, ProfileView, ReaderCard.
 */
export function ProgressBar({
  value = 0,
  max = 100,
  showLabel = false,
  label,
  variant = "primary",
  height = "md",
  className = "",
}) {
  const pct = max > 0 ? Math.min(100, Math.max(0, (value / max) * 100)) : 0;

  const trackClasses = {
    primary: "bg-slate-100",
    secondary: "bg-slate-200",
  };

  const fillClasses = {
    primary: "bg-slate-700",
    secondary: "bg-primary-500",
  };

  const heightClasses = { sm: "h-2", md: "h-4" };
  const h = heightClasses[height] || heightClasses.md;

  return (
    <div className={className}>
      <div
        className={`${trackClasses[variant] || trackClasses.primary} rounded-full overflow-hidden ${h}`}
      >
        <div
          className={`${fillClasses[variant] || fillClasses.primary} h-full rounded-full transition-all duration-500`}
          style={{ width: `${pct}%` }}
        />
      </div>
      {showLabel && (
        <p className="text-right mt-1 text-sm font-medium text-slate-700">
          {label ?? `${Math.round(pct)}% completat`}
        </p>
      )}
    </div>
  );
}
