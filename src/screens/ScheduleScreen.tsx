import React, { useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { ScheduleStackParamList, Session, EventDay } from '../types';
import { sessions } from '../data/sessions';
import { campfireSlots } from '../data/campfireSlots';
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

// Sessions worth bookmarking (breaks and check-ins don't need saving)
const BOOKMARKABLE: Session['category'][] = ['keynote', 'campfire', 'social', 'activity'];

export default function ScheduleScreen({ navigation }: Props) {
  const [activeDay, setActiveDay] = useState<EventDay>('day1');
  const [myAgendaOnly, setMyAgendaOnly] = useState(false);
  const { isSaved, toggleSession, loaded } = useAgendaContext();

  const daySessions = sessions.filter((s) => s.day === activeDay);
  const filtered = myAgendaOnly
    ? daySessions.filter((s) => isSaved(s.id))
    : daySessions;

  return (
    <SafeAreaView style={styles.safe}>
      {/* Day tabs */}
      <View style={styles.tabs}>
        <TouchableOpacity
          style={[styles.tab, activeDay === 'day1' && styles.tabActive]}
          onPress={() => setActiveDay('day1')}
        >
          <Text style={[styles.tabText, activeDay === 'day1' && styles.tabTextActive]}>
            MAY 26 · WELCOME NIGHT
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeDay === 'day2' && styles.tabActive]}
          onPress={() => setActiveDay('day2')}
        >
          <Text style={[styles.tabText, activeDay === 'day2' && styles.tabTextActive]}>
            MAY 27 · MAIN DAY
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
          {myAgendaOnly ? 'MY AGENDA' : 'MY AGENDA'}
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
          const bookmarkable = BOOKMARKABLE.includes(item.category);
          const saved = isSaved(item.id);
          const isCampfire = item.category === 'campfire';

          const handlePress = () => {
            if (isCampfire && item.campfireSlotId) {
              const slot = campfireSlots.find((s) => s.id === item.campfireSlotId);
              if (slot) {
                navigation.navigate('CampfireSlot', { slot });
                return;
              }
            }
            navigation.navigate('SessionDetail', { session: item });
          };

          return (
            <TouchableOpacity
              style={[styles.card, saved && styles.cardSaved]}
              onPress={handlePress}
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
              {isCampfire && (
                <Text style={styles.chevron}>›</Text>
              )}
              {!isCampfire && bookmarkable && loaded && (
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
              {!isCampfire && !bookmarkable && <Text style={styles.chevron}>›</Text>}
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
  agendaToggleActive: {
    backgroundColor: colors.primary,
  },
  agendaToggleText: {
    color: colors.primary,
    fontSize: fontSize.xs,
    fontWeight: fontWeight.heavy,
    letterSpacing: 1,
  },
  agendaToggleTextActive: { color: colors.white },
  list: { paddingHorizontal: spacing.md, paddingBottom: spacing.xxl },
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
  cardSaved: {
    borderColor: colors.primary,
    borderWidth: 2,
  },
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
  empty: { alignItems: 'center', paddingTop: spacing.xxl, paddingHorizontal: spacing.xl },
  emptyIcon: { fontSize: 48, marginBottom: spacing.md },
  emptyText: { color: colors.primary, fontSize: fontSize.lg, fontWeight: fontWeight.heavy, textAlign: 'center' },
  emptySubtext: { color: '#888', fontSize: fontSize.sm, textAlign: 'center', marginTop: spacing.sm, lineHeight: 20 },
});
