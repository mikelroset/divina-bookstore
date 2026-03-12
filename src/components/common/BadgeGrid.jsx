import React, { useState } from "react";
import { BADGE_CATALOG, CATEGORY_ORDER } from "../../utils/badgeCatalog";

/**
 * Tooltip o modal amb informació del badge.
 * Desktop: es mostra en hover. Mobile: en tap.
 */
function BadgeTooltip({ badge, unlocked, onClose }) {
  return (
    <div
      className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 z-50 w-56 rounded-xl border border-primary-500 bg-white p-3 shadow-xl"
      role="tooltip"
    >
      <img
        src={badge.image}
        alt=""
        className={`w-12 h-12 mx-auto mb-2 rounded-lg object-cover ${!unlocked ? "grayscale opacity-70" : ""}`}
        loading="lazy"
      />
      <p className="font-semibold text-slate-800 text-sm">{badge.name}</p>
      <p className="text-xs text-slate-600 mt-1">{badge.description}</p>
      <p className="text-xs text-primary-600 mt-2">
        {unlocked ? "Desbloquejat" : `Condició: ${getConditionLabel(badge)}`}
      </p>
      {onClose && (
        <button
          type="button"
          onClick={onClose}
          className="mt-2 w-full py-1 text-xs text-primary-600 hover:underline"
        >
          Tancar
        </button>
      )}
    </div>
  );
}

function getConditionLabel(badge) {
  const v = badge.conditionValue;
  switch (badge.condition) {
    case "books_completed":
      return `${v} llibres completats`;
    case "total_pages":
      return `${v?.toLocaleString?.() ?? v} pàgines llegides`;
    case "streak_days":
      return `${v} dies seguits`;
    case "genres_count":
      return `${v} gèneres diferents`;
    case "classics_completed":
      return `${v} clàssic(s) completat(s)`;
    case "book_pages_min":
      return `Llibre de ${v}+ pàgines`;
    case "pages_in_day":
      return `${v} pàgines en un dia`;
    case "reviews_count":
      return `${v} ressenyes publicades`;
    case "encouragements_sent":
      return `${v} encoratjaments enviats`;
    default:
      return badge.description;
  }
}

export function BadgeCard({ badge, unlocked }) {
  const [showTooltip, setShowTooltip] = useState(false);

  return (
    <div className="relative group">
      <button
        type="button"
        onClick={() => setShowTooltip((s) => !s)}
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        className="flex flex-col items-center p-2 rounded-xl hover:bg-primary-50 transition-colors focus:outline-none focus:ring-2 focus:ring-primary-300"
        aria-label={badge.name}
      >
        <img
          src={badge.image}
          alt={badge.name}
          className={`w-14 h-14 rounded-lg object-cover transition-all ${!unlocked ? "grayscale opacity-60" : ""}`}
          loading="lazy"
        />
        <span className="text-xs font-medium text-slate-700 mt-1 truncate max-w-full">
          {badge.name}
        </span>
      </button>
      {showTooltip && (
        <BadgeTooltip
          badge={badge}
          unlocked={unlocked}
          onClose={() => setShowTooltip(false)}
        />
      )}
    </div>
  );
}

/**
 * Ordena badges: desbloquejats primer, després bloquejats; dins de cada grup per categoria i dificultat.
 */
function sortBadges(catalog, unlockedIds) {
  return [...catalog].sort((a, b) => {
    const aUnlocked = unlockedIds.has(a.id);
    const bUnlocked = unlockedIds.has(b.id);
    if (aUnlocked !== bUnlocked) return aUnlocked ? -1 : 1;
    const catA = CATEGORY_ORDER.indexOf(a.category);
    const catB = CATEGORY_ORDER.indexOf(b.category);
    if (catA !== catB) return catA - catB;
    return (a.difficulty ?? 0) - (b.difficulty ?? 0);
  });
}

export function BadgeGrid({ unlockedIds = new Set() }) {
  const sorted = sortBadges(BADGE_CATALOG, unlockedIds);

  return (
    <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 gap-3">
      {sorted.map((badge) => (
        <BadgeCard key={badge.id} badge={badge} unlocked={unlockedIds.has(badge.id)} />
      ))}
    </div>
  );
}
