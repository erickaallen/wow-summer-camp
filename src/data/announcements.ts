import { Announcement } from '../types';

/**
 * Announcements are filtered in HomeScreen by visibleFrom / visibleUntil.
 * Omit either field to leave that bound open.
 *
 * TIME WINDOWS (all times local Louisville / Eastern):
 *   Pre-camp    → before May 26 9 AM
 *   Kickoff day → May 26 9 AM – May 27 8 AM
 *   Camp day AM → May 27 8 AM – 12 PM
 *   Camp day PM → May 27 12 PM – 6 PM
 *   Post-camp   → after May 27 6 PM
 */
export const announcements: Announcement[] = [
  // ── Pre-camp (app is live, event hasn't started yet) ─────────────────────
  {
    id: 'pre1',
    title: 'Get Ready for Camp!',
    body: 'Take a peek at the schedule, explore the counselor lineup, and add the sessions you don\'t want to miss to your camp agenda!',
    visibleUntil: '2026-05-26T09:00:00',
  },
  // ── Kickoff day: May 26 ───────────────────────────────────────────────────
  {
    id: 'day1_a',
    title: '🎉 Kickoff Party Tonight!',
    body: 'Doors open at 6 PM at Progress Park. Come ready to connect, celebrate, and kick off an amazing two days together.',
    visibleFrom:  '2026-05-26T09:00:00',
    visibleUntil: '2026-05-26T18:00:00',
  },

  // ── Camp day morning: May 27 ──────────────────────────────────────────────
  {
    id: 'day2_am',
    title: '☀️ Camp Day Is Here!',
    body: 'Check-in begins at 8 AM. The opening ceremony starts at 9:15 AM. Check your schedule, find your first rotation, and go introduce yourself!',
    visibleFrom:  '2026-05-27T08:00:00',
    visibleUntil: '2026-05-27T12:59:59',
  },

  // ── Camp day afternoon: May 27 ────────────────────────────────────────────
  {
    id: 'day2_pm',
    title: '🔥 Afternoon Rotations Starting',
    body: 'Lunch break is over — afternoon campfire sessions begin at 1:15 PM. Don\'t forget to explore the beautiful grounds at Progress Park!',
    visibleFrom:  '2026-05-27T13:00:00',
    visibleUntil: '2026-05-27T17:29:59',
  },

  // ── Closing / post-camp ───────────────────────────────────────────────────
  {
    id: 'post1',
    title: '💛 Thanks for Coming to Camp!',
    body: 'What an amazing experience! Stay connected with your fellow campers — tag your photos with #WOWSummerCamp!',
    visibleFrom: '2026-05-27T17:30:00',
  },

];
