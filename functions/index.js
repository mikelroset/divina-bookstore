/**
 * Cloud Functions – Divina Bookstore
 * Fase 2: Enviament de correu d'invitació quan l'email no té compte.
 * Gestió d'usuaris: superadmin pot desactivar i eliminar comptes.
 *
 * Requereix variables de configuració (firebase functions:config:set o .env en emulador):
 * - resend.api_key: API key de Resend (https://resend.com)
 * - app.invite_base_url: URL base de l'app (ex: https://divina-bookstore.vercel.app)
 * - app.from_email: Email remitent (ex: invitations@el-teu-domini.com o onboarding@resend.dev per proves)
 */

const { onDocumentWritten } = require("firebase-functions/v2/firestore");
const { onCall, HttpsError } = require("firebase-functions/v2/https");
const { defineString } = require("firebase-functions/params");
const admin = require("firebase-admin");
const { Resend } = require("resend");

admin.initializeApp();

const CONFIG_COLLECTION = "config";
const SUPERADMINS_DOC = "superadmins";
const ADMIN_LOG_COLLECTION = "adminLog";
const DISABLED_USERS_DOC = "disabledUsers";

const INVITE_RESEND_COOLDOWN_MS = 10 * 60 * 1000; // 10 min
const RATE_LIMIT_PER_HOUR = 30;

const apiKey = defineString("RESEND_API_KEY", { default: "" });
const inviteBaseUrl = defineString("INVITE_BASE_URL", { default: "https://divina-bookstore.vercel.app" });
const fromEmail = defineString("FROM_EMAIL", { default: "Divina Bookstore <onboarding@resend.dev>" });

/**
 * Comprova si existeix un usuari amb aquest email a Firebase Auth (no revelar al client).
 */
async function userExistsByEmail(email) {
  try {
    await admin.auth().getUserByEmail(email);
    return true;
  } catch (e) {
    if (e.code === "auth/user-not-found") return false;
    throw e;
  }
}

/**
 * Rate limit: màxim RATE_LIMIT_PER_HOUR invitacions enviades per usuari per hora.
 * Utilitza Firestore inviteRateLimit/{userId} amb { count, windowStart }.
 */
async function checkRateLimit(userId) {
  const db = admin.firestore();
  const ref = db.collection("inviteRateLimit").doc(userId);
  const now = Date.now();
  const hourMs = 60 * 60 * 1000;

  return db.runTransaction(async (tx) => {
    const snap = await tx.get(ref);
    const data = snap.exists ? snap.data() : null;
    const windowStart = data?.windowStart ?? 0;
    const count = data?.count ?? 0;

    if (now - windowStart >= hourMs) {
      tx.set(ref, { count: 1, windowStart: now });
      return true;
    }
    if (count >= RATE_LIMIT_PER_HOUR) return false;
    tx.set(ref, { count: count + 1, windowStart: windowStart });
    return true;
  });
}

/**
 * Envia el correu d'invitació via Resend.
 */
async function sendInviteEmail({ to, communityName, inviteId, inviteToken }) {
  const key = apiKey.value();
  if (!key) {
    console.warn("RESEND_API_KEY no configurat; no s’envia correu.");
    return;
  }
  const baseUrl = inviteBaseUrl.value().replace(/\/$/, "");
  const inviteLink = `${baseUrl}/community/invite/${inviteId}?token=${encodeURIComponent(inviteToken)}`;

  const resend = new Resend(key);
  const { data, error } = await resend.emails.send({
    from: fromEmail.value(),
    to: [to],
    subject: `Invitació a la comunitat "${communityName}" – Divina Bookstore`,
    html: `
      <p>Hola,</p>
      <p>T’han convidat a unir-te a la comunitat <strong>${escapeHtml(communityName)}</strong> a Divina Bookstore.</p>
      <p>Fes clic a l’enllaç de sota per crear un compte (o iniciar sessió) i acceptar la invitació:</p>
      <p><a href="${escapeHtml(inviteLink)}" style="background:#0d9488;color:white;padding:10px 20px;text-decoration:none;border-radius:6px;display:inline-block;">Acceptar invitació</a></p>
      <p>Si no has sol·licitat aquesta invitació, pots ignorar aquest correu.</p>
      <p>L’enllaç caduca en 14 dies.</p>
      <p>— Divina Bookstore</p>
    `,
  });

  if (error) {
    console.error("Error enviant correu d’invitació:", error.message);
    throw new Error(error.message);
  }
  if (data?.id) {
    console.log("Correu enviat:", data.id);
  }
}

function escapeHtml(s) {
  if (typeof s !== "string") return "";
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/**
 * Quan es crea o actualitza un document a communityInvites:
 * - Si status !== 'pending' o ha caducat, no fer res.
 * - Si ja hem enviat correu (emailSentAt dins dels últims 10 min), no reenviar (idempotència).
 * - Rate limit: si l’usuari ha enviat massa invitacions aquesta hora, no enviar (però no revelar).
 * - Si l’email JA té compte a Firebase Auth, no enviar correu (veuran la invitació en iniciar sessió).
 * - Si l’email NO té compte, enviar correu amb l’enllaç d’invitació i desar emailSentAt.
 */
exports.onCommunityInviteWritten = onDocumentWritten(
  { document: "communityInvites/{inviteId}" },
  async (event) => {
    const after = event.data?.after;
    if (!after?.exists) return;

    const data = after.data();
    const inviteId = after.id;

    if (data.status !== "pending") return;
    if (data.expiresAt < Date.now()) return;

    const email = (data.email || "").toLowerCase().trim();
    const inviteToken = data.inviteToken;
    const invitedByUserId = data.invitedByUserId;
    if (!email || !inviteToken) return;

    // Idempotència: no reenviar si ja hem enviat fa menys de 10 min
    const emailSentAt = data.emailSentAt ?? 0;
    if (emailSentAt && Date.now() - emailSentAt < INVITE_RESEND_COOLDOWN_MS) {
      return;
    }

    const db = admin.firestore();

    // Rate limit per usuari que convida
    const allowed = await checkRateLimit(invitedByUserId);
    if (!allowed) {
      console.warn("Rate limit superat per usuari:", invitedByUserId);
      return;
    }

    // Només enviar si l’usuari NO té compte (no revelar si existeix)
    const exists = await userExistsByEmail(email);
    if (exists) return;

    // Obtenir nom de la comunitat
    let communityName = "Comunitat";
    try {
      const comSnap = await db.collection("communities").doc(data.communityId).get();
      if (comSnap.exists) communityName = comSnap.data().name || communityName;
    } catch (_) {}

    await sendInviteEmail({
      to: email,
      communityName,
      inviteId,
      inviteToken,
    });

    await db.collection("communityInvites").doc(inviteId).update({
      emailSentAt: Date.now(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    });
  }
);

// ========== Gestió d'usuaris (superadmin) ==========

async function ensureSuperadmin(callerUid) {
  if (!callerUid) throw new HttpsError("unauthenticated", "Cal estar autenticat.");
  const db = admin.firestore();
  const ref = db.collection(CONFIG_COLLECTION).doc(SUPERADMINS_DOC);
  const snap = await ref.get();
  if (!snap.exists) {
    throw new HttpsError("permission-denied", "Config superadmins no trobada. Contacta l’administrador.");
  }
  const uids = snap.data()?.uids ?? [];
  if (!Array.isArray(uids) || !uids.includes(callerUid)) {
    throw new HttpsError("permission-denied", "No tens permisos de superadmin.");
  }
}

function logAdminAction(db, superadminUserId, targetUserId, action) {
  return db.collection(ADMIN_LOG_COLLECTION).add({
    superadminUserId,
    targetUserId,
    action,
    timestamp: admin.firestore.FieldValue.serverTimestamp(),
  });
}

exports.listUsersForAdmin = onCall(async (request) => {
  await ensureSuperadmin(request.auth?.uid);

  const { pageToken } = request.data || {};
  const listResult = await admin.auth().listUsers(100, pageToken);

  const users = listResult.users.map((u) => ({
    uid: u.uid,
    email: u.email || "",
    displayName: u.displayName || "",
    disabled: u.disabled || false,
    creationTime: u.metadata?.creationTime,
  }));

  return { users, nextPageToken: listResult.pageToken || null };
});

exports.disableUserForAdmin = onCall(async (request) => {
  const callerUid = request.auth?.uid;
  await ensureSuperadmin(callerUid);

  const { targetUserId } = request.data || {};
  if (!targetUserId || typeof targetUserId !== "string") {
    throw new HttpsError("invalid-argument", "Falta targetUserId.");
  }

  if (targetUserId === callerUid) {
    throw new HttpsError("failed-precondition", "No pots desactivar el teu propi compte.");
  }

  const db = admin.firestore();

  await admin.auth().updateUser(targetUserId, { disabled: true });

  const ref = db.collection(CONFIG_COLLECTION).doc(DISABLED_USERS_DOC);
  await db.runTransaction(async (tx) => {
    const snap = await tx.get(ref);
    const data = snap.exists ? snap.data() : {};
    const uids = data.uids || [];
    if (!uids.includes(targetUserId)) {
      tx.set(ref, { uids: [...uids, targetUserId], updatedAt: admin.firestore.FieldValue.serverTimestamp() });
    }
  });

  await logAdminAction(db, callerUid, targetUserId, "disable");

  const userRef = db.collection("users").doc(targetUserId).collection("prefs").doc("settings");
  const prefsSnap = await userRef.get();
  if (prefsSnap.exists) {
    await userRef.update({ disabledAt: Date.now() });
  } else {
    await userRef.set({ disabledAt: Date.now() });
  }

  return { success: true };
});

async function deleteAllUserData(db, userId) {
  const batch = db.batch();

  const userRef = db.collection("users").doc(userId);
  const booksSnap = await userRef.collection("books").get();
  booksSnap.docs.forEach((d) => batch.delete(d.ref));

  const prefsSnap = await userRef.collection("prefs").get();
  prefsSnap.docs.forEach((d) => batch.delete(d.ref));

  const communitiesSnap = await db.collection("communities").get();
  for (const com of communitiesSnap.docs) {
    const memberRef = com.ref.collection("members").doc(userId);
    const m = await memberRef.get();
    if (m.exists) batch.delete(memberRef);

    const leaderRef = com.ref.collection("leaderboard").doc(userId);
    const l = await leaderRef.get();
    if (l.exists) batch.delete(leaderRef);
  }

  const reviewsSnap = await db.collection("reviews").where("authorUserId", "==", userId).get();
  for (const r of reviewsSnap.docs) {
    const likesSnap = await r.ref.collection("likes").get();
    likesSnap.docs.forEach((d) => batch.delete(d.ref));
    batch.delete(r.ref);
  }

  const encouragementsFrom = await db.collection("encouragements").where("fromUserId", "==", userId).get();
  encouragementsFrom.docs.forEach((d) => batch.delete(d.ref));

  const encouragementsTo = await db.collection("encouragements").where("toUserId", "==", userId).get();
  encouragementsTo.docs.forEach((d) => batch.delete(d.ref));

  await batch.commit();
}

exports.deleteUserForAdmin = onCall(async (request) => {
  const callerUid = request.auth?.uid;
  await ensureSuperadmin(callerUid);

  const { targetUserId } = request.data || {};
  if (!targetUserId || typeof targetUserId !== "string") {
    throw new HttpsError("invalid-argument", "Falta targetUserId.");
  }

  if (targetUserId === callerUid) {
    throw new HttpsError("failed-precondition", "No pots eliminar el teu propi compte.");
  }

  const db = admin.firestore();

  await deleteAllUserData(db, targetUserId);

  const configRef = db.collection(CONFIG_COLLECTION).doc(DISABLED_USERS_DOC);
  const snap = await configRef.get();
  if (snap.exists) {
    const uids = (snap.data().uids || []).filter((id) => id !== targetUserId);
    await configRef.set({ uids, updatedAt: admin.firestore.FieldValue.serverTimestamp() });
  }

  await logAdminAction(db, callerUid, targetUserId, "delete");

  await admin.auth().deleteUser(targetUserId);

  return { success: true };
});
