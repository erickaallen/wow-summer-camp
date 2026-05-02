import { useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Notifications from 'expo-notifications';
import { Session, CampfireSlot } from '../types';
import { getReminderDate, getReminderDateFromSlot } from '../utils/sessionTime';

const REMINDERS_KEY = '@wow_camp_reminders';

// Map of id (sessionId or counselorSessionId) → expo notification identifier
type ReminderMap = Record<string, string>;

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

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

      const { status } = await Notifications.requestPermissionsAsync();
      if (status !== 'granted') return 'denied' as const;

      const notifId = await Notifications.scheduleNotificationAsync({
        content: { title, body, data: { id } },
        trigger: {
          type: Notifications.SchedulableTriggerInputTypes.DATE,
          date: reminderDate,
        },
      });

      setReminderMap((prev) => {
        const next = { ...prev, [id]: notifId };
        persist(next);
        return next;
      });

      return 'scheduled' as const;
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
      if (notifId) {
        await Notifications.cancelScheduledNotificationAsync(notifId);
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
