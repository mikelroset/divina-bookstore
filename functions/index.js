/**
 * Cloud Functions – Divina Bookstore
 * Fase 2: Enviament de correu d'invitació quan l'email no té compte.
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

const GAMIFICATION_DOC = "gamification";
const { Resend } = require("resend");

admin.initializeApp();

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
 * Obté el rànquing de la comunitat (Cloud Function per bypassar restriccions Firestore).
 * El client no pot llegir users/{uid}/prefs/gamification d'altres usuaris.
 * @param {Object} data - { communityId: string, period: 'week'|'month'|'all' }
 * @returns {Array<{ userId: string, displayName?: string, points: number, rank: number }>}
 */
exports.getLeaderboard = onCall({ region: "europe-west1" }, async (request) => {
  if (!request.auth?.uid) {
    throw new HttpsError("unauthenticated", "Cal iniciar sessió.");
  }
  const { communityId, period } = request.data || {};
  if (!communityId || typeof communityId !== "string") {
    throw new HttpsError("invalid-argument", "communityId requerit.");
  }
  const validPeriods = ["week", "month", "all"];
  const p = validPeriods.includes(period) ? period : "week";

  const db = admin.firestore();

  const memberRef = db.collection("communities").doc(communityId).collection("members").doc(request.auth.uid);
  const memberSnap = await memberRef.get();
  if (!memberSnap.exists || memberSnap.data()?.status !== "active") {
    throw new HttpsError("permission-denied", "No ets membre d'aquesta comunitat.");
  }

  const membersSnap = await db
    .collection("communities")
    .doc(communityId)
    .collection("members")
    .where("status", "==", "active")
    .get();

  const displayNames = {};
  const memberIds = [];
  membersSnap.docs.forEach((d) => {
    const data = d.data();
    memberIds.push(d.id);
    displayNames[d.id] = data.displayName || data.email || "Lector";
  });

  const results = [];
  for (const uid of memberIds) {
    const gRef = db.collection("users").doc(uid).collection("prefs").doc(GAMIFICATION_DOC);
    const gSnap = await gRef.get();
    const data = gSnap.exists ? gSnap.data() : {};
    if (data.showInLeaderboard === false) continue;
    let points = data.totalPoints ?? 0;
    if (p === "week") points = data.pointsThisWeek ?? 0;
    else if (p === "month") points = data.pointsThisMonth ?? 0;
    results.push({
      userId: uid,
      displayName: displayNames[uid] ?? "Lector",
      points,
    });
  }

  results.sort((a, b) => b.points - a.points);
  return results.map((r, i) => ({ ...r, rank: i + 1 }));
});

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
