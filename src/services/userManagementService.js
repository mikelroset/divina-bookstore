import { doc, getDoc } from "firebase/firestore";
import { getFunctions, httpsCallable } from "firebase/functions";
import { db } from "./firebase";

const functions = getFunctions(db.app, "europe-west1");
const CONFIG_COLLECTION = "config";
const DISABLED_USERS_DOC = "disabledUsers";

/**
 * Llegeix els UIDs d'usuaris desactivats (config/disabledUsers).
 * Usat per anonimitzar i filtrar membres.
 * @returns {Promise<Set<string>>}
 */
export async function getDisabledUserIds() {
  try {
    const ref = doc(db, CONFIG_COLLECTION, DISABLED_USERS_DOC);
    const snap = await getDoc(ref);
    const uids = snap.exists() ? (snap.data().uids ?? []) : [];
    return new Set(Array.isArray(uids) ? uids : []);
  } catch {
    return new Set();
  }
}

/**
 * Llista usuaris (només superadmin). Crida la Cloud Function listUsersForAdmin.
 * @param {{ pageToken?: string }} opts
 * @returns {Promise<{ users: Array<{ uid: string, email: string, displayName: string, disabled: boolean }>, nextPageToken: string|null }>}
 */
export async function listUsersForAdmin(opts = {}) {
  const fn = httpsCallable(functions, "listUsersForAdmin");
  const result = await fn(opts);
  return result.data;
}

/**
 * Desactiva un usuari (només superadmin).
 * @param {string} targetUserId
 */
export async function disableUserForAdmin(targetUserId) {
  const fn = httpsCallable(functions, "disableUserForAdmin");
  await fn({ targetUserId });
}

/**
 * Elimina definitivament un usuari (només superadmin).
 * @param {string} targetUserId
 */
export async function deleteUserForAdmin(targetUserId) {
  const fn = httpsCallable(functions, "deleteUserForAdmin");
  await fn({ targetUserId });
}
