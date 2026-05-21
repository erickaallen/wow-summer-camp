import { Session } from '../types';
import { sessions } from '../data/sessions';

export type EventPhase =
  | 'pre_event'    // before May 26 6:00 PM
  | 'day1_evening' // May 26 6:00 PM – 9:00 PM  (kickoff party)
  | 'day2_morning' // May 26 9:00 PM – May 27 8:00 AM
  | 'day2_active'  // May 27 8:00 AM – 6:00 PM  (full camp day)
  | 'post_event';  // after May 27 6:00 PM

function local(y: number, mo: number, d: number, h: number, m: number) {
  return new Date(y, mo - 1, d, h, m, 0, 0);
}

// Phase start times in device local time (event is in Louisville, KY — EDT)
const PHASE_START = {
  day1_evening: local(2026, 5, 26, 18,  0).getTime(),
  day2_morning: local(2026, 5, 26, 21,  0).getTime(),
  day2_active:  local(2026, 5, 27,  8,  0).getTime(),
  post_event:   local(2026, 5, 27, 18,  0).getTime(),
};

export function getEventPhase(now = new Date()): EventPhase {
  const t = now.getTime();
  if (t >= PHASE_START.post_event)   return 'post_event';
  if (t >= PHASE_START.day2_active)  return 'day2_active';
  if (t >= PHASE_START.day2_morning) return 'day2_morning';
  if (t >= PHASE_START.day1_evening) return 'day1_evening';
  return 'pre_event';
}

// ─── Now / Next session (Day 2 main track) ───────────────────────────────────

export interface NowNext {
  current: Session | null;
  next:    Session | null;
}

function parseDay2Time(timeStr: string): Date {
  const m = timeStr.match(/(\d+):(\d+)\s*(AM|PM)/i);
  if (!m) return new Date(0);
  let h = parseInt(m[1], 10);
  const min = parseInt(m[2], 10);
  const isPM = m[3].toUpperCase() === 'PM';
  if (isPM && h !== 12) h += 12;
  if (!isPM && h === 12) h = 0;
  return local(2026, 5, 27, h, min);
}

// s25 is the parallel Girl Scouts craft — exclude from main track
const PARALLEL = new Set(['s25']);

export function getNowNext(now = new Date()): NowNext {
  const track = sessions
    .filter(s => s.day === 'day2' && s.startTime && !PARALLEL.has(s.id))
    .map(s => ({
      session: s,
      start:   parseDay2Time(s.startTime),
      end:     s.endTime ? parseDay2Time(s.endTime) : null,
    }))
    .sort((a, b) => a.start.getTime() - b.start.getTime());

  for (let i = 0; i < track.length; i++) {
    const { session, start, end } = track[i];
    const effectiveEnd = end ?? track[i + 1]?.start ?? local(2026, 5, 27, 18, 0);
    if (now >= start && now < effectiveEnd) {
      return { current: session, next: track[i + 1]?.session ?? null };
    }
    if (now < start) {
      return { current: null, next: session };
    }
  }
  return { current: null, next: null };
}
