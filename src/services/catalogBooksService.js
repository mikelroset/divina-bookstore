/**
 * Servei per al catàleg global de llibres (títol original + autor).
 * Evita duplicats en ressenyes: les ressenyes s'associen a una entrada de catàleg
 * identificada per títol original i autor normalitzats.
 */

import { collection, query, where, getDocs, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "./firebase";
import { getBookMatchKey } from "../utils/normalizeBookKey";

const CATALOG_COLLECTION = "catalogBooks";

/**
 * Troba o crea una entrada de catàleg per (originalTitle, author).
 * @param {string} originalTitle - Títol original del llibre
 * @param {string} author - Autor
 * @returns {Promise<{ id: string, originalTitle: string, author: string }>}
 */
export async function findOrCreateCatalogBook(originalTitle, author) {
  const raw = (originalTitle ?? "").trim();
  const auth = (author ?? "").trim();
  if (!raw || !auth) {
    throw new Error("El títol original i l'autor són obligatoris.");
  }

  const matchKey = getBookMatchKey(raw, auth);
  const catalogRef = collection(db, CATALOG_COLLECTION);
  const q = query(catalogRef, where("_matchKey", "==", matchKey));
  const snap = await getDocs(q);

  if (!snap.empty) {
    const doc = snap.docs[0];
    const data = doc.data();
    return {
      id: doc.id,
      originalTitle: data.originalTitle,
      author: data.author,
    };
  }

  const docRef = await addDoc(catalogRef, {
    originalTitle: raw,
    author: auth,
    _matchKey: matchKey,
    createdAt: serverTimestamp(),
  });
  return { id: docRef.id, originalTitle: raw, author: auth };
}
