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
 * Servei d'encoratjaments (usuari → usuari).
 * Col·lecció Firestore: `encouragements` (fromUserId, fromUserName, toUserId, createdAt).
 * Regles recomanades: només l'enviador pot crear amb el seu fromUserId;
 * només el receptor pot llegir documents on toUserId == request.auth.uid.
 * Índex compost: toUserId (ASC) + createdAt (DESC) per getEncouragementsForUser.
 */
export const encouragementService = {
  /**
   * Envia un encoratjament d'un usuari a un altre.
   * @param {string} fromUserId - UID de qui envia
   * @param {string} fromUserName - Nom per mostrar del sender
   * @param {string} toUserId - UID de qui rep l'encoratjament
   */
  sendEncouragement: async (fromUserId, fromUserName, toUserId) => {
    try {
      const encouragementsRef = collection(db, "encouragements");
      await addDoc(encouragementsRef, {
        fromUserId,
        fromUserName: fromUserName ?? "Algú",
        toUserId,
        createdAt: serverTimestamp(),
      });
    } catch (error) {
      console.error("Error al enviar encoratjament:", error);
      throw error;
    }
  },

  /**
   * Obté els encoratjaments rebuts per un usuari (inbox).
   * @param {string} userId - UID de l'usuari que rep
   * @returns {Promise<Array<{ id: string, fromUserName: string, createdAt: unknown }>>}
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
      return querySnapshot.docs.map((docSnap) => ({
        id: docSnap.id,
        ...docSnap.data(),
      }));
    } catch (error) {
      console.error("Error al obtenir encoratjaments:", error);
      throw error;
    }
  },
};
