import { useState, useEffect, useCallback } from "react";
import { getUnlockedBadgeIds, evaluateAndUnlockBadges } from "../services/badgeService";

/**
 * Hook per gestionar els badges de l'usuari.
 * Carrega els desbloquejats, avalua i desbloqueja nous, i retorna els nous per a notificació.
 * @param {string} [userId]
 * @param {Object} context - { books, readingActivityDays }
 * @param {(badges: Array<{ id: string, name: string, image: string }>) => void} [onNewUnlocks] - Callback quan hi ha nous badges desbloquejats
 */
export function useBadges(userId, context, onNewUnlocks) {
  const [unlockedIds, setUnlockedIds] = useState(() => new Set());
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    if (!userId) {
      setUnlockedIds(new Set());
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const ids = await getUnlockedBadgeIds(userId);
      setUnlockedIds(ids);
      if (!context?.books && !context?.readingActivityDays) {
        setLoading(false);
        return;
      }
      const newlyUnlocked = await evaluateAndUnlockBadges(userId, context);
      if (newlyUnlocked.length > 0) {
        newlyUnlocked.forEach((b) => ids.add(b.id));
        setUnlockedIds(new Set(ids));
        onNewUnlocks?.(newlyUnlocked);
      }
    } catch (err) {
      console.error("Error loading badges:", err);
    } finally {
      setLoading(false);
    }
  }, [userId, context?.books, context?.readingActivityDays, onNewUnlocks]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return { unlockedIds, loading, refresh };
}
