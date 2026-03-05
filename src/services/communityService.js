import {
  collection,
  doc,
  setDoc,
  getDocs,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "./firebase";
import { getCommunityMembers } from "./communityManagementService";

function bookToCommunityItem(book, now = Date.now()) {
  return {
    id: book.id,
    title: book.title ?? "",
    author: book.author ?? null,
    genre: book.genre ?? null,
    coverUrl: book.coverUrl ?? null,
    currentPage: book.currentPage ?? 0,
    pages: book.pages ?? null,
    startDate: book.startDate ?? null,
    lastUpdatedAt: book.updatedAt ?? book.lastUpdatedAt ?? now,
  };
}

function sortBooksByActivity(books) {
  return [...books].sort((a, b) => {
    const ta = a.lastUpdatedAt ?? a.startDate ?? 0;
    const tb = b.lastUpdatedAt ?? b.startDate ?? 0;
    if (tb !== ta) return (tb || 0) - (ta || 0);
    return (a.title ?? "").localeCompare(b.title ?? "");
  });
}

export const communityService = {
  /**
   * Actualitzar els llibres en lectura de l'usuari a la comunitat.
   * @param {string} userId
   * @param {{ displayName?: string, photoURL?: string }} userData
   * @param {Array<{ id: string, title?: string, author?: string, genre?: string, coverUrl?: string, currentPage?: number, pages?: number, startDate?: string, updatedAt?: number }>|null} currentBooksArray - Tots els llibres amb status "reading"
   */
  updateCurrentReading: async (userId, userData, currentBooksArray) => {
    try {
      const communityRef = doc(db, "community", userId);
      const now = Date.now();
      const books = Array.isArray(currentBooksArray) ? currentBooksArray : [];
      const currentBooks = books.map((b) => bookToCommunityItem(b, now));
      const first = currentBooks[0] ?? null;

      await setDoc(communityRef, {
        displayName: userData.displayName,
        photoURL: userData.photoURL,
        currentBooks,
        currentBook: first
          ? {
              id: first.id,
              title: first.title,
              author: first.author,
              genre: first.genre,
              coverUrl: first.coverUrl,
              currentPage: first.currentPage,
              pages: first.pages,
              startDate: first.startDate,
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
   * Obtenir els lectors de la comunitat: tots els membres amb currentBooks (o currentBook) normalitzat a array.
   * @param {string|null|undefined} activeCommunityId
   * @returns {Promise<Array<{ uid: string, displayName?: string, photoURL?: string, currentBooks: Array }>>}
   */
  getCommunityReaders: async (activeCommunityId) => {
    try {
      if (!activeCommunityId) return [];
      const members = await getCommunityMembers(activeCommunityId);
      const memberIds = new Set(members.map((m) => m.userId));

      const communityRef = collection(db, "community");
      const querySnapshot = await getDocs(communityRef);

      const docByUid = {};
      querySnapshot.docs.forEach((docSnap) => {
        if (memberIds.has(docSnap.id)) docByUid[docSnap.id] = docSnap.data();
      });

      const readers = members.map((m) => {
        const data = docByUid[m.userId] ?? {};
        const rawBooks = data.currentBooks ?? (data.currentBook ? [data.currentBook] : []);
        const currentBooks = sortBooksByActivity(
          rawBooks.map((b) => ({
            ...b,
            lastUpdatedAt: b.lastUpdatedAt ?? b.startDate ?? 0,
          })),
        );
        return {
          uid: m.userId,
          displayName: data.displayName ?? m.displayName,
          photoURL: data.photoURL ?? m.photoURL,
          currentBooks,
        };
      });

      return readers;
    } catch (error) {
      console.error("Error al obtenir comunitat:", error);
      throw error;
    }
  },
};
