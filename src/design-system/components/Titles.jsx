import React from "react";

/**
 * Títols unificats del Design System.
 *
 * - PageTitle: títol de pàgina (h2, 3xl, serif)
 * - BoxTitle: títol amb icona de les boxes de l'inici (h3, icona)
 * - BookTitle: títol dels llibres (h3, lg, serif)
 * - SectionTitle: títol de subseccions comunitat (h3, uppercase, tracking)
 */

export function PageTitle({ children, subtitle, className = "" }) {
  return (
    <div className={className}>
      <h2 className="text-3xl font-serif text-[var(--color-text-primary)] mb-2">{children}</h2>
      {subtitle && <p className="text-[var(--color-text-secondary)]">{subtitle}</p>}
    </div>
  );
}

export function BoxTitle({ icon: Icon, children, className = "" }) {
  return (
    <h3
      className={`text-sm font-medium text-[var(--color-text-secondary)] flex items-center gap-3 mb-4 ${className}`}
    >
      {Icon && <Icon className="w-6 h-6 text-[var(--color-primary)]" />}
      {children}
    </h3>
  );
}

export function BookTitle({ children, className = "" }) {
  return (
    <h3
      className={`font-serif text-lg text-[var(--color-text-primary)] line-clamp-2 ${className}`}
    >
      {children}
    </h3>
  );
}

export function SectionTitle({ children, className = "" }) {
  return (
    <h3
      className={`text-sm font-medium text-[var(--color-primary)] uppercase tracking-wide ${className}`}
    >
      {children}
    </h3>
  );
}
