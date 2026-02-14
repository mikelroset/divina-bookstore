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

export const bookService = {
  // Obtenir tots els llibres d'un usuari
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

  // Afegir un nou llibre
  addBook: async (userId, bookData) => {
    try {
      console.log("📚 Afegint llibre per userId:", userId);
      console.log("📚 Dades del llibre:", bookData);

      const booksRef = collection(db, "users", userId, "books");
      const docRef = await addDoc(booksRef, {
        ...bookData,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });

      console.log("✅ Llibre afegit amb ID:", docRef.id);
      return { id: docRef.id, ...bookData };
    } catch (error) {
      console.error("❌ Error al afegir llibre:", error);
      console.error("❌ Error code:", error.code);
      console.error("❌ Error message:", error.message);
      throw error;
    }
  },

  // Actualitzar un llibre
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

  // Eliminar un llibre
  deleteBook: async (userId, bookId) => {
    try {
      const bookRef = doc(db, "users", userId, "books", bookId);
      await deleteDoc(bookRef);
      console.log("✅ Llibre eliminat:", bookId);
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
