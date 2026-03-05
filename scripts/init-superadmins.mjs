#!/usr/bin/env node
/**
 * Inicialitza el document config/superadmins a Firestore.
 * Executa amb: node scripts/init-superadmins.mjs
 * Requereix: GOOGLE_APPLICATION_CREDENTIALS o Firebase Admin inicialitzat amb credencials.
 */
import admin from "firebase-admin";

const SUPERADMIN_UIDS = ["6g9VBE4EagT5yk8PuSZRHZGwAuH2"];

async function main() {
  if (!admin.apps.length) {
    try {
      admin.initializeApp({ projectId: process.env.GCLOUD_PROJECT || "divinabookstore" });
    } catch (e) {
      console.error("Inicialitza Firebase Admin amb GOOGLE_APPLICATION_CREDENTIALS o config.");
      process.exit(1);
    }
  }
  const db = admin.firestore();
  await db.collection("config").doc("superadmins").set({ uids: SUPERADMIN_UIDS }, { merge: true });
  console.log("config/superadmins inicialitzat amb:", SUPERADMIN_UIDS);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
