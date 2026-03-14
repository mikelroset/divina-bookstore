import { useState, useEffect } from "react";
import { getDisabledUserIds } from "../services/userManagementService";

/**
 * Hook que retorna el conjunt d'UIDs d'usuaris desactivats (per anonimització).
 * @returns {{ disabledIds: Set<string>, loading: boolean }}
 */
export function useDisabledUsers() {
  const [disabledIds, setDisabledIds] = useState(new Set());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    getDisabledUserIds()
      .then((set) => {
        if (!cancelled) setDisabledIds(set);
      })
      .catch(() => {
        if (!cancelled) setDisabledIds(new Set());
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => { cancelled = true; };
  }, []);

  return { disabledIds, loading };
}
