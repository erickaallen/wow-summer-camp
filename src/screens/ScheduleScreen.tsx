import { SafeAreaView } from 'react-native-safe-area-context';
import React, { useState } from 'react';
import {
  View,
  Text,
  FlatList,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
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

const CATEGORY_COLORS: Record<Session['category'], string> = {
  keynote: colors.primary,
  campfire: colors.teal,
  break: '#95A5A6',
  social: '#F0A500',
  activity: '#E67E22',
  checkin: '#27AE60',
};

const CATEGORY_LABELS: Record<Session['category'], string> = {
  keynote: 'MAIN STAGE',
  campfire: '🔥 CAMPFIRE',
  break: 'BREAK',
  social: '✨ SOCIAL',
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

const BOOKMARKABLE: Session['category'][] = ['keynote', 'campfire', 'social', 'activity'];

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
  const { isSaved, toggleSession } = useAgendaContext();
  const counselor = counselors.find((c) => c.id === cs.counselorId);
  const loc = campfireLocations.find((l) => l.id === cs.locationId);
  if (!counselor) return null;

  const catColor = COUNSELOR_CATEGORY_COLORS[counselor.category] ?? colors.teal;
  const saved = isSaved(cs.id);

  return (
    <TouchableOpacity style={styles.campfireCard} onPress={onPress} activeOpacity={0.8}>
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
        onPress={() => toggleSession(cs.id)}
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
}: {
  session: Session;
  navigation: Props['navigation'];
}) {
  const rotation = campfireRotations.find((r) => r.id === session.campfireRotationId);
  if (!rotation) return null;

  const rotationSessions = counselorSessions.filter((cs) => cs.rotationId === rotation.id);

  return (
    <View style={styles.campfireBlock}>
      <View style={styles.campfireBlockHeader}>
        <View style={{ flex: 1 }}>
          <Text style={styles.campfireBlockTime}>
            {session.startTime} – {session.endTime}
          </Text>
          <Text style={styles.campfireBlockLabel}>🔥 CAMPFIRE SESSIONS</Text>
          <Text style={styles.campfireBlockMeta}>
            Rotation #{rotation.rotationNumber}  ·  {rotationSessions.length} sessions
          </Text>
        </View>
      </View>

      {rotationSessions.length > 0 ? (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.campfireScroll}
        >
          {rotationSessions.map((cs) => (
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
  const { isSaved, toggleSession, loaded } = useAgendaContext();

  const daySessions = sessions.filter((s) => s.day === activeDay);
  const filtered = myAgendaOnly
    ? daySessions.filter((s) => isSaved(s.id))
    : daySessions;

  return (
    <SafeAreaView style={styles.safe} edges={[]}>

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

      {/* ── Day selector ── */}
      <View style={styles.dayRow}>
        {(['day1', 'day2'] as EventDay[]).map((day) => (
          <TouchableOpacity
            key={day}
            style={[styles.dayChip, activeDay === day && styles.dayChipActive]}
            onPress={() => setActiveDay(day)}
          >
            <Text style={[styles.dayChipText, activeDay === day && styles.dayChipTextActive]}>
              {DAY_LABELS[day].short}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* ── Date section header ── */}
      <View style={styles.dateHeader}>
        <Text style={styles.dateHeaderText}>{DAY_LABELS[activeDay].long}</Text>
      </View>

      {/* ── Session list ── */}
      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyIcon}>📋</Text>
            <Text style={styles.emptyText}>No saved sessions yet.</Text>
            <Text style={styles.emptySubtext}>
              Tap the bookmark icon on any session to add it to your agenda.
            </Text>
          </View>
        }
        renderItem={({ item }) => {
          if (item.category === 'campfire') {
            return <CampfireBlock session={item} navigation={navigation} />;
          }

          const bookmarkable = BOOKMARKABLE.includes(item.category);
          const saved = isSaved(item.id);
          const catColor = CATEGORY_COLORS[item.category];

          return (
            <TouchableOpacity
              style={styles.row}
              onPress={() => navigation.navigate('SessionDetail', { session: item })}
              activeOpacity={0.7}
            >
              <View style={[styles.rowAccent, { backgroundColor: catColor }]} />
              <View style={styles.rowBody}>
                <Text style={styles.rowTime}>
                  {item.startTime}{item.endTime ? ` – ${item.endTime}` : ''}
                </Text>
                <Text style={styles.rowTitle}>{item.title}</Text>
                <Text style={styles.rowMeta}>
                  {CATEGORY_LABELS[item.category]}  ·  {item.location}
                </Text>
                {item.leadName && <Text style={styles.rowLead}>👤 {item.leadName}</Text>}
              </View>
              {bookmarkable && loaded && (
                <TouchableOpacity
                  onPress={() => toggleSession(item.id)}
                  hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
                  style={styles.rowBookmark}
                >
                  <Ionicons
                    name={saved ? 'bookmark' : 'bookmark-outline'}
                    size={22}
                    color={saved ? colors.primary : '#CCC'}
                  />
                </TouchableOpacity>
              )}
            </TouchableOpacity>
          );
        }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },

  // ── Toggle ──
  toggle: {
    flexDirection: 'row',
    margin: spacing.md,
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

  // ── Day chips ──
  dayRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    paddingHorizontal: spacing.md,
    marginBottom: spacing.sm,
  },
  dayChip: {
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.md,
    borderRadius: radius.full,
    borderWidth: 2,
    borderColor: colors.border,
    backgroundColor: colors.white,
  },
  dayChipActive: { backgroundColor: colors.textDark, borderColor: colors.textDark },
  dayChipText: { fontFamily: fontFamily.subheading, color: colors.textMuted, fontSize: fontSize.xs, letterSpacing: 0.5 },
  dayChipTextActive: { color: colors.white },

  // ── Date header bar ──
  dateHeader: {
    backgroundColor: colors.textDark,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    marginBottom: 0,
  },
  dateHeaderText: {
    fontFamily: fontFamily.subheading,
    color: colors.white,
    fontSize: fontSize.sm,
    letterSpacing: 1.5,
  },

  // ── Session list ──
  list: { paddingBottom: spacing.xxl },
  separator: { height: StyleSheet.hairlineWidth, backgroundColor: colors.border, marginLeft: spacing.md + 4 },

  // ── Session row ──
  row: {
    flexDirection: 'row',
    alignItems: 'stretch',
    backgroundColor: colors.white,
    paddingVertical: spacing.md,
    paddingRight: spacing.md,
  },
  rowAccent: { width: 4, marginRight: spacing.md },
  rowBody: { flex: 1 },
  rowTime: {
    fontFamily: fontFamily.bodySemi,
    color: colors.textMuted,
    fontSize: fontSize.xs,
    marginBottom: 3,
    letterSpacing: 0.3,
  },
  rowTitle: {
    fontFamily: fontFamily.bodyBold,
    color: colors.textDark,
    fontSize: fontSize.md,
    lineHeight: 22,
    marginBottom: 4,
  },
  rowMeta: {
    fontFamily: fontFamily.bodyBold,
    color: colors.textMuted,
    fontSize: fontSize.xs,
    letterSpacing: 0.5,
  },
  rowLead: { fontFamily: fontFamily.body, color: colors.teal, fontSize: fontSize.xs, marginTop: 3 },
  rowBookmark: { justifyContent: 'center', paddingLeft: spacing.sm },

  // ── Campfire block ──
  campfireBlock: {
    backgroundColor: colors.white,
    borderRadius: 0,
  },
  campfireBlockHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    paddingLeft: spacing.md + 4,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.border,
  },
  campfireBlockTime: {
    fontFamily: fontFamily.bodySemi,
    color: colors.textMuted,
    fontSize: fontSize.xs,
    marginBottom: 3,
    letterSpacing: 0.3,
  },
  campfireBlockLabel: {
    fontFamily: fontFamily.bodyBold,
    color: colors.teal,
    fontSize: fontSize.md,
    marginBottom: 2,
  },
  campfireBlockMeta: {
    fontFamily: fontFamily.bodyBold,
    color: colors.textMuted,
    fontSize: fontSize.xs,
    letterSpacing: 0.5,
  },
  campfireScroll: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    gap: spacing.sm,
  },
  campfireEmpty: {
    color: '#999',
    fontSize: fontSize.xs,
    padding: spacing.md,
    fontStyle: 'italic',
  },

  // ── Campfire card ──
  campfireCard: {
    width: 200,
    backgroundColor: colors.background,
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
