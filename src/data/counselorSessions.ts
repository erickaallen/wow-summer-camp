import { CounselorSession } from '../types';

/**
 * All counselor-led campfire session assignments for May 27, 2026.
 * Each entry = one counselor leading their session at a location during a rotation.
 * id convention: cs_{rotationId}_{locationId}
 *
 * Locations: loc1–loc14  (see campfireLocations.ts)
 * Rotations: r1–r7       (see campfireRotations.ts)
 * Counselors: c1–c27     (see counselors.ts)
 */
export const counselorSessions: CounselorSession[] = [

  // ── Rotation 1  ·  10:00–10:30 AM ─────────────────────────────────────────
  { id: 'cs_r1_loc1',  counselorId: 'c14', rotationId: 'r1', locationId: 'loc1'  }, // Holly Hartmann   · Airstream Trio
  { id: 'cs_r1_loc2',  counselorId: 'c19', rotationId: 'r1', locationId: 'loc2'  }, // Cynthia Lee      · Pavilion
  { id: 'cs_r1_loc3',  counselorId: 'c22', rotationId: 'r1', locationId: 'loc3'  }, // Gretchen Hunt    · Behind 502 House
  { id: 'cs_r1_loc4',  counselorId: 'c23', rotationId: 'r1', locationId: 'loc4'  }, // Cierra Brent     · The Grove
  { id: 'cs_r1_loc5',  counselorId: 'c20', rotationId: 'r1', locationId: 'loc5'  }, // Danielle M-S     · Airstream Duo
  { id: 'cs_r1_loc6',  counselorId: 'c9',  rotationId: 'r1', locationId: 'loc6'  }, // Tali Lindberg    · Stella/Dottie
  { id: 'cs_r1_loc7',  counselorId: 'c6',  rotationId: 'r1', locationId: 'loc7'  }, // Megan Hale       · Grass by Shuffleboard
  { id: 'cs_r1_loc8',  counselorId: 'c24', rotationId: 'r1', locationId: 'loc8'  }, // Leslie Hall      · Dam Beach
  { id: 'cs_r1_loc9',  counselorId: 'c3',  rotationId: 'r1', locationId: 'loc9'  }, // Abby Kamen       · Event Center Patio
  // loc10 empty (Davonna not scheduled R1)
  // loc11 empty (Ari Farley not scheduled R1)
  { id: 'cs_r1_loc12', counselorId: 'c11', rotationId: 'r1', locationId: 'loc12' }, // Melissa W&V      · Tree Swing
  { id: 'cs_r1_loc13', counselorId: 'c15', rotationId: 'r1', locationId: 'loc13' }, // Patti Weiter     · The Lawn
  // loc14 empty (Kylie not scheduled R1)

  // ── Rotation 2  ·  10:45–11:15 AM ─────────────────────────────────────────
  { id: 'cs_r2_loc1',  counselorId: 'c14', rotationId: 'r2', locationId: 'loc1'  }, // Holly Hartmann   · Airstream Trio
  { id: 'cs_r2_loc2',  counselorId: 'c19', rotationId: 'r2', locationId: 'loc2'  }, // Cynthia Lee      · Pavilion
  { id: 'cs_r2_loc3',  counselorId: 'c22', rotationId: 'r2', locationId: 'loc3'  }, // Gretchen Hunt    · Behind 502 House
  { id: 'cs_r2_loc4',  counselorId: 'c23', rotationId: 'r2', locationId: 'loc4'  }, // Cierra Brent     · The Grove
  // loc5 empty (Kate/Danielle not scheduled R2)
  { id: 'cs_r2_loc6',  counselorId: 'c12', rotationId: 'r2', locationId: 'loc6'  }, // Leah Bomar       · Stella/Dottie
  { id: 'cs_r2_loc7',  counselorId: 'c1',  rotationId: 'r2', locationId: 'loc7'  }, // Erica Weddle     · Grass by Shuffleboard
  // loc8 empty (Megan Smith/Leslie not scheduled R2)
  { id: 'cs_r2_loc9',  counselorId: 'c16', rotationId: 'r2', locationId: 'loc9'  }, // Sydney Catinna   · Event Center Patio
  { id: 'cs_r2_loc10', counselorId: 'c25', rotationId: 'r2', locationId: 'loc10' }, // Davonna Saier    · Lake House Tent
  { id: 'cs_r2_loc11', counselorId: 'c7',  rotationId: 'r2', locationId: 'loc11' }, // Cece Stevenson   · Left of Bldg 52
  { id: 'cs_r2_loc12', counselorId: 'c18', rotationId: 'r2', locationId: 'loc12' }, // Bonnie Logsdon   · Tree Swing
  // loc13 empty (Jessica/Patti not scheduled R2)
  { id: 'cs_r2_loc14', counselorId: 'c10', rotationId: 'r2', locationId: 'loc14' }, // Kylie Fischbach  · Courtyard

  // ── Rotation 3  ·  11:30 AM–12:00 PM ──────────────────────────────────────
  { id: 'cs_r3_loc1',  counselorId: 'c14', rotationId: 'r3', locationId: 'loc1'  }, // Holly Hartmann   · Airstream Trio
  { id: 'cs_r3_loc2',  counselorId: 'c19', rotationId: 'r3', locationId: 'loc2'  }, // Cynthia Lee      · Pavilion
  { id: 'cs_r3_loc3',  counselorId: 'c22', rotationId: 'r3', locationId: 'loc3'  }, // Gretchen Hunt    · Behind 502 House
  { id: 'cs_r3_loc4',  counselorId: 'c23', rotationId: 'r3', locationId: 'loc4'  }, // Cierra Brent     · The Grove
  { id: 'cs_r3_loc5',  counselorId: 'c20', rotationId: 'r3', locationId: 'loc5'  }, // Danielle M-S     · Airstream Duo
  { id: 'cs_r3_loc6',  counselorId: 'c12', rotationId: 'r3', locationId: 'loc6'  }, // Leah Bomar       · Stella/Dottie
  { id: 'cs_r3_loc7',  counselorId: 'c1',  rotationId: 'r3', locationId: 'loc7'  }, // Erica Weddle     · Grass by Shuffleboard
  { id: 'cs_r3_loc8',  counselorId: 'c2',  rotationId: 'r3', locationId: 'loc8'  }, // Megan Smith      · Dam Beach
  // loc9 empty
  // loc10 empty
  { id: 'cs_r3_loc11', counselorId: 'c8',  rotationId: 'r3', locationId: 'loc11' }, // Ari Farley       · Left of Bldg 52
  { id: 'cs_r3_loc12', counselorId: 'c11', rotationId: 'r3', locationId: 'loc12' }, // Melissa W&V      · Tree Swing
  { id: 'cs_r3_loc13', counselorId: 'c17', rotationId: 'r3', locationId: 'loc13' }, // Jessica C.       · The Lawn
  // loc14 empty

  // ── Rotation 4  ·  1:15–1:45 PM ───────────────────────────────────────────
  { id: 'cs_r4_loc1',  counselorId: 'c27', rotationId: 'r4', locationId: 'loc1'  }, // Ann Brown        · Airstream Trio
  { id: 'cs_r4_loc2',  counselorId: 'c13', rotationId: 'r4', locationId: 'loc2'  }, // Deirdre Barnes   · Pavilion
  // loc3 empty
  // loc4 empty
  { id: 'cs_r4_loc5',  counselorId: 'c21', rotationId: 'r4', locationId: 'loc5'  }, // Kate Kravchenko  · Airstream Duo
  { id: 'cs_r4_loc6',  counselorId: 'c9',  rotationId: 'r4', locationId: 'loc6'  }, // Tali Lindberg    · Stella/Dottie
  { id: 'cs_r4_loc7',  counselorId: 'c1',  rotationId: 'r4', locationId: 'loc7'  }, // Erica Weddle     · Grass by Shuffleboard
  { id: 'cs_r4_loc8',  counselorId: 'c2',  rotationId: 'r4', locationId: 'loc8'  }, // Megan Smith      · Dam Beach
  { id: 'cs_r4_loc9',  counselorId: 'c3',  rotationId: 'r4', locationId: 'loc9'  }, // Abby Kamen       · Event Center Patio
  // loc10 empty
  { id: 'cs_r4_loc11', counselorId: 'c7',  rotationId: 'r4', locationId: 'loc11' }, // Cece Stevenson   · Left of Bldg 52
  { id: 'cs_r4_loc12', counselorId: 'c18', rotationId: 'r4', locationId: 'loc12' }, // Bonnie Logsdon   · Tree Swing
  { id: 'cs_r4_loc13', counselorId: 'c15', rotationId: 'r4', locationId: 'loc13' }, // Patti Weiter     · The Lawn
  { id: 'cs_r4_loc14', counselorId: 'c10', rotationId: 'r4', locationId: 'loc14' }, // Kylie Fischbach  · Courtyard

  // ── Rotation 5  ·  2:00–2:30 PM ───────────────────────────────────────────
  // loc1 empty
  { id: 'cs_r5_loc2',  counselorId: 'c13', rotationId: 'r5', locationId: 'loc2'  }, // Deirdre Barnes   · Pavilion
  { id: 'cs_r5_loc3',  counselorId: 'c4',  rotationId: 'r5', locationId: 'loc3'  }, // Whitney Fallon   · Behind 502 House
  { id: 'cs_r5_loc4',  counselorId: 'c5',  rotationId: 'r5', locationId: 'loc4'  }, // Carmellia J.H.   · The Grove
  { id: 'cs_r5_loc5',  counselorId: 'c21', rotationId: 'r5', locationId: 'loc5'  }, // Kate Kravchenko  · Airstream Duo
  { id: 'cs_r5_loc6',  counselorId: 'c9',  rotationId: 'r5', locationId: 'loc6'  }, // Tali Lindberg    · Stella/Dottie
  { id: 'cs_r5_loc7',  counselorId: 'c6',  rotationId: 'r5', locationId: 'loc7'  }, // Megan Hale       · Grass by Shuffleboard
  { id: 'cs_r5_loc8',  counselorId: 'c24', rotationId: 'r5', locationId: 'loc8'  }, // Leslie Hall      · Dam Beach
  { id: 'cs_r5_loc9',  counselorId: 'c16', rotationId: 'r5', locationId: 'loc9'  }, // Sydney Catinna   · Event Center Patio
  { id: 'cs_r5_loc10', counselorId: 'c25', rotationId: 'r5', locationId: 'loc10' }, // Davonna Saier    · Lake House Tent
  { id: 'cs_r5_loc11', counselorId: 'c8',  rotationId: 'r5', locationId: 'loc11' }, // Ari Farley       · Left of Bldg 52
  { id: 'cs_r5_loc12', counselorId: 'c11', rotationId: 'r5', locationId: 'loc12' }, // Melissa W&V      · Tree Swing
  { id: 'cs_r5_loc13', counselorId: 'c17', rotationId: 'r5', locationId: 'loc13' }, // Jessica C.       · The Lawn
  // loc14 empty

  // ── Rotation 6  ·  2:45–3:15 PM ───────────────────────────────────────────
  { id: 'cs_r6_loc1',  counselorId: 'c27', rotationId: 'r6', locationId: 'loc1'  }, // Ann Brown        · Airstream Trio
  { id: 'cs_r6_loc2',  counselorId: 'c13', rotationId: 'r6', locationId: 'loc2'  }, // Deirdre Barnes   · Pavilion
  { id: 'cs_r6_loc3',  counselorId: 'c4',  rotationId: 'r6', locationId: 'loc3'  }, // Whitney Fallon   · Behind 502 House
  { id: 'cs_r6_loc4',  counselorId: 'c5',  rotationId: 'r6', locationId: 'loc4'  }, // Carmellia J.H.   · The Grove
  { id: 'cs_r6_loc5',  counselorId: 'c20', rotationId: 'r6', locationId: 'loc5'  }, // Danielle M-S     · Airstream Duo
  // loc6 empty
  { id: 'cs_r6_loc7',  counselorId: 'c6',  rotationId: 'r6', locationId: 'loc7'  }, // Megan Hale       · Grass by Shuffleboard
  { id: 'cs_r6_loc8',  counselorId: 'c2',  rotationId: 'r6', locationId: 'loc8'  }, // Megan Smith      · Dam Beach
  { id: 'cs_r6_loc9',  counselorId: 'c16', rotationId: 'r6', locationId: 'loc9'  }, // Sydney Catinna   · Event Center Patio
  { id: 'cs_r6_loc10', counselorId: 'c25', rotationId: 'r6', locationId: 'loc10' }, // Davonna Saier    · Lake House Tent
  { id: 'cs_r6_loc11', counselorId: 'c7',  rotationId: 'r6', locationId: 'loc11' }, // Cece Stevenson   · Left of Bldg 52
  // loc12 empty
  { id: 'cs_r6_loc13', counselorId: 'c15', rotationId: 'r6', locationId: 'loc13' }, // Patti Weiter     · The Lawn
  { id: 'cs_r6_loc14', counselorId: 'c10', rotationId: 'r6', locationId: 'loc14' }, // Kylie Fischbach  · Courtyard

  // ── Rotation 7  ·  3:30–4:00 PM ───────────────────────────────────────────
  { id: 'cs_r7_loc1',  counselorId: 'c27', rotationId: 'r7', locationId: 'loc1'  }, // Ann Brown        · Airstream Trio
  // loc2 empty
  { id: 'cs_r7_loc3',  counselorId: 'c4',  rotationId: 'r7', locationId: 'loc3'  }, // Whitney Fallon   · Behind 502 House
  { id: 'cs_r7_loc4',  counselorId: 'c5',  rotationId: 'r7', locationId: 'loc4'  }, // Carmellia J.H.   · The Grove
  { id: 'cs_r7_loc5',  counselorId: 'c21', rotationId: 'r7', locationId: 'loc5'  }, // Kate Kravchenko  · Airstream Duo
  { id: 'cs_r7_loc6',  counselorId: 'c12', rotationId: 'r7', locationId: 'loc6'  }, // Leah Bomar       · Stella/Dottie
  // loc7 empty
  { id: 'cs_r7_loc8',  counselorId: 'c24', rotationId: 'r7', locationId: 'loc8'  }, // Leslie Hall      · Dam Beach
  { id: 'cs_r7_loc9',  counselorId: 'c3',  rotationId: 'r7', locationId: 'loc9'  }, // Abby Kamen       · Event Center Patio
  // loc10 empty
  { id: 'cs_r7_loc11', counselorId: 'c8',  rotationId: 'r7', locationId: 'loc11' }, // Ari Farley       · Left of Bldg 52
  { id: 'cs_r7_loc12', counselorId: 'c18', rotationId: 'r7', locationId: 'loc12' }, // Bonnie Logsdon   · Tree Swing
  { id: 'cs_r7_loc13', counselorId: 'c17', rotationId: 'r7', locationId: 'loc13' }, // Jessica C.       · The Lawn
  // loc14 empty
];
