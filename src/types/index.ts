export type EventDay = 'day1' | 'day2';

export interface Session {
  id: string;
  title: string;
  speakerId?: string;
  day: EventDay;
  startTime: string;
  endTime: string;
  location: string;
  description: string;
  category: 'keynote' | 'workshop' | 'panel' | 'break' | 'networking';
}

export interface Speaker {
  id: string;
  name: string;
  title: string;
  company: string;
  bio: string;
  photoPlaceholder: string;
  sessionIds: string[];
  socials?: {
    instagram?: string;
    linkedin?: string;
    website?: string;
  };
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

export type RootTabParamList = {
  Home: undefined;
  Schedule: undefined;
  Speakers: undefined;
  Map: undefined;
  More: undefined;
};

export type ScheduleStackParamList = {
  ScheduleList: undefined;
  SessionDetail: { session: Session };
};

export type SpeakersStackParamList = {
  SpeakerList: undefined;
  SpeakerDetail: { speaker: Speaker };
};

export type MoreStackParamList = {
  MoreMenu: undefined;
  Sponsors: undefined;
  CheckIn: undefined;
};
