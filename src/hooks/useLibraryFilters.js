import { useState, useMemo } from "react";
import { LIBRARY_FILTER_ALL } from "../utils/constants";

/**
 * Gestiona la cerca i el filtre per estat de la biblioteca.
 * Retorna l'estat, els setters i la llista de llibres ja filtrada.
 */
export const useLibraryFilters = (books) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState(LIBRARY_FILTER_ALL);

  const filteredBooks = useMemo(() => {
    return books.filter((book) => {
      const matchesSearch =
        book.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        book.author?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesFilter =
        filterStatus === LIBRARY_FILTER_ALL || book.status === filterStatus;
      return matchesSearch && matchesFilter;
    });
  }, [books, searchTerm, filterStatus]);

  return {
    searchTerm,
    setSearchTerm,
    filterStatus,
    setFilterStatus,
    filteredBooks,
  };
};
