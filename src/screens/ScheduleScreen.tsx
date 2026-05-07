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
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import {
  ScheduleStackParamList,
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
import { colors, spacing, fontSize, fontFamily, radius } from '../theme';

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
    title: 'Kickoff Party',
    date: 'May 26',
    image: require('../../assets/images/mocktails.png'),
    tiltInactive: '-20deg',
    tiltActive: '-8deg',
    imageStyle: { top: 2, left: 6 },
  },
  day2: {
    title: 'Camp\nDay',
    date: 'May 27',
    image: require('../../assets/images/smores.png'),
    tiltInactive: '20deg',
    tiltActive: '8deg',
    imageStyle: { top: 2, right: 6 },
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
      {isActive && (
        <Svg
          width="100%"
          height="100%"
          viewBox="0 0 180 90"
          preserveAspectRatio="xMidYMid meet"
          style={[StyleSheet.absoluteFill, { transform: [{ rotate: '-2deg' }] }]}
        >
          <Path d="M 3 12 Q 46 8 90 11 Q 138 14 177 10 L 175 34 Q 128 38 84 36 Q 40 34 5 37 Z" fill="#FFD972" fillOpacity={0.5} />
          <Path d="M 8 35 Q 54 31 96 34 Q 142 37 174 33 L 172 61 Q 124 65 80 62 Q 36 59 10 63 Z" fill="#FFD972" fillOpacity={0.5} />
          <Path d="M 146 9 Q 164 8 179 11 L 177 60 Q 162 62 144 60 Z" fill="#FFD972" fillOpacity={0.45} />
          <Path d="M 2 18 Q 14 15 22 17 L 20 55 Q 10 57 1 54 Z" fill="#FFD972" fillOpacity={0.3} />
          <Path d="M 30 65 Q 74 62 110 65 Q 144 67 156 64 L 154 81 Q 118 84 82 82 Q 46 80 28 83 Z" fill="#FFD972" fillOpacity={0.5} />
          <Path d="M 138 63 Q 156 62 167 65 L 165 82 Q 152 84 136 82 Z" fill="#FFD972" fillOpacity={0.45} />
          <Path d="M 27 68 Q 38 66 46 68 L 44 80 Q 32 82 25 80 Z" fill="#FFD972" fillOpacity={0.3} />
        </Svg>
      )}

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

      <Text style={[styles.daySelectorTitle, isActive && styles.daySelectorTitleActive]}>
        {cfg.title}
      </Text>
      <Text style={[styles.daySelectorDate, isActive && styles.daySelectorDateActive]}>
        {cfg.date}
      </Text>
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
  const { isSaved, toggleSession, getSavedForRotation, replaceSession } = useAgendaContext();
  const counselor = counselors.find((c) => c.id === cs.counselorId);
  const loc = campfireLocations.find((l) => l.id === cs.locationId);
  if (!counselor) return null;

  const catColor = COUNSELOR_CATEGORY_COLORS[counselor.category] ?? colors.teal;
  const saved = isSaved(cs.id);

  const handleBookmark = () => {
    if (saved) {
      // Already saved — just toggle off
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

  return (
    <TouchableOpacity
      style={styles.campfireCard}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <View style={[styles.campfireCardAccent, { backgroundColor: catColor }]} />
      <View style={styles.campfireCardBody}>
        <Text style={[styles.campfireCategoryLabel, { color: catColor }]} numberOfLines={1}>
          {counselor.category.toUpperCase()}
        </Text>
        <Text style={styles.campfireCounselorName} numberOfLines={1}>
          {counselor.name}
        </Text>
        <Text style={styles.campfireTopicText} numberOfLines={3}>
          {counselor.sessionTopic}
        </Text>
        <View style={styles.campfireLocRow}>
          <Ionicons name="location-outline" size={11} color="#999" />
          <Text style={styles.campfireLocText} numberOfLines={1}>
            {' '}{loc?.name ?? '—'}
          </Text>
        </View>
      </View>
      <TouchableOpacity
        style={styles.campfireBookmarkBtn}
        onPress={handleBookmark}
        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
      >
        <Ionicons
          name={saved ? 'bookmark' : 'bookmark-outline'}
          size={18}
          color={saved ? colors.primary : '#CCC'}
        />
      </TouchableOpacity>
    </TouchableOpacity>
  );
}

// ─── Inline campfire block ────────────────────────────────────────────────────
function CampfireBlock({
  session,
  navigation,
  myAgendaOnly,
  onBrowse,
}: {
  session: Session;
  navigation: Props['navigation'];
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
          <View style={styles.campfireGapIconRow}>
            <Ionicons name="alert-circle-outline" size={20} color={colors.primary} />
            <Text style={styles.campfireGapTitle}>No session selected</Text>
          </View>
          <Text style={styles.campfireGapBody}>
            You haven't chosen a campfire session for this rotation yet. Tap to browse your options.
          </Text>
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
      {campfireHeader(
        !myAgendaOnly
          ? <Text style={styles.campfireBlockMeta}>
              {rotationSessions.length} sessions to choose from
            </Text>
          : null
      )}

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
                navigation.navigate('CounselorSessionDetail', {
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

      {/* ── All Sessions / My Agenda toggle ── */}
      <View style={styles.toggle}>
        <TouchableOpacity
          style={[styles.toggleBtn, !myAgendaOnly && styles.toggleBtnActive]}
          onPress={() => setMyAgendaOnly(false)}
        >
          <Text style={[styles.toggleText, !myAgendaOnly && styles.toggleTextActive]}>
            All Sessions
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.toggleBtn, myAgendaOnly && styles.toggleBtnActive]}
          onPress={() => setMyAgendaOnly(true)}
        >
          <Text style={[styles.toggleText, myAgendaOnly && styles.toggleTextActive]}>
            My Agenda
          </Text>
        </TouchableOpacity>
      </View>

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
                  navigation={navigation}
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
                onPress={() => navigation.navigate('SessionDetail', { session: item })}
                activeOpacity={0.75}
              >
                {/* Time — written in the notebook margin */}
                <View style={styles.rowTimeArea}>
                  <Text style={styles.rowTimeMain}>{timeMain}</Text>
                  {timeSuffix ? <Text style={styles.rowTimeSuffix}>{timeSuffix}</Text> : null}
                </View>

                {/* Content — right of the pink margin line */}
                <View style={styles.rowContent}>
                  <View style={[styles.rowColorBar, { backgroundColor: catColor }]} />
                  <View style={styles.rowContentInner}>
                    <Text style={styles.rowTitle} numberOfLines={2}>{item.title}</Text>
                    <Text style={styles.rowMeta}>
                      {CATEGORY_LABELS[item.category]}
                      {item.location ? `  ·  ${item.location}` : ''}
                    </Text>
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

  // ── Toggle ──
  toggle: {
    flexDirection: 'row',
    marginHorizontal: spacing.md,
    marginBottom: spacing.sm,
    backgroundColor: colors.white,
    borderRadius: radius.full,
    borderWidth: 2,
    borderColor: colors.primary,
    overflow: 'hidden',
  },
  toggleBtn: {
    flex: 1,
    paddingVertical: spacing.sm + 2,
    alignItems: 'center',
  },
  toggleBtnActive: { backgroundColor: colors.primary },
  toggleText: {
    fontFamily: fontFamily.bodyBold,
    color: colors.primary,
    fontSize: fontSize.sm,
    letterSpacing: 0.3,
  },
  toggleTextActive: { color: colors.white },

  // ── Day selector ──
  daySelectorRow: {
    flexDirection: 'row',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
  },
  daySelectorBtn: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.sm,
    minHeight: 72,
  },
  daySelectorTitle: {
    fontFamily: fontFamily.display,
    color: colors.textMuted,
    fontSize: fontSize.lg,
    textAlign: 'center',
  },
  daySelectorTitleActive: { color: colors.textDark },
  daySelectorDate: {
    fontFamily: fontFamily.subheading,
    color: colors.textMuted,
    fontSize: fontSize.sm,
    textAlign: 'center',
    marginTop: 2,
  },
  daySelectorDateActive: { color: colors.textDark },
  daySelectorImage: {
    position: 'absolute',
    width: 62,
    height: 62,
    resizeMode: 'contain',
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
    fontSize: fontSize.xs,
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
  campfireBlockHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: spacing.md,
    paddingRight: spacing.md,
    // no border — the teal spine provides the visual separation
  },
  campfireBlockRight: {
    flex: 1,
    flexDirection: 'row',
    paddingLeft: spacing.md,   // breathing room between spine and text
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
    fontFamily: fontFamily.subheading,
    color: colors.textMuted,
    fontSize: fontSize.xs,
    letterSpacing: 0.3,
  },
  campfireScroll: {
    paddingLeft: MARGIN_X + spacing.sm,
    paddingRight: spacing.md,
    paddingTop: spacing.xs,
    paddingBottom: spacing.sm,
    gap: spacing.sm,
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
    marginRight: spacing.md,
    marginTop: spacing.xs,
    marginBottom: spacing.sm,
    backgroundColor: '#FFF3F8',
    borderWidth: 1.5,
    borderColor: colors.primary,
    borderStyle: 'dashed',
    borderRadius: 0,
    padding: spacing.md,
  },
  campfireGapIconRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    marginBottom: spacing.xs,
  },
  campfireGapTitle: {
    fontFamily: fontFamily.bodyBold,
    color: colors.primary,
    fontSize: fontSize.sm,
  },
  campfireGapBody: {
    fontFamily: fontFamily.body,
    color: colors.textMuted,
    fontSize: fontSize.sm,
    lineHeight: 20,
  },

  // ── Campfire card (floating cards in horizontal scroll) ──
  campfireCard: {
    width: 200,
    backgroundColor: colors.white,
    borderRadius: 0,
    borderWidth: 1,
    borderColor: colors.border,
    flexDirection: 'row',
    overflow: 'hidden',
  },
  campfireCardAccent: { width: 4, alignSelf: 'stretch' },
  campfireCardBody: { flex: 1, padding: spacing.sm, gap: 3 },
  campfireCategoryLabel: { fontFamily: fontFamily.subheading, fontSize: 9, letterSpacing: 0.5 },
  campfireCounselorName: { fontFamily: fontFamily.display, color: colors.textDark, fontSize: fontSize.sm },
  campfireTopicText: { fontFamily: fontFamily.body, color: '#555', fontSize: 11, lineHeight: 15 },
  campfireLocRow: { flexDirection: 'row', alignItems: 'center', marginTop: 2 },
  campfireLocText: { fontFamily: fontFamily.body, color: '#999', fontSize: 10, flex: 1 },
  campfireBookmarkBtn: { padding: spacing.xs, justifyContent: 'flex-start', alignItems: 'center', paddingTop: spacing.sm },

  // ── Empty state ──
  empty: { alignItems: 'center', paddingTop: spacing.xxl, paddingHorizontal: spacing.xl },
  emptyIcon: { fontSize: 48, marginBottom: spacing.md },
  emptyText: { fontFamily: fontFamily.display, color: colors.primary, fontSize: fontSize.lg, textAlign: 'center' },
  emptySubtext: { fontFamily: fontFamily.body, color: '#888', fontSize: fontSize.sm, textAlign: 'center', marginTop: spacing.sm, lineHeight: 20 },
});
