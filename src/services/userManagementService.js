import { doc, getDoc, getDocs, collection, setDoc, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "./firebase";

const CONFIG_COLLECTION = "config";
const DISABLED_USERS_DOC = "disabledUsers";
const ADMIN_LOG_COLLECTION = "adminLog";
const COMMUNITIES_COLLECTION = "communities";
const MEMBERS_SUBCOLLECTION = "members";

/**
 * Llegeix els UIDs d'usuaris desactivats (config/disabledUsers).
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
 * Llista usuaris agrupant des de membres de totes les comunitats (Firestore-only).
 * No usa Cloud Functions. Exclou usuaris desactivats del resultat o els marca com disabled.
 * @returns {Promise<{ users: Array<{ uid: string, email: string, displayName: string, disabled: boolean }> }>}
 */
export async function listUsersForAdmin() {
  const [disabledIds, communitiesSnap] = await Promise.all([
    getDisabledUserIds(),
    getDocs(collection(db, COMMUNITIES_COLLECTION)),
  ]);

  const byUid = new Map();

  for (const comDoc of communitiesSnap.docs) {
    const membersSnap = await getDocs(
      collection(db, COMMUNITIES_COLLECTION, comDoc.id, MEMBERS_SUBCOLLECTION),
    );
    for (const mDoc of membersSnap.docs) {
      const uid = mDoc.id;
      const data = mDoc.data();
      const existing = byUid.get(uid);
      const displayName = data.displayName ?? existing?.displayName ?? "";
      const email = data.email ?? existing?.email ?? "";
      if (!existing || (displayName || email)) {
        byUid.set(uid, {
          uid,
          displayName: displayName || existing?.displayName || "",
          email: email || existing?.email || "",
        });
      }
    }
  }

  const users = Array.from(byUid.values()).map((u) => ({
    ...u,
    disabled: disabledIds.has(u.uid),
  }));

  return { users };
}

/**
 * Desactiva un usuari (soft: Firestore flag). Només superadmin (regles ho verifiquen).
 * L'usuari no podrà continuar amb sessió si AuthContext comprova disabledUsers.
 * @param {string} targetUserId
 * @param {string} superadminUserId - UID del superadmin (per adminLog)
 */
export async function disableUserForAdmin(targetUserId, superadminUserId) {
  const ref = doc(db, CONFIG_COLLECTION, DISABLED_USERS_DOC);
  const snap = await getDoc(ref);
  const data = snap.exists() ? snap.data() : {};
  const uids = [...(data.uids || [])];
  if (!uids.includes(targetUserId)) {
    uids.push(targetUserId);
    await setDoc(ref, { uids, updatedAt: serverTimestamp() });
  }

  await addDoc(collection(db, ADMIN_LOG_COLLECTION), {
    superadminUserId,
    targetUserId,
    action: "disable",
    timestamp: serverTimestamp(),
  });
}
