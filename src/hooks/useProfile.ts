import { useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { UserProfile } from '../types';

const STORAGE_KEY = '@wow_camp_profile';

const EMPTY_PROFILE: UserProfile = {
  ticketEmail: '',
  firstName: '',
  lastName: '',
  networkingEmail: '',
  businessName: '',
  jobTitle: '',
  phone: '',
  instagram: '',
  website: '',
  photo: '',
};

/** Returns true if the minimum required fields are filled in */
export function isProfileComplete(profile: UserProfile | null): boolean {
  if (!profile) return false;
  return !!(
    profile.firstName?.trim() &&
    profile.lastName?.trim()
  );
}

export function useProfile() {
  const [profile, setProfileState] = useState<UserProfile | null>(null);
  const [loaded, setLoaded] = useState(false);

  const reload = useCallback(async () => {
    const raw = await AsyncStorage.getItem(STORAGE_KEY);
    setProfileState(raw ? JSON.parse(raw) : null);
    setLoaded(true);
  }, []);

  // Load from storage on mount
  useEffect(() => {
    reload();
  }, [reload]);

  // Save full profile to storage
  const saveProfile = useCallback(async (updates: UserProfile) => {
    setProfileState(updates);
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updates));
  }, []);

  // Clear profile (for testing / reset)
  const clearProfile = useCallback(async () => {
    setProfileState(null);
    await AsyncStorage.removeItem(STORAGE_KEY);
  }, []);

  return {
    profile,
    emptyProfile: EMPTY_PROFILE,
    loaded,
    reload,
    saveProfile,
    clearProfile,
    isComplete: isProfileComplete(profile),
  };
}
