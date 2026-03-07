export const getDaysReading = (startDate) => {
  if (!startDate) return 0;
  const start = new Date(startDate);
  const today = new Date();
  const diffTime = Math.abs(today - start);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
};

export const calculateProgress = (currentPage, totalPages) => {
  if (!currentPage || !totalPages || totalPages === 0) return 0;
  return Math.round((currentPage / totalPages) * 100);
};

/**
 * Percentatge de progrés segur per a la UI; retorna null si és incoherent (negatiu, > 100%, pages 0).
 * @param {number|undefined|null} currentPage
 * @param {number|undefined|null} totalPages
 * @returns {number|null} 0–100 o null si invàlid
 */
export const safeProgress = (currentPage, totalPages) => {
  if (currentPage == null || totalPages == null) return null;
  const cur = Number(currentPage);
  const total = Number(totalPages);
  if (total <= 0 || cur < 0 || cur > total || Number.isNaN(cur) || Number.isNaN(total)) return null;
  return Math.min(100, Math.round((cur / total) * 100));
};

// Funcions addicionals
export const formatNumber = (num) => {
  return new Intl.NumberFormat("ca-ES").format(num);
};

export const truncateText = (text, maxLength = 100) => {
  if (!text || text.length <= maxLength) return text;
  return text.substring(0, maxLength) + "...";
};

export const generateId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

export const validateISBN = (isbn) => {
  if (!isbn) return false;
  // Eliminar guions i espais
  const cleanISBN = isbn.replace(/[-\s]/g, "");
  // ISBN-10 o ISBN-13
  return /^\d{10}$/.test(cleanISBN) || /^\d{13}$/.test(cleanISBN);
};

export const sortBooks = (books, sortBy = "title") => {
  const sorted = [...books];
  switch (sortBy) {
    case "title":
      return sorted.sort((a, b) => (a.title ?? "").localeCompare(b.title ?? ""));
    case "author":
      return sorted.sort((a, b) => (a.author ?? "").localeCompare(b.author ?? ""));
    case "rating":
      return sorted.sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0));
    case "year":
      return sorted.sort((a, b) => (b.year || 0) - (a.year || 0));
    case "recent":
      return sorted.sort((a, b) => {
        const dateA = new Date(a.startDate || 0);
        const dateB = new Date(b.startDate || 0);
        return dateB - dateA;
      });
    default:
      return sorted;
  }
};
