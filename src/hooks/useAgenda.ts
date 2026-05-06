import { useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AGENDA_KEY = '@wow_camp_agenda';

export function useAgenda() {
  const [savedIds, setSavedIds] = useState<Set<string>>(new Set());
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    AsyncStorage.getItem(AGENDA_KEY).then((raw) => {
      if (raw) {
        setSavedIds(new Set(JSON.parse(raw) as string[]));
      }
      setLoaded(true);
    });
  }, []);

  const persist = useCallback(async (next: Set<string>) => {
    await AsyncStorage.setItem(AGENDA_KEY, JSON.stringify([...next]));
  }, []);

  const toggleSession = useCallback(async (sessionId: string) => {
    setSavedIds((prev) => {
      const next = new Set(prev);
      if (next.has(sessionId)) {
        next.delete(sessionId);
      } else {
        next.add(sessionId);
      }
      persist(next);
      return next;
    });
  }, [persist]);

  const isSaved = useCallback(
    (sessionId: string) => savedIds.has(sessionId),
    [savedIds],
  );

  /**
   * Returns the saved counselor session ID for a given rotation, if any.
   * Counselor session IDs follow the pattern: cs_{rotationId}_{locationId}
   */
  const getSavedForRotation = useCallback(
    (rotationId: string): string | undefined =>
      [...savedIds].find((id) => id.startsWith(`cs_${rotationId}_`)),
    [savedIds],
  );

  /**
   * Atomically removes oldId and adds newId — used when switching
   * campfire sessions within the same rotation.
   */
  const replaceSession = useCallback(
    (oldId: string, newId: string) => {
      setSavedIds((prev) => {
        const next = new Set(prev);
        next.delete(oldId);
        next.add(newId);
        persist(next);
        return next;
      });
    },
    [persist],
  );

  return { savedIds, isSaved, toggleSession, getSavedForRotation, replaceSession, loaded };
}
