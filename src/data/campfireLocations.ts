import { CampfireLocation } from '../types';

/**
 * The 14 fixed physical spaces where campfire sessions run all day on May 27.
 * Each counselor pair stays at their location — attendees rotate through them.
 */
export const campfireLocations: CampfireLocation[] = [
  {
    id: 'loc1',
    locationNumber: 1,
    name: 'Airstream Trio',
    mapLabel: '33-35',
    primaryCounselorId: 'c14',   // Holly Hartmann
    secondaryCounselorId: 'c27', // Ann Brown
  },
  {
    id: 'loc2',
    locationNumber: 2,
    name: 'Pavilion',
    mapLabel: '15',
    primaryCounselorId: 'c19',   // Cynthia Lee
    secondaryCounselorId: 'c13', // Deirdre Barnes
  },
  {
    id: 'loc3',
    locationNumber: 3,
    name: 'Behind 502 House',
    mapLabel: '1',
    primaryCounselorId: 'c22',   // Gretchen Hunt
    secondaryCounselorId: 'c4',  // Whitney Fallon
  },
  {
    id: 'loc4',
    locationNumber: 4,
    name: 'The Grove',
    mapLabel: '17',
    primaryCounselorId: 'c23',   // Cierra Brent
    secondaryCounselorId: 'c5',  // Carmellia Jackson Hurley
  },
  {
    id: 'loc5',
    locationNumber: 5,
    name: 'Airstream Duo',
    mapLabel: '4, 8, 10',
    primaryCounselorId: 'c21',   // Kate Kravchenko
    secondaryCounselorId: 'c20', // Danielle Meadows-Stinnett
  },
  {
    id: 'loc6',
    locationNumber: 6,
    name: 'Stella / Dottie',
    mapLabel: '50, 51',
    primaryCounselorId: 'c9',    // Tali Lindberg
    secondaryCounselorId: 'c12', // Leah Bomar
  },
  {
    id: 'loc7',
    locationNumber: 7,
    name: 'Grass by Shuffleboard',
    mapLabel: '28',
    primaryCounselorId: 'c1',    // Erica Weddle
    secondaryCounselorId: 'c6',  // Megan Hale
  },
  {
    id: 'loc8',
    locationNumber: 8,
    name: 'Dam Beach',
    mapLabel: 'Dam Beach',
    primaryCounselorId: 'c2',    // Megan Smith
    secondaryCounselorId: 'c24', // Leslie Hall
  },
  {
    id: 'loc9',
    locationNumber: 9,
    name: 'Event Center Patio',
    mapLabel: '22',
    primaryCounselorId: 'c3',    // Abby Kamen
    secondaryCounselorId: 'c16', // Sydney Catinna
  },
  {
    id: 'loc10',
    locationNumber: 10,
    name: 'Lake House Tent',
    mapLabel: '3',
    primaryCounselorId: 'c25',   // Davonna Saier (solo)
  },
  {
    id: 'loc11',
    locationNumber: 11,
    name: 'Left of Building 52',
    mapLabel: '52',
    primaryCounselorId: 'c8',    // Ari Farley
    secondaryCounselorId: 'c7',  // Cece Stevenson
  },
  {
    id: 'loc12',
    locationNumber: 12,
    name: 'Tree Swing',
    mapLabel: '11',
    primaryCounselorId: 'c11',   // Melissa Wurth & Vanessa
    secondaryCounselorId: 'c18', // Bonnie Logsdon
  },
  {
    id: 'loc13',
    locationNumber: 13,
    name: 'The Lawn',
    mapLabel: '18',
    primaryCounselorId: 'c17',   // Jessica Colliersmith
    secondaryCounselorId: 'c15', // Patti Weiter
  },
  {
    id: 'loc14',
    locationNumber: 14,
    name: 'Courtyard',
    mapLabel: '23',
    primaryCounselorId: 'c10',   // Kylie Fischbach (solo)
  },
];
