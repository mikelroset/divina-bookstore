import {
  collection,
  addDoc,
  query,
  where,
  getDocs,
  serverTimestamp,
  doc,
  getDoc,
  setDoc,
} from "firebase/firestore";
import { db } from "./firebase";

const NOTIFICATIONS_COLLECTION = "bookCompletedNotifications";
const DISMISSALS_DOC = "dismissedBookNotifications";
const THREE_DAYS_MS = 3 * 24 * 60 * 60 * 1000;
const IDEMPOTENCY_WINDOW_MS = 60 * 60 * 1000; // 1h per evitar duplicats

function getCreatedAtMs(data) {
  const ct = data?.completedAt ?? data?.createdAt;
  if (!ct) return 0;
  return ct?.toMillis?.() ?? (ct?.seconds != null ? ct.seconds * 1000 : 0);
}

/**
 * Crea una notificació de llibre completat per a una comunitat.
 * Idempotent: no crea duplicat si ja existeix una per (communityId, bookId) recent.
 * @param {string} communityId
 * @param {string} bookId
 * @param {string} bookTitle
 * @param {string} completedByUserId
 * @param {string} completedByUserName
 */
export async function createBookCompletedNotification(
  communityId,
  bookId,
  bookTitle,
  completedByUserId,
  completedByUserName,
) {
  const ref = collection(db, NOTIFICATIONS_COLLECTION);
  const q = query(
    ref,
    where("communityId", "==", communityId),
    where("bookId", "==", bookId),
  );
  const snap = await getDocs(q);
  const now = Date.now();
  const hasRecent = snap.docs.some((d) => {
    const ms = getCreatedAtMs(d.data());
    return ms >= now - IDEMPOTENCY_WINDOW_MS;
  });
  if (hasRecent) return null;

  const docRef = await addDoc(ref, {
    communityId,
    bookId,
    bookTitle: bookTitle ?? "Llibre",
    completedByUserId,
    completedByUserName: completedByUserName ?? "Algú",
    completedAt: serverTimestamp(),
  });
  return docRef.id;
}

/**
 * Obté les notificacions de llibres completats per l'usuari.
 * Filtra: comunitats de l'usuari, no pròpies, no caducades (3 dies), no tancades.
 * @param {string} userId
 * @param {string[]} userCommunityIds
 * @returns {Promise<Array<{ id: string, bookTitle: string, completedByUserName: string, completedAt: unknown, communityId: string }>>}
 */
export async function getBookCompletedNotifications(userId, userCommunityIds) {
  if (!userId || !Array.isArray(userCommunityIds) || userCommunityIds.length === 0) {
    return [];
  }
  const threeDaysAgo = Date.now() - THREE_DAYS_MS;
  const dismissed = await getDismissedIds(userId);
  const ids = userCommunityIds.slice(0, 10); // Firestore "in" limit
  const ref = collection(db, NOTIFICATIONS_COLLECTION);
  const q = query(ref, where("communityId", "in", ids));
  const snap = await getDocs(q);
  const list = snap.docs
    .map((d) => ({ id: d.id, ...d.data() }))
    .filter((n) => n.completedByUserId !== userId)
    .filter((n) => getCreatedAtMs(n) >= threeDaysAgo)
    .filter((n) => !dismissed.has(n.id));
  if (userCommunityIds.length > 10) {
    const rest = userCommunityIds.slice(10);
    for (let i = 0; i < rest.length; i += 10) {
      const chunk = rest.slice(i, i + 10);
      const q2 = query(ref, where("communityId", "in", chunk));
      const snap2 = await getDocs(q2);
      snap2.docs.forEach((d) => {
        const n = { id: d.id, ...d.data() };
        if (n.completedByUserId !== userId && getCreatedAtMs(n) >= threeDaysAgo && !dismissed.has(n.id)) {
          list.push(n);
        }
      });
    }
  }
  list.sort((a, b) => getCreatedAtMs(b) - getCreatedAtMs(a));
  return list;
}

async function getDismissedIds(userId) {
  try {
    const ref = doc(db, "users", userId, "prefs", DISMISSALS_DOC);
    const snap = await getDoc(ref);
    const data = snap.exists() ? snap.data() : {};
    const arr = data?.notificationIds ?? [];
    return new Set(Array.isArray(arr) ? arr : []);
  } catch {
    return new Set();
  }
}

/**
 * Marca una notificació com a tancada per l'usuari.
 * @param {string} userId
 * @param {string} notificationId
 */
export async function dismissBookCompletedNotification(userId, notificationId) {
  if (!userId || !notificationId) return;
  try {
    const ref = doc(db, "users", userId, "prefs", DISMISSALS_DOC);
    const snap = await getDoc(ref);
    const data = snap.exists() ? snap.data() : {};
    const ids = Array.isArray(data?.notificationIds) ? [...data.notificationIds] : [];
    if (!ids.includes(notificationId)) {
      ids.push(notificationId);
      await setDoc(ref, { notificationIds: ids }, { merge: true });
    }
  } catch (err) {
    console.error("Error al tancar notificació:", err);
    throw err;
  }
}
