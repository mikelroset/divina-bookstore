import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "./firebase";

const PREFS_COLLECTION = "prefs";
const PREFS_DOC_ID = "settings";

/**
 * Get user prefs (annual goal, reading activity days for streak).
 * Firestore: users/{uid}/prefs/settings with { annualGoal?: number, readingActivityDays?: string[] }
 */
export async function getUserPrefs(userId) {
  if (!userId) return { annualGoal: 0, readingActivityDays: [] };
  try {
    const ref = doc(db, "users", userId, PREFS_COLLECTION, PREFS_DOC_ID);
    const snap = await getDoc(ref);
    const data = snap.exists() ? snap.data() : {};
    return {
      annualGoal: data.annualGoal ?? 0,
      readingActivityDays: Array.isArray(data.readingActivityDays)
        ? data.readingActivityDays
        : [],
    };
  } catch (error) {
    console.error("Error al obtenir preferències:", error);
    return { annualGoal: 0, readingActivityDays: [] };
  }
}

/**
 * Update user prefs (e.g. annual goal). Merges with existing.
 */
export async function updateUserPrefs(userId, updates) {
  if (!userId) return;
  try {
    const ref = doc(db, "users", userId, PREFS_COLLECTION, PREFS_DOC_ID);
    const current = await getUserPrefs(userId);
    await setDoc(ref, { ...current, ...updates }, { merge: true });
  } catch (error) {
    console.error("Error al actualitzar preferències:", error);
    throw error;
  }
}

const MS_PER_DAY = 24 * 60 * 60 * 1000;
const STREAK_DAYS_CAP = 30;

function todayKey() {
  return new Date().toISOString().slice(0, 10);
}

/**
 * Add today to reading activity days (for streak). Call when user updates currentPage on any book.
 * Keeps only last STREAK_DAYS_CAP days.
 */
export async function addReadingActivityDay(userId) {
  if (!userId) return;
  const today = todayKey();
  try {
    const prefs = await getUserPrefs(userId);
    let days = prefs.readingActivityDays || [];
    if (!days.includes(today)) {
      days = [today, ...days].slice(0, STREAK_DAYS_CAP);
      const ref = doc(db, "users", userId, PREFS_COLLECTION, PREFS_DOC_ID);
      await setDoc(ref, { ...prefs, readingActivityDays: days }, { merge: true });
    }
  } catch (error) {
    console.error("Error al registrar activitat de lectura:", error);
  }
}

/**
 * Compute current streak: consecutive days with activity ending today.
 * If there was no activity today, streak is 0.
 */
export function computeStreak(readingActivityDays) {
  if (!readingActivityDays || readingActivityDays.length === 0) return 0;
  const sorted = [...readingActivityDays].filter(Boolean).sort().reverse();
  const today = todayKey();
  if (sorted[0] !== today) return 0;
  let streak = 1;
  let expectDate = dateBefore(today);
  for (let i = 1; i < sorted.length; i++) {
    const d = sorted[i];
    if (d === expectDate) {
      streak++;
      expectDate = dateBefore(d);
    } else if (d < expectDate) {
      break;
    }
  }
  return streak;
}

function dateBefore(isoDate) {
  const d = new Date(isoDate);
  d.setDate(d.getDate() - 1);
  return d.toISOString().slice(0, 10);
}
