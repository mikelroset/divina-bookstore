import {
  collection,
  collectionGroup,
  doc,
  addDoc,
  getDocs,
  getDoc,
  query,
  where,
  orderBy,
  limit,
  startAfter,
  serverTimestamp,
  runTransaction,
} from "firebase/firestore";
import { db } from "./firebase";

const REVIEWS_COLLECTION = "reviews";
const LIKES_SUBCOLLECTION = "likes";
const PAGE_SIZE = 10;

/**
 * @typedef {Object} Review
 * @property {string} id
 * @property {string} bookId
 * @property {string} bookTitle
 * @property {string} bookAuthor
 * @property {string} authorUserId
 * @property {string} [authorDisplayName]
 * @property {string} [authorPhotoURL]
 * @property {string} text
 * @property {unknown} createdAt
 * @property {number} likeCount
 */

/**
 * Publicar una nova ressenya.
 * @param {string} userId - UID de l'autor
 * @param {string} displayName - Nom per mostrar
 * @param {string} [photoURL] - URL de la foto
 * @param {Object} book - Llibre { id, title, author }
 * @param {string} text - Text de la ressenya
 */
export async function addReview(userId, displayName, photoURL, book, text) {
  if (!userId || !displayName || !book?.title || !book?.author || !text?.trim()) {
    throw new Error("Falten dades obligatòries per publicar la ressenya.");
  }
  const reviewsRef = collection(db, REVIEWS_COLLECTION);
  const docRef = await addDoc(reviewsRef, {
    bookId: book.id ?? "",
    bookTitle: book.title,
    bookAuthor: book.author,
    authorUserId: userId,
    authorDisplayName: displayName,
    authorPhotoURL: photoURL ?? null,
    text: text.trim(),
    createdAt: serverTimestamp(),
    likeCount: 0,
  });
  return { id: docRef.id, bookId: book.id, bookTitle: book.title, bookAuthor: book.author, authorUserId: userId, authorDisplayName: displayName, authorPhotoURL: photoURL, text: text.trim(), likeCount: 0 };
}

/**
 * Obtenir ressenyes paginades (ordenades per createdAt desc).
 * @param {{ startAfterDoc?: import('firebase/firestore').DocumentSnapshot | null, pageSize?: number }} [opts]
 * @returns {Promise<{ reviews: Review[], lastDoc: import('firebase/firestore').DocumentSnapshot | null }>}
 */
export async function getReviews(opts = {}) {
  const { startAfterDoc = null, pageSize = PAGE_SIZE } = opts;
  const reviewsRef = collection(db, REVIEWS_COLLECTION);
  let q = query(
    reviewsRef,
    orderBy("createdAt", "desc"),
    limit(pageSize + 1),
  );
  if (startAfterDoc) {
    q = query(
      reviewsRef,
      orderBy("createdAt", "desc"),
      startAfter(startAfterDoc),
      limit(pageSize + 1),
    );
  }
  const snap = await getDocs(q);
  const docs = snap.docs;
  const hasMore = docs.length > pageSize;
  const slice = hasMore ? docs.slice(0, pageSize) : docs;
  const reviews = slice.map((d) => ({
    id: d.id,
    ...d.data(),
    likeCount: d.data().likeCount ?? 0,
  }));
  const lastDoc = slice.length > 0 ? slice[slice.length - 1] : null;
  return { reviews, lastDoc };
}

/**
 * Obtenir els IDs de ressenyes que un usuari ha fet like (collectionGroup).
 * Requereix índex: reviews/likes, userId ASC.
 * @param {string} userId
 * @returns {Promise<Set<string>>}
 */
export async function getLikedReviewIds(userId) {
  if (!userId) return new Set();
  try {
    const likesRef = collectionGroup(db, LIKES_SUBCOLLECTION);
    const q = query(likesRef, where("userId", "==", userId));
    const snap = await getDocs(q);
    const ids = new Set();
    snap.docs.forEach((d) => {
      const path = d.ref.path;
      const match = path.match(/^reviews\/([^/]+)\/likes\//);
      if (match) ids.add(match[1]);
    });
    return ids;
  } catch (err) {
    console.warn("getLikedReviewIds fallback (pot faltar índex):", err);
    return new Set();
  }
}

/**
 * Obtenir liked per un conjunt de reviewIds (quan collectionGroup no està disponible).
 * @param {string} userId
 * @param {string[]} reviewIds
 * @returns {Promise<Set<string>>}
 */
export async function getLikedReviewIdsForReviews(userId, reviewIds) {
  if (!userId || !reviewIds?.length) return new Set();
  const ids = new Set();
  await Promise.all(
    reviewIds.map(async (reviewId) => {
      const likeRef = doc(db, REVIEWS_COLLECTION, reviewId, LIKES_SUBCOLLECTION, userId);
      const likeSnap = await getDoc(likeRef);
      if (likeSnap.exists()) ids.add(reviewId);
    }),
  );
  return ids;
}

/**
 * Fer o desfer like en una ressenya. Transacció atòmica.
 * @param {string} reviewId
 * @param {string} userId
 * @param {boolean} currentLiked - si l'usuari ja ha fet like
 * @returns {Promise<{ likeCount: number }>}
 */
export async function toggleLike(reviewId, userId, currentLiked) {
  if (!reviewId || !userId) throw new Error("Falten reviewId o userId.");
  const reviewRef = doc(db, REVIEWS_COLLECTION, reviewId);
  const likeRef = doc(db, REVIEWS_COLLECTION, reviewId, LIKES_SUBCOLLECTION, userId);

  const result = await runTransaction(db, async (transaction) => {
    const reviewSnap = await transaction.get(reviewRef);
    if (!reviewSnap.exists()) {
      throw new Error("La ressenya no existeix.");
    }
    const reviewData = reviewSnap.data();
    let newCount = (reviewData.likeCount ?? 0);

    if (currentLiked) {
      transaction.delete(likeRef);
      newCount = Math.max(0, newCount - 1);
    } else {
      transaction.set(likeRef, { userId, createdAt: serverTimestamp() });
      newCount = newCount + 1;
    }
    transaction.update(reviewRef, { likeCount: newCount });
    return { likeCount: newCount };
  });
  return result;
}
