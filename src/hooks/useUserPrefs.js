import { useState, useEffect, useCallback } from "react";
import {
  getUserPrefs,
  updateUserPrefs,
  addReadingActivityDay,
  computeStreak,
} from "../services/userPrefsService";
import { ensureUserInDefaultCommunity } from "../services/communityManagementService";
import { DEFAULT_COMMUNITY_ID } from "../utils/constants";
import i18n, { SUPPORTED_LANGS, DEFAULT_LANG } from "../i18n";

function detectBrowserLocale() {
  const lang = navigator.language?.toLowerCase() || navigator.languages?.[0]?.toLowerCase() || "";
  if (lang.startsWith("ca")) return "ca";
  if (lang.startsWith("es")) return "es";
  if (lang.startsWith("en")) return "en";
  return null;
}

/**
 * @param {string | undefined} userId
 * @param {{ email?: string, displayName?: string, photoURL?: string } | undefined} [profile] - Optional user profile (e.g. currentUser) to store email/displayName when ensuring default community.
 */
export function useUserPrefs(userId, profile) {
  const [annualGoal, setAnnualGoalState] = useState(0);
  const [readingActivityDays, setReadingActivityDays] = useState([]);
  const [activeCommunityId, setActiveCommunityIdState] = useState(null);
  const [userCommunityIds, setUserCommunityIdsState] = useState([]);
  const [locale, setLocaleState] = useState(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async (cancelledRef) => {
    if (!userId) {
      const detected = detectBrowserLocale();
      const initialLocale = detected && SUPPORTED_LANGS.includes(detected) ? detected : DEFAULT_LANG;
      if (!cancelledRef?.current) {
        setLocaleState(initialLocale);
        setAnnualGoalState(0);
        setReadingActivityDays([]);
        setActiveCommunityIdState(null);
        setUserCommunityIdsState([]);
        setLoading(false);
      }
      i18n.changeLanguage(initialLocale);
      return;
    }
    try {
      setLoading(true);
      const prefs = await getUserPrefs(userId);
      if (cancelledRef?.current) return;
      setAnnualGoalState(prefs.annualGoal ?? 0);
      setReadingActivityDays(prefs.readingActivityDays ?? []);
      const savedLocale = prefs.locale && SUPPORTED_LANGS.includes(prefs.locale) ? prefs.locale : null;
      const browserLocale = detectBrowserLocale();
      const effectiveLocale = savedLocale ?? (browserLocale && SUPPORTED_LANGS.includes(browserLocale) ? browserLocale : null) ?? DEFAULT_LANG;
      setLocaleState(effectiveLocale);
      i18n.changeLanguage(effectiveLocale);
      let communityId = prefs.activeCommunityId ?? null;
      let communityIds = prefs.userCommunityIds ?? [];
      if (communityIds.length === 0 || !communityId) {
        const memberProfile = profile
          ? { email: profile.email, displayName: profile.displayName, photoURL: profile.photoURL }
          : {};
        await ensureUserInDefaultCommunity(userId, memberProfile);
        if (cancelledRef?.current) return;
        communityIds = [DEFAULT_COMMUNITY_ID];
        communityId = communityId || DEFAULT_COMMUNITY_ID;
        await updateUserPrefs(userId, { activeCommunityId: communityId, userCommunityIds: communityIds });
        if (cancelledRef?.current) return;
      }
      setActiveCommunityIdState(communityId);
      setUserCommunityIdsState(communityIds);
    } catch (err) {
      if (!cancelledRef?.current) console.error("Error loading user prefs:", err);
    } finally {
      if (!cancelledRef?.current) setLoading(false);
    }
  }, [userId, profile]);

  useEffect(() => {
    const cancelledRef = { current: false };
    load(cancelledRef);
    return () => {
      cancelledRef.current = true;
    };
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

  const setLocale = useCallback(
    async (newLocale) => {
      if (!SUPPORTED_LANGS.includes(newLocale)) return;
      setLocaleState(newLocale);
      i18n.changeLanguage(newLocale);
      if (!userId) return;
      try {
        await updateUserPrefs(userId, { locale: newLocale });
      } catch (err) {
        console.error("Error saving locale:", err);
      }
    },
    [userId],
  );

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
    locale,
    setLocale,
    loading,
    refreshPrefs: load,
  };
}
