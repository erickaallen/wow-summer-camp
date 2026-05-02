import React from 'react';
import {
  View, Text, FlatList, TouchableOpacity,
  StyleSheet, SafeAreaView,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { ScheduleStackParamList } from '../types';
import { counselorSessions } from '../data/counselorSessions';
import { counselors } from '../data/counselors';
import { useAgendaContext } from '../hooks/AgendaContext';
import { colors, spacing, fontSize, fontWeight, radius } from '../theme';
import { Ionicons } from '@expo/vector-icons';

type Props = NativeStackScreenProps<ScheduleStackParamList, 'CampfireSlot'>;

const CATEGORY_COLORS: Record<string, string> = {
  'Movement': '#4DBFBF',
  'Mindset & Storytelling': '#9B59B6',
  'Craft & Connect': '#E67E22',
  'Business & Branding': colors.primary,
  'Leadership': '#27AE60',
};

export default function CampfireSlotScreen({ route, navigation }: Props) {
  const { slot } = route.params;
  const { isSaved } = useAgendaContext();

  const slotSessions = counselorSessions.filter(
    (cs) => cs.campfireSlotId === slot.id,
  );

  React.useLayoutEffect(() => {
    navigation.setOptions({
      title: `Campfire Session #${slot.slotNumber}`,
    });
  }, [navigation, slot]);

  return (
    <SafeAreaView style={styles.safe}>
      {/* Slot header */}
      <View style={styles.slotHeader}>
        <Text style={styles.slotTitle}>🔥 Campfire Session #{slot.slotNumber}</Text>
        <Text style={styles.slotTime}>{slot.startTime} – {slot.endTime}</Text>
        <Text style={styles.slotSubtitle}>Choose the session you'd like to attend</Text>
      </View>

      {slotSessions.length === 0 ? (
        /* ── Empty state: assignments not yet available ── */
        <View style={styles.empty}>
          <Text style={styles.emptyIcon}>🏕️</Text>
          <Text style={styles.emptyTitle}>Session Assignments Coming Soon</Text>
          <Text style={styles.emptyBody}>
            Counselor-to-session assignments and room locations will be posted here
            closer to camp day. Check back soon!
          </Text>
          <Text style={styles.emptyHint}>
            In the meantime, browse the Counselors tab to see all 27 session topics.
          </Text>
        </View>
      ) : (
        /* ── Session list ── */
        <FlatList
          data={slotSessions}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          renderItem={({ item }) => {
            const counselor = counselors.find((c) => c.id === item.counselorId);
            if (!counselor) return null;
            const saved = isSaved(item.id);
            const catColor = CATEGORY_COLORS[counselor.category] ?? colors.teal;

            return (
              <TouchableOpacity
                style={[styles.card, saved && styles.cardSaved]}
                onPress={() =>
                  navigation.navigate('CounselorSessionDetail', {
                    counselorSession: item,
                    slot,
                  })
                }
                activeOpacity={0.8}
              >
                <View style={[styles.categoryBar, { backgroundColor: catColor }]} />
                <View style={styles.cardContent}>
                  <Text style={styles.counselorName}>{counselor.name}</Text>
                  <Text style={styles.topic} numberOfLines={2}>{counselor.sessionTopic}</Text>
                  <View style={styles.metaRow}>
                    <Text style={[styles.category, { color: catColor }]}>
                      {counselor.category}
                    </Text>
                    <Text style={styles.dot}> · </Text>
                    <Text style={styles.location}>📍 {item.location}</Text>
                  </View>
                </View>
                {saved ? (
                  <Ionicons name="bookmark" size={20} color={colors.primary} style={styles.bookmark} />
                ) : (
                  <Ionicons name="chevron-forward" size={20} color={colors.teal} style={styles.bookmark} />
                )}
              </TouchableOpacity>
            );
          }}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  slotHeader: {
    backgroundColor: colors.accent,
    borderBottomWidth: 3,
    borderBottomColor: colors.teal,
    padding: spacing.lg,
    alignItems: 'center',
  },
  slotTitle: {
    color: colors.primary,
    fontSize: fontSize.lg,
    fontWeight: fontWeight.heavy,
  },
  slotTime: {
    color: colors.teal,
    fontSize: fontSize.sm,
    fontWeight: fontWeight.bold,
    marginTop: spacing.xs,
  },
  slotSubtitle: {
    color: colors.textDark,
    fontSize: fontSize.xs,
    marginTop: spacing.xs,
    fontWeight: fontWeight.semibold,
  },
  list: { padding: spacing.md, paddingBottom: spacing.xxl },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: radius.md,
    marginBottom: spacing.sm,
    borderWidth: 1,
    borderColor: colors.surface,
    overflow: 'hidden',
  },
  cardSaved: {
    borderColor: colors.primary,
    borderWidth: 2,
  },
  categoryBar: { width: 5, alignSelf: 'stretch' },
  cardContent: { flex: 1, padding: spacing.md },
  counselorName: {
    color: colors.textDark,
    fontSize: fontSize.md,
    fontWeight: fontWeight.heavy,
    marginBottom: 2,
  },
  topic: {
    color: '#555',
    fontSize: fontSize.sm,
    lineHeight: 18,
    marginBottom: spacing.xs,
  },
  metaRow: { flexDirection: 'row', alignItems: 'center' },
  category: { fontSize: fontSize.xs, fontWeight: fontWeight.bold },
  dot: { color: '#ccc' },
  location: { color: '#888', fontSize: fontSize.xs },
  bookmark: { paddingHorizontal: spacing.sm },
  empty: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.xl,
  },
  emptyIcon: { fontSize: 56, marginBottom: spacing.md },
  emptyTitle: {
    color: colors.primary,
    fontSize: fontSize.lg,
    fontWeight: fontWeight.heavy,
    textAlign: 'center',
    marginBottom: spacing.sm,
  },
  emptyBody: {
    color: '#555',
    fontSize: fontSize.sm,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: spacing.md,
  },
  emptyHint: {
    color: colors.teal,
    fontSize: fontSize.xs,
    textAlign: 'center',
    fontWeight: fontWeight.semibold,
  },
});
