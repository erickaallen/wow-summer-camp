import { useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = '@wow_camp_checklist';

export interface ChecklistState {
  adventure: boolean;
  instagram: boolean;
}

const DEFAULT: ChecklistState = { adventure: false, instagram: false };

export function useChecklist() {
  const [checks, setChecks] = useState<ChecklistState>(DEFAULT);

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY).then((raw) => {
      if (raw) setChecks({ ...DEFAULT, ...JSON.parse(raw) });
    });
  }, []);

  const toggle = useCallback(async (key: keyof ChecklistState) => {
    setChecks((prev) => {
      const next = { ...prev, [key]: !prev[key] };
      AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  return { checks, toggle };
}
