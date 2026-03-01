import {
  doc,
  getDoc,
  setDoc,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "./firebase";
import {
  DEFAULT_COMMUNITY_ID,
  DEFAULT_COMMUNITY_NAME,
  DEFAULT_COMMUNITY_OWNER_UID,
} from "../utils/constants";

const COMMUNITIES_COLLECTION = "communities";
const MEMBERS_SUBCOLLECTION = "members";

/**
 * Ensure the default community document exists. Creates it if missing.
 * @returns {Promise<{ id: string, name: string }>}
 */
export async function ensureDefaultCommunity() {
  const ref = doc(db, COMMUNITIES_COLLECTION, DEFAULT_COMMUNITY_ID);
  const snap = await getDoc(ref);
  if (!snap.exists()) {
    await setDoc(ref, {
      name: DEFAULT_COMMUNITY_NAME,
      description: null,
      visibility: "private",
      ownerUserId: DEFAULT_COMMUNITY_OWNER_UID,
      status: "active",
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
  }
  return { id: DEFAULT_COMMUNITY_ID, name: DEFAULT_COMMUNITY_NAME };
}

/**
 * Add or update a member in a community.
 * @param {string} communityId
 * @param {string} userId
 * @param {string} role - owner | admin | participant
 */
export async function setCommunityMember(communityId, userId, role) {
  const ref = doc(db, COMMUNITIES_COLLECTION, communityId, MEMBERS_SUBCOLLECTION, userId);
  const snap = await getDoc(ref);
  const now = serverTimestamp();
  if (!snap.exists()) {
    await setDoc(ref, {
      role,
      status: "active",
      joinedAt: now,
      updatedAt: now,
    });
  } else {
    await setDoc(ref, { ...snap.data(), role, updatedAt: now }, { merge: true });
  }
}

/**
 * Ensure the user is a member of the default community (lazy migration).
 * Call when loading app if user has no activeCommunityId or we need to ensure membership.
 * @param {string} userId
 */
export async function ensureUserInDefaultCommunity(userId) {
  if (!userId) return;
  await ensureDefaultCommunity();
  const isOwner = userId === DEFAULT_COMMUNITY_OWNER_UID;
  await setCommunityMember(
    DEFAULT_COMMUNITY_ID,
    userId,
    isOwner ? "owner" : "participant",
  );
}

/**
 * Get communities the user belongs to. Phase 1: returns default community if user is member.
 * @param {string} userId
 * @returns {Promise<Array<{ id: string, name: string }>>}
 */
export async function getUserCommunities(userId) {
  if (!userId) return [];
  await ensureDefaultCommunity();
  const memberRef = doc(
    db,
    COMMUNITIES_COLLECTION,
    DEFAULT_COMMUNITY_ID,
    MEMBERS_SUBCOLLECTION,
    userId,
  );
  const memberSnap = await getDoc(memberRef);
  if (!memberSnap.exists() || memberSnap.data()?.status !== "active") {
    await ensureUserInDefaultCommunity(userId);
  }
  return [{ id: DEFAULT_COMMUNITY_ID, name: DEFAULT_COMMUNITY_NAME }];
}
