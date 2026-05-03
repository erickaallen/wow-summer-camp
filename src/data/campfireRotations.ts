import { CampfireRotation } from '../types';

/**
 * The 7 timed rotation windows on May 27.
 * Attendees pick a campfire location each rotation and move between them.
 * All campfire sessions run concurrently within each window.
 */
export const campfireRotations: CampfireRotation[] = [
  { id: 'r1', rotationNumber: 1, day: 'day2', startTime: '10:00 AM', endTime: '10:30 AM' },
  { id: 'r2', rotationNumber: 2, day: 'day2', startTime: '10:45 AM', endTime: '11:15 AM' },
  { id: 'r3', rotationNumber: 3, day: 'day2', startTime: '11:30 AM', endTime: '12:00 PM' },
  { id: 'r4', rotationNumber: 4, day: 'day2', startTime: '1:15 PM',  endTime: '1:45 PM'  },
  { id: 'r5', rotationNumber: 5, day: 'day2', startTime: '2:00 PM',  endTime: '2:30 PM'  },
  { id: 'r6', rotationNumber: 6, day: 'day2', startTime: '2:45 PM',  endTime: '3:15 PM'  },
  { id: 'r7', rotationNumber: 7, day: 'day2', startTime: '3:30 PM',  endTime: '4:00 PM'  },
];
