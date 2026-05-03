import { Announcement } from '../types';

/**
 * Announcements are filtered in HomeScreen by visibleFrom / visibleUntil.
 * Omit either field to leave that bound open.
 *
 * TIME WINDOWS (all times local Louisville / Eastern):
 *   Pre-camp    → before May 26 9 AM
 *   Kickoff day → May 26 9 AM – May 27 8 AM
 *   Camp day AM → May 27 8 AM – 12 PM
 *   Camp day PM → May 27 12 PM – 5 PM
 *   Post-camp   → after May 27 5 PM
 */
export const announcements: Announcement[] = [

  // ── TEST: visible right now (remove before launch) ───────────────────────
  {
    id: 'test1',
    title: '👋 Announcement Test',
    body: 'This card is visible right now so you can see the time-based display working. It expires May 26 at 8 AM.',
    visibleUntil: '2026-05-26T08:00:00',
  },

  // ── Pre-camp (app is live, event hasn't started yet) ─────────────────────
  {
    id: 'pre1',
    title: 'Registration Is Now Open',
    body: 'Download the schedule, explore the counselor lineup, and bookmark the sessions you don\'t want to miss before camp day!',
    visibleUntil: '2026-05-26T09:00:00',
  },

  // ── Kickoff day: May 26 ───────────────────────────────────────────────────
  {
    id: 'day1_a',
    title: '🎉 Kickoff Party Tonight!',
    body: 'Doors open at 6 PM at Progress Park. Come ready to connect, celebrate, and kick off an incredible weekend.',
    visibleFrom:  '2026-05-26T09:00:00',
    visibleUntil: '2026-05-26T18:00:00',
  },
  {
    id: 'day1_b',
    title: 'Check-In Is Open',
    body: 'Pick up your badge and swag bag at the Registration table near the main entrance. See you inside!',
    visibleFrom:  '2026-05-26T17:30:00',
    visibleUntil: '2026-05-26T20:00:00',
  },

  // ── Camp day morning: May 27 ──────────────────────────────────────────────
  {
    id: 'day2_am',
    title: '☀️ Camp Day Is Here!',
    body: 'Campfire sessions start at 10 AM. Check your schedule, find your first rotation, and go introduce yourself!',
    visibleFrom:  '2026-05-27T08:00:00',
    visibleUntil: '2026-05-27T12:00:00',
  },

  // ── Camp day afternoon: May 27 ────────────────────────────────────────────
  {
    id: 'day2_pm',
    title: '🔥 Afternoon Rotations Starting',
    body: 'Lunch break is over — afternoon campfire sessions begin at 1:15 PM. Don\'t forget to explore a new location!',
    visibleFrom:  '2026-05-27T12:00:00',
    visibleUntil: '2026-05-27T17:00:00',
  },

  // ── Closing / post-camp ───────────────────────────────────────────────────
  {
    id: 'post1',
    title: '💛 Thanks for Coming to Camp!',
    body: 'What an incredible weekend. Stay connected with your fellow campers — tag your photos with #WOWSummerCamp!',
    visibleFrom: '2026-05-27T17:00:00',
  },

];
