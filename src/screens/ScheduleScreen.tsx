import { SafeAreaView } from 'react-native-safe-area-context';
import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  Image,
  FlatList,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Svg, { Path } from 'react-native-svg';
import { useNavigation } from '@react-navigation/native';
import { NativeStackScreenProps, NativeStackNavigationProp } from '@react-navigation/native-stack';
import {
  ScheduleStackParamList,
  RootStackParamList,
  Session,
  EventDay,
  CounselorSession,
  CampfireRotation,
} from '../types';
import { sessions } from '../data/sessions';
import { campfireRotations } from '../data/campfireRotations';
import { campfireLocations } from '../data/campfireLocations';
import { counselorSessions } from '../data/counselorSessions';
import { counselors } from '../data/counselors';
import { useAgendaContext } from '../hooks/AgendaContext';
import { colors, spacing, fontSize, fontFamily } from '../theme';

type Props = NativeStackScreenProps<ScheduleStackParamList, 'ScheduleList'>;

// ─── Notebook paper constants ─────────────────────────────────────────────────
const MARGIN_X = 76;   // width of the time column

/** Splits "9:00 AM" → { main: "9:00", suffix: "AM" } */
function parseSessionTime(time: string): { main: string; suffix: string } {
  const spaceIdx = time.lastIndexOf(' ');
  if (spaceIdx === -1) return { main: time, suffix: '' };
  return { main: time.slice(0, spaceIdx), suffix: time.slice(spaceIdx + 1) };
}


const CATEGORY_COLORS: Record<Session['category'], string> = {
  keynote: colors.primary,
  campfire: colors.teal,
  break: colors.yellow,
  social: '#F0A500',
  activity: '#E67E22',
  checkin: '#27AE60',
};

const CATEGORY_LABELS: Record<Session['category'], string> = {
  keynote: 'MAIN STAGE',
  campfire: '🔥 CAMPFIRE',
  break: 'BREAK',
  social: 'SOCIAL',
  activity: 'ACTIVITY',
  checkin: 'CHECK-IN',
};

const COUNSELOR_CATEGORY_COLORS: Record<string, string> = {
  'Movement': '#4DBFBF',
  'Mindset & Storytelling': '#9B59B6',
  'Craft & Connect': '#E67E22',
  'Business & Branding': colors.primary,
  'Leadership': '#27AE60',
};

const DAY_LABELS: Record<EventDay, { short: string; long: string }> = {
  day1: { short: 'MAY 26', long: 'MONDAY, MAY 26' },
  day2: { short: 'MAY 27', long: 'TUESDAY, MAY 27' },
};


const DAY_CONFIG: Record<EventDay, {
  title: string;
  date: string;
  image: any;
  tiltInactive: string;
  tiltActive: string;
  imageStyle: object;
}> = {
  day1: {
    title: 'Kickoff\nParty',
    date: 'May 26',
    image: require('../../assets/images/pink-disco-ball.png'),
    tiltInactive: '0deg',
    tiltActive: '-8deg',
    imageStyle: {},
  },
  day2: {
    title: 'Camp\nDay',
    date: 'May 27',
    image: require('../../assets/images/campfire.png'),
    tiltInactive: '0deg',
    tiltActive: '8deg',
    imageStyle: {},
  },
};

// ─── Day selector button ─────────────────────────────────────────────────────
function DaySelectorBtn({ day, isActive, onPress }: {
  day: EventDay;
  isActive: boolean;
  onPress: () => void;
}) {
  const cfg = DAY_CONFIG[day];
  const anim = useRef(new Animated.Value(isActive ? 1 : 0)).current;

  useEffect(() => {
    Animated.spring(anim, {
      toValue: isActive ? 1 : 0,
      useNativeDriver: true,
      friction: 6,
      tension: 80,
    }).start();
  }, [isActive]);

  const imageOpacity  = anim.interpolate({ inputRange: [0, 1], outputRange: [0.35, 1] });
  const imageScale    = anim.interpolate({ inputRange: [0, 1], outputRange: [0.78, 1.08] });
  const imageTranslateY = anim.interpolate({ inputRange: [0, 1], outputRange: [4, -4] });
  const imageRotate   = anim.interpolate({ inputRange: [0, 1], outputRange: [cfg.tiltInactive, cfg.tiltActive] });

  return (
    <TouchableOpacity style={styles.daySelectorBtn} onPress={onPress} activeOpacity={0.85}>
      {/* Graphic */}
      <Animated.Image
        source={cfg.image}
        style={[
          styles.daySelectorImage,
          cfg.imageStyle,
          {
            opacity: imageOpacity,
            transform: [
              { scale: imageScale },
              { translateY: imageTranslateY },
              { rotate: imageRotate },
            ],
          },
        ]}
      />

      {/* Text — highlight sits only behind the words */}
      <View style={styles.daySelectorTextWrapper}>
        {isActive && (
          <Svg
            width="100%"
            height="100%"
            viewBox="0 0 180 90"
            preserveAspectRatio="xMidYMid meet"
            style={[StyleSheet.absoluteFill, { transform: [{ rotate: '-2deg' }] }]}
          >
            <Path d="M 28 10 Q 66 6 90 9 Q 118 12 154 8 L 152 30 Q 116 34 88 32 Q 60 30 30 33 Z" fill="#FFD972" fillOpacity={0.5} />
            <Path d="M 34 33 Q 70 29 90 32 Q 114 35 148 31 L 146 55 Q 108 59 88 57 Q 64 55 36 58 Z" fill="#FFD972" fillOpacity={0.5} />
            <Path d="M 136 8 Q 152 7 158 10 L 156 54 Q 148 56 134 54 Z" fill="#FFD972" fillOpacity={0.45} />
            <Path d="M 22 16 Q 32 13 40 15 L 38 52 Q 28 54 21 52 Z" fill="#FFD972" fillOpacity={0.3} />
            <Path d="M 42 55 Q 74 51 90 54 Q 110 57 140 53 L 138 82 Q 106 86 88 84 Q 66 82 44 85 Z" fill="#FFD972" fillOpacity={0.5} />
            <Path d="M 124 53 Q 142 52 147 55 L 145 83 Q 138 85 122 83 Z" fill="#FFD972" fillOpacity={0.45} />
            <Path d="M 34 60 Q 44 58 50 60 L 48 84 Q 40 86 33 84 Z" fill="#FFD972" fillOpacity={0.3} />
          </Svg>
        )}
        <Text style={[styles.daySelectorTitle, isActive && styles.daySelectorTitleActive]}>
          {cfg.title}
        </Text>
        <Text style={[styles.daySelectorDate, isActive && styles.daySelectorDateActive]}>
          {cfg.date}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

// ─── Campfire card (horizontal scroll) ───────────────────────────────────────
function CampfireCard({
  cs,
  rotation,
  onPress,
}: {
  cs: CounselorSession;
  rotation: CampfireRotation;
  onPress: () => void;
}) {
  const { isSaved, toggleSession, getSavedForRotation, replaceSession, hasReminder, scheduleCounselorReminder, cancelReminder } = useAgendaContext();
  const counselor = counselors.find((c) => c.id === cs.counselorId);
  const loc = campfireLocations.find((l) => l.id === cs.locationId);
  if (!counselor) return null;

  const catColor = COUNSELOR_CATEGORY_COLORS[counselor.category] ?? colors.teal;
  const saved = isSaved(cs.id);
  const reminded = hasReminder(cs.id);

  const handleBookmark = () => {
    if (saved) {
      toggleSession(cs.id);
      return;
    }
    const existingId = getSavedForRotation(cs.rotationId);
    if (existingId && existingId !== cs.id) {
      Alert.alert(
        'Time Slot Conflict',
        'You already have a campfire session saved for this rotation. Switch to this one instead?',
        [
          { text: 'Keep Current', style: 'cancel' },
          { text: 'Switch', onPress: () => replaceSession(existingId, cs.id) },
        ],
      );
      return;
    }
    toggleSession(cs.id);
  };

  const handleBell = async () => {
    if (reminded) {
      await cancelReminder(cs.id);
      return;
    }
    // Must be saved first
    if (!saved) {
      const existingId = getSavedForRotation(cs.rotationId);
      if (existingId && existingId !== cs.id) {
        Alert.alert(
          'Time Slot Conflict',
          'You already have a campfire session saved for this rotation. Switch to this one and set a reminder?',
          [
            { text: 'Keep Current', style: 'cancel' },
            {
              text: 'Switch & Remind',
              onPress: async () => {
                await cancelReminder(existingId);
                replaceSession(existingId, cs.id);
                const result = await scheduleCounselorReminder(cs.id, rotation, counselor.name, counselor.sessionTopic);
                if (result === 'denied') {
                  Alert.alert('Notifications Blocked', 'Enable notifications for WOW Summer Camp in your device Settings.');
                }
              },
            },
          ],
        );
        return;
      }
      toggleSession(cs.id);
    }
    const result = await scheduleCounselorReminder(cs.id, rotation, counselor.name, counselor.sessionTopic);
    if (result === 'denied') {
      Alert.alert('Notifications Blocked', 'Enable notifications for WOW Summer Camp in your device Settings.');
    } else if (result === 'past') {
      Alert.alert('Already Started', 'This session has already begun — no reminder needed!');
    }
  };

  return (
    <TouchableOpacity
      style={[styles.campfireCard, {
        borderColor: catColor,
        shadowColor: catColor,
      }]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      {/* <View style={[styles.campfireCardAccent, { backgroundColor: catColor }]} /> */}
      <View style={styles.campfireCardBody}>
        <View style={styles.campfireCardContent}>
          <Text style={[styles.campfireCategoryLabel, { color: catColor }]} numberOfLines={1}>
            {counselor.category.toUpperCase()}
          </Text>
          <Text style={styles.campfireTopicText} numberOfLines={2}>
            {counselor.sessionTopic}
          </Text>
          <Text style={styles.campfireCounselorName} numberOfLines={1}>
            {counselor.name}
          </Text>
        </View>
        <View style={styles.campfireLocRow}>
          <Ionicons name="location-outline" size={13} color="#999" />
          <Text style={styles.campfireLocText} numberOfLines={1}>
            {' '}{loc?.name ?? '—'}
          </Text>
          <TouchableOpacity onPress={handleBell} hitSlop={{ top: 8, bottom: 8, left: 6, right: 6 }}>
            <Ionicons
              name={reminded ? 'notifications' : 'notifications-outline'}
              size={13}
              color={reminded ? colors.primary : '#999'}
            />
          </TouchableOpacity>
          <TouchableOpacity onPress={handleBookmark} hitSlop={{ top: 8, bottom: 8, left: 6, right: 6 }}>
            <Ionicons
              name={saved ? 'bookmark' : 'bookmark-outline'}
              size={13}
              color={saved ? colors.primary : '#999'}
            />
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );
}

// ─── Inline campfire block ────────────────────────────────────────────────────
function CampfireBlock({
  session,
  rootNav,
  myAgendaOnly,
  onBrowse,
}: {
  session: Session;
  rootNav: NativeStackNavigationProp<RootStackParamList>;
  myAgendaOnly: boolean;
  onBrowse: () => void;
}) {
  const { getSavedForRotation } = useAgendaContext();
  const rotation = campfireRotations.find((r) => r.id === session.campfireRotationId);
  if (!rotation) return null;

  const rotationSessions = counselorSessions.filter((cs) => cs.rotationId === rotation.id);
  const savedId = myAgendaOnly ? getSavedForRotation(rotation.id) : undefined;

  const { main: cfTimeMain, suffix: cfTimeSuffix } = parseSessionTime(session.startTime);

  // Shared header — time in margin + label (bar is on the outer block container)
  const campfireHeader = (extraMeta?: React.ReactNode) => (
    <View style={styles.campfireBlockHeader}>
      <View style={styles.rowTimeArea}>
        <Text style={styles.rowTimeMain}>{cfTimeMain}</Text>
        {cfTimeSuffix ? <Text style={styles.rowTimeSuffix}>{cfTimeSuffix}</Text> : null}
      </View>
      <View style={styles.campfireBlockRight}>
        <View style={{ flex: 1 }}>
          <Text style={styles.campfireBlockLabel}>🔥 Campfire Rotation #{rotation.rotationNumber}</Text>
          {extraMeta}
        </View>
      </View>
    </View>
  );

  // ── My Agenda: gap card — no session chosen yet ──
  if (myAgendaOnly && !savedId) {
    return (
      <View style={styles.campfireBlock}>
        {campfireHeader()}
        <TouchableOpacity
          style={styles.campfireGap}
          onPress={onBrowse}
          activeOpacity={0.75}
        >
          <View style={styles.campfireGapTitleWrap}>
            <Svg
              width="100%"
              height="100%"
              viewBox="0 0 200 28"
              preserveAspectRatio="none"
              style={[StyleSheet.absoluteFill, { transform: [{ rotate: '-1.5deg' }] }]}
            >
              <Path d="M 8 6 Q 60 2 100 5 Q 145 8 192 4 L 191 22 Q 148 26 100 24 Q 56 22 9 25 Z" fill="#FFD972" fillOpacity={0.55} />
              <Path d="M 180 4 Q 194 3 198 6 L 197 23 Q 192 25 179 23 Z" fill="#FFD972" fillOpacity={0.4} />
              <Path d="M 4 8 Q 12 5 18 7 L 17 22 Q 10 24 3 22 Z" fill="#FFD972" fillOpacity={0.3} />
            </Svg>
            <Text style={styles.campfireGapTitle}>No session selected yet.</Text>
          </View>
          <Text style={styles.campfireGapBody}>TAP TO BROWSE</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // ── My Agenda: show only the saved card ──
  const visibleSessions = myAgendaOnly && savedId
    ? rotationSessions.filter((cs) => cs.id === savedId)
    : rotationSessions;

  return (
    <View style={styles.campfireBlock}>
      <View style={styles.campfireBlockBar} />
      {campfireHeader()}

      {visibleSessions.length > 0 ? (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.campfireScroll}
        >
          {visibleSessions.map((cs) => (
            <CampfireCard
              key={cs.id}
              cs={cs}
              rotation={rotation}
              onPress={() =>
                rootNav.navigate('CounselorSessionDetail', {
                  counselorSession: cs,
                  rotation,
                })
              }
            />
          ))}
        </ScrollView>
      ) : (
        <Text style={styles.campfireEmpty}>No sessions scheduled this rotation.</Text>
      )}
    </View>
  );
}

// ─── Main screen ─────────────────────────────────────────────────────────────
export default function ScheduleScreen({ navigation }: Props) {
  const rootNav = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [activeDay, setActiveDay] = useState<EventDay>('day1');
  const [myAgendaOnly, setMyAgendaOnly] = useState(false);
  const { getSavedForRotation, loaded } = useAgendaContext();

  const daySessions = sessions.filter((s) => s.day === activeDay);
  // All sessions always shown — campfire blocks render gap cards when unselected
  const filtered = daySessions;

  return (
    <SafeAreaView style={styles.safe} edges={[]}>

      {/* ── Day selector ── */}
      <View style={styles.daySelectorRow}>
        {(['day1', 'day2'] as EventDay[]).map((day) => (
          <DaySelectorBtn
            key={day}
            day={day}
            isActive={activeDay === day}
            onPress={() => setActiveDay(day)}
          />
        ))}
      </View>

      {/* ── My agenda filter (camp day only) ── */}
      {activeDay === 'day2' && (
        <>
          {/* Agenda filter stripe */}
          <TouchableOpacity
            style={styles.agendaStripeOption}
            onPress={() => setMyAgendaOnly(!myAgendaOnly)}
            activeOpacity={0.85}
          >
            <View style={styles.agendaCheckBox}>
              {myAgendaOnly && (
                <Svg width="24" height="24" viewBox="0 0 20 20" style={{ position: 'absolute' }}>
                  <Path d="M 3 10 Q 7 15 9 17 Q 13 8 18 3" stroke={colors.primary} strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" fill="none" />
                </Svg>
              )}
            </View>
            <Text style={styles.agendaCheckLabel}>
              SHOW MY PERSONAL AGENDA
            </Text>
          </TouchableOpacity>
        </>
      )}

      {/* ── Session list ── */}
      <View style={styles.listContainer}>
        <ScrollView
          style={styles.listScroll}
          contentContainerStyle={styles.list}
        >
          {/* Session items */}
          {filtered.map((item) => {
            if (item.category === 'campfire') {
              return (
                <CampfireBlock
                  key={item.id}
                  session={item}
                  rootNav={rootNav}
                  myAgendaOnly={myAgendaOnly}
                  onBrowse={() => setMyAgendaOnly(false)}
                />
              );
            }

            const { main: timeMain, suffix: timeSuffix } = parseSessionTime(item.startTime);
            const catColor = CATEGORY_COLORS[item.category];

            return (
              <TouchableOpacity
                key={item.id}
                style={styles.row}
                onPress={() => rootNav.navigate('SessionDetail', { session: item })}
                activeOpacity={0.75}
              >
                {/* Time — written in the notebook margin */}
                <View style={styles.rowTimeArea}>
                  <Text style={styles.rowTimeMain}>{timeMain}</Text>
                  {timeSuffix ? <Text style={styles.rowTimeSuffix}>{timeSuffix}</Text> : null}
                </View>

                {/* Content — right of the pink margin line */}
                <View style={styles.rowContent}>
                  {/* <View style={[styles.rowColorBar, { backgroundColor: catColor }]} /> */}
                  <View style={styles.rowContentInner}>
                    <Text style={styles.rowTitle} numberOfLines={2}>{item.title}</Text>
                    {item.location ? (
                      <View style={styles.rowLocRow}>
                        <Ionicons name="location-outline" size={13} color="#666" />
                        <Text style={styles.rowLocText} numberOfLines={1}>
                          {' '}{item.location}
                        </Text>
                      </View>
                    ) : null}
                  </View>
                </View>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },

  // ── My agenda filter ──
  agendaCheckRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.sm,
    gap: spacing.sm,
  },
  // Agenda filter stripe
  agendaStripeOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.lg,
    backgroundColor: colors.accent,
  },
  agendaCheckBox: {
    width: 28,
    height: 28,
    borderRadius: 4,
    borderWidth: 2.5,
    borderColor: colors.textDark,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.white,
  },
  agendaCheckBoxActive: { borderColor: colors.primary },
  agendaCheckLabel: {
    fontFamily: fontFamily.barlowBold,
    color: colors.textDark,
    fontSize: fontSize.md,
    letterSpacing: 0.2,
  },
  agendaCheckLabelActive: { color: colors.primary },

  // ── Day selector ──
  daySelectorRow: {
    flexDirection: 'row',
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.xs,
    paddingBottom: 0,
  },
  daySelectorBtn: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.sm,
  },
  daySelectorTextWrapper: {
    width: '100%',
    alignItems: 'center',
    paddingVertical: 8,
    zIndex: 1,
  },
  daySelectorTitle: {
    fontFamily: fontFamily.display,
    color: colors.textMuted,
    fontSize: fontSize.lg,
    textAlign: 'center',
    lineHeight: 28,
  },
  daySelectorTitleActive: { color: colors.textDark },
  daySelectorDate: {
    fontFamily: fontFamily.subheading,
    color: colors.textMuted,
    fontSize: fontSize.md,
    textAlign: 'center',
    marginTop: 2,
  },
  daySelectorDateActive: { color: colors.textDark },
  daySelectorImage: {
    width: 56,
    height: 56,
    resizeMode: 'contain',
    marginBottom: -10,
    zIndex: 0,
  },

  // ── List container ──
  listContainer: { flex: 1, backgroundColor: colors.background },
  listScroll: { backgroundColor: colors.background },
  list: { paddingBottom: spacing.xxl },

  // ── Session row ──
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: colors.background,
    paddingVertical: spacing.md,
    paddingRight: spacing.md,
  },

  // Time column (left of the divider)
  rowTimeArea: {
    width: MARGIN_X,
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingTop: 2,
  },
  rowTimeMain: {
    fontFamily: fontFamily.barlowBold,
    fontSize: 19,
    lineHeight: 23,
    color: colors.textDark,
  },
  rowTimeSuffix: {
    fontFamily: fontFamily.subheading,
    fontSize: 10,
    color: colors.textMuted,
    letterSpacing: 0.5,
    marginTop: 1,
  },

  // Content column (right of the divider)
  rowContent: {
    flex: 1,
    flexDirection: 'row',
    paddingLeft: spacing.sm,
    paddingTop: 2,
  },
  rowColorBar: {
    width: 3,
    minHeight: 44,
    alignSelf: 'stretch',
    borderRadius: 1.5,
    marginRight: spacing.sm,
  },
  rowContentInner: { flex: 1 },
  rowTitle: {
    fontFamily: fontFamily.barlowBold,
    color: colors.textDark,
    fontSize: fontSize.md,
    lineHeight: 22,
    marginBottom: 4,
  },
  rowMeta: {
    fontFamily: fontFamily.subheading,
    color: colors.textMuted,
    fontSize: fontSize.sm,
    letterSpacing: 0.3,
  },
  rowLead: {
    fontFamily: fontFamily.body,
    color: colors.teal,
    fontSize: fontSize.xs,
    marginTop: 3,
  },

  // ── Campfire block ──
  campfireBlock: {
    backgroundColor: 'transparent',
  },
  campfireBlockBar: {
    width: 3,
    alignSelf: 'stretch',
    borderRadius: 1.5,
    backgroundColor: colors.teal,
  },
  campfireBlockHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingTop: spacing.md,
    paddingBottom: spacing.xs,
    paddingRight: spacing.md,
    // no border — the teal spine provides the visual separation
  },
  campfireBlockRight: {
    flex: 1,
    flexDirection: 'row',
    paddingTop: 2,
  },
  campfireBlockLabel: {
    fontFamily: fontFamily.barlowBold,
    color: colors.teal,
    fontSize: fontSize.md,
    lineHeight: 22,
    marginBottom: 2,
  },
  campfireBlockMeta: {
    fontFamily: fontFamily.body,
    color: '#666',
    fontSize: 13,
  },
  campfireScroll: {
    paddingLeft: MARGIN_X + spacing.sm,
    paddingRight: spacing.md,
    paddingTop: 2,
    paddingBottom: spacing.sm,
    gap: spacing.md,
  },
  campfireEmpty: {
    fontFamily: fontFamily.body,
    color: '#999',
    fontSize: fontSize.xs,
    paddingLeft: MARGIN_X + spacing.sm,
    paddingVertical: spacing.sm,
    fontStyle: 'italic',
  },

  // ── Campfire gap (My Agenda — no session chosen) ──
  campfireGap: {
    marginLeft: MARGIN_X + spacing.sm,
    marginTop: spacing.xs,
    marginBottom: spacing.sm,
    width: 240,
    height: 120,
    backgroundColor: 'transparent',
    borderWidth: 1.5,
    borderColor: colors.textDark,
    borderStyle: 'dashed',
    borderRadius: 0,
    padding: spacing.sm,
    justifyContent: 'center',
    alignItems: 'center',
  },
  campfireGapTitleWrap: {
    width: '100%',
    marginBottom: 2,
  },
  campfireGapTitle: {
    fontFamily: 'Corben_700Bold',
    color: colors.textDark,
    fontSize: fontSize.sm,
    textAlign: 'center',
    lineHeight: 22,
    zIndex: 1,
  },
  campfireGapBody: {
    fontFamily: fontFamily.subheading,
    color: colors.textDark,
    fontSize: fontSize.xs,
    letterSpacing: 0.5,
    marginBottom: 3,
    textAlign: 'center',
  },

  // ── Campfire card (floating cards in horizontal scroll) ──
  campfireCard: {
    width: 240,
    height: 120,
    backgroundColor: colors.white,
    borderRadius: 0,
    borderWidth: 2,
    flexDirection: 'row',
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 4,
  },
  campfireCardAccent: { width: 4, alignSelf: 'stretch' },
  campfireCardBody: { flex: 1, padding: spacing.sm, paddingVertical: 8, justifyContent: 'space-between' },
  campfireCardContent: { gap: 2 },
  campfireCategoryLabel: { fontFamily: fontFamily.subheading, fontSize: 9, letterSpacing: 0.5, marginBottom: 3 },
  campfireCounselorName: { fontFamily: fontFamily.body, color: '#555', fontSize: 12, lineHeight: 16 },
  campfireTopicText: { fontFamily: fontFamily.display, color: colors.textDark, fontSize: fontSize.sm, lineHeight: 17 },
  rowLocRow: { flexDirection: 'row', alignItems: 'center', marginTop: 2 },
  rowLocText: { fontFamily: fontFamily.body, color: '#666', fontSize: 13, flex: 1 },
  campfireLocRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 2 },
  campfireLocText: { fontFamily: fontFamily.body, color: '#999', fontSize: 12, flex: 1 },

  // ── Empty state ──
  empty: { alignItems: 'center', paddingTop: spacing.xxl, paddingHorizontal: spacing.xl },
  emptyIcon: { fontSize: 48, marginBottom: spacing.md },
  emptyText: { fontFamily: fontFamily.display, color: colors.primary, fontSize: fontSize.lg, textAlign: 'center' },
  emptySubtext: { fontFamily: fontFamily.body, color: '#888', fontSize: fontSize.sm, textAlign: 'center', marginTop: spacing.sm, lineHeight: 20 },
});

