import { SafeAreaView } from 'react-native-safe-area-context';
import React, { useState } from 'react';
import {
  View, Text, ScrollView, StyleSheet,
  TouchableOpacity, Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import HeadshotAvatar from '../components/HeadshotAvatar';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { ScheduleStackParamList } from '../types';
import { counselors } from '../data/counselors';
import { campfireLocations } from '../data/campfireLocations';
import { useAgendaContext } from '../hooks/AgendaContext';
import { getReminderDateFromSlot } from '../utils/sessionTime';
import { colors, spacing, fontSize, fontFamily, radius, shadow } from '../theme';

type Props = NativeStackScreenProps<ScheduleStackParamList, 'CounselorSessionDetail'>;

const CATEGORY_COLORS: Record<string, string> = {
  'Movement': '#4DBFBF',
  'Mindset & Storytelling': '#9B59B6',
  'Craft & Connect': '#E67E22',
  'Business & Branding': colors.primary,
  'Leadership': '#27AE60',
};

export default function CounselorSessionDetailScreen({ route, navigation }: Props) {
  const { counselorSession, rotation } = route.params;
  const counselor = counselors.find((c) => c.id === counselorSession.counselorId);
  const location = campfireLocations.find((l) => l.id === counselorSession.locationId);

  const {
    isSaved, toggleSession, getSavedForRotation, replaceSession,
    hasReminder, scheduleCounselorReminder, cancelReminder,
    loaded,
  } = useAgendaContext();

  const [reminderLoading, setReminderLoading] = useState(false);

  if (!counselor) return null;

  const catColor = CATEGORY_COLORS[counselor.category] ?? colors.teal;
  const saved = isSaved(counselorSession.id);
  const reminded = hasReminder(counselorSession.id);
  const canRemind = !!getReminderDateFromSlot(rotation);

  React.useLayoutEffect(() => {
    navigation.setOptions({
      title: 'Campfire Session',
    });
  }, [navigation]);

  const handleToggleSave = async () => {
    if (saved && reminded) await cancelReminder(counselorSession.id);
    toggleSession(counselorSession.id);
  };

  /** Schedules the reminder (assumes session is already saved). */
  const doScheduleReminder = async () => {
    setReminderLoading(true);
    const result = await scheduleCounselorReminder(
      counselorSession.id,
      rotation,
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

  const handleSaveWithReminder = async () => {
    if (!saved) {
      const existingId = getSavedForRotation(counselorSession.rotationId);
      if (existingId && existingId !== counselorSession.id) {
        Alert.alert(
          'Time Slot Conflict',
          'You already have a campfire session saved for this rotation. Switch to this one instead?',
          [
            { text: 'Keep Current', style: 'cancel', onPress: () => setReminderLoading(false) },
            {
              text: 'Switch',
              onPress: async () => {
                await cancelReminder(existingId);
                replaceSession(existingId, counselorSession.id);
                await doScheduleReminder();
              },
            },
          ],
        );
        return;
      }
      toggleSession(counselorSession.id);
    }
    await doScheduleReminder();
  };

  const handleSaveOnly = () => {
    if (!saved) {
      const existingId = getSavedForRotation(counselorSession.rotationId);
      if (existingId && existingId !== counselorSession.id) {
        Alert.alert(
          'Time Slot Conflict',
          'You already have a campfire session saved for this rotation. Switch to this one instead?',
          [
            { text: 'Keep Current', style: 'cancel' },
            {
              text: 'Switch',
              onPress: () => replaceSession(existingId, counselorSession.id),
            },
          ],
        );
        return;
      }
      toggleSession(counselorSession.id);
    }
  };

  const handleCancelReminder = async () => {
    setReminderLoading(true);
    await cancelReminder(counselorSession.id);
    setReminderLoading(false);
  };

  return (
    <SafeAreaView style={styles.safe} edges={[]}>
      <ScrollView contentContainerStyle={styles.scroll}>

        {/* Topic title + meta */}
        <View style={styles.header}>
          <Text style={styles.topic}>{counselor.sessionTopic}</Text>
          <View style={[styles.categoryBadge, { backgroundColor: catColor }]}>
            <Text style={styles.categoryText}>{counselor.category.toUpperCase()}</Text>
          </View>
          <View style={styles.metaRow}>
            <Text style={styles.metaText}>
              🕐 {rotation.startTime} – {rotation.endTime}
            </Text>
          </View>
          <Text style={styles.metaText}>📍 {location?.name ?? 'Campfire'}</Text>
        </View>

        {/* Agenda / Reminder CTAs */}
        {loaded && (
          <View style={styles.ctaBlock}>
            <View style={styles.actionRow}>
              {/* Agenda toggle */}
              <TouchableOpacity
                style={styles.actionBtn}
                onPress={handleToggleSave}
                activeOpacity={0.7}
              >
                <View style={[styles.actionIconWrap, saved && styles.actionIconWrapActive]}>
                  <Ionicons
                    name={saved ? 'bookmark' : 'bookmark-outline'}
                    size={26}
                    color={saved ? colors.primary : colors.textMuted}
                  />
                </View>
                <Text style={[styles.actionLabel, saved && styles.actionLabelActive]}>
                  {saved ? 'Saved' : 'My Agenda'}
                </Text>
              </TouchableOpacity>

              {/* Reminder toggle */}
              {canRemind && (
                <TouchableOpacity
                  style={styles.actionBtn}
                  onPress={reminded ? handleCancelReminder : handleSaveWithReminder}
                  disabled={reminderLoading}
                  activeOpacity={0.7}
                >
                  <View style={[styles.actionIconWrap, reminded && styles.actionIconWrapActive]}>
                    <Ionicons
                      name={reminded ? 'notifications' : 'notifications-outline'}
                      size={26}
                      color={reminded ? colors.primary : colors.textMuted}
                    />
                  </View>
                  <Text style={[styles.actionLabel, reminded && styles.actionLabelActive]}>
                    {reminderLoading ? '…' : reminded ? 'Reminder Set' : 'Set Reminder'}
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        )}

        {/* About this session */}
        {counselor.sessionDescription ? (
          <View style={styles.aboutCard}>
            <Text style={styles.aboutLabel}>ABOUT THIS SESSION</Text>
            <Text style={styles.aboutText}>{counselor.sessionDescription}</Text>
          </View>
        ) : null}

        {/* Counselor card */}
        <TouchableOpacity
          style={[styles.counselorCard, {
            borderColor: catColor,
            shadowColor: catColor,
          }]}
          onPress={() =>
            navigation.getParent<any>()?.navigate('Counselors', {
              screen: 'CounselorDetail',
              params: { counselor },
            })
          }
          activeOpacity={0.8}
        >
          <Text style={[styles.counselorCardLabel, { color: catColor }]}>YOUR COUNSELOR</Text>
          <View style={styles.counselorCardRow}>
            <HeadshotAvatar
              source={counselor.headshot}
              name={counselor.name}
              size={52}
              borderColor={catColor}
              borderWidth={2}
            />
            <View style={{ flex: 1 }}>
              <Text style={styles.counselorName}>{counselor.name}</Text>
              {counselor.instagram ? (
                <Text style={[styles.learnMore, { color: catColor }]}>{counselor.instagram}</Text>
              ) : null}
            </View>
            <Ionicons name="chevron-forward" size={20} color={catColor} />
          </View>
        </TouchableOpacity>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  scroll: { padding: spacing.md, paddingBottom: spacing.xxl, gap: spacing.md },

  // ── Header ──
  header: { paddingBottom: spacing.xs },
  topic: {
    fontFamily: fontFamily.display,
    color: colors.textDark,
    fontSize: fontSize.xl,
    lineHeight: 36,
    marginBottom: spacing.xs,
  },
  categoryBadge: {
    alignSelf: 'flex-start',
    borderRadius: radius.full,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    marginBottom: spacing.sm,
    marginTop: spacing.xs,
  },
  categoryText: {
    fontFamily: fontFamily.subheading,
    color: colors.white,
    fontSize: fontSize.xs,
    letterSpacing: 2,
  },
  metaRow: { marginBottom: spacing.xs },
  metaText: {
    fontFamily: fontFamily.body,
    color: colors.textMuted,
    fontSize: fontSize.sm,
    marginBottom: spacing.xs,
  },

  // ── CTAs ──
  ctaBlock: {},
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: spacing.xl,
    paddingVertical: spacing.sm,
  },
  actionBtn: {
    alignItems: 'center',
    gap: spacing.xs,
    minWidth: 72,
  },
  actionIconWrap: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionIconWrapActive: {
    backgroundColor: '#FDE8F0',
  },
  actionLabel: {
    fontFamily: fontFamily.bodySemi,
    fontSize: fontSize.xs,
    color: colors.textMuted,
    textAlign: 'center',
  },
  actionLabelActive: {
    color: colors.primary,
  },

  // ── Counselor card ──
  counselorCard: {
    backgroundColor: colors.white,
    borderRadius: 0,
    borderWidth: 2,
    padding: spacing.md,
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 4,
  },
  counselorCardLabel: {
    fontFamily: fontFamily.subheading,
    fontSize: fontSize.xs,
    letterSpacing: 1.5,
    marginBottom: spacing.xs,
  },
  counselorCardRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  counselorName: {
    fontFamily: fontFamily.display,
    color: colors.textDark,
    fontSize: fontSize.md,
    marginBottom: 2,
  },
  learnMore: {
    fontFamily: fontFamily.bodySemi,
    fontSize: fontSize.sm,
  },

  // ── About ──
  aboutCard: {
    backgroundColor: colors.white,
    borderRadius: 0,
    padding: spacing.md,
    ...shadow.sm,
  },
  aboutLabel: {
    fontFamily: fontFamily.subheading,
    color: colors.textDark,
    fontSize: fontSize.sm,
    fontWeight: '900',
    letterSpacing: 1.5,
    marginBottom: spacing.sm,
  },
  aboutText: {
    fontFamily: fontFamily.body,
    color: colors.textMuted,
    fontSize: fontSize.sm,
    lineHeight: 22,
  },
});
