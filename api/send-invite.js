/**
 * Vercel Serverless Function – enviament de correu d'invitació (opció 100% gratuïta, sense Blaze).
 * POST /api/send-invite amb body { inviteId } i header Authorization: Bearer <Firebase ID token>.
 *
 * Variables d'entorn a Vercel: RESEND_API_KEY, INVITE_BASE_URL, FROM_EMAIL, FIREBASE_SERVICE_ACCOUNT_JSON
 */

const INVITE_RESEND_COOLDOWN_MS = 10 * 60 * 1000;

function escapeHtml(s) {
  if (typeof s !== "string") return "";
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

async function userExistsByEmail(auth, email) {
  try {
    await auth.getUserByEmail(email);
    return true;
  } catch (e) {
    if (e.code === "auth/user-not-found") return false;
    throw e;
  }
}

async function sendInviteEmail(ResendClass, resendKey, fromEmail, baseUrl, { to, communityName, inviteId, inviteToken }) {
  const inviteLink = `${baseUrl.replace(/\/$/, "")}/community/invite/${inviteId}?token=${encodeURIComponent(inviteToken)}`;
  const resend = new ResendClass(resendKey);
  const { data, error } = await resend.emails.send({
    from: fromEmail,
    to: [to],
    subject: `Invitació a la comunitat "${communityName}" – Divina Bookstore`,
    html: `
      <p>Hola,</p>
      <p>T'han convidat a unir-te a la comunitat <strong>${escapeHtml(communityName)}</strong> a Divina Bookstore.</p>
      <p>Fes clic a l'enllaç de sota per crear un compte (o iniciar sessió) i acceptar la invitació:</p>
      <p><a href="${escapeHtml(inviteLink)}" style="background:#0d9488;color:white;padding:10px 20px;text-decoration:none;border-radius:6px;display:inline-block;">Acceptar invitació</a></p>
      <p>Si no has sol·licitat aquesta invitació, pots ignorar aquest correu.</p>
      <p>L'enllaç caduca en 14 dies.</p>
      <p>— Divina Bookstore</p>
    `,
  });
  if (error) throw new Error(error.message);
  return data;
}

export default async function handler(req, res) {
  res.setHeader("Content-Type", "application/json");
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const authHeader = req.headers.authorization;
  const token = authHeader?.startsWith("Bearer ") ? authHeader.slice(7) : null;
  if (!token) {
    return res.status(401).json({ error: "Missing Authorization header" });
  }

  let inviteId;
  try {
    const body = typeof req.body === "string" ? JSON.parse(req.body) : req.body || {};
    inviteId = body.inviteId;
  } catch (_) {
    return res.status(400).json({ error: "Invalid JSON body" });
  }
  if (!inviteId || typeof inviteId !== "string") {
    return res.status(400).json({ error: "Missing inviteId" });
  }

  const serviceAccountJson = process.env.FIREBASE_SERVICE_ACCOUNT_JSON;
  const resendKey = process.env.RESEND_API_KEY;
  const baseUrl = process.env.INVITE_BASE_URL || "https://divina-bookstore.vercel.app";
  const fromEmail = process.env.FROM_EMAIL || "Divina Bookstore <onboarding@resend.dev>";

  if (!serviceAccountJson) {
    console.error("FIREBASE_SERVICE_ACCOUNT_JSON not set");
    return res.status(500).json({ error: "Server configuration error" });
  }

  let admin;
  try {
    admin = (await import("firebase-admin")).default;
  } catch (e) {
    console.error("Firebase Admin import error:", e.message);
    return res.status(500).json({ error: "Server configuration error" });
  }

  if (!admin.apps.length) {
    try {
      const cred = JSON.parse(serviceAccountJson.trim());
      admin.initializeApp({ credential: admin.credential.cert(cred) });
    } catch (e) {
      console.error("Firebase Admin init error:", e.message);
      return res.status(500).json({ error: "Server configuration error" });
    }
  }

  try {
    const auth = admin.auth();
    const db = admin.firestore();

    let decoded;
    try {
      decoded = await auth.verifyIdToken(token);
    } catch (e) {
      return res.status(401).json({ error: "Invalid or expired token" });
    }
    const uid = decoded.uid;

    const inviteRef = db.collection("communityInvites").doc(inviteId);
    const inviteSnap = await inviteRef.get();
    if (!inviteSnap.exists) {
      return res.status(404).json({ error: "Invite not found" });
    }
    const data = inviteSnap.data();
    if (data.status !== "pending") {
      return res.status(400).json({ error: "Invite not pending" });
    }
    if (data.expiresAt < Date.now()) {
      return res.status(400).json({ error: "Invite expired" });
    }
    if (data.invitedByUserId !== uid) {
      return res.status(403).json({ error: "Not authorized to send this invite" });
    }

    const emailSentAt = data.emailSentAt ?? 0;
    if (emailSentAt && Date.now() - emailSentAt < INVITE_RESEND_COOLDOWN_MS) {
      return res.status(200).json({ ok: true, skipped: "cooldown" });
    }

    const email = (data.email || "").toLowerCase().trim();
    const inviteToken = data.inviteToken;
    if (!email || !inviteToken) {
      return res.status(400).json({ error: "Invalid invite data" });
    }

    const exists = await userExistsByEmail(auth, email);
    if (exists) {
      return res.status(200).json({ ok: true, skipped: "user_exists" });
    }

    if (!resendKey) {
      console.warn("RESEND_API_KEY not set; skipping send");
      return res.status(200).json({ ok: true, skipped: "no_resend_key" });
    }

    let communityName = "Comunitat";
    try {
      const comSnap = await db.collection("communities").doc(data.communityId).get();
      if (comSnap.exists) communityName = comSnap.data().name || communityName;
    } catch (_) {}

    const { Resend: ResendClass } = await import("resend");
    await sendInviteEmail(ResendClass, resendKey, fromEmail, baseUrl, {
      to: email,
      communityName,
      inviteId,
      inviteToken,
    });

    await inviteRef.update({
      emailSentAt: Date.now(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    return res.status(200).json({ ok: true, sent: true });
  } catch (e) {
    console.error("send-invite error:", e.message, e.stack);
    return res.status(500).json({ error: "Server error" });
  }
}
