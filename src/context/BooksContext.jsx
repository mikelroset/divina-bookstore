import React, { createContext, useState, useEffect, useCallback } from "react";
import { bookService } from "../services/bookService";
import { communityService } from "../services/communityService";
import { useAuth } from "../hooks/useAuth";

export const BooksContext = createContext();

export const BooksProvider = ({ children }) => {
  const { user } = useAuth();
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(false);

  const loadBooks = useCallback(async () => {
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

  useEffect(() => {
    if (user) {
      loadBooks();
    } else {
      setBooks([]);
    }
  }, [user, loadBooks]);

  useEffect(() => {
    if (user && books.length > 0) {
      // Trobar el llibre que està llegint
      const currentReading = books.find((b) => b.status === "reading");

      // Actualitzar la comunitat (userId ha de ser string per al path del document)
      communityService
        .updateCurrentReading(user.uid, user, currentReading)
        .catch((err) => console.error("Error actualitzant comunitat:", err));
    }
  }, [user, books]);

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
        prevBooks.map((book) => (book.id === bookId ? updatedBook : book)),
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

  const value = {
    books,
    loading,
    addBook,
    updateBook,
    deleteBook,
    getBooksByStatus,
    refreshBooks: loadBooks,
  };

  return (
    <BooksContext.Provider value={value}>{children}</BooksContext.Provider>
  );
};
