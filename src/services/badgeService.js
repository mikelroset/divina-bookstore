import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "./firebase";
import { BADGE_CATALOG } from "../utils/badgeCatalog";
import { computeStreak } from "./userPrefsService";

const BADGES_DOC = "badges";

/**
 * @param {string} userId
 * @returns {Promise<{ unlockedBadgeIds: string[], unlockedAt: Record<string, number> }>}
 */
export async function getBadgeData(userId) {
  if (!userId) return { unlockedBadgeIds: [], unlockedAt: {} };
  try {
    const ref = doc(db, "users", userId, "prefs", BADGES_DOC);
    const snap = await getDoc(ref);
    const data = snap.exists() ? snap.data() : {};
    return {
      unlockedBadgeIds: Array.isArray(data.unlockedBadgeIds) ? data.unlockedBadgeIds : [],
      unlockedAt: data.unlockedAt && typeof data.unlockedAt === "object" ? data.unlockedAt : {},
    };
  } catch (err) {
    console.error("Error al obtenir badges:", err);
    return { unlockedBadgeIds: [], unlockedAt: {} };
  }
}

/**
 * @param {string} userId
 * @returns {Promise<Set<string>>}
 */
export async function getUnlockedBadgeIds(userId) {
  const { unlockedBadgeIds } = await getBadgeData(userId);
  return new Set(unlockedBadgeIds);
}

/**
 * Desbloqueja un badge i el persisteix.
 * @param {string} userId
 * @param {string} badgeId
 * @returns {Promise<void>}
 */
export async function unlockBadge(userId, badgeId) {
  if (!userId || !badgeId) return;
  const { unlockedBadgeIds, unlockedAt } = await getBadgeData(userId);
  if (unlockedBadgeIds.includes(badgeId)) return;
  const nextIds = [...unlockedBadgeIds, badgeId];
  const nextAt = { ...unlockedAt, [badgeId]: Date.now() };
  const ref = doc(db, "users", userId, "prefs", BADGES_DOC);
  await setDoc(ref, { unlockedBadgeIds: nextIds, unlockedAt: nextAt }, { merge: true });
}

/**
 * Evalua i desbloqueja tots els badges que l'usuari compleix. Retorna els nous desbloquejats.
 * Si context és buit, es carreguen books i readingActivityDays des de Firestore.
 * @param {string} userId
 * @param {Object} [context] - { books, readingActivityDays } (opcional)
 * @returns {Promise<Array<{ id: string, name: string, image: string }>>}
 */
export async function evaluateAndUnlockBadges(userId, context = {}) {
  if (!userId) return [];
  let ctx = { books: [], readingActivityDays: [], ...context };
  if ((!ctx.books || ctx.books.length === 0) && (!ctx.readingActivityDays || ctx.readingActivityDays.length === 0)) {
    const [books, prefs] = await Promise.all([
      import("./bookService").then((m) => m.bookService.getUserBooks(userId)),
      import("./userPrefsService").then((m) => m.getUserPrefs(userId)),
    ]);
    ctx = { ...ctx, books: books ?? [], readingActivityDays: prefs?.readingActivityDays ?? [] };
  }
  const { unlockedBadgeIds } = await getBadgeData(userId);
  const unlocked = new Set(unlockedBadgeIds);
  const newlyUnlocked = [];

  const stats = computeStats(ctx);
  const socialStats = await fetchSocialStats(userId);

  for (const badge of BADGE_CATALOG) {
    if (unlocked.has(badge.id)) continue;
    const ok = evaluateBadge(badge, { ...stats, ...socialStats });
    if (ok) {
      await unlockBadge(userId, badge.id);
      unlocked.add(badge.id);
      newlyUnlocked.push({ id: badge.id, name: badge.name, image: badge.image });
    }
  }
  return newlyUnlocked;
}

function computeStats(context) {
  const { books = [], readingActivityDays = [] } = context;
  const completed = books.filter((b) => b.status === "completed");
  const uniqueBookIds = new Set(completed.map((b) => b.id).filter(Boolean));
  const completedCount = uniqueBookIds.size;

  let totalPages = 0;
  const allPageLogs = [];
  const completedGenres = new Set();
  const completedByMonth = {};
  let maxBookPages = 0;
  let hasClassic = false;
  let classicsCount = 0;

  for (const b of books) {
    const pages = parseInt(b.pages, 10) || 0;
    const current = parseInt(b.currentPage, 10) || 0;
    totalPages += Math.min(current, pages) || current;
    if (b.pageLog && Array.isArray(b.pageLog)) {
      allPageLogs.push(...b.pageLog.map((e) => ({ ...e, bookId: b.id })));
    }
    if (b.status === "completed") {
      if (b.genre) completedGenres.add(String(b.genre).trim());
      if (b.pages) maxBookPages = Math.max(maxBookPages, parseInt(b.pages, 10));
      if (b.genre && String(b.genre).toLowerCase().includes("clàssic")) {
        hasClassic = true;
        classicsCount++;
      }
      const end = b.endDate ? new Date(b.endDate) : null;
      if (end) {
        const m = end.getMonth() + 1;
        completedByMonth[m] = (completedByMonth[m] || 0) + 1;
      }
    }
  }

  const firstPage = allPageLogs.some((e) => (e.page || 0) >= 1);
  const streak = computeStreak(readingActivityDays);
  const totalActivityDays = readingActivityDays.length;

  const pagesByDay = {};
  const pagesByWeekend = {};
  const nightReadings = new Set();
  const morningReadings = new Set();

  for (const b of books) {
    const log = (b.pageLog || []).slice().sort((a, x) => (a.at || 0) - (x.at || 0));
    for (let i = 1; i < log.length; i++) {
      const delta = (log[i].page || 0) - (log[i - 1].page || 0);
      if (delta <= 0) continue;
      const d = new Date(log[i].at).toISOString().slice(0, 10);
      const hour = new Date(log[i].at).getHours();
      pagesByDay[d] = (pagesByDay[d] || 0) + delta;
      if (hour >= 0 && hour < 6) nightReadings.add(d);
      if (hour >= 6 && hour < 12) morningReadings.add(d);
      if (isWeekendDay(log[i].at)) {
        const key = getWeekendKey(log[i].at);
        pagesByWeekend[key] = (pagesByWeekend[key] || 0) + delta;
      }
    }
  }

  let maxPagesInDay = 0;
  for (const v of Object.values(pagesByDay)) {
    if (v > maxPagesInDay) maxPagesInDay = v;
  }
  let maxPagesInWeekend = 0;
  for (const v of Object.values(pagesByWeekend)) {
    if (v > maxPagesInWeekend) maxPagesInWeekend = v;
  }

  const nightStreak = computeConsecutiveFromSet(nightReadings);
  const morningStreak = computeConsecutiveFromSet(morningReadings);

  const thisMonth = new Date().getMonth() + 1;
  const booksThisMonth = completed.filter((b) => {
    const end = b.endDate ? new Date(b.endDate) : null;
    return end && end.getMonth() + 1 === thisMonth;
  }).length;

  return {
    firstPage,
    completedCount,
    totalPages,
    streak,
    totalActivityDays,
    genresCount: completedGenres.size,
    hasClassic,
    classicsCount,
    maxBookPages,
    maxPagesInDay,
    maxPagesInWeekend,
    readAfterMidnight: nightReadings.size > 0,
    nightStreak,
    morningStreak,
    booksThisMonth,
    completedByMonth,
  };
}

function getWeekendStart() {
  const d = new Date();
  const day = d.getDay();
  const diff = day === 0 ? 6 : day - 6;
  d.setDate(d.getDate() - diff);
  return d.toISOString().slice(0, 10);
}

function isWeekendDay(ts) {
  const d = new Date(ts);
  const day = d.getDay();
  return day === 0 || day === 6;
}

function getWeekendKey(ts) {
  const d = new Date(ts);
  const day = d.getDay();
  const diff = day === 0 ? 6 : day - 6;
  d.setDate(d.getDate() - diff);
  return d.toISOString().slice(0, 10);
}

function computeConsecutiveFromSet(dateSet) {
  if (!dateSet || dateSet.size === 0) return 0;
  const sorted = [...dateSet].filter(Boolean).sort().reverse();
  const start = sorted[0];
  let streak = 1;
  let check = new Date(start);
  check.setDate(check.getDate() - 1);
  let expect = check.toISOString().slice(0, 10);
  while (dateSet.has(expect)) {
    streak++;
    check.setDate(check.getDate() - 1);
    expect = check.toISOString().slice(0, 10);
  }
  return streak;
}

/**
 * @param {string} userId
 * @returns {Promise<{ reviewsCount: number, encouragementsSent: number, hasReviewWith10Likes: boolean }>}
 */
async function fetchSocialStats(userId) {
  try {
    const [reviewsCount, encouragementsSent, hasReviewWith10Likes] = await Promise.all([
      getReviewsCountByAuthor(userId),
      getEncouragementsSentCount(userId),
      hasUserReviewWithMinLikes(userId, 10),
    ]);
    return { reviewsCount, encouragementsSent, hasReviewWith10Likes };
  } catch (err) {
    console.warn("Error fetching social stats for badges:", err);
    return { reviewsCount: 0, encouragementsSent: 0, hasReviewWith10Likes: false };
  }
}

async function getReviewsCountByAuthor(userId) {
  const { collection, query, where, getDocs } = await import("firebase/firestore");
  const q = query(
    collection(db, "reviews"),
    where("authorUserId", "==", userId),
  );
  const snap = await getDocs(q);
  return snap.docs.length;
}

async function getEncouragementsSentCount(userId) {
  const { collection, query, where, getDocs } = await import("firebase/firestore");
  const q = query(
    collection(db, "encouragements"),
    where("fromUserId", "==", userId),
  );
  const snap = await getDocs(q);
  return snap.docs.length;
}

async function hasUserReviewWithMinLikes(userId, minLikes) {
  const { collection, query, where, getDocs } = await import("firebase/firestore");
  const q = query(
    collection(db, "reviews"),
    where("authorUserId", "==", userId),
  );
  const snap = await getDocs(q);
  return snap.docs.some((d) => (d.data().likeCount ?? 0) >= minLikes);
}

function evaluateBadge(badge, stats) {
  const cond = badge.condition;
  const val = badge.conditionValue;

  switch (cond) {
    case "first_page":
      return stats.firstPage === true;
    case "books_completed":
      return stats.completedCount >= (val ?? 1);
    case "total_pages":
      return stats.totalPages >= (val ?? 0);
    case "streak_days":
      return stats.streak >= (val ?? 0);
    case "total_activity_days":
      return stats.totalActivityDays >= (val ?? 0);
    case "genres_count":
      return stats.genresCount >= (val ?? 0);
    case "classics_completed":
      return stats.classicsCount >= (val ?? 0);
    case "book_pages_min":
      return stats.maxBookPages >= (val ?? 0);
    case "pages_in_day":
      return stats.maxPagesInDay >= (val ?? 0);
    case "pages_in_weekend":
      return stats.maxPagesInWeekend >= (val ?? 0);
    case "read_after_midnight":
      return stats.readAfterMidnight === true;
    case "reviews_count":
      return stats.reviewsCount >= (val ?? 0);
    case "review_with_10_likes":
      return stats.hasReviewWith10Likes === true;
    case "encouragements_sent":
      return stats.encouragementsSent >= (val ?? 0);
    case "night_streak":
      return stats.nightStreak >= (val ?? 0);
    case "morning_streak":
      return stats.morningStreak >= (val ?? 0);
    case "books_in_month":
      return stats.booksThisMonth >= (val ?? 0);
    case "book_completed_in_month":
      return (stats.completedByMonth[val] ?? 0) > 0;
    case "book_completed_in_summer":
      return (stats.completedByMonth[7] ?? 0) > 0 || (stats.completedByMonth[8] ?? 0) > 0;
    case "architect":
      return (
        stats.completedCount >= 100 &&
        stats.totalPages >= 10000 &&
        stats.genresCount >= 10
      );
    default:
      return false;
  }
}
