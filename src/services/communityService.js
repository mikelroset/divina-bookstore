import {
  collection,
  doc,
  setDoc,
  getDocs,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "./firebase";

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

  // Obtenir tots els lectors de la comunitat (tots els usuaris amb currentBook)
  getCommunityReaders: async () => {
    try {
      const communityRef = collection(db, "community");
      const querySnapshot = await getDocs(communityRef);

      const readers = querySnapshot.docs
        .map((docSnap) => ({
          uid: docSnap.id,
          ...docSnap.data(),
        }))
        .filter((reader) => reader.currentBook != null); // != per detectar null i undefined

      return readers;
    } catch (error) {
      console.error("Error al obtenir comunitat:", error);
      throw error;
    }
  },
};
