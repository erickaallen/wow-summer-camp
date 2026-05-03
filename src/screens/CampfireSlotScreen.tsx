/**
 * CampfireSlotScreen — kept for reference but no longer in the navigation stack.
 * Campfire sessions are now shown inline in ScheduleScreen as horizontal scroll cards.
 *
 * If a standalone "all sessions in a rotation" view is needed in the future,
 * re-add this to ScheduleStack and add CampfireRotation: { rotation: CampfireRotation }
 * back to ScheduleStackParamList.
 */
import { SafeAreaView } from 'react-native-safe-area-context';
import React from 'react';
import {
  View, Text, FlatList, TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { counselorSessions } from '../data/counselorSessions';
import { campfireLocations } from '../data/campfireLocations';
import { counselors } from '../data/counselors';
import { useAgendaContext } from '../hooks/AgendaContext';
import { colors, spacing, fontSize, fontWeight, radius } from '../theme';
import { Ionicons } from '@expo/vector-icons';
import { CampfireRotation } from '../types';

const CATEGORY_COLORS: Record<string, string> = {
  'Movement': '#4DBFBF',
  'Mindset & Storytelling': '#9B59B6',
  'Craft & Connect': '#E67E22',
  'Business & Branding': colors.primary,
  'Leadership': '#27AE60',
};

// Standalone usage (not in nav stack — props passed directly if needed)
export default function CampfireSlotScreen({ rotation }: { rotation: CampfireRotation }) {
  const { isSaved } = useAgendaContext();

  const slotSessions = counselorSessions.filter(
    (cs) => cs.rotationId === rotation.id,
  );

  return (
    <SafeAreaView style={styles.safe} edges={[]}>
      <View style={styles.slotHeader}>
        <Text style={styles.slotTitle}>🔥 Rotation #{rotation.rotationNumber}</Text>
        <Text style={styles.slotTime}>{rotation.startTime} – {rotation.endTime}</Text>
        <Text style={styles.slotSubtitle}>Choose the session you'd like to attend</Text>
      </View>

      {slotSessions.length === 0 ? (
        <View style={styles.empty}>
          <Text style={styles.emptyIcon}>🏕️</Text>
          <Text style={styles.emptyTitle}>No Sessions This Rotation</Text>
          <Text style={styles.emptyBody}>
            No campfire sessions are scheduled during this time window.
          </Text>
        </View>
      ) : (
        <FlatList
          data={slotSessions}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          renderItem={({ item }) => {
            const counselor = counselors.find((c) => c.id === item.counselorId);
            const loc = campfireLocations.find((l) => l.id === item.locationId);
            if (!counselor) return null;
            const saved = isSaved(item.id);
            const catColor = CATEGORY_COLORS[counselor.category] ?? colors.teal;

            return (
              <View style={[styles.card, saved && styles.cardSaved]}>
                <View style={[styles.categoryBar, { backgroundColor: catColor }]} />
                <View style={styles.cardContent}>
                  <Text style={styles.counselorName}>{counselor.name}</Text>
                  <Text style={styles.topic} numberOfLines={2}>{counselor.sessionTopic}</Text>
                  <View style={styles.metaRow}>
                    <Text style={[styles.category, { color: catColor }]}>
                      {counselor.category}
                    </Text>
                    <Text style={styles.dot}> · </Text>
                    <Text style={styles.location}>📍 {loc?.name ?? '—'}</Text>
                  </View>
                </View>
                {saved ? (
                  <Ionicons name="bookmark" size={20} color={colors.primary} style={styles.bookmark} />
                ) : (
                  <Ionicons name="chevron-forward" size={20} color={colors.teal} style={styles.bookmark} />
                )}
              </View>
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
  cardSaved: { borderColor: colors.primary, borderWidth: 2 },
  categoryBar: { width: 5, alignSelf: 'stretch' },
  cardContent: { flex: 1, padding: spacing.md },
  counselorName: {
    color: colors.textDark,
    fontSize: fontSize.md,
    fontWeight: fontWeight.heavy,
    marginBottom: 2,
  },
  topic: { color: '#555', fontSize: fontSize.sm, lineHeight: 18, marginBottom: spacing.xs },
  metaRow: { flexDirection: 'row', alignItems: 'center' },
  category: { fontSize: fontSize.xs, fontWeight: fontWeight.bold },
  dot: { color: '#ccc' },
  location: { color: '#888', fontSize: fontSize.xs },
  bookmark: { paddingHorizontal: spacing.sm },
  empty: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: spacing.xl },
  emptyIcon: { fontSize: 56, marginBottom: spacing.md },
  emptyTitle: {
    color: colors.primary,
    fontSize: fontSize.lg,
    fontWeight: fontWeight.heavy,
    textAlign: 'center',
    marginBottom: spacing.sm,
  },
  emptyBody: { color: '#555', fontSize: fontSize.sm, textAlign: 'center', lineHeight: 22 },
});
