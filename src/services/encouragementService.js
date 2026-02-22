import {
  collection,
  addDoc,
  query,
  where,
  orderBy,
  getDocs,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "./firebase";

/**
 * Servei d'encoratjaments (usuari → usuari, per llibre).
 * Col·lecció Firestore: `encouragements` (fromUserId, fromUserName, toUserId, bookId, bookTitle, createdAt).
 * Regles recomanades: només l'enviador pot crear amb el seu fromUserId;
 * només el receptor pot llegir documents on toUserId == request.auth.uid.
 * Índex compost: toUserId (ASC) + createdAt (DESC) per getEncouragementsForUser.
 * canSendEncouragement fa query només per fromUserId i filtra en client; no cal índex compost per al cooldown.
 */
export const encouragementService = {
  /**
   * Envia un encoratjament d'un usuari a un altre per un llibre concret.
   * @param {string} fromUserId - UID de qui envia
   * @param {string} fromUserName - Nom per mostrar del sender
   * @param {string} toUserId - UID de qui rep l'encoratjament
   * @param {string} [bookId] - ID del llibre (opcional)
   * @param {string} [bookTitle] - Títol del llibre per al missatge (fallback "Llibre")
   */
  sendEncouragement: async (
    fromUserId,
    fromUserName,
    toUserId,
    bookId,
    bookTitle,
  ) => {
    try {
      const encouragementsRef = collection(db, "encouragements");
      await addDoc(encouragementsRef, {
        fromUserId,
        fromUserName: fromUserName ?? "Algú",
        toUserId,
        bookId: bookId ?? null,
        bookTitle: bookTitle ?? "Llibre",
        createdAt: serverTimestamp(),
      });
    } catch (error) {
      console.error("Error al enviar encoratjament:", error);
      throw error;
    }
  },

  /**
   * Obté els encoratjaments rebuts per un usuari (inbox). Només retorna els dels últims 3 dies.
   * @param {string} userId - UID de l'usuari que rep
   * @returns {Promise<Array<{ id: string, fromUserName: string, bookTitle?: string, createdAt: unknown }>>}
   */
  getEncouragementsForUser: async (userId) => {
    try {
      const encouragementsRef = collection(db, "encouragements");
      const q = query(
        encouragementsRef,
        where("toUserId", "==", userId),
        orderBy("createdAt", "desc"),
      );
      const querySnapshot = await getDocs(q);
      const threeDaysAgoMs =
        Date.now() - 3 * 24 * 60 * 60 * 1000;
      const all = querySnapshot.docs.map((docSnap) => ({
        id: docSnap.id,
        ...docSnap.data(),
      }));
      return all.filter((doc) => {
        const createdAt = doc.createdAt;
        const ms =
          createdAt?.toMillis?.() ??
          (createdAt?.seconds != null ? createdAt.seconds * 1000 : 0);
        return ms >= threeDaysAgoMs;
      });
    } catch (error) {
      console.error("Error al obtenir encoratjaments:", error);
      throw error;
    }
  },

  /**
   * Comprova si l'enviador pot enviar un encoratjament a aquest receptor per aquest llibre
   * (no n'hi ha un dels últims 3 dies per la mateixa parella fromUserId + toUserId + bookId).
   * @param {string} fromUserId - UID de qui envia
   * @param {string} toUserId - UID de qui rep
   * @param {string | null} [bookId] - ID del llibre (opcional)
   * @returns {Promise<boolean>} true si pot enviar, false si està en cooldown
   */
  canSendEncouragement: async (fromUserId, toUserId, bookId) => {
    try {
      const encouragementsRef = collection(db, "encouragements");
      const q = query(
        encouragementsRef,
        where("fromUserId", "==", fromUserId),
      );
      const querySnapshot = await getDocs(q);
      const threeDaysAgoMs = Date.now() - 3 * 24 * 60 * 60 * 1000;
      const normalizedBookId = bookId ?? null;
      const hasRecent = querySnapshot.docs.some((docSnap) => {
        const data = docSnap.data();
        if (data.toUserId !== toUserId) return false;
        const docBookId = data.bookId ?? null;
        if (docBookId !== normalizedBookId) return false;
        const createdAt = data.createdAt;
        const ms =
          createdAt?.toMillis?.() ??
          (createdAt?.seconds != null ? createdAt.seconds * 1000 : 0);
        return ms >= threeDaysAgoMs;
      });
      return !hasRecent;
    } catch (error) {
      console.error("Error al comprovar cooldown encoratjament:", error);
      return true;
    }
  },
};
