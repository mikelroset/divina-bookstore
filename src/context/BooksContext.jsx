import React, { createContext, useContext, useState, useEffect } from "react";
import { bookService } from "../services/bookService";
import { useAuth } from "./AuthContext";

const BooksContext = React.createContext();

export const useBooks = () => {
  const context = React.useContext(BooksContext);
  if (!context) {
    throw new Error("useBooks ha de ser utilitzat dins d'un BooksProvider");
  }
  return context;
};

export const BooksProvider = ({ children }) => {
  const { user } = useAuth();
  const [books, setBooks] = React.useState([]);
  const [loading, setLoading] = React.useState(false);

  // Carregar llibres quan l'usuari canvia
  React.useEffect(() => {
    if (user) {
      loadBooks();
    } else {
      setBooks([]);
    }
  }, [user]);

  const loadBooks = async () => {
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
  };

  const addBook = async (bookData) => {
    if (!user) return;

    try {
      const newBook = await bookService.addBook(user.uid, bookData);
      setBooks([...books, newBook]);
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
      setBooks(books.map((book) => (book.id === bookId ? updatedBook : book)));
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
      setBooks(books.filter((book) => book.id !== bookId));
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
