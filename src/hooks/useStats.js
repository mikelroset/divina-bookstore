import { useMemo } from "react";
import { useBooks } from "./useBooks";
import { computeStats } from "../utils/stats";

/**
 * Calcula les estadístiques de lectura a partir dels llibres de l'usuari.
 * Única font de veritat per a aquests càlculs (evita duplicar getStats a App).
 */
export const useStats = () => {
  const { books } = useBooks();
  return useMemo(() => computeStats(books), [books]);
};
