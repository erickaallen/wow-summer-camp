import { CounselorSession } from '../types';

/**
 * All counselor-led campfire session assignments for May 27, 2026.
 * Each entry = one counselor leading their session at a location during a rotation.
 * id convention: cs_{rotationId}_{locationId}
 *
 * Source of truth: Counselor Session Assignment Grid PDF (final, pre-camp)
 * Locations: loc1–loc14  (see campfireLocations.ts — note: loc11 does not exist)
 * Rotations: r1–r7       (see campfireRotations.ts)
 * Counselors: c1–c27     (see counselors.ts)
 */
export const counselorSessions: CounselorSession[] = [

  // ── Rotation 1  ·  10:00–10:30 AM ─────────────────────────────────────────
  { id: 'cs_r1_loc1',  counselorId: 'c14', rotationId: 'r1', locationId: 'loc1'  }, // Holly Hartman       · Airstream Trio
  { id: 'cs_r1_loc2',  counselorId: 'c19', rotationId: 'r1', locationId: 'loc2'  }, // Cynthia Lee         · Pavilion
  { id: 'cs_r1_loc3',  counselorId: 'c17', rotationId: 'r1', locationId: 'loc3'  }, // Jessica Colliersmith· Behind 502 House
  { id: 'cs_r1_loc4',  counselorId: 'c22', rotationId: 'r1', locationId: 'loc4'  }, // Gretchen Hunt       · The Grove
  // loc5 empty (Airstream Duo — no session R1)
  { id: 'cs_r1_loc6',  counselorId: 'c9',  rotationId: 'r1', locationId: 'loc6'  }, // Tali Lindberg       · Stella/Dottie
  { id: 'cs_r1_loc7',  counselorId: 'c6',  rotationId: 'r1', locationId: 'loc7'  }, // Megan Hale          · Grass by Shuffleboard
  { id: 'cs_r1_loc8',  counselorId: 'c13', rotationId: 'r1', locationId: 'loc8'  }, // Deirdre Barnes      · Bridge Beach
  { id: 'cs_r1_loc9',  counselorId: 'c3',  rotationId: 'r1', locationId: 'loc9'  }, // Abby Kamen          · Event Center Patio
  // loc10 empty (Lake House Tent — no session R1)
  { id: 'cs_r1_loc12', counselorId: 'c1',  rotationId: 'r1', locationId: 'loc12' }, // Erica Weddle        · Tree Swing
  { id: 'cs_r1_loc13', counselorId: 'c15', rotationId: 'r1', locationId: 'loc13' }, // Patti Weiter        · The Lawn
  { id: 'cs_r1_loc14', counselorId: 'c8',  rotationId: 'r1', locationId: 'loc14' }, // Ari Farley          · Courtyard

  // ── Rotation 2  ·  10:45–11:15 AM ─────────────────────────────────────────
  { id: 'cs_r2_loc1',  counselorId: 'c14', rotationId: 'r2', locationId: 'loc1'  }, // Holly Hartman       · Airstream Trio
  { id: 'cs_r2_loc2',  counselorId: 'c19', rotationId: 'r2', locationId: 'loc2'  }, // Cynthia Lee         · Pavilion
  { id: 'cs_r2_loc3',  counselorId: 'c17', rotationId: 'r2', locationId: 'loc3'  }, // Jessica Colliersmith· Behind 502 House
  { id: 'cs_r2_loc4',  counselorId: 'c22', rotationId: 'r2', locationId: 'loc4'  }, // Gretchen Hunt       · The Grove
  { id: 'cs_r2_loc5',  counselorId: 'c20', rotationId: 'r2', locationId: 'loc5'  }, // Danielle M-S        · Airstream Duo
  { id: 'cs_r2_loc6',  counselorId: 'c7',  rotationId: 'r2', locationId: 'loc6'  }, // Cece Stevenson      · Stella/Dottie
  { id: 'cs_r2_loc7',  counselorId: 'c26', rotationId: 'r2', locationId: 'loc7'  }, // Michelle Champagne  · Grass by Shuffleboard
  { id: 'cs_r2_loc8',  counselorId: 'c13', rotationId: 'r2', locationId: 'loc8'  }, // Deirdre Barnes      · Bridge Beach
  { id: 'cs_r2_loc9',  counselorId: 'c23', rotationId: 'r2', locationId: 'loc9'  }, // Cierra Brent        · Event Center Patio
  { id: 'cs_r2_loc10', counselorId: 'c25', rotationId: 'r2', locationId: 'loc10' }, // Davonna Saier       · Lake House Tent
  { id: 'cs_r2_loc12', counselorId: 'c1',  rotationId: 'r2', locationId: 'loc12' }, // Erica Weddle        · Tree Swing
  { id: 'cs_r2_loc13', counselorId: 'c11', rotationId: 'r2', locationId: 'loc13' }, // Melissa Wurth & V   · The Lawn
  // loc14 empty (Courtyard — no session R2)

  // ── Rotation 3  ·  11:30 AM–12:00 PM ──────────────────────────────────────
  { id: 'cs_r3_loc1',  counselorId: 'c14', rotationId: 'r3', locationId: 'loc1'  }, // Holly Hartman       · Airstream Trio
  { id: 'cs_r3_loc2',  counselorId: 'c19', rotationId: 'r3', locationId: 'loc2'  }, // Cynthia Lee         · Pavilion
  // loc3 empty (Behind 502 House — no session R3)
  { id: 'cs_r3_loc4',  counselorId: 'c22', rotationId: 'r3', locationId: 'loc4'  }, // Gretchen Hunt       · The Grove
  { id: 'cs_r3_loc5',  counselorId: 'c20', rotationId: 'r3', locationId: 'loc5'  }, // Danielle M-S        · Airstream Duo
  { id: 'cs_r3_loc6',  counselorId: 'c7',  rotationId: 'r3', locationId: 'loc6'  }, // Cece Stevenson      · Stella/Dottie
  { id: 'cs_r3_loc7',  counselorId: 'c26', rotationId: 'r3', locationId: 'loc7'  }, // Michelle Champagne  · Grass by Shuffleboard
  { id: 'cs_r3_loc8',  counselorId: 'c2',  rotationId: 'r3', locationId: 'loc8'  }, // Megan Smith         · Bridge Beach
  // loc9 empty (Event Center Patio — no session R3)
  { id: 'cs_r3_loc10', counselorId: 'c24', rotationId: 'r3', locationId: 'loc10' }, // Leslie Hall         · Lake House Tent
  { id: 'cs_r3_loc12', counselorId: 'c1',  rotationId: 'r3', locationId: 'loc12' }, // Erica Weddle        · Tree Swing
  { id: 'cs_r3_loc13', counselorId: 'c11', rotationId: 'r3', locationId: 'loc13' }, // Melissa Wurth & V   · The Lawn
  { id: 'cs_r3_loc14', counselorId: 'c8',  rotationId: 'r3', locationId: 'loc14' }, // Ari Farley          · Courtyard

  // ── Rotation 4  ·  1:15–1:45 PM ───────────────────────────────────────────
  { id: 'cs_r4_loc1',  counselorId: 'c27', rotationId: 'r4', locationId: 'loc1'  }, // Ann Brown           · Airstream Trio
  { id: 'cs_r4_loc2',  counselorId: 'c12', rotationId: 'r4', locationId: 'loc2'  }, // Leah Bomar          · Pavilion
  { id: 'cs_r4_loc3',  counselorId: 'c17', rotationId: 'r4', locationId: 'loc3'  }, // Jessica Colliersmith· Behind 502 House
  { id: 'cs_r4_loc5',  counselorId: 'c21', rotationId: 'r4', locationId: 'loc5'  }, // Kate Kravchenko     · Airstream Duo
  { id: 'cs_r4_loc6',  counselorId: 'c9',  rotationId: 'r4', locationId: 'loc6'  }, // Tali Lindberg       · Stella/Dottie
  { id: 'cs_r4_loc7',  counselorId: 'c26', rotationId: 'r4', locationId: 'loc7'  }, // Michelle Champagne  · Grass by Shuffleboard
  { id: 'cs_r4_loc8',  counselorId: 'c2',  rotationId: 'r4', locationId: 'loc8'  }, // Megan Smith         · Bridge Beach
  { id: 'cs_r4_loc9',  counselorId: 'c3',  rotationId: 'r4', locationId: 'loc9'  }, // Abby Kamen          · Event Center Patio
  { id: 'cs_r4_loc10', counselorId: 'c24', rotationId: 'r4', locationId: 'loc10' }, // Leslie Hall         · Lake House Tent
  { id: 'cs_r4_loc12', counselorId: 'c18', rotationId: 'r4', locationId: 'loc12' }, // Bonnie Logsdon      · Tree Swing
  { id: 'cs_r4_loc13', counselorId: 'c15', rotationId: 'r4', locationId: 'loc13' }, // Patti Weiter        · The Lawn
  { id: 'cs_r4_loc14', counselorId: 'c10', rotationId: 'r4', locationId: 'loc14' }, // Kylie Fischbach     · Courtyard

  // ── Rotation 5  ·  2:00–2:30 PM ───────────────────────────────────────────
  // loc1 empty (Airstream Trio — no session R5)
  { id: 'cs_r5_loc2',  counselorId: 'c12', rotationId: 'r5', locationId: 'loc2'  }, // Leah Bomar          · Pavilion
  { id: 'cs_r5_loc3',  counselorId: 'c4',  rotationId: 'r5', locationId: 'loc3'  }, // Whitney Fallon      · Behind 502 House
  { id: 'cs_r5_loc4',  counselorId: 'c5',  rotationId: 'r5', locationId: 'loc4'  }, // Carmellia J.H.      · The Grove
  { id: 'cs_r5_loc5',  counselorId: 'c21', rotationId: 'r5', locationId: 'loc5'  }, // Kate Kravchenko     · Airstream Duo
  { id: 'cs_r5_loc6',  counselorId: 'c9',  rotationId: 'r5', locationId: 'loc6'  }, // Tali Lindberg       · Stella/Dottie
  { id: 'cs_r5_loc7',  counselorId: 'c6',  rotationId: 'r5', locationId: 'loc7'  }, // Megan Hale          · Grass by Shuffleboard
  // loc8 empty (Bridge Beach — no session R5)
  { id: 'cs_r5_loc9',  counselorId: 'c23', rotationId: 'r5', locationId: 'loc9'  }, // Cierra Brent        · Event Center Patio
  { id: 'cs_r5_loc10', counselorId: 'c25', rotationId: 'r5', locationId: 'loc10' }, // Davonna Saier       · Lake House Tent
  { id: 'cs_r5_loc12', counselorId: 'c18', rotationId: 'r5', locationId: 'loc12' }, // Bonnie Logsdon      · Tree Swing
  { id: 'cs_r5_loc13', counselorId: 'c11', rotationId: 'r5', locationId: 'loc13' }, // Melissa Wurth & V   · The Lawn
  { id: 'cs_r5_loc14', counselorId: 'c10', rotationId: 'r5', locationId: 'loc14' }, // Kylie Fischbach     · Courtyard

  // ── Rotation 6  ·  2:45–3:15 PM ───────────────────────────────────────────
  { id: 'cs_r6_loc1',  counselorId: 'c27', rotationId: 'r6', locationId: 'loc1'  }, // Ann Brown           · Airstream Trio
  { id: 'cs_r6_loc2',  counselorId: 'c12', rotationId: 'r6', locationId: 'loc2'  }, // Leah Bomar          · Pavilion
  { id: 'cs_r6_loc3',  counselorId: 'c4',  rotationId: 'r6', locationId: 'loc3'  }, // Whitney Fallon      · Behind 502 House
  { id: 'cs_r6_loc4',  counselorId: 'c5',  rotationId: 'r6', locationId: 'loc4'  }, // Carmellia J.H.      · The Grove
  { id: 'cs_r6_loc5',  counselorId: 'c20', rotationId: 'r6', locationId: 'loc5'  }, // Danielle M-S        · Airstream Duo
  // loc6 empty (Stella/Dottie — no session R6)
  { id: 'cs_r6_loc7',  counselorId: 'c6',  rotationId: 'r6', locationId: 'loc7'  }, // Megan Hale          · Grass by Shuffleboard
  { id: 'cs_r6_loc8',  counselorId: 'c2',  rotationId: 'r6', locationId: 'loc8'  }, // Megan Smith         · Bridge Beach
  { id: 'cs_r6_loc9',  counselorId: 'c23', rotationId: 'r6', locationId: 'loc9'  }, // Cierra Brent        · Event Center Patio
  { id: 'cs_r6_loc10', counselorId: 'c25', rotationId: 'r6', locationId: 'loc10' }, // Davonna Saier       · Lake House Tent
  // loc12 empty (Tree Swing — no session R6)
  { id: 'cs_r6_loc13', counselorId: 'c15', rotationId: 'r6', locationId: 'loc13' }, // Patti Weiter        · The Lawn
  { id: 'cs_r6_loc14', counselorId: 'c10', rotationId: 'r6', locationId: 'loc14' }, // Kylie Fischbach     · Courtyard

  // ── Rotation 7  ·  3:30–4:00 PM ───────────────────────────────────────────
  { id: 'cs_r7_loc1',  counselorId: 'c27', rotationId: 'r7', locationId: 'loc1'  }, // Ann Brown           · Airstream Trio
  // loc2 empty (Pavilion — no session R7)
  { id: 'cs_r7_loc3',  counselorId: 'c4',  rotationId: 'r7', locationId: 'loc3'  }, // Whitney Fallon      · Behind 502 House
  { id: 'cs_r7_loc4',  counselorId: 'c5',  rotationId: 'r7', locationId: 'loc4'  }, // Carmellia J.H.      · The Grove
  { id: 'cs_r7_loc5',  counselorId: 'c21', rotationId: 'r7', locationId: 'loc5'  }, // Kate Kravchenko     · Airstream Duo
  { id: 'cs_r7_loc6',  counselorId: 'c7',  rotationId: 'r7', locationId: 'loc6'  }, // Cece Stevenson      · Stella/Dottie
  // loc7 empty (Grass by Shuffleboard — no session R7)
  { id: 'cs_r7_loc8',  counselorId: 'c13', rotationId: 'r7', locationId: 'loc8'  }, // Deirdre Barnes      · Bridge Beach
  { id: 'cs_r7_loc9',  counselorId: 'c3',  rotationId: 'r7', locationId: 'loc9'  }, // Abby Kamen          · Event Center Patio
  { id: 'cs_r7_loc10', counselorId: 'c24', rotationId: 'r7', locationId: 'loc10' }, // Leslie Hall         · Lake House Tent
  { id: 'cs_r7_loc12', counselorId: 'c18', rotationId: 'r7', locationId: 'loc12' }, // Bonnie Logsdon      · Tree Swing
  // loc13 empty (The Lawn — no session R7)
  { id: 'cs_r7_loc14', counselorId: 'c8',  rotationId: 'r7', locationId: 'loc14' }, // Ari Farley          · Courtyard
];
