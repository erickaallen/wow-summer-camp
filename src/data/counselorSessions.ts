import { CounselorSession } from '../types';

/**
 * ─── HOW TO ADD DATA WHEN SLOT ASSIGNMENTS ARRIVE ────────────────────────────
 *
 * Each entry maps one counselor to one campfire slot at a specific location.
 * A counselor can appear in multiple slots if they present more than once.
 *
 * counselorId  → matches Counselor.id in src/data/counselors.ts (c1–c27)
 * campfireSlotId → matches CampfireSlot.id in src/data/campfireSlots.ts (cf1–cf7)
 * location     → the room or area name (e.g. 'Breakout Room A', 'Lakeside Tent')
 *
 * Example entry:
 * {
 *   id: 'cs_cf1_c8',        // convention: cs_{slotId}_{counselorId}
 *   counselorId: 'c8',      // Ari Farley
 *   campfireSlotId: 'cf1',  // Campfire Session #1 · 10:00–10:30 AM
 *   location: 'Breakout Room A',
 * },
 * ─────────────────────────────────────────────────────────────────────────────
 */
export const counselorSessions: CounselorSession[] = [
  // Add entries here when Amanda sends slot assignments and room locations.
];
