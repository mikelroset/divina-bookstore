import {
  collection,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  getDocs,
  query,
  where,
  orderBy,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "./firebase";

/**
 * @typedef {Object} Book
 * @property {string} id
 * @property {string} [title]
 * @property {string} [author]
 * @property {number} [pages]
 * @property {number} [currentPage]
 * @property {string} [status]
 * @property {string} [genre]
 * @property {Array<{at: number, page: number}>} [pageLog]
 */

export const bookService = {
  /**
   * Obtenir tots els llibres d'un usuari.
   * @param {string} userId - UID de l'usuari
   * @returns {Promise<Book[]>} Llistat de llibres ordenats per createdAt desc
   */
  getUserBooks: async (userId) => {
    try {
      const booksRef = collection(db, "users", userId, "books");
      const q = query(booksRef, orderBy("createdAt", "desc"));
      const querySnapshot = await getDocs(q);

      return querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
    } catch (error) {
      console.error("Error al obtenir llibres:", error);
      throw error;
    }
  },

  /**
   * Afegir un nou llibre.
   * @param {string} userId - UID de l'usuari
   * @param {Partial<Book>} bookData - Dades del llibre
   * @returns {Promise<Book>} Llibre creat amb id
   */
  addBook: async (userId, bookData) => {
    try {
      const booksRef = collection(db, "users", userId, "books");
      const docRef = await addDoc(booksRef, {
        ...bookData,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
      return { id: docRef.id, ...bookData };
    } catch (error) {
      console.error("Error al afegir llibre:", error);
      throw error;
    }
  },

  /**
   * Actualitzar un llibre existent.
   * @param {string} userId - UID de l'usuari
   * @param {string} bookId - ID del llibre
   * @param {Partial<Book>} bookData - Dades a actualitzar
   * @returns {Promise<Book>} Llibre actualitzat
   */
  updateBook: async (userId, bookId, bookData) => {
    try {
      const bookRef = doc(db, "users", userId, "books", bookId);
      await updateDoc(bookRef, {
        ...bookData,
        updatedAt: serverTimestamp(),
      });

      return { id: bookId, ...bookData };
    } catch (error) {
      console.error("Error al actualitzar llibre:", error);
      throw error;
    }
  },

  /**
   * Eliminar un llibre.
   * @param {string} userId - UID de l'usuari
   * @param {string} bookId - ID del llibre
   * @returns {Promise<void>}
   */
  deleteBook: async (userId, bookId) => {
    try {
      const bookRef = doc(db, "users", userId, "books", bookId);
      await deleteDoc(bookRef);
    } catch (error) {
      console.error("Error al eliminar llibre:", error);
      throw error;
    }
  },

  // Obtenir llibres per estat
  getBooksByStatus: async (userId, status) => {
    try {
      const booksRef = collection(db, "users", userId, "books");
      const q = query(
        booksRef,
        where("status", "==", status),
        orderBy("createdAt", "desc"),
      );
      const querySnapshot = await getDocs(q);

      return querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
    } catch (error) {
      console.error("Error al obtenir llibres per estat:", error);
      throw error;
    }
  },
};
