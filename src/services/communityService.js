import {
  collection,
  doc,
  setDoc,
  getDocs,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "./firebase";
import { getCommunityMembers } from "./communityManagementService";

export const communityService = {
  // Actualitzar el llibre actual de l'usuari a la comunitat
  updateCurrentReading: async (userId, userData, currentBook) => {
    try {
      const communityRef = doc(db, "community", userId);

      await setDoc(communityRef, {
        displayName: userData.displayName,
        photoURL: userData.photoURL,
        currentBook: currentBook
          ? {
              id: currentBook.id,
              title: currentBook.title,
              author: currentBook.author,
              genre: currentBook.genre,
              coverUrl: currentBook.coverUrl,
              currentPage: currentBook.currentPage,
              pages: currentBook.pages,
              startDate: currentBook.startDate,
            }
          : null,
        updatedAt: serverTimestamp(),
      });
    } catch (error) {
      console.error("Error al actualitzar comunitat:", error);
      throw error;
    }
  },

  /**
   * Obtenir els lectors de la comunitat: usuaris amb currentBook que són membres actius de la comunitat.
   * @param {string|null|undefined} activeCommunityId - ID de la comunitat activa; si és null/undefined retorna []
   */
  getCommunityReaders: async (activeCommunityId) => {
    try {
      if (!activeCommunityId) return [];
      const members = await getCommunityMembers(activeCommunityId);
      const memberIds = new Set(members.map((m) => m.userId));

      const communityRef = collection(db, "community");
      const querySnapshot = await getDocs(communityRef);

      const readers = querySnapshot.docs
        .map((docSnap) => ({
          uid: docSnap.id,
          ...docSnap.data(),
        }))
        .filter((reader) => reader.currentBook != null && memberIds.has(reader.uid));

      return readers;
    } catch (error) {
      console.error("Error al obtenir comunitat:", error);
      throw error;
    }
  },
};
