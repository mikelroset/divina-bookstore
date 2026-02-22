import { useState, useEffect } from "react";
import { encouragementService } from "../services/encouragementService";

/**
 * Retorna el nombre d'encoratjaments rebuts per l'usuari (per mostrar badge a la nav).
 * El comptador reflecteix només els dels últims 3 dies (getEncouragementsForUser ja filtra).
 * @param {string | undefined} userId - UID de l'usuari autenticat
 * @returns {{ count: number, loading: boolean }}
 */
export const useEncouragementCount = (userId) => {
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) return;
    queueMicrotask(() => setLoading(true));
    encouragementService
      .getEncouragementsForUser(userId)
      .then((list) => setCount(list?.length ?? 0))
      .catch(() => setCount(0))
      .finally(() => setLoading(false));
  }, [userId]);

  // Quan no hi ha userId no fem setState a l'effect; derivem el resultat per evitar cascading renders
  if (!userId) return { count: 0, loading: false };
  return { count, loading };
};
