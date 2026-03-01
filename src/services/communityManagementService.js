import {
  doc,
  getDoc,
  setDoc,
  getDocs,
  addDoc,
  collection,
  collectionGroup,
  query,
  where,
  limit,
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
const INVITES_COLLECTION = "communityInvites";
const INVITE_EXPIRY_DAYS = 14;
const INVITE_RESEND_COOLDOWN_MS = 10 * 60 * 1000; // 10 min idempotència

function generateInviteToken() {
  return crypto.randomUUID?.() ?? `${Date.now()}-${Math.random().toString(36).slice(2, 15)}`;
}

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
 * Add or update a member in a community. Stores userId for collection group queries.
 * @param {string} communityId
 * @param {string} userId
 * @param {string} role - owner | admin | participant
 * @param {{ displayName?: string, photoURL?: string }} [profile]
 */
export async function setCommunityMember(communityId, userId, role, profile = {}) {
  const ref = doc(db, COMMUNITIES_COLLECTION, communityId, MEMBERS_SUBCOLLECTION, userId);
  const snap = await getDoc(ref);
  const now = serverTimestamp();
  const data = {
    userId,
    role,
    status: "active",
    joinedAt: now,
    updatedAt: now,
    ...(profile.displayName && { displayName: profile.displayName }),
    ...(profile.photoURL !== undefined && { photoURL: profile.photoURL }),
  };
  if (!snap.exists()) {
    await setDoc(ref, data);
  } else {
    await setDoc(ref, { ...snap.data(), ...data, updatedAt: now }, { merge: true });
  }
}

/**
 * Ensure the user is a member of the default community (lazy migration).
 * @param {string} userId
 * @param {{ displayName?: string, photoURL?: string }} [profile]
 */
export async function ensureUserInDefaultCommunity(userId, profile = {}) {
  if (!userId) return;
  await ensureDefaultCommunity();
  const isOwner = userId === DEFAULT_COMMUNITY_OWNER_UID;
  await setCommunityMember(
    DEFAULT_COMMUNITY_ID,
    userId,
    isOwner ? "owner" : "participant",
    profile,
  );
}

/**
 * Get communities the user belongs to. Uses denormalized userCommunityIds from prefs.
 * Only includes communities where the user is an active member (excludes left/banned).
 * @param {string} userId
 * @param {string[]} [userCommunityIds] - from prefs; if not provided, only default is returned
 * @returns {Promise<{ communities: Array<{ id: string, name: string, visibility?: string }>, activeCommunityIds: string[] }>}
 */
export async function getUserCommunities(userId, userCommunityIds = null) {
  if (!userId) return { communities: [], activeCommunityIds: [] };
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
  const ids = Array.isArray(userCommunityIds) && userCommunityIds.length > 0
    ? userCommunityIds
    : [DEFAULT_COMMUNITY_ID];
  const list = [];
  const activeIds = [];
  for (const id of ids) {
    const role = await getMemberRole(id, userId);
    if (role === null) continue;
    const comRef = doc(db, COMMUNITIES_COLLECTION, id);
    const comSnap = await getDoc(comRef);
    if (comSnap.exists() && comSnap.data()?.status === "active") {
      list.push({
        id: comSnap.id,
        name: comSnap.data().name ?? id,
        visibility: comSnap.data().visibility,
      });
      activeIds.push(id);
    }
  }
  return { communities: list, activeCommunityIds: activeIds };
}

/**
 * Create a new community. Caller must add new id to user prefs (userCommunityIds, activeCommunityId).
 * @param {string} ownerUserId
 * @param {{ name: string, description?: string, visibility: 'open'|'private' }}
 * @param {{ displayName?: string, photoURL?: string }} [ownerProfile]
 * @returns {Promise<{ id: string, name: string }>}
 */
export async function createCommunity(ownerUserId, { name, description = null, visibility = "private" }, ownerProfile = {}) {
  const ref = await addDoc(collection(db, COMMUNITIES_COLLECTION), {
    name: name.trim(),
    description: description?.trim() || null,
    visibility,
    ownerUserId,
    status: "active",
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  await setCommunityMember(ref.id, ownerUserId, "owner", ownerProfile);
  return { id: ref.id, name: name.trim() };
}

/**
 * Get community doc.
 * @returns {Promise<{ id: string, name: string, description?: string, visibility: string, ownerUserId: string, status: string }|null>}
 */
export async function getCommunity(communityId) {
  const snap = await getDoc(doc(db, COMMUNITIES_COLLECTION, communityId));
  if (!snap.exists()) return null;
  return { id: snap.id, ...snap.data() };
}

/**
 * Get member role in community.
 * @returns {Promise<'owner'|'admin'|'participant'|null>}
 */
export async function getMemberRole(communityId, userId) {
  const snap = await getDoc(doc(db, COMMUNITIES_COLLECTION, communityId, MEMBERS_SUBCOLLECTION, userId));
  if (!snap.exists() || snap.data()?.status !== "active") return null;
  return snap.data().role ?? null;
}

/**
 * List active members of a community.
 * @returns {Promise<Array<{ userId: string, role: string, displayName?: string, photoURL?: string }>>}
 */
export async function getCommunityMembers(communityId) {
  const snap = await getDocs(
    query(
      collection(db, COMMUNITIES_COLLECTION, communityId, MEMBERS_SUBCOLLECTION),
      where("status", "==", "active"),
    ),
  );
  return snap.docs.map((d) => ({
    userId: d.id,
    role: d.data().role ?? "participant",
    displayName: d.data().displayName,
    photoURL: d.data().photoURL,
  }));
}

/**
 * Remove member (set status left) or ban. Only admin/owner.
 * @param {string} communityId
 * @param {string} targetUserId
 * @param {'left'|'banned'} status
 */
export async function setMemberStatus(communityId, targetUserId, status) {
  const ref = doc(db, COMMUNITIES_COLLECTION, communityId, MEMBERS_SUBCOLLECTION, targetUserId);
  await setDoc(ref, { status, updatedAt: serverTimestamp() }, { merge: true });
}

/**
 * Set member role (e.g. promote to admin). Only owner can set admin; only owner can transfer owner.
 */
export async function updateMemberRole(communityId, userId, role) {
  await setCommunityMember(communityId, userId, role);
}

/**
 * Dissolve community. Only the owner can do it. The default community cannot be dissolved.
 * @param {string} communityId
 * @param {string} userId - must be owner
 */
export async function dissolveCommunity(communityId, userId) {
  if (communityId === DEFAULT_COMMUNITY_ID) {
    throw new Error("No es pot dissoldre la comunitat per defecte.");
  }
  const role = await getMemberRole(communityId, userId);
  if (role !== "owner") {
    throw new Error("Només el propietari pot dissoldre la comunitat.");
  }
  const ref = doc(db, COMMUNITIES_COLLECTION, communityId);
  await setDoc(ref, { status: "dissolved", updatedAt: serverTimestamp() }, { merge: true });
}

/**
 * List open (visibility === 'open') active communities, with optional member count for sorting.
 * @param {number} maxCount - max communities to fetch (default 20)
 * @param {number} topN - if set, sort by member count desc and return top N (default all)
 * @returns {Promise<Array<{ id: string, name: string, description?: string, memberCount?: number }>>}
 */
export async function getOpenCommunities(maxCount = 20, topN = null) {
  const q = query(
    collection(db, COMMUNITIES_COLLECTION),
    where("visibility", "==", "open"),
    where("status", "==", "active"),
    limit(maxCount),
  );
  const snap = await getDocs(q);
  const list = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
  const withCount = await Promise.all(
    list.map(async (c) => {
      const members = await getCommunityMembers(c.id);
      return { ...c, memberCount: members.length };
    }),
  );
  withCount.sort((a, b) => (b.memberCount ?? 0) - (a.memberCount ?? 0));
  return topN != null ? withCount.slice(0, topN) : withCount;
}

/**
 * Join an open community as participant. Fails if community is not open or user already member.
 * @param {string} communityId
 * @param {string} userId
 * @param {{ displayName?: string, photoURL?: string }} [profile]
 */
export async function joinOpenCommunity(communityId, userId, profile = {}) {
  const com = await getCommunity(communityId);
  if (!com || com.status !== "active" || com.visibility !== "open") {
    throw new Error("Aquesta comunitat no accepta nous membres ara.");
  }
  const existingRole = await getMemberRole(communityId, userId);
  if (existingRole !== null) {
    return;
  }
  await setCommunityMember(communityId, userId, "participant", profile);
}

// ---------- Invitations ----------

function inviteDocId(communityId, email) {
  return `${communityId}_${String(email).toLowerCase().trim()}`;
}

/**
 * Create or resend invite. One pending per (communityId, email). Expires in INVITE_EXPIRY_DAYS.
 * Idempotency: within 10 min of lastEmailSentAt we do not update (no second "send").
 * Stores inviteToken for invitation link; lastEmailSentAt for cooldown.
 * @returns {Promise<{ inviteId: string }>}
 */
export async function createOrResendInvite(communityId, email, invitedByUserId) {
  const normalizedEmail = String(email).toLowerCase().trim();
  const inviteId = inviteDocId(communityId, normalizedEmail);
  const ref = doc(db, INVITES_COLLECTION, inviteId);
  const snap = await getDoc(ref);
  const now = Date.now();
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + INVITE_EXPIRY_DAYS);

  if (snap.exists()) {
    const d = snap.data();
    if (d?.status === "pending" && d?.lastEmailSentAt != null && now - d.lastEmailSentAt < INVITE_RESEND_COOLDOWN_MS) {
      return { inviteId };
    }
  }

  const inviteToken = snap.exists() && snap.data()?.inviteToken
    ? snap.data().inviteToken
    : generateInviteToken();
  const data = {
    communityId,
    email: normalizedEmail,
    invitedByUserId,
    status: "pending",
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
    expiresAt: expiresAt.getTime(),
    inviteToken,
    lastEmailSentAt: now,
  };
  if (snap.exists() && snap.data()?.status === "pending") {
    await setDoc(ref, { ...data, updatedAt: serverTimestamp(), expiresAt: data.expiresAt, inviteToken, lastEmailSentAt: now }, { merge: true });
  } else {
    await setDoc(ref, data);
  }
  return { inviteId };
}

/**
 * Demana a l’API (Vercel) que enviï el correu d’invitació si l’email no té compte.
 * Opció gratuïta sense Firebase Blaze. Es crida després de createOrResendInvite.
 * @param {string} inviteId
 * @param {() => Promise<string>} getIdToken - ex: () => currentUser.getIdToken()
 */
export async function requestSendInviteEmail(inviteId, getIdToken) {
  if (!inviteId || typeof getIdToken !== "function") return;
  try {
    const token = await getIdToken();
    const base = typeof window !== "undefined" && window.location?.origin ? window.location.origin : "";
    const res = await fetch(`${base}/api/send-invite`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ inviteId }),
    });
    if (!res.ok && res.status !== 200) {
      console.warn("send-invite API:", res.status, await res.text());
    }
  } catch (e) {
    console.warn("requestSendInviteEmail:", e);
  }
}

/**
 * Get a single invite by id (for invite acceptance page). Returns null if not found or not pending/valid.
 * @returns {Promise<{ id: string, communityId: string, communityName?: string, email: string, expiresAt: number, inviteToken?: string }|null>}
 */
export async function getInviteById(inviteId) {
  const ref = doc(db, INVITES_COLLECTION, inviteId);
  const snap = await getDoc(ref);
  if (!snap.exists()) return null;
  const data = snap.data();
  if (data?.status !== "pending" || data?.expiresAt < Date.now()) return null;
  const community = await getCommunity(data.communityId);
  return {
    id: snap.id,
    communityId: data.communityId,
    communityName: community?.name,
    email: data.email,
    expiresAt: data.expiresAt,
    inviteToken: data.inviteToken,
  };
}

/**
 * Get pending invites for an email (e.g. current user).
 * @returns {Promise<Array<{ id: string, communityId: string, communityName?: string, email: string, invitedByUserId: string, expiresAt: number }>>}
 */
export async function getPendingInvitesForEmail(email) {
  const normalizedEmail = String(email).toLowerCase().trim();
  const now = Date.now();
  const snap = await getDocs(
    query(
      collection(db, INVITES_COLLECTION),
      where("email", "==", normalizedEmail),
      where("status", "==", "pending"),
    ),
  );
  const list = [];
  for (const d of snap.docs) {
    const data = d.data();
    if (data.expiresAt > now) {
      const community = await getCommunity(data.communityId);
      list.push({
        id: d.id,
        communityId: data.communityId,
        communityName: community?.name,
        email: data.email,
        invitedByUserId: data.invitedByUserId,
        expiresAt: data.expiresAt,
      });
    }
  }
  return list;
}

/**
 * Accept invite: add user to community only if user's email matches invite email.
 * @param {string} userEmail - email of the authenticated user (must match invite)
 * @returns {Promise<{ communityId: string }>}
 */
export async function acceptInvite(inviteId, userId, userEmail, profile = {}) {
  const ref = doc(db, INVITES_COLLECTION, inviteId);
  const snap = await getDoc(ref);
  if (!snap.exists() || snap.data()?.status !== "pending" || snap.data()?.expiresAt < Date.now()) {
    throw new Error("Invitation no vàlida o caducada");
  }
  const data = snap.data();
  const inviteEmail = (data.email ?? "").toLowerCase().trim();
  const normalizedUserEmail = (userEmail ?? "").toLowerCase().trim();
  if (inviteEmail !== normalizedUserEmail) {
    throw new Error("Aquest enllaç és per a un altre correu.");
  }
  const { communityId } = data;
  await setDoc(ref, { status: "accepted", acceptedByUserId: userId, updatedAt: serverTimestamp() }, { merge: true });
  await setCommunityMember(communityId, userId, "participant", profile);
  return { communityId };
}

/**
 * Reject invite.
 */
export async function rejectInvite(inviteId) {
  const ref = doc(db, INVITES_COLLECTION, inviteId);
  await setDoc(ref, { status: "rejected", updatedAt: serverTimestamp() }, { merge: true });
}
