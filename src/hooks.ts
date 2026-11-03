import { useCallback, useEffect, useRef, useState } from 'react';
import type { SaveData } from './types';
import { loadSave, writeSave, storageAvailable } from './services/storage';

/** Holds the whole save in React state and writes it through to localStorage. */
export function useSave() {
  const initial = useRef(loadSave());
  const [save, setSave] = useState<SaveData>(initial.current.data);
  const [recovered] = useState(initial.current.recovered);
  const [canStore] = useState(storageAvailable);
  const first = useRef(true);

  useEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    writeSave(save);
  }, [save]);

  const update = useCallback((fn: (s: SaveData) => SaveData) => setSave((s) => fn(s)), []);
  return { save, update, setSave, recovered, canStore };
}

/** Re-render when the local date changes (for the daily reset at midnight). */
export function useNow(intervalMs = 30000) {
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), intervalMs);
    return () => clearInterval(id);
  }, [intervalMs]);
  return now;
}

export function usePrefersReducedMotion() {
  const q = typeof window !== 'undefined' && window.matchMedia ? window.matchMedia('(prefers-reduced-motion: reduce)') : null;
  return q?.matches ?? false;
}
