import { doc, getDoc } from "firebase/firestore";
import { db } from "./firebase";
import { DEFAULT_COMMUNITY_OWNER_UID } from "../utils/constants";

const CONFIG_COLLECTION = "config";
const SUPERADMINS_DOC = "superadmins";

/**
 * Check if a user is a Superadmin. Reads from Firestore config/superadmins.
 * Fallback: if document doesn't exist, checks against known first Superadmin uid.
 * @param {string} userId
 * @returns {Promise<boolean>}
 */
export async function isSuperadmin(userId) {
  if (!userId) return false;
  try {
    const ref = doc(db, CONFIG_COLLECTION, SUPERADMINS_DOC);
    const snap = await getDoc(ref);
    if (snap.exists()) {
      const uids = snap.data()?.uids ?? [];
      return Array.isArray(uids) && uids.includes(userId);
    }
  } catch (err) {
    console.warn("superadminService.isSuperadmin:", err);
  }
  return userId === DEFAULT_COMMUNITY_OWNER_UID;
}
