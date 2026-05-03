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
import { colors, spacing, fontSize, fontWeight, radius } from '../theme';

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

// Sessions worth bookmarking (breaks and check-ins don't need saving)
const BOOKMARKABLE: Session['category'][] = ['keynote', 'campfire', 'social', 'activity'];

// ─── Campfire session card (inside the horizontal scroll) ────────────────────
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

// ─── Inline campfire block for a rotation ────────────────────────────────────
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
      {/* Block header */}
      <View style={styles.campfireBlockHeader}>
        <View style={[styles.categoryDot, { backgroundColor: colors.teal }]} />
        <View style={{ flex: 1 }}>
          <Text style={styles.campfireBlockLabel}>🔥 CAMPFIRE SESSIONS</Text>
          <Text style={styles.campfireBlockTime}>
            Rotation #{rotation.rotationNumber}  ·  {session.startTime} – {session.endTime}
          </Text>
        </View>
        <Text style={styles.campfireCount}>{rotationSessions.length} sessions</Text>
      </View>

      {/* Horizontal scroll of session cards */}
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
      {/* Day tabs */}
      <View style={styles.tabs}>
        <TouchableOpacity
          style={[styles.tab, activeDay === 'day1' && styles.tabActive]}
          onPress={() => setActiveDay('day1')}
        >
          <Text style={[styles.tabText, activeDay === 'day1' && styles.tabTextActive]}>
            MAY 26 · KICKOFF PARTY
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeDay === 'day2' && styles.tabActive]}
          onPress={() => setActiveDay('day2')}
        >
          <Text style={[styles.tabText, activeDay === 'day2' && styles.tabTextActive]}>
            MAY 27 · CAMP DAY
          </Text>
        </TouchableOpacity>
      </View>

      {/* My Agenda toggle */}
      <TouchableOpacity
        style={[styles.agendaToggle, myAgendaOnly && styles.agendaToggleActive]}
        onPress={() => setMyAgendaOnly((v) => !v)}
      >
        <Ionicons
          name={myAgendaOnly ? 'bookmark' : 'bookmark-outline'}
          size={16}
          color={myAgendaOnly ? colors.white : colors.primary}
        />
        <Text style={[styles.agendaToggleText, myAgendaOnly && styles.agendaToggleTextActive]}>
          MY AGENDA
        </Text>
      </TouchableOpacity>

      {/* Session list */}
      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
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
          const isCampfire = item.category === 'campfire';

          // ── Campfire items: inline horizontal block ──
          if (isCampfire) {
            return (
              <CampfireBlock
                session={item}
                navigation={navigation}
              />
            );
          }

          // ── All other session types: standard card ──
          const bookmarkable = BOOKMARKABLE.includes(item.category);
          const saved = isSaved(item.id);

          return (
            <TouchableOpacity
              style={[styles.card, saved && styles.cardSaved]}
              onPress={() => navigation.navigate('SessionDetail', { session: item })}
              activeOpacity={0.8}
            >
              <View style={[styles.categoryDot, { backgroundColor: CATEGORY_COLORS[item.category] }]} />
              <View style={styles.cardContent}>
                <Text style={styles.categoryLabel}>{CATEGORY_LABELS[item.category]}</Text>
                <Text style={styles.sessionTitle}>{item.title}</Text>
                <View style={styles.metaRow}>
                  <Text style={styles.time}>
                    {item.startTime}{item.endTime ? ` – ${item.endTime}` : ''}
                  </Text>
                  <Text style={styles.dot}> · </Text>
                  <Text style={styles.location} numberOfLines={1}>📍 {item.location}</Text>
                </View>
                {item.leadName && <Text style={styles.lead}>👤 {item.leadName}</Text>}
              </View>
              {bookmarkable && loaded && (
                <TouchableOpacity
                  onPress={() => toggleSession(item.id)}
                  hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
                  style={styles.bookmarkBtn}
                >
                  <Ionicons
                    name={saved ? 'bookmark' : 'bookmark-outline'}
                    size={20}
                    color={saved ? colors.primary : '#CCC'}
                  />
                </TouchableOpacity>
              )}
              {!bookmarkable && <Text style={styles.chevron}>›</Text>}
            </TouchableOpacity>
          );
        }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  tabs: {
    flexDirection: 'row',
    margin: spacing.md,
    marginBottom: spacing.sm,
    backgroundColor: colors.white,
    borderRadius: radius.full,
    borderWidth: 2,
    borderColor: colors.primary,
    overflow: 'hidden',
  },
  tab: {
    flex: 1,
    paddingVertical: spacing.sm,
    alignItems: 'center',
    paddingHorizontal: spacing.xs,
  },
  tabActive: { backgroundColor: colors.primary },
  tabText: {
    color: colors.primary,
    fontWeight: fontWeight.bold,
    fontSize: 10,
    letterSpacing: 0.5,
    textAlign: 'center',
  },
  tabTextActive: { color: colors.white },
  agendaToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-end',
    marginRight: spacing.md,
    marginBottom: spacing.sm,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: radius.full,
    borderWidth: 2,
    borderColor: colors.primary,
    backgroundColor: colors.white,
    gap: spacing.xs,
  },
  agendaToggleActive: { backgroundColor: colors.primary },
  agendaToggleText: {
    color: colors.primary,
    fontSize: fontSize.xs,
    fontWeight: fontWeight.heavy,
    letterSpacing: 1,
  },
  agendaToggleTextActive: { color: colors.white },
  list: { paddingHorizontal: spacing.md, paddingBottom: spacing.xxl },

  // ── Standard session card ──
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: radius.md,
    padding: spacing.md,
    marginBottom: spacing.sm,
    borderWidth: 1,
    borderColor: colors.surface,
  },
  cardSaved: { borderColor: colors.primary, borderWidth: 2 },
  categoryDot: {
    width: 10,
    height: 10,
    borderRadius: radius.full,
    marginRight: spacing.sm,
    alignSelf: 'flex-start',
    marginTop: 4,
  },
  cardContent: { flex: 1 },
  categoryLabel: {
    color: colors.teal,
    fontSize: fontSize.xs,
    fontWeight: fontWeight.heavy,
    letterSpacing: 1,
    marginBottom: 2,
  },
  sessionTitle: {
    color: colors.textDark,
    fontSize: fontSize.md,
    fontWeight: fontWeight.bold,
    marginBottom: 4,
  },
  metaRow: { flexDirection: 'row', alignItems: 'center' },
  time: { color: colors.primary, fontSize: fontSize.xs, fontWeight: fontWeight.bold },
  dot: { color: '#ccc' },
  location: { color: '#888', fontSize: fontSize.xs, flex: 1 },
  lead: { color: colors.teal, fontSize: fontSize.xs, marginTop: 2 },
  bookmarkBtn: { paddingLeft: spacing.sm },
  chevron: { color: colors.primary, fontSize: 22, fontWeight: fontWeight.bold },

  // ── Campfire block ──
  campfireBlock: {
    backgroundColor: colors.white,
    borderRadius: radius.md,
    marginBottom: spacing.sm,
    borderWidth: 1,
    borderColor: colors.tealLight,
    overflow: 'hidden',
  },
  campfireBlockHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    padding: spacing.md,
    paddingBottom: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.tealLight,
  },
  campfireBlockLabel: {
    color: colors.teal,
    fontSize: fontSize.xs,
    fontWeight: fontWeight.heavy,
    letterSpacing: 1,
  },
  campfireBlockTime: {
    color: colors.textMuted,
    fontSize: fontSize.xs,
    marginTop: 1,
  },
  campfireCount: {
    color: colors.primary,
    fontSize: fontSize.xs,
    fontWeight: fontWeight.bold,
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

  // ── Individual campfire card (horizontal) ──
  campfireCard: {
    width: 200,
    backgroundColor: colors.background,
    borderRadius: radius.sm,
    borderWidth: 1,
    borderColor: colors.border,
    flexDirection: 'row',
    overflow: 'hidden',
  },
  campfireCardAccent: {
    width: 4,
    alignSelf: 'stretch',
  },
  campfireCardBody: {
    flex: 1,
    padding: spacing.sm,
    gap: 3,
  },
  campfireCategoryLabel: {
    fontSize: 9,
    fontWeight: fontWeight.heavy,
    letterSpacing: 0.5,
  },
  campfireCounselorName: {
    color: colors.textDark,
    fontSize: fontSize.sm,
    fontWeight: fontWeight.heavy,
  },
  campfireTopicText: {
    color: '#555',
    fontSize: 11,
    lineHeight: 15,
  },
  campfireLocRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  campfireLocText: {
    color: '#999',
    fontSize: 10,
    flex: 1,
  },
  campfireBookmarkBtn: {
    padding: spacing.xs,
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingTop: spacing.sm,
  },

  // ── Empty state ──
  empty: { alignItems: 'center', paddingTop: spacing.xxl, paddingHorizontal: spacing.xl },
  emptyIcon: { fontSize: 48, marginBottom: spacing.md },
  emptyText: { color: colors.primary, fontSize: fontSize.lg, fontWeight: fontWeight.heavy, textAlign: 'center' },
  emptySubtext: { color: '#888', fontSize: fontSize.sm, textAlign: 'center', marginTop: spacing.sm, lineHeight: 20 },
});
