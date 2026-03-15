import React from "react";
import { Heart } from "lucide-react";

/**
 * LikeButton - botó de like per ressenyes i contingut similar.
 *
 * Ús: ReviewsView, qualsevol contingut amb like/cor.
 * Variants: liked (primary-50 bg, primary-600 text) | default (slate, hover slate-100).
 */
export function LikeButton({
  liked = false,
  count = 0,
  onClick,
  disabled = false,
  size = "md",
  className = "",
}) {
  const sizeClasses = { sm: "gap-1 px-2 py-1 text-xs", md: "gap-1.5 px-3 py-1.5 text-sm" };
  const iconSizes = { sm: "w-4 h-4", md: "w-5 h-5" };

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`flex items-center font-medium rounded-lg transition-colors shrink-0 ${
        liked
          ? "text-[var(--color-primary)] bg-[var(--color-primary-soft)]"
          : "text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-secondary)]"
      } ${sizeClasses[size]} ${className}`}
      aria-label={liked ? "Desfer like" : "Fer like"}
    >
      <Heart className={`${iconSizes[size]} ${liked ? "fill-current" : ""}`} />
      <span>{count}</span>
    </button>
  );
}
