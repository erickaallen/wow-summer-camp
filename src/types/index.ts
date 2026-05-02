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
  /** Links a campfire schedule entry to its CampfireSlot definition */
  campfireSlotId?: string;
}

/** One of the 7 concurrent-session time blocks on May 27 */
export interface CampfireSlot {
  id: string;           // 'cf1' … 'cf7'
  slotNumber: number;   // 1 … 7
  day: EventDay;
  startTime: string;
  endTime: string;
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
  confirmed: boolean;
}

/**
 * A specific counselor presenting in a specific campfire slot at a specific location.
 * This is the unit attendees save to their personal agenda.
 *
 * TO ADD REAL DATA: populate src/data/counselorSessions.ts with entries
 * once Amanda sends slot assignments and room locations.
 */
export interface CounselorSession {
  id: string;             // e.g. 'cs_cf1_c3'
  counselorId: string;    // references Counselor.id
  campfireSlotId: string; // references CampfireSlot.id
  location: string;       // room or area name, e.g. 'Breakout Room A'
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
  timestamp: string;
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
  CampfireSlot: { slot: CampfireSlot };
  CounselorSessionDetail: { counselorSession: CounselorSession; slot: CampfireSlot };
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
