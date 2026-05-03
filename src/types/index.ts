export type EventDay = 'day1' | 'day2';

export interface Session {
  id: string;
  title: string;
  leadName?: string;
  day: EventDay;
  startTime: string;
  endTime: string;
  location: string;
  description: string;
  category: 'keynote' | 'campfire' | 'break' | 'social' | 'activity' | 'checkin';
  /** Links a campfire schedule entry to its CampfireRotation */
  campfireRotationId?: string;
}

/** One of 7 timed rotation windows on May 27 (attendees move between them) */
export interface CampfireRotation {
  id: string;            // 'r1' … 'r7'
  rotationNumber: number;
  day: EventDay;
  startTime: string;
  endTime: string;
}

/** @deprecated Use CampfireRotation. Kept as alias so existing utility functions compile unchanged. */
export type CampfireSlot = CampfireRotation;

/** One of 14 fixed physical spaces where campfire sessions take place all day */
export interface CampfireLocation {
  id: string;               // 'loc1' … 'loc14'
  locationNumber: number;   // 1 … 14
  name: string;             // display name, e.g. 'Airstream Trio'
  mapLabel: string;         // map marker reference, e.g. '33-35'
  primaryCounselorId: string;
  secondaryCounselorId?: string;
}

export type CounselorCategory =
  | 'Movement'
  | 'Mindset & Storytelling'
  | 'Craft & Connect'
  | 'Business & Branding'
  | 'Leadership';

export interface Counselor {
  id: string;
  name: string;
  sessionTopic: string;
  category: CounselorCategory;
  bio: string;
  instagram?: string;
  email?: string;
  headshot?: number; // require() image source
  confirmed: boolean;
}

/**
 * One counselor leading their session at a specific location during a specific rotation.
 * This is the unit attendees save to their personal agenda.
 */
export interface CounselorSession {
  id: string;          // e.g. 'cs_r1_loc1'
  counselorId: string; // references Counselor.id (the leader for this slot)
  rotationId: string;  // references CampfireRotation.id
  locationId: string;  // references CampfireLocation.id
}

export interface Sponsor {
  id: string;
  name: string;
  tier: 'platinum' | 'gold' | 'silver' | 'community';
  description: string;
  logoPlaceholder: string;
  website?: string;
}

export interface Announcement {
  id: string;
  title: string;
  body: string;
  /** ISO string — when this announcement becomes visible. Omit to show immediately. */
  visibleFrom?: string;
  /** ISO string — when this announcement stops showing. Omit to show indefinitely. */
  visibleUntil?: string;
}

export interface VenueArea {
  id: string;
  name: string;
  description: string;
  latitude: number;
  longitude: number;
}

// ─── Navigation param lists ───────────────────────────────────────────────────

export type RootTabParamList = {
  Home: undefined;
  Schedule: undefined;
  Counselors: undefined;
  Map: undefined;
  More: undefined;
};

export type ScheduleStackParamList = {
  ScheduleList: undefined;
  SessionDetail: { session: Session };
  CounselorSessionDetail: { counselorSession: CounselorSession; rotation: CampfireRotation };
};

export type CounselorsStackParamList = {
  CounselorList: undefined;
  CounselorDetail: { counselor: Counselor };
};

export type MoreStackParamList = {
  MoreMenu: undefined;
  Sponsors: undefined;
  CheckIn: undefined;
};

export type MapStackParamList = {
  MapMain: undefined;
};
