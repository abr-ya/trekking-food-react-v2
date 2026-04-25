import { useCallback, useMemo, useState } from "react";

const buildStorageKey = (hikingId: string) => `food-plan:hidden-recipes:${hikingId}`;

const readInitialIds = (storageKey: string): Set<string> => {
  if (typeof window === "undefined") return new Set();
  try {
    const raw = window.localStorage.getItem(storageKey);
    if (!raw) return new Set();
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      return new Set(parsed.filter((value): value is string => typeof value === "string"));
    }
  } catch {
    // Ignore corrupted data; start with an empty set.
  }
  return new Set();
};

const persist = (storageKey: string, ids: Set<string>) => {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(storageKey, JSON.stringify([...ids]));
  } catch {
    // Ignore quota or private mode errors.
  }
};

export type UseHiddenRecipesResult = {
  hiddenIds: ReadonlySet<string>;
  isHidden: (id: string) => boolean;
  hide: (id: string) => void;
  show: (id: string) => void;
  reset: () => void;
};

/**
 * Per-hiking persistent set of recipe ids hidden from the "Recipes by days" summary on the
 * Food Plan tab. Persists in localStorage under `food-plan:hidden-recipes:${hikingId}`.
 */
export const useHiddenRecipes = (hikingId: string): UseHiddenRecipesResult => {
  const storageKey = useMemo(() => buildStorageKey(hikingId), [hikingId]);
  const [hiddenIds, setHiddenIds] = useState<Set<string>>(() => readInitialIds(storageKey));

  const isHidden = useCallback((id: string) => hiddenIds.has(id), [hiddenIds]);

  const hide = useCallback(
    (id: string) => {
      setHiddenIds((prev) => {
        if (prev.has(id)) return prev;
        const next = new Set(prev);
        next.add(id);
        persist(storageKey, next);
        return next;
      });
    },
    [storageKey],
  );

  const show = useCallback(
    (id: string) => {
      setHiddenIds((prev) => {
        if (!prev.has(id)) return prev;
        const next = new Set(prev);
        next.delete(id);
        persist(storageKey, next);
        return next;
      });
    },
    [storageKey],
  );

  const reset = useCallback(() => {
    setHiddenIds((prev) => {
      if (prev.size === 0) return prev;
      const next = new Set<string>();
      persist(storageKey, next);
      return next;
    });
  }, [storageKey]);

  return { hiddenIds, isHidden, hide, show, reset };
};
