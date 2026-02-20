/**
 * Calcula les estadístiques de lectura a partir d’una llista de llibres.
 * Funció pura per poder testar-la sense React.
 * @param {Array<{ status: string, genre?: string, endDate?: string, pages?: number, currentPage?: number }>} books
 * @returns {Object} Estadístiques (totalBooks, completedBooks, readingBooks, pendingBooks, booksThisMonth, favoriteGenre, progressPercentage, totalPages, readPages)
 */
export function computeStats(books) {
  const completedBooks = books.filter((b) => b.status === "completed");
  const currentMonth = new Date().getMonth();

  const booksThisMonth = completedBooks.filter((b) => {
    if (!b.endDate) return false;
    return new Date(b.endDate).getMonth() === currentMonth;
  });

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

  // Progrés només dels llibres que s’estan llegint (no pendents ni completats)
  const readingBooksList = books.filter((b) => b.status === "reading");
  const totalPages = readingBooksList.reduce(
    (sum, book) => sum + (book.pages || 0),
    0,
  );
  const readPages = readingBooksList.reduce(
    (sum, book) => sum + (book.currentPage || 0),
    0,
  );
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
}
