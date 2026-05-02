import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { ScheduleStackParamList } from '../types';
import { useAgendaContext } from '../hooks/AgendaContext';
import { getReminderDate } from '../utils/sessionTime';
import { colors, spacing, fontSize, fontWeight, radius } from '../theme';

type Props = NativeStackScreenProps<ScheduleStackParamList, 'SessionDetail'>;

const CATEGORY_LABELS: Record<string, string> = {
  keynote: 'MAIN STAGE',
  campfire: '🔥 CAMPFIRE SESSION',
  break: 'BREAK',
  social: '✨ SOCIAL',
  activity: 'ACTIVITY',
  checkin: 'CHECK-IN',
};

const CATEGORY_COLORS: Record<string, string> = {
  keynote: colors.primary,
  campfire: colors.teal,
  break: '#95A5A6',
  social: '#F0A500',
  activity: '#E67E22',
  checkin: '#27AE60',
};

const BOOKMARKABLE = ['keynote', 'campfire', 'social', 'activity'];

export default function SessionDetailScreen({ route, navigation }: Props) {
  const { session } = route.params;
  const {
    isSaved, toggleSession,
    hasReminder, scheduleReminder, cancelReminder,
    loaded,
  } = useAgendaContext();

  const [reminderLoading, setReminderLoading] = useState(false);

  const catColor = CATEGORY_COLORS[session.category] ?? colors.teal;
  const bookmarkable = BOOKMARKABLE.includes(session.category);
  const saved = isSaved(session.id);
  const reminded = hasReminder(session.id);
  const canRemind = !!getReminderDate(session); // false if session is in the past

  // Sync header bookmark icon
  React.useLayoutEffect(() => {
    navigation.setOptions({
      title: session.title,
      headerRight: bookmarkable && loaded
        ? () => (
            <TouchableOpacity
              onPress={() => handleToggleSave()}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              style={{ marginRight: 4 }}
            >
              <Ionicons
                name={saved ? 'bookmark' : 'bookmark-outline'}
                size={24}
                color={colors.primary}
              />
            </TouchableOpacity>
          )
        : undefined,
    });
  }, [navigation, session, bookmarkable, loaded, saved]);

  const handleToggleSave = async () => {
    if (saved && reminded) {
      // Unsaving also cancels the reminder
      await cancelReminder(session.id);
    }
    toggleSession(session.id);
  };

  const handleSaveWithReminder = async () => {
    setReminderLoading(true);
    if (!saved) toggleSession(session.id);
    const result = await scheduleReminder(session);
    setReminderLoading(false);

    if (result === 'denied') {
      Alert.alert(
        'Notifications Blocked',
        'To receive session reminders, enable notifications for WOW Summer Camp in your device Settings.',
        [{ text: 'OK' }],
      );
    } else if (result === 'past') {
      Alert.alert('Already Started', 'This session has already begun — no reminder needed!');
    }
  };

  const handleSaveOnly = () => {
    if (!saved) toggleSession(session.id);
  };

  const handleCancelReminder = async () => {
    setReminderLoading(true);
    await cancelReminder(session.id);
    setReminderLoading(false);
  };

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.scroll}>

        {/* Header card */}
        <View style={[styles.header, { borderColor: catColor }]}>
          <View style={[styles.categoryBadge, { backgroundColor: catColor }]}>
            <Text style={styles.categoryText}>
              {CATEGORY_LABELS[session.category] ?? session.category.toUpperCase()}
            </Text>
          </View>
          <Text style={styles.title}>{session.title}</Text>
          <View style={styles.metaRow}>
            <Text style={styles.time}>
              {session.startTime}{session.endTime ? ` – ${session.endTime}` : ''}
            </Text>
            <Text style={styles.metaDot}> · </Text>
            <Text style={styles.location}>📍 {session.location}</Text>
          </View>
          {session.leadName && (
            <Text style={styles.lead}>👤 {session.leadName}</Text>
          )}
        </View>

        {/* Description */}
        <View style={styles.descriptionCard}>
          <Text style={styles.description}>{session.description}</Text>
        </View>

        {/* Agenda / Reminder CTAs */}
        {bookmarkable && loaded && (
          <View style={styles.ctaBlock}>
            {!saved && (
              <>
                {/* Primary: Save + Reminder */}
                {canRemind && (
                  <TouchableOpacity
                    style={styles.primaryBtn}
                    onPress={handleSaveWithReminder}
                    disabled={reminderLoading}
                    activeOpacity={0.8}
                  >
                    <Ionicons name="notifications" size={18} color={colors.white} />
                    <Text style={styles.primaryBtnText}>
                      {reminderLoading ? 'Setting Reminder…' : 'Add to Agenda + Set Reminder'}
                    </Text>
                  </TouchableOpacity>
                )}
                {/* Secondary: Save only */}
                <TouchableOpacity
                  style={styles.secondaryBtn}
                  onPress={handleSaveOnly}
                  activeOpacity={0.8}
                >
                  <Ionicons name="bookmark-outline" size={18} color={colors.primary} />
                  <Text style={styles.secondaryBtnText}>
                    {canRemind ? 'Add to Agenda without Reminder' : 'Add to Agenda'}
                  </Text>
                </TouchableOpacity>
              </>
            )}

            {saved && !reminded && (
              <>
                <View style={styles.savedBadge}>
                  <Ionicons name="bookmark" size={16} color={colors.white} />
                  <Text style={styles.savedBadgeText}>Saved to Your Agenda</Text>
                </View>
                {canRemind && (
                  <TouchableOpacity
                    style={styles.secondaryBtn}
                    onPress={handleSaveWithReminder}
                    disabled={reminderLoading}
                    activeOpacity={0.8}
                  >
                    <Ionicons name="notifications-outline" size={18} color={colors.primary} />
                    <Text style={styles.secondaryBtnText}>
                      {reminderLoading ? 'Setting…' : 'Add a Reminder'}
                    </Text>
                  </TouchableOpacity>
                )}
              </>
            )}

            {saved && reminded && (
              <View style={styles.reminderSetBlock}>
                <View style={styles.savedBadge}>
                  <Ionicons name="notifications" size={16} color={colors.white} />
                  <Text style={styles.savedBadgeText}>Saved · Reminder Set (10 min before)</Text>
                </View>
                <TouchableOpacity
                  style={styles.cancelReminderBtn}
                  onPress={handleCancelReminder}
                  disabled={reminderLoading}
                >
                  <Text style={styles.cancelReminderText}>
                    {reminderLoading ? 'Cancelling…' : 'Cancel Reminder'}
                  </Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        )}

        {/* Campfire explainer */}
        {session.category === 'campfire' && (
          <View style={styles.campfireNote}>
            <Text style={styles.campfireNoteTitle}>🔥 About Campfire Sessions</Text>
            <Text style={styles.campfireNoteBody}>
              Campfire Sessions are intimate, counselor-led roundtable discussions running
              simultaneously across multiple breakout areas. Choose the topic that speaks to you
              and join your campfire! Browse the Counselors tab to see all session topics.
            </Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  scroll: { padding: spacing.md },
  header: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 3,
    padding: spacing.lg,
    marginBottom: spacing.md,
  },
  categoryBadge: {
    alignSelf: 'flex-start',
    borderRadius: radius.full,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    marginBottom: spacing.sm,
  },
  categoryText: {
    color: colors.white,
    fontSize: fontSize.xs,
    fontWeight: fontWeight.heavy,
    letterSpacing: 1,
  },
  title: {
    color: colors.primary,
    fontSize: fontSize.xl,
    fontWeight: fontWeight.heavy,
    marginBottom: spacing.sm,
  },
  metaRow: { flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap' },
  time: { color: colors.textDark, fontSize: fontSize.sm, fontWeight: fontWeight.bold },
  metaDot: { color: '#ccc' },
  location: { color: '#888', fontSize: fontSize.sm },
  lead: { color: colors.teal, fontSize: fontSize.sm, fontWeight: fontWeight.bold, marginTop: spacing.xs },
  descriptionCard: {
    backgroundColor: colors.white,
    borderRadius: radius.md,
    padding: spacing.md,
    marginBottom: spacing.md,
  },
  description: { color: '#444', fontSize: fontSize.md, lineHeight: 24 },
  ctaBlock: {
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  primaryBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    backgroundColor: colors.primary,
    borderRadius: radius.full,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
  },
  primaryBtnText: {
    color: colors.white,
    fontSize: fontSize.sm,
    fontWeight: fontWeight.heavy,
    letterSpacing: 0.5,
  },
  secondaryBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    borderRadius: radius.full,
    borderWidth: 2,
    borderColor: colors.primary,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.lg,
    backgroundColor: colors.white,
  },
  secondaryBtnText: {
    color: colors.primary,
    fontSize: fontSize.sm,
    fontWeight: fontWeight.bold,
  },
  savedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    backgroundColor: '#27AE60',
    borderRadius: radius.full,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.lg,
  },
  savedBadgeText: {
    color: colors.white,
    fontSize: fontSize.sm,
    fontWeight: fontWeight.heavy,
  },
  reminderSetBlock: { gap: spacing.sm },
  cancelReminderBtn: { alignSelf: 'center' },
  cancelReminderText: {
    color: '#888',
    fontSize: fontSize.xs,
    textDecorationLine: 'underline',
  },
  campfireNote: {
    backgroundColor: colors.accent,
    borderRadius: radius.md,
    borderWidth: 2,
    borderColor: colors.teal,
    padding: spacing.md,
  },
  campfireNoteTitle: {
    color: colors.textDark,
    fontSize: fontSize.sm,
    fontWeight: fontWeight.heavy,
    marginBottom: spacing.xs,
  },
  campfireNoteBody: {
    color: '#555',
    fontSize: fontSize.sm,
    lineHeight: 20,
  },
});
