/**
 * Catàleg de nivells amb noms atractius.
 * Estructura: Títol del rol — Rang mineral (Ferro → Diamant).
 * Nivell 71: Llegenda Divina.
 */

const MINERAL_RANKS = ["Ferro", "Bronze", "Plata", "Or", "Platí", "Esmeralda", "Diamant"];

const ROLES = [
  "Aprenent de Biblioteca",
  "Aprenent de Llibres",
  "Novici de la Paraula",
  "Escuder de la Tinta",
  "Cavaller de les Històries",
  "Guardià del Pergamí",
  "Cronista",
  "Arxiver Reial",
  "Gran Bibliotecari",
  "Saviesa Antiga",
];

/** Colors Tailwind per a cada rang mineral */
const MINERAL_COLORS = {
  Ferro: "text-slate-700",
  Bronze: "text-amber-800",
  Plata: "text-slate-400",
  Or: "text-amber-500",
  Platí: "text-sky-400",
  Esmeralda: "text-emerald-500",
  Diamant: "text-blue-400",
};

/** Classes per a fons/badge */
const MINERAL_BG_COLORS = {
  Ferro: "bg-slate-700",
  Bronze: "bg-amber-800",
  Plata: "bg-slate-400",
  Or: "bg-amber-500",
  Platí: "bg-sky-400",
  Esmeralda: "bg-emerald-500",
  Diamant: "bg-blue-400",
};

const CATALOG = [];

// Nivells 1-70: rol + rang mineral
for (let i = 0; i < 70; i++) {
  const roleIndex = Math.floor(i / 7);
  const mineralIndex = i % 7;
  const role = ROLES[roleIndex];
  const mineral = MINERAL_RANKS[mineralIndex];
  CATALOG.push({
    level: i + 1,
    roleName: role,
    mineralRank: mineral,
    displayName: `${role} — ${mineral}`,
  });
}

// Nivell 71
CATALOG.push({
  level: 71,
  roleName: "Llegenda Divina",
  mineralRank: null,
  displayName: "Llegenda Divina",
});

const LEVEL_MIN = 1;
const LEVEL_MAX = 71;

/**
 * @param {number} level - Nivell numèric (1-71)
 * @returns {{ level: number, roleName: string, mineralRank: string|null, displayName: string, colorClass: string, bgClass: string }}
 */
export function getLevelInfo(level) {
  const clamped = Math.max(LEVEL_MIN, Math.min(LEVEL_MAX, Math.floor(level) || 1));
  if (clamped !== level) {
    console.warn(`[levelCatalog] Nivell fora de rang: ${level}, assignat ${clamped}`);
  }
  const entry = CATALOG[clamped - 1];
  const colorClass = entry.mineralRank ? MINERAL_COLORS[entry.mineralRank] : "text-amber-500";
  const bgClass = entry.mineralRank ? MINERAL_BG_COLORS[entry.mineralRank] : "bg-amber-500";
  return {
    ...entry,
    colorClass,
    bgClass,
  };
}

/**
 * @param {string} mineralRank - Ferro, Bronze, ...
 * @returns {string} Tailwind class
 */
export function getMineralColor(mineralRank) {
  return MINERAL_COLORS[mineralRank] ?? "text-slate-600";
}

const POINTS_PER_LEVEL = 171;

/** Punts mínims per assolir cada nivell (nivell 1 = 0, nivell 2 = 171, ...) */
export function getPointsForLevel(level) {
  if (level <= 1) return 0;
  if (level >= LEVEL_MAX) return (LEVEL_MAX - 1) * POINTS_PER_LEVEL;
  return (level - 1) * POINTS_PER_LEVEL;
}

export { CATALOG, MINERAL_RANKS, ROLES };
