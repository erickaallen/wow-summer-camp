import { VenueArea } from '../types';

export const VENUE_NAME = 'Progress Park';
export const VENUE_ADDRESS = 'Progress Park, Louisville, KY';

// Progress Park, Louisville, KY
export const VENUE_COORDS = {
  latitude: 38.2527,
  longitude: -85.7585,
  latitudeDelta: 0.005,
  longitudeDelta: 0.005,
};

export const venueAreas: VenueArea[] = [
  {
    id: 'v1',
    name: 'Main Stage',
    description: 'Keynotes, panels, and opening/closing ceremonies.',
    latitude: 38.2528,
    longitude: -85.7585,
  },
  {
    id: 'v2',
    name: 'Workshop Hall A',
    description: 'Breakout workshops — financial & business sessions.',
    latitude: 38.2526,
    longitude: -85.7582,
  },
  {
    id: 'v3',
    name: 'Workshop Hall B',
    description: 'Breakout workshops — brand & marketing sessions.',
    latitude: 38.2525,
    longitude: -85.7588,
  },
  {
    id: 'v4',
    name: 'Dining Pavilion',
    description: 'Meals and catering.',
    latitude: 38.253,
    longitude: -85.7583,
  },
  {
    id: 'v5',
    name: 'Outdoor Pavilion',
    description: 'Networking, happy hour, and outdoor activities.',
    latitude: 38.2524,
    longitude: -85.7586,
  },
  {
    id: 'v6',
    name: 'Registration & Check-in',
    description: 'Badge pickup and check-in on arrival.',
    latitude: 38.2529,
    longitude: -85.759,
  },
];
