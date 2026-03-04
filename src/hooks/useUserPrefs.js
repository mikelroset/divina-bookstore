import { useState, useEffect, useCallback } from "react";
import {
  getUserPrefs,
  updateUserPrefs,
  addReadingActivityDay,
  computeStreak,
} from "../services/userPrefsService";
import { ensureUserInDefaultCommunity } from "../services/communityManagementService";
import { DEFAULT_COMMUNITY_ID } from "../utils/constants";

/**
 * @param {string | undefined} userId
 * @param {{ email?: string, displayName?: string, photoURL?: string } | undefined} [profile] - Optional user profile (e.g. currentUser) to store email/displayName when ensuring default community.
 */
export function useUserPrefs(userId, profile) {
  const [annualGoal, setAnnualGoalState] = useState(0);
  const [readingActivityDays, setReadingActivityDays] = useState([]);
  const [activeCommunityId, setActiveCommunityIdState] = useState(null);
  const [userCommunityIds, setUserCommunityIdsState] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    if (!userId) {
      setAnnualGoalState(0);
      setReadingActivityDays([]);
      setActiveCommunityIdState(null);
      setUserCommunityIdsState([]);
      setLoading(false);
      return;
    }
    try {
      setLoading(true);
      const prefs = await getUserPrefs(userId);
      setAnnualGoalState(prefs.annualGoal ?? 0);
      setReadingActivityDays(prefs.readingActivityDays ?? []);
      let communityId = prefs.activeCommunityId ?? null;
      let communityIds = prefs.userCommunityIds ?? [];
      if (communityIds.length === 0 || !communityId) {
        const memberProfile = profile
          ? { email: profile.email, displayName: profile.displayName, photoURL: profile.photoURL }
          : {};
        await ensureUserInDefaultCommunity(userId, memberProfile);
        communityIds = [DEFAULT_COMMUNITY_ID];
        communityId = communityId || DEFAULT_COMMUNITY_ID;
        await updateUserPrefs(userId, { activeCommunityId: communityId, userCommunityIds: communityIds });
      }
      setActiveCommunityIdState(communityId);
      setUserCommunityIdsState(communityIds);
    } catch (err) {
      console.error("Error loading user prefs:", err);
    } finally {
      setLoading(false);
    }
  }, [userId, profile]);

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

  const addCommunityToUser = useCallback(
    async (communityId) => {
      if (!userId || !communityId) return;
      const prefs = await getUserPrefs(userId);
      const ids = prefs.userCommunityIds ?? [];
      if (ids.includes(communityId)) return;
      const next = [...ids, communityId];
      setUserCommunityIdsState(next);
      await updateUserPrefs(userId, { userCommunityIds: next });
    },
    [userId],
  );

  /** Sincronitza userCommunityIds amb els ids on l'usuari és membre actiu (per ex. després d'expulsió). */
  const syncUserCommunityIds = useCallback(
    async (activeCommunityIds) => {
      if (!userId || !Array.isArray(activeCommunityIds)) return;
      setUserCommunityIdsState(activeCommunityIds);
      setActiveCommunityIdState((current) => {
        const next = activeCommunityIds.includes(current) ? current : (activeCommunityIds[0] ?? null);
        return next;
      });
      const newActive = activeCommunityIds.length > 0 ? (activeCommunityIds.includes(activeCommunityId) ? activeCommunityId : activeCommunityIds[0]) : null;
      await updateUserPrefs(userId, { userCommunityIds: activeCommunityIds, activeCommunityId: newActive ?? null });
    },
    [userId, activeCommunityId],
  );

  return {
    annualGoal,
    setAnnualGoal,
    readingActivityDays,
    streak,
    recordReadingActivity,
    activeCommunityId,
    setActiveCommunityId,
    userCommunityIds,
    addCommunityToUser,
    syncUserCommunityIds,
    loading,
    refreshPrefs: load,
  };
}
