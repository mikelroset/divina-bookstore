import {
  collection,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  getDocs,
  query,
  orderBy,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "./firebase";
import { normalizeISBN, validateISBN } from "../utils/helpers";
import i18n from "../i18n";

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
   * ISBN obligatori. Comprova duplicats per usuari (mateix ISBN normalitzat).
   * @param {string} userId - UID de l'usuari
   * @param {Partial<Book>} bookData - Dades del llibre
   * @returns {Promise<Book>} Llibre creat amb id
   */
  addBook: async (userId, bookData) => {
    const isbn = (bookData.isbn ?? "").trim();
    if (!isbn) {
      throw new Error(i18n.t("bookForm.errorIsbnRequired"));
    }
    if (!validateISBN(isbn)) {
      throw new Error(i18n.t("bookForm.errorIsbnInvalid"));
    }
    const normalizedIsbn = normalizeISBN(isbn);
    if (!normalizedIsbn) {
      throw new Error(i18n.t("bookForm.errorIsbnInvalid"));
    }

    const existingBooks = await bookService.getUserBooks(userId);
    const hasDuplicate = existingBooks.some((b) => {
      const existingNorm = normalizeISBN(b.isbn);
      return existingNorm && existingNorm === normalizedIsbn;
    });
    if (hasDuplicate) {
      throw new Error(i18n.t("bookForm.errorBookAlreadyExists"));
    }

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
   * Si bookData inclou isbn, comprova que no sigui duplicat (en un altre llibre del mateix usuari).
   * @param {string} userId - UID de l'usuari
   * @param {string} bookId - ID del llibre
   * @param {Partial<Book>} bookData - Dades a actualitzar
   * @returns {Promise<Book>} Llibre actualitzat
   */
  updateBook: async (userId, bookId, bookData) => {
    const newIsbn = bookData?.isbn != null ? (bookData.isbn + "").trim() : null;
    if (newIsbn) {
      if (!validateISBN(newIsbn)) {
        throw new Error(i18n.t("bookForm.errorIsbnInvalid"));
      }
      const normalizedIsbn = normalizeISBN(newIsbn);
      const existingBooks = await bookService.getUserBooks(userId);
      const hasDuplicate = existingBooks.some((b) => {
        if (b.id === bookId) return false;
        const existingNorm = normalizeISBN(b.isbn);
        return existingNorm && existingNorm === normalizedIsbn;
      });
      if (hasDuplicate) {
        throw new Error(i18n.t("bookForm.errorBookAlreadyExists"));
      }
    }

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
