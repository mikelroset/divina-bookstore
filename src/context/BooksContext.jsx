import React, { createContext, useState, useEffect, useCallback } from "react";
import { bookService } from "../services/bookService";
import { communityService } from "../services/communityService";
import { useAuth } from "../hooks/useAuth";

export const BooksContext = createContext();

export const BooksProvider = ({ children }) => {
  const { user } = useAuth();
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!user) {
      setBooks([]);
      return;
    }
    let cancelled = false;
    (async () => {
      try {
        setLoading(true);
        const userBooks = await bookService.getUserBooks(user.uid);
        if (!cancelled) setBooks(userBooks);
      } catch (error) {
        if (!cancelled) console.error("Error al carregar llibres:", error);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [user]);

  // Sincronitzar llibres en lectura a community/{userId} per a la vista de comunitat.
  // No sincronitzem mentre loading: true per no sobreescriure amb [] abans d’haver carregat els llibres.
  useEffect(() => {
    if (!user || loading) return;
    const readingBooks = books.filter((b) => b.status === "reading");
    communityService
      .updateCurrentReading(user.uid, user, readingBooks)
      .catch((err) => console.error("Error actualitzant comunitat:", err));
  }, [user, books, loading]);

  const addBook = async (bookData) => {
    if (!user) return;

    try {
      const newBook = await bookService.addBook(user.uid, bookData);
      setBooks((prevBooks) => [newBook, ...prevBooks]);
      return newBook;
    } catch (error) {
      console.error("Error al afegir llibre:", error);
      throw error;
    }
  };

  const updateBook = async (bookId, bookData) => {
    if (!user) return;

    try {
      const updatedBook = await bookService.updateBook(
        user.uid,
        bookId,
        bookData,
      );
      setBooks((prevBooks) =>
        prevBooks.map((book) =>
          book.id === bookId
            ? { ...book, ...updatedBook, id: bookId }
            : book,
        ),
      );
      return updatedBook;
    } catch (error) {
      console.error("Error al actualitzar llibre:", error);
      throw error;
    }
  };

  const deleteBook = async (bookId) => {
    if (!user) return;

    try {
      await bookService.deleteBook(user.uid, bookId);
      setBooks((prevBooks) => prevBooks.filter((book) => book.id !== bookId));
    } catch (error) {
      console.error("Error al eliminar llibre:", error);
      throw error;
    }
  };

  const getBooksByStatus = (status) => {
    return books.filter((book) => book.status === status);
  };

  const refreshBooks = useCallback(async () => {
    if (!user) return;
    try {
      setLoading(true);
      const userBooks = await bookService.getUserBooks(user.uid);
      setBooks(userBooks);
    } catch (error) {
      console.error("Error al carregar llibres:", error);
    } finally {
      setLoading(false);
    }
  }, [user]);

  const value = {
    books,
    loading,
    addBook,
    updateBook,
    deleteBook,
    getBooksByStatus,
    refreshBooks,
  };

  return (
    <BooksContext.Provider value={value}>{children}</BooksContext.Provider>
  );
};
