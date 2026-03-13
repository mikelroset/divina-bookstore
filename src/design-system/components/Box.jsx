import React from "react";

/**
 * Box - contenidor unificat del Design System.
 *
 * Estil: border verd (primary-500), fons blanc, ombra gris.
 * Unifica les boxes del perfil i de la resta de l'app.
 *
 * Variants:
 * - default: bg-white/80, border-primary-500, shadow-lg (pàgines principals)
 * - soft: bg-primary-50, border-primary-500 (caixes del perfil, estadístiques)
 */
export function Box({
  as: Comp = "div",
  children,
  variant = "default",
  className = "",
  padding = "lg",
  ...props
}) {
  const baseClasses = "rounded-2xl border border-primary-500";
  const variantClasses = {
    default:
      "bg-white/80 backdrop-blur-sm shadow-lg",
    soft: "bg-primary-50",
  };
  const paddingClasses = {
    sm: "p-4",
    md: "p-5",
    lg: "p-6",
    xl: "p-12",
  };
  const classes = [
    baseClasses,
    variantClasses[variant] || variantClasses.default,
    paddingClasses[padding] || paddingClasses.lg,
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <Comp className={classes} {...props}>
      {children}
    </Comp>
  );
}
