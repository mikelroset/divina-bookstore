import React from "react";
import { Link } from "react-router-dom";

/**
 * Sistema de botons unificat (AC 4).
 * Variants: primary (acció principal), secondary (alternativa), ghost (menor).
 * Estats: normal, hover, disabled (opacity-50, cursor-not-allowed).
 */
const BASE_CLASSES =
  "inline-flex items-center justify-center gap-2 font-medium rounded-xl transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/30 focus:ring-offset-1 disabled:opacity-50 disabled:cursor-not-allowed";

const VARIANT_CLASSES = {
  primary:
    "px-4 py-3 bg-[var(--color-primary)] hover:opacity-90 active:opacity-95 text-white shadow-sm",
  secondary:
    "px-4 py-3 bg-[var(--color-secondary-bg)] border border-[var(--color-border)] text-[var(--color-secondary-text)] hover:opacity-90",
  ghost: "px-4 py-3 text-[var(--color-primary)] hover:bg-[var(--color-bg-secondary)]",
};

const SIZE_CLASSES = {
  md: "px-4 py-3 text-base",
  sm: "px-3 py-1.5 text-sm",
  lg: "px-6 py-4 text-base",
};

function ButtonContent({ icon: Icon, children }) {
  if (!Icon) return children;
  return (
    <>
      <Icon className="w-5 h-5 shrink-0" aria-hidden />
      {children}
    </>
  );
}

export function PrimaryButton({
  children,
  as,
  to,
  href,
  icon,
  size = "md",
  className = "",
  ...props
}) {
  const classes = `${BASE_CLASSES} ${VARIANT_CLASSES.primary} ${SIZE_CLASSES[size] || SIZE_CLASSES.md} ${className}`.trim();
  const Comp = as ?? (to ? Link : href ? "a" : "button");
  const linkProps = to ? { to } : href ? { href } : {};
  return (
    <Comp className={classes} {...linkProps} {...props}>
      <ButtonContent icon={icon}>{children}</ButtonContent>
    </Comp>
  );
}

export function SecondaryButton({
  children,
  as,
  to,
  href,
  icon,
  size = "md",
  className = "",
  ...props
}) {
  const classes = `${BASE_CLASSES} ${VARIANT_CLASSES.secondary} ${SIZE_CLASSES[size] || SIZE_CLASSES.md} ${className}`.trim();
  const Comp = as ?? (to ? Link : href ? "a" : "button");
  const linkProps = to ? { to } : href ? { href } : {};
  return (
    <Comp className={classes} {...linkProps} {...props}>
      <ButtonContent icon={icon}>{children}</ButtonContent>
    </Comp>
  );
}

export function GhostButton({
  children,
  as,
  to,
  href,
  icon,
  size = "md",
  className = "",
  ...props
}) {
  const classes = `${BASE_CLASSES} ${VARIANT_CLASSES.ghost} ${SIZE_CLASSES[size] || SIZE_CLASSES.md} ${className}`.trim();
  const Comp = as ?? (to ? Link : href ? "a" : "button");
  const linkProps = to ? { to } : href ? { href } : {};
  return (
    <Comp className={classes} {...linkProps} {...props}>
      <ButtonContent icon={icon}>{children}</ButtonContent>
    </Comp>
  );
}
