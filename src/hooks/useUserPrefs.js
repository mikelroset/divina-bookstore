import { useState, useEffect, useCallback } from "react";
import {
  getUserPrefs,
  updateUserPrefs,
  addReadingActivityDay,
  computeStreak,
} from "../services/userPrefsService";

export function useUserPrefs(userId) {
  const [annualGoal, setAnnualGoalState] = useState(0);
  const [readingActivityDays, setReadingActivityDays] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    if (!userId) {
      setAnnualGoalState(0);
      setReadingActivityDays([]);
      setLoading(false);
      return;
    }
    try {
      setLoading(true);
      const prefs = await getUserPrefs(userId);
      setAnnualGoalState(prefs.annualGoal ?? 0);
      setReadingActivityDays(prefs.readingActivityDays ?? []);
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

  return {
    annualGoal,
    setAnnualGoal,
    readingActivityDays,
    streak,
    recordReadingActivity,
    loading,
    refreshPrefs: load,
  };
}
