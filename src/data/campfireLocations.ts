import { CampfireLocation } from '../types';

/**
 * The 13 fixed physical spaces where campfire sessions run all day on May 27.
 * Each counselor pair stays at their location — attendees rotate through them.
 * Source of truth: Counselor Sessions Locations PDF (final, pre-camp)
 */
export const campfireLocations: CampfireLocation[] = [
  {
    id: 'loc1',
    locationNumber: 1,
    name: 'Airstream Trio',
    mapLabel: '33-35',
    primaryCounselorId: 'c14',   // Holly Hartman
    secondaryCounselorId: 'c27', // Ann Brown
    rainLocation: 'Behind the Bunk House',
  },
  {
    id: 'loc2',
    locationNumber: 2,
    name: 'Pavilion',
    mapLabel: '15',
    primaryCounselorId: 'c19',   // Cynthia Lee
    secondaryCounselorId: 'c12', // Leah Bomar
    // rain: same location — no rainLocation needed
  },
  {
    id: 'loc3',
    locationNumber: 3,
    name: 'Behind 502 House',
    mapLabel: '1',
    primaryCounselorId: 'c17',   // Jessica Colliersmith
    secondaryCounselorId: 'c4',  // Whitney Fallon
    // rain: same location — no rainLocation needed
  },
  {
    id: 'loc4',
    locationNumber: 4,
    name: 'The Grove',
    mapLabel: '17',
    primaryCounselorId: 'c22',   // Gretchen Hunt
    secondaryCounselorId: 'c5',  // Carmellia Jackson Hurley
    rainLocation: 'The Grove (with tents)',
  },
  {
    id: 'loc5',
    locationNumber: 5,
    name: 'Airstream Duo',
    mapLabel: '4, 8, 10',
    primaryCounselorId: 'c21',   // Kate Kravchenko
    secondaryCounselorId: 'c20', // Danielle Meadows-Stinnett
    rainLocation: 'Lake House',
  },
  {
    id: 'loc6',
    locationNumber: 6,
    name: 'Stella / Dottie',
    mapLabel: '50, 51',
    primaryCounselorId: 'c9',    // Tali Lindberg
    secondaryCounselorId: 'c7',  // Cece Stevenson
    rainLocation: 'Wanderlust Room',
  },
  {
    id: 'loc7',
    locationNumber: 7,
    name: 'Grass by Shuffleboard',
    mapLabel: '28',
    primaryCounselorId: 'c26',   // Michelle Champagne
    secondaryCounselorId: 'c6',  // Megan Hale
    rainLocation: 'Inside Mess Hall',
  },
  {
    id: 'loc8',
    locationNumber: 8,
    name: 'Bridge Beach',
    mapLabel: '30',
    primaryCounselorId: 'c2',    // Megan Smith
    secondaryCounselorId: 'c13', // Deirdre Barnes
    // rain: same location — no rainLocation needed
  },
  {
    id: 'loc9',
    locationNumber: 9,
    name: 'Event Center Patio',
    mapLabel: '22',
    primaryCounselorId: 'c3',    // Abby Kamen
    secondaryCounselorId: 'c23', // Cierra Brent
    // rain: same location — no rainLocation needed
  },
  {
    id: 'loc10',
    locationNumber: 10,
    name: 'Lake House Tent',
    mapLabel: '3',
    primaryCounselorId: 'c25',   // Davonna Saier
    secondaryCounselorId: 'c24', // Leslie Hall
    // rain: same location — no rainLocation needed
  },
  {
    id: 'loc12',
    locationNumber: 12,
    name: 'Tree Swing',
    mapLabel: '11',
    primaryCounselorId: 'c1',    // Erica Weddle
    secondaryCounselorId: 'c18', // Bonnie Logsdon
    rainLocation: 'Turf Lawn (in front of Mess Hall)',
  },
  {
    id: 'loc13',
    locationNumber: 13,
    name: 'The Lawn',
    mapLabel: '18',
    primaryCounselorId: 'c11',   // Melissa Wurth & Vanessa
    secondaryCounselorId: 'c15', // Patti Weiter
    rainLocation: 'Mess Hall Front Porch (Right)',
  },
  {
    id: 'loc14',
    locationNumber: 14,
    name: 'Courtyard',
    mapLabel: '23',
    primaryCounselorId: 'c10',   // Kylie Fischbach
    secondaryCounselorId: 'c8',  // Ari Farley
    rainLocation: 'Inside Mess Hall',
  },
];
