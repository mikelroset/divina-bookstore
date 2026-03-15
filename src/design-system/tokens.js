/**
 * Design tokens centralitzats per al Design System.
 * Es mapen a classes Tailwind i es poden usar per documentació o generació d'estils.
 *
 * La UI usa variables CSS del tema (theme.css): --color-primary, --color-text-primary, etc.
 * Aquests tokens són per referència o ús en JS; els components han de preferir var(--color-*).
 *
 * Ús: import { TOKENS } from '../design-system/tokens';
 * Classes: TOKENS.input.base, TOKENS.spacing.md, etc.
 */
export const TOKENS = {
  colors: {
    /** Paleta primary: blau sky (light theme). Dark theme usa --color-primary del CSS. */
    primary: {
      50: "#f0f9ff",
      100: "#e0f2fe",
      200: "#bae6fd",
      300: "#7dd3fc",
      400: "#38bdf8",
      500: "#0ea5e9",
      600: "#0284c7",
      700: "#0369a1",
      800: "#075985",
      900: "#0c4a6e",
    },
    accent: {
      500: "#d97706",
      600: "#b45309",
    },
    slate: {
      100: "#f1f5f9",
      200: "#e2e8f0",
      500: "#64748b",
      600: "#475569",
      700: "#334155",
      800: "#1e293b",
    },
  },

  spacing: {
    sm: "0.5rem",   // 8px - px-2 py-2
    md: "1rem",     // 16px - px-4 py-3
    lg: "1.5rem",   // 24px
    xl: "2rem",     // 32px
  },

  borderRadius: {
    md: "0.5rem",   // 8px - rounded-lg
    lg: "0.75rem",  // 12px - rounded-xl
    xl: "1rem",     // 16px - rounded-2xl
  },

  typography: {
    fontSerif: "Playfair Display, serif",
    fontSans: "system-ui, sans-serif",
  },

  /** Classes Tailwind per als components (per consistència) */
  input: {
    base: "w-full px-4 py-2 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl focus:outline-none focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)]/30 text-[var(--color-text-primary)] placeholder-[var(--color-text-secondary)]/70 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-150",
    error: "border-[var(--color-error)] focus:border-[var(--color-error)] focus:ring-[var(--color-error)]/30",
  },

  shadow: {
    sm: "shadow-sm",
    md: "shadow-lg",
  },
};
