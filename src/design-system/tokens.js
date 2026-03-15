/**
 * Design tokens centralitzats per al Design System.
 * Es mapen a classes Tailwind i es poden usar per documentació o generació d'estils.
 *
 * Ús: import { TOKENS } from '../design-system/tokens';
 * Classes: TOKENS.input.base, TOKENS.spacing.md, etc.
 */
export const TOKENS = {
  colors: {
    primary: {
      50: "#f0fdf4",
      100: "#dcfce7",
      200: "#bbf7d0",
      300: "#86efac",
      400: "#4ade80",
      500: "#16a34a",
      600: "#15803d",
      700: "#166534",
      800: "#14532d",
      900: "#052e16",
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
    base: "w-full px-4 py-2 bg-[var(--color-surface)]/80 border border-[var(--color-border)] rounded-xl focus:outline-none focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)]/30 text-[var(--color-text-primary)] disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-150",
    error: "border-[var(--color-error)] focus:border-[var(--color-error)] focus:ring-[var(--color-error)]/30",
  },

  shadow: {
    sm: "shadow-sm",
    md: "shadow-lg",
  },
};
