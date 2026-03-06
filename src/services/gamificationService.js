import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "./firebase";

const GAMIFICATION_DOC = "gamification";
const POINTS_PER_10_PAGES = 1;
const POINTS_PER_BOOK_COMPLETED = 10;
const POINTS_STREAK_BONUS = 5;
const STREAK_BONUS_EVERY_DAYS = 5;
const POINTS_PER_LEVEL = 100;
const MAX_PAGES_DELTA_PER_UPDATE = 300;

function weekKey() {
  const d = new Date();
  const start = new Date(d);
  start.setDate(d.getDate() - d.getDay());
  return start.toISOString().slice(0, 10);
}

function monthKey() {
  return new Date().toISOString().slice(0, 7);
}

export function pointsToLevel(points) {
  return 1 + Math.floor((points ?? 0) / POINTS_PER_LEVEL);
}

export function pointsToNextLevel(points) {
  const current = points ?? 0;
  const nextLevelAt = pointsToLevel(current) * POINTS_PER_LEVEL;
  return Math.max(0, nextLevelAt - current);
}

export async function getGamification(userId) {
  if (!userId) return defaultGamification();
  try {
    const ref = doc(db, "users", userId, "prefs", GAMIFICATION_DOC);
    const snap = await getDoc(ref);
    const data = snap.exists() ? snap.data() : {};
    return {
      totalPoints: data.totalPoints ?? 0,
      pointsThisWeek: data.pointsThisWeek ?? 0,
      pointsThisMonth: data.pointsThisMonth ?? 0,
      showInLeaderboard: data.showInLeaderboard !== false,
      completedBookIds: Array.isArray(data.completedBookIds) ? data.completedBookIds : [],
      lastStreakBonusDay: data.lastStreakBonusDay ?? null,
      lastWeekKey: data.lastWeekKey ?? null,
      lastMonthKey: data.lastMonthKey ?? null,
    };
  } catch (err) {
    console.error("Error al obtenir gamificació:", err);
    return defaultGamification();
  }
}

function defaultGamification() {
  return {
    totalPoints: 0,
    pointsThisWeek: 0,
    pointsThisMonth: 0,
    showInLeaderboard: true,
    completedBookIds: [],
    lastStreakBonusDay: null,
    lastWeekKey: null,
    lastMonthKey: null,
  };
}

async function ensurePeriodReset(userId, g) {
  const wk = weekKey();
  const mk = monthKey();
  let updates = {};
  if (g.lastWeekKey !== wk) {
    updates.pointsThisWeek = 0;
    updates.lastWeekKey = wk;
  }
  if (g.lastMonthKey !== mk) {
    updates.pointsThisMonth = 0;
    updates.lastMonthKey = mk;
  }
  if (Object.keys(updates).length > 0) {
    await setDoc(
      doc(db, "users", userId, "prefs", GAMIFICATION_DOC),
      { ...g, ...updates },
      { merge: true },
    );
    return { ...g, ...updates };
  }
  return g;
}

/**
 * Afegeix punts. Actualitza totalPoints, pointsThisWeek, pointsThisMonth.
 * Reseteja setmanal/mensual si ha canviat el període.
 */
export async function addPoints(userId, amount, reason = "unknown") {
  if (!userId || amount <= 0) return;
  try {
    let g = await getGamification(userId);
    g = await ensurePeriodReset(userId, g);
    const total = (g.totalPoints ?? 0) + amount;
    const week = (g.pointsThisWeek ?? 0) + amount;
    const month = (g.pointsThisMonth ?? 0) + amount;
    await setDoc(
      doc(db, "users", userId, "prefs", GAMIFICATION_DOC),
      {
        ...g,
        totalPoints: total,
        pointsThisWeek: week,
        pointsThisMonth: month,
        lastWeekKey: g.lastWeekKey ?? weekKey(),
        lastMonthKey: g.lastMonthKey ?? monthKey(),
      },
      { merge: true },
    );
  } catch (err) {
    console.error("Error al afegir punts:", err);
    throw err;
  }
}

/**
 * Atorga +10 punts per llibre completat. Idempotent.
 */
export async function grantCompletedBookBonus(userId, bookId) {
  if (!userId || !bookId) return;
  const g = await getGamification(userId);
  if ((g.completedBookIds ?? []).includes(bookId)) return;
  await addPoints(userId, POINTS_PER_BOOK_COMPLETED, "book_completed");
  const completed = [...(g.completedBookIds ?? []), bookId];
  await setDoc(
    doc(db, "users", userId, "prefs", GAMIFICATION_DOC),
    { completedBookIds: completed },
    { merge: true },
  );
}

/**
 * Atorga +5 punts per ratxa cada 5 dies. Idempotent.
 * @param {number} streak - ratxa actual (dies consecutius)
 */
export async function grantStreakBonus(userId, streak) {
  if (!userId || streak < STREAK_BONUS_EVERY_DAYS) return;
  if (streak % STREAK_BONUS_EVERY_DAYS !== 0) return;
  const g = await getGamification(userId);
  if (g.lastStreakBonusDay === streak) return;
  await addPoints(userId, POINTS_STREAK_BONUS, "streak_bonus");
  await setDoc(
    doc(db, "users", userId, "prefs", GAMIFICATION_DOC),
    { lastStreakBonusDay: streak },
    { merge: true },
  );
}

/**
 * Punt per pàgines: +1 per cada 10 pàgines noves. No premia delta <= 0 ni > 300 (antitrampa).
 */
export async function addPointsForPages(userId, deltaPages, totalPages) {
  if (!userId || totalPages == null || totalPages <= 0) return;
  if (deltaPages <= 0) return;
  if (deltaPages > MAX_PAGES_DELTA_PER_UPDATE) return;
  const points = Math.floor(deltaPages / 10);
  if (points > 0) await addPoints(userId, points, "pages_read");
}

export async function setShowInLeaderboard(userId, show) {
  if (!userId) return;
  await setDoc(
    doc(db, "users", userId, "prefs", GAMIFICATION_DOC),
    { showInLeaderboard: !!show },
    { merge: true },
  );
}

/**
 * Obté el leaderboard per a una comunitat.
 * @param {string[]} memberUserIds - userIds dels membres
 * @param {'week'|'month'|'all'} period
 * @returns {Promise<Array<{ userId: string, displayName?: string, points: number, rank: number }>>}
 */
export async function getLeaderboard(memberUserIds, period, displayNames = {}) {
  if (!memberUserIds?.length) return [];
  const results = await Promise.all(
    memberUserIds.map(async (uid) => {
      const g = await getGamification(uid);
      if (g.showInLeaderboard === false) return null;
      let points = g.totalPoints ?? 0;
      if (period === "week") points = g.pointsThisWeek ?? 0;
      else if (period === "month") points = g.pointsThisMonth ?? 0;
      return {
        userId: uid,
        displayName: displayNames[uid] ?? "Lector",
        points,
      };
    }),
  );
  const filtered = results.filter(Boolean);
  filtered.sort((a, b) => b.points - a.points);
  return filtered.map((r, i) => ({ ...r, rank: i + 1 }));
}
