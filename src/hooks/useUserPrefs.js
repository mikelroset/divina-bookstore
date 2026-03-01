import { useState, useEffect, useCallback } from "react";
import {
  getUserPrefs,
  updateUserPrefs,
  addReadingActivityDay,
  computeStreak,
} from "../services/userPrefsService";
import { ensureUserInDefaultCommunity } from "../services/communityManagementService";
import { DEFAULT_COMMUNITY_ID } from "../utils/constants";

export function useUserPrefs(userId) {
  const [annualGoal, setAnnualGoalState] = useState(0);
  const [readingActivityDays, setReadingActivityDays] = useState([]);
  const [activeCommunityId, setActiveCommunityIdState] = useState(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    if (!userId) {
      setAnnualGoalState(0);
      setReadingActivityDays([]);
      setActiveCommunityIdState(null);
      setLoading(false);
      return;
    }
    try {
      setLoading(true);
      const prefs = await getUserPrefs(userId);
      setAnnualGoalState(prefs.annualGoal ?? 0);
      setReadingActivityDays(prefs.readingActivityDays ?? []);
      let communityId = prefs.activeCommunityId ?? null;
      if (!communityId) {
        await ensureUserInDefaultCommunity(userId);
        await updateUserPrefs(userId, { activeCommunityId: DEFAULT_COMMUNITY_ID });
        communityId = DEFAULT_COMMUNITY_ID;
      }
      setActiveCommunityIdState(communityId);
    } catch (err) {
      console.error("Error loading user prefs:", err);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    load();
  }, [load]);

  const setAnnualGoal = useCallback(
    async (value) => {
      const num = Math.max(0, parseInt(value, 10) || 0);
      setAnnualGoalState(num);
      if (!userId) return;
      try {
        await updateUserPrefs(userId, { annualGoal: num });
      } catch (err) {
        console.error("Error saving annual goal:", err);
      }
    },
    [userId],
  );

  const recordReadingActivity = useCallback(async () => {
    if (!userId) return;
    try {
      await addReadingActivityDay(userId);
      const prefs = await getUserPrefs(userId);
      setReadingActivityDays(prefs.readingActivityDays ?? []);
    } catch (err) {
      console.error("Error recording reading activity:", err);
    }
  }, [userId]);

  const streak = computeStreak(readingActivityDays);

  const setActiveCommunityId = useCallback(
    async (communityId) => {
      setActiveCommunityIdState(communityId);
      if (!userId) return;
      try {
        await updateUserPrefs(userId, { activeCommunityId: communityId });
      } catch (err) {
        console.error("Error saving active community:", err);
      }
    },
    [userId],
  );

  return {
    annualGoal,
    setAnnualGoal,
    readingActivityDays,
    streak,
    recordReadingActivity,
    activeCommunityId,
    setActiveCommunityId,
    loading,
    refreshPrefs: load,
  };
}
