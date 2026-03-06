import { useState, useEffect, useCallback } from "react";
import {
  getGamification,
  setShowInLeaderboard,
  pointsToLevel,
  pointsToNextLevel,
} from "../services/gamificationService";

export function useGamification(userId) {
  const [gamification, setGamification] = useState(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    if (!userId) {
      setGamification(null);
      setLoading(false);
      return;
    }
    try {
      setLoading(true);
      const g = await getGamification(userId);
      setGamification(g);
    } catch (err) {
      console.error("Error loading gamification:", err);
      setGamification(null);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    load();
  }, [load]);

  const setShowInLeaderboardOpt = useCallback(
    async (show) => {
      if (!userId) return;
      try {
        await setShowInLeaderboard(userId, show);
        setGamification((prev) => (prev ? { ...prev, showInLeaderboard: show } : null));
      } catch (err) {
        console.error("Error updating showInLeaderboard:", err);
      }
    },
    [userId],
  );

  const totalPoints = gamification?.totalPoints ?? 0;
  const level = pointsToLevel(totalPoints);
  const toNextLevel = pointsToNextLevel(totalPoints);
  const showInLeaderboard = gamification?.showInLeaderboard !== false;

  return {
    totalPoints,
    pointsThisWeek: gamification?.pointsThisWeek ?? 0,
    pointsThisMonth: gamification?.pointsThisMonth ?? 0,
    level,
    toNextLevel,
    showInLeaderboard,
    setShowInLeaderboard: setShowInLeaderboardOpt,
    loading,
    refresh: load,
  };
}
