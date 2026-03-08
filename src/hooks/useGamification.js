import { useState, useEffect, useCallback } from "react";
import {
  getGamification,
  setShowInLeaderboard,
  pointsToLevel,
  pointsToNextLevel,
} from "../services/gamificationService";
import { getLevelInfo } from "../utils/levelCatalog";

export function useGamification(userId) {
  const [gamification, setGamification] = useState(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async (cancelledRef) => {
    if (!userId) {
      if (!cancelledRef?.current) {
        setGamification(null);
        setLoading(false);
      }
      return;
    }
    try {
      setLoading(true);
      const g = await getGamification(userId);
      if (cancelledRef?.current) return;
      setGamification(g);
    } catch (err) {
      if (!cancelledRef?.current) {
        console.error("Error loading gamification:", err);
        setGamification(null);
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
  const toNextLevelData = pointsToNextLevel(totalPoints);
  const levelInfo = getLevelInfo(level);
  const nextLevelInfo = level < 71 ? getLevelInfo(level + 1) : null;
  const showInLeaderboard = gamification?.showInLeaderboard !== false;

  return {
    totalPoints,
    pointsThisWeek: gamification?.pointsThisWeek ?? 0,
    pointsThisMonth: gamification?.pointsThisMonth ?? 0,
    level,
    levelDisplayName: levelInfo.displayName,
    levelColorClass: levelInfo.colorClass,
    toNextLevel: toNextLevelData.points,
    toNextLevelProgressPct: toNextLevelData.progressPct,
    nextLevelDisplayName: nextLevelInfo?.displayName ?? null,
    showInLeaderboard,
    setShowInLeaderboard: setShowInLeaderboardOpt,
    loading,
    refresh: load,
  };
}
