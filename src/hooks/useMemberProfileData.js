import { useState, useEffect, useCallback } from "react";
import { bookService } from "../services/bookService";
import { getUserPrefs } from "../services/userPrefsService";
import { computeStats } from "../utils/stats";
import { useGamification } from "./useGamification";
import { useBadges } from "./useBadges";

/**
 * Hook per carregar dades del perfil públic d'un membre (només lectura).
 * Ús: MemberProfileView per mostrar el perfil d'un altre usuari de la comunitat.
 * @param {string} [userId] - UID del membre
 * @returns {{ stats, annualGoal, books, readingActivityDays, ...gamification, ...badges, loading, error }}
 */
export function useMemberProfileData(userId) {
  const [books, setBooks] = useState([]);
  const [prefs, setPrefs] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const gamification = useGamification(userId);
  const { unlockedIds, loading: badgesLoading } = useBadges(userId);

  const load = useCallback(async (cancelledRef) => {
    if (!userId) {
      if (!cancelledRef?.current) {
        setBooks([]);
        setPrefs(null);
        setLoading(false);
      }
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const [booksData, prefsData] = await Promise.all([
        bookService.getUserBooks(userId),
        getUserPrefs(userId),
      ]);
      if (cancelledRef?.current) return;
      setBooks(booksData);
      setPrefs(prefsData);
    } catch (err) {
      if (!cancelledRef?.current) {
        console.error("Error loading member profile:", err);
        setError(err);
      }
    } finally {
      if (!cancelledRef?.current) setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    const cancelledRef = { current: false };
    load(cancelledRef);
    return () => {
      cancelledRef.current = true;
    };
  }, [load]);

  const stats = computeStats(books);
  const annualGoal = prefs?.annualGoal ?? 0;
  const readingActivityDays = prefs?.readingActivityDays ?? [];
  const dataLoading = loading || gamification.loading || badgesLoading;

  return {
    stats,
    annualGoal,
    books,
    readingActivityDays,
    ...gamification,
    unlockedIds,
    badgesLoading,
    loading: dataLoading,
    error,
  };
}
