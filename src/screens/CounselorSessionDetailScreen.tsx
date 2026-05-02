import React, { useState } from 'react';
import {
  View, Text, ScrollView, StyleSheet, SafeAreaView,
  TouchableOpacity, Alert, Linking,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { ScheduleStackParamList } from '../types';
import { counselors } from '../data/counselors';
import { useAgendaContext } from '../hooks/AgendaContext';
import { getReminderDateFromSlot } from '../utils/sessionTime';
import { colors, spacing, fontSize, fontWeight, radius } from '../theme';

type Props = NativeStackScreenProps<ScheduleStackParamList, 'CounselorSessionDetail'>;

const CATEGORY_COLORS: Record<string, string> = {
  'Movement': '#4DBFBF',
  'Mindset & Storytelling': '#9B59B6',
  'Craft & Connect': '#E67E22',
  'Business & Branding': colors.primary,
  'Leadership': '#27AE60',
};

export default function CounselorSessionDetailScreen({ route, navigation }: Props) {
  const { counselorSession, slot } = route.params;
  const counselor = counselors.find((c) => c.id === counselorSession.counselorId);

  const {
    isSaved, toggleSession,
    hasReminder, scheduleCounselorReminder, cancelReminder,
    loaded,
  } = useAgendaContext();

  const [reminderLoading, setReminderLoading] = useState(false);

  if (!counselor) return null;

  const catColor = CATEGORY_COLORS[counselor.category] ?? colors.teal;
  const saved = isSaved(counselorSession.id);
  const reminded = hasReminder(counselorSession.id);
  const canRemind = !!getReminderDateFromSlot(slot);

  React.useLayoutEffect(() => {
    navigation.setOptions({
      title: counselor.name,
      headerRight: loaded
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
  }, [navigation, counselor, loaded, saved]);

  const handleToggleSave = async () => {
    if (saved && reminded) await cancelReminder(counselorSession.id);
    toggleSession(counselorSession.id);
  };

  const handleSaveWithReminder = async () => {
    setReminderLoading(true);
    if (!saved) toggleSession(counselorSession.id);
    const result = await scheduleCounselorReminder(
      counselorSession.id,
      slot,
      counselor.name,
      counselor.sessionTopic,
    );
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
    if (!saved) toggleSession(counselorSession.id);
  };

  const handleCancelReminder = async () => {
    setReminderLoading(true);
    await cancelReminder(counselorSession.id);
    setReminderLoading(false);
  };

  const handleInstagram = () => {
    if (counselor.instagram) {
      const handle = counselor.instagram.replace('@', '');
      Linking.openURL(`https://instagram.com/${handle}`);
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.scroll}>

        {/* Counselor hero */}
        <View style={[styles.heroCard, { borderColor: catColor }]}>
          <View style={[styles.categoryBadge, { backgroundColor: catColor }]}>
            <Text style={styles.categoryText}>{counselor.category.toUpperCase()}</Text>
          </View>
          <Text style={styles.name}>{counselor.name}</Text>
          {counselor.instagram && (
            <TouchableOpacity onPress={handleInstagram}>
              <Text style={styles.instagram}>{counselor.instagram}</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Session info */}
        <View style={styles.sessionCard}>
          <Text style={styles.topicLabel}>🔥 SESSION TOPIC</Text>
          <Text style={styles.topic}>{counselor.sessionTopic}</Text>
          <View style={styles.metaRow}>
            <Ionicons name="time-outline" size={14} color={colors.teal} />
            <Text style={styles.metaText}> {slot.startTime} – {slot.endTime}</Text>
            <Text style={styles.metaDot}>  ·  </Text>
            <Ionicons name="location-outline" size={14} color={colors.teal} />
            <Text style={styles.metaText}> {counselorSession.location}</Text>
          </View>
        </View>

        {/* Agenda / Reminder CTAs */}
        {loaded && (
          <View style={styles.ctaBlock}>
            {!saved && (
              <>
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
                  style={styles.cancelBtn}
                  onPress={handleCancelReminder}
                  disabled={reminderLoading}
                >
                  <Text style={styles.cancelText}>
                    {reminderLoading ? 'Cancelling…' : 'Cancel Reminder'}
                  </Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        )}

        {/* Bio (shown when available) */}
        {counselor.bio ? (
          <View style={styles.bioCard}>
            <Text style={styles.bioLabel}>ABOUT</Text>
            <Text style={styles.bio}>{counselor.bio}</Text>
          </View>
        ) : null}

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  scroll: { padding: spacing.md },
  heroCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 3,
    padding: spacing.lg,
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  categoryBadge: {
    borderRadius: radius.full,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    marginBottom: spacing.sm,
  },
  categoryText: {
    color: colors.white,
    fontSize: fontSize.xs,
    fontWeight: fontWeight.heavy,
    letterSpacing: 2,
  },
  name: {
    color: colors.primary,
    fontSize: fontSize.xl,
    fontWeight: fontWeight.heavy,
    textAlign: 'center',
    marginBottom: spacing.xs,
  },
  instagram: {
    color: colors.teal,
    fontSize: fontSize.sm,
    fontWeight: fontWeight.bold,
    textDecorationLine: 'underline',
  },
  sessionCard: {
    backgroundColor: colors.accent,
    borderRadius: radius.md,
    borderWidth: 2,
    borderColor: colors.teal,
    padding: spacing.md,
    marginBottom: spacing.md,
  },
  topicLabel: {
    color: colors.teal,
    fontSize: fontSize.xs,
    fontWeight: fontWeight.heavy,
    letterSpacing: 1,
    marginBottom: spacing.xs,
  },
  topic: {
    color: colors.textDark,
    fontSize: fontSize.md,
    fontWeight: fontWeight.bold,
    lineHeight: 22,
    marginBottom: spacing.sm,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  metaText: { color: '#555', fontSize: fontSize.xs },
  metaDot: { color: '#ccc' },
  ctaBlock: { gap: spacing.sm, marginBottom: spacing.md },
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
  cancelBtn: { alignSelf: 'center' },
  cancelText: {
    color: '#888',
    fontSize: fontSize.xs,
    textDecorationLine: 'underline',
  },
  bioCard: {
    backgroundColor: colors.white,
    borderRadius: radius.md,
    padding: spacing.md,
  },
  bioLabel: {
    color: colors.teal,
    fontSize: fontSize.xs,
    fontWeight: fontWeight.heavy,
    letterSpacing: 2,
    marginBottom: spacing.sm,
  },
  bio: { color: '#444', fontSize: fontSize.md, lineHeight: 24 },
});
