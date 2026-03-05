import { useState, useEffect } from "react";
import { isSuperadmin } from "../services/superadminService";

/**
 * Hook to check if the current user is a Superadmin.
 * @param {string} [userId]
 * @returns {{ isSuperadmin: boolean, loading: boolean }}
 */
export function useSuperadmin(userId) {
  const [value, setValue] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) {
      setValue(false);
      setLoading(false);
      return;
    }
    let cancelled = false;
    setLoading(true);
    isSuperadmin(userId)
      .then((v) => {
        if (!cancelled) setValue(v);
      })
      .catch(() => {
        if (!cancelled) setValue(false);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => { cancelled = true; };
  }, [userId]);

  return { isSuperadmin: value, loading };
}
