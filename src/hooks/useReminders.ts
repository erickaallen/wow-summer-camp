import { useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Session, CampfireSlot } from '../types';
import { getReminderDate, getReminderDateFromSlot } from '../utils/sessionTime';

const REMINDERS_KEY = '@wow_camp_reminders';

// Map of id (sessionId or counselorSessionId) → expo notification identifier
type ReminderMap = Record<string, string>;

// expo-notifications was removed from Expo Go in SDK 53.
// Use a try-catch require so the app loads cleanly in Expo Go and
// works fully in development builds and production.
type NotificationsModule = typeof import('expo-notifications');
let Notifs: NotificationsModule | null = null;

try {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  Notifs = require('expo-notifications') as NotificationsModule;
  Notifs.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: true,
      shouldSetBadge: false,
      shouldShowBanner: true,
      shouldShowList: true,
    }),
  });
} catch {
  Notifs = null;
}

export function useReminders() {
  const [reminderMap, setReminderMap] = useState<ReminderMap>({});
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    AsyncStorage.getItem(REMINDERS_KEY).then((raw) => {
      if (raw) setReminderMap(JSON.parse(raw) as ReminderMap);
      setLoaded(true);
    });
  }, []);

  const persist = useCallback(async (next: ReminderMap) => {
    await AsyncStorage.setItem(REMINDERS_KEY, JSON.stringify(next));
  }, []);

  const hasReminder = useCallback(
    (id: string) => id in reminderMap,
    [reminderMap],
  );

  const _schedule = useCallback(
    async (id: string, reminderDate: Date | null, title: string, body: string) => {
      if (!reminderDate) return 'past' as const;

      // No notifications module available (Expo Go) — store state so UI reflects it
      if (!Notifs) {
        setReminderMap((prev) => {
          const next = { ...prev, [id]: 'unavailable' };
          persist(next);
          return next;
        });
        return 'scheduled' as const;
      }

      try {
        const { status } = await Notifs.requestPermissionsAsync();
        if (status !== 'granted') return 'denied' as const;

        const notifId = await Notifs.scheduleNotificationAsync({
          content: { title, body, data: { id } },
          trigger: {
            type: Notifs.SchedulableTriggerInputTypes.DATE,
            date: reminderDate,
          },
        });

        setReminderMap((prev) => {
          const next = { ...prev, [id]: notifId };
          persist(next);
          return next;
        });

        return 'scheduled' as const;
      } catch {
        return 'denied' as const;
      }
    },
    [persist],
  );

  /** Schedule a reminder for a generic session (keynote, social, etc.) */
  const scheduleReminder = useCallback(
    async (session: Session): Promise<'scheduled' | 'denied' | 'past'> =>
      _schedule(
        session.id,
        getReminderDate(session),
        '🔥 Starting in 10 minutes',
        session.title,
      ),
    [_schedule],
  );

  /** Schedule a reminder for a counselor session using the campfire slot's time */
  const scheduleCounselorReminder = useCallback(
    async (
      counselorSessionId: string,
      slot: CampfireSlot,
      counselorName: string,
      topic: string,
    ): Promise<'scheduled' | 'denied' | 'past'> =>
      _schedule(
        counselorSessionId,
        getReminderDateFromSlot(slot),
        `🔥 Starting in 10 minutes — ${counselorName}`,
        topic,
      ),
    [_schedule],
  );

  /** Cancel a scheduled notification and remove it from the map */
  const cancelReminder = useCallback(
    async (id: string) => {
      const notifId = reminderMap[id];
      if (notifId && Notifs && notifId !== 'unavailable') {
        try {
          await Notifs.cancelScheduledNotificationAsync(notifId);
        } catch {
          // ignore
        }
      }
      setReminderMap((prev) => {
        const next = { ...prev };
        delete next[id];
        persist(next);
        return next;
      });
    },
    [reminderMap, persist],
  );

  return { hasReminder, scheduleReminder, scheduleCounselorReminder, cancelReminder, loaded };
}
