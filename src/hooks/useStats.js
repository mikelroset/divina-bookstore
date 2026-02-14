import { useMemo } from "react";
import { useBooks } from "../context/BooksContext";

export const useStats = () => {
  // const { books } = useBooks();

  const books = []; // Mock per desenvolupament

  const stats = React.useMemo(() => {
    const completedBooks = books.filter((b) => b.status === "completed");
    const currentMonth = new Date().getMonth();

    const booksThisMonth = completedBooks.filter((b) => {
      if (!b.endDate) return false;
      return new Date(b.endDate).getMonth() === currentMonth;
    });

    // Calcular gènere preferit
    const genreCounts = {};
    completedBooks.forEach((book) => {
      genreCounts[book.genre] = (genreCounts[book.genre] || 0) + 1;
    });
    const favoriteGenre =
      Object.keys(genreCounts).length > 0
        ? Object.keys(genreCounts).reduce((a, b) =>
            genreCounts[a] > genreCounts[b] ? a : b,
          )
        : "N/A";

    // Calcular progrés global
    const totalPages = books.reduce((sum, book) => sum + (book.pages || 0), 0);
    const readPages = books.reduce((sum, book) => {
      if (book.status === "completed") return sum + (book.pages || 0);
      if (book.status === "reading") return sum + (book.currentPage || 0);
      return sum;
    }, 0);
    const progressPercentage =
      totalPages > 0 ? Math.round((readPages / totalPages) * 100) : 0;

    return {
      totalBooks: books.length,
      completedBooks: completedBooks.length,
      readingBooks: books.filter((b) => b.status === "reading").length,
      pendingBooks: books.filter((b) => b.status === "pending").length,
      booksThisMonth: booksThisMonth.length,
      favoriteGenre,
      progressPercentage,
      totalPages,
      readPages,
    };
  }, [books]);

  return stats;
};
