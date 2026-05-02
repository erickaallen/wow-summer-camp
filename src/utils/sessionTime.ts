import { Session, CampfireSlot } from '../types';

const EVENT_DATES: Record<'day1' | 'day2', string> = {
  day1: '2026-05-26',
  day2: '2026-05-27',
};

function parseTimeString(timeStr: string, day: 'day1' | 'day2'): Date | null {
  if (!timeStr) return null;

  const match = timeStr.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
  if (!match) return null;

  let hours = parseInt(match[1], 10);
  const minutes = parseInt(match[2], 10);
  const meridiem = match[3].toUpperCase();

  if (meridiem === 'PM' && hours !== 12) hours += 12;
  if (meridiem === 'AM' && hours === 12) hours = 0;

  const dateStr = EVENT_DATES[day];
  const date = new Date(
    `${dateStr}T${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:00`,
  );

  return isNaN(date.getTime()) ? null : date;
}

/** Full start Date for a generic session */
export function getSessionStartDate(session: Session): Date | null {
  return parseTimeString(session.startTime, session.day);
}

/** Full start Date for a campfire slot */
export function getSlotStartDate(slot: CampfireSlot): Date | null {
  return parseTimeString(slot.startTime, slot.day);
}

/** Reminder Date (10 min before) for a generic session. Null if past. */
export function getReminderDate(session: Session): Date | null {
  const start = getSessionStartDate(session);
  if (!start) return null;
  const reminder = new Date(start.getTime() - 10 * 60 * 1000);
  return reminder > new Date() ? reminder : null;
}

/** Reminder Date (10 min before) for a campfire slot. Null if past. */
export function getReminderDateFromSlot(slot: CampfireSlot): Date | null {
  const start = getSlotStartDate(slot);
  if (!start) return null;
  const reminder = new Date(start.getTime() - 10 * 60 * 1000);
  return reminder > new Date() ? reminder : null;
}
