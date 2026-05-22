import { SafeAreaView } from 'react-native-safe-area-context';
import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types';
import { useAgendaContext } from '../hooks/AgendaContext';
import { getReminderDate } from '../utils/sessionTime';
import { colors, spacing, fontSize, fontFamily, radius, shadow } from '../theme';
import { counselors } from '../data/counselors';
import HeadshotAvatar from '../components/HeadshotAvatar';

/** Categories where users can set a personal reminder */
const REMINDABLE = ['keynote', 'social', 'activity'];

type Props = NativeStackScreenProps<RootStackParamList, 'SessionDetail'>;

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

export default function SessionDetailScreen({ route, navigation }: Props) {
  const { session } = route.params;
  const { hasReminder, scheduleReminder, cancelReminder, loaded } = useAgendaContext();

  const [reminderLoading, setReminderLoading] = useState(false);

  const catColor = CATEGORY_COLORS[session.category] ?? colors.teal;
  const remindable = REMINDABLE.includes(session.category);
  const reminded = hasReminder(session.id);
  const canRemind = !!getReminderDate(session); // false if session is in the past

  const handleSetReminder = async () => {
    setReminderLoading(true);
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

  const handleCancelReminder = async () => {
    setReminderLoading(true);
    await cancelReminder(session.id);
    setReminderLoading(false);
  };

  return (
    <SafeAreaView style={styles.safe} edges={[]}>
      <ScrollView contentContainerStyle={styles.scroll}>

        {/* Header */}
        <View style={styles.headerBody}>
          <Text style={styles.title}>{session.title}</Text>
          <View style={[styles.categoryBadge, { backgroundColor: catColor }]}>
            <Text style={styles.categoryText}>
              {CATEGORY_LABELS[session.category] ?? session.category.toUpperCase()}
            </Text>
          </View>
          <Text style={styles.metaText}>
            🕐 {session.startTime}{session.endTime ? ` – ${session.endTime}` : ''}
          </Text>
          <Text style={styles.metaText}>📍 {session.location}</Text>
        </View>

        {/* Description */}
        {!!session.description && (
          <View style={[styles.descriptionCard, shadow.sm]}>
            <Text style={styles.descriptionLabel}>ABOUT THIS SESSION</Text>
            <Text style={styles.description}>{session.description}</Text>
          </View>
        )}

        {/* Agenda note + optional reminder CTA */}
        {loaded && (
          <View style={styles.ctaBlock}>
            {remindable && canRemind && (
              <View style={styles.actionRow}>
                <TouchableOpacity
                  style={styles.actionBtn}
                  onPress={reminded ? handleCancelReminder : handleSetReminder}
                  disabled={reminderLoading}
                  activeOpacity={0.7}
                >
                  <View style={[styles.actionIconWrap, reminded && styles.actionIconWrapActive]}>
                    <Ionicons
                      name={reminded ? 'notifications' : 'notifications-outline'}
                      size={26}
                      color={reminded ? colors.white : colors.primary}
                    />
                  </View>
                  <Text style={[styles.actionLabel, reminded && styles.actionLabelActive]}>
                    {reminderLoading ? '…' : reminded ? 'Reminder Set' : 'Set Reminder'}
                  </Text>
                </TouchableOpacity>
              </View>
            )}
            {session.day === 'day2' && (
              <Text style={styles.agendaNote}>
                ✓ This session is on every attendee's agenda
              </Text>
            )}
          </View>
        )}

        {/* Speaker / player cards */}
        {session.panelCounselorIds && session.panelCounselorIds.length > 0 && (() => {
          const speakers = session.panelCounselorIds
            .map((cid) => counselors.find((c) => c.id === cid))
            .filter((c): c is NonNullable<typeof c> => !!c);
          const isRacing = speakers.some((c) => c.category === 'Racing Louisville');
          const cardColor = isRacing ? colors.teal : colors.primary;
          const sectionLabel = isRacing ? 'MEET THE PLAYERS' : '🎤 FEATURED SPEAKER';
          return (
            <View style={styles.panelSection}>
              <Text style={styles.panelSectionLabel}>{sectionLabel}</Text>
              {speakers.map((speaker) => (
                <TouchableOpacity
                  key={speaker.id}
                  style={[styles.playerCard, { borderColor: cardColor, shadowColor: cardColor }]}
                  activeOpacity={0.8}
                  onPress={() =>
                    navigation.navigate('CounselorDetail', { counselor: speaker })
                  }
                >
                  <HeadshotAvatar
                    source={speaker.headshot}
                    name={speaker.name}
                    size={52}
                    borderColor={cardColor}
                    borderWidth={2}
                  />
                  <View style={{ flex: 1 }}>
                    <Text style={styles.playerName}>{speaker.name}</Text>
                    {speaker.instagram && (
                      <Text style={[styles.playerHandle, { color: cardColor }]}>{speaker.instagram}</Text>
                    )}
                  </View>
                  <Ionicons name="chevron-forward" size={20} color={cardColor} />
                </TouchableOpacity>
              ))}
            </View>
          );
        })()}

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
  scroll: { padding: spacing.md, paddingBottom: spacing.xxl, gap: spacing.md },
  headerBody: { paddingBottom: spacing.xs },
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
  title: {
    fontFamily: fontFamily.display,
    color: colors.textDark,
    fontSize: fontSize.xl,
    lineHeight: 36,
  },
  metaText: {
    fontFamily: fontFamily.bodyBold,
    color: colors.textMuted,
    fontSize: fontSize.md,
    marginBottom: spacing.xs,
  },
  descriptionCard: {
    backgroundColor: colors.white,
    borderRadius: 0,
    padding: spacing.md,
    ...shadow.sm,
  },
  descriptionLabel: {
    fontFamily: fontFamily.subheading,
    color: colors.textDark,
    fontSize: fontSize.sm,
    fontWeight: '900',
    letterSpacing: 1.5,
    marginBottom: spacing.sm,
  },
  description: { fontFamily: fontFamily.body, color: colors.textMuted, fontSize: fontSize.sm, lineHeight: 22 },
  ctaBlock: { gap: spacing.sm },
  agendaNote: {
    fontFamily: fontFamily.bodySemi,
    fontSize: fontSize.xs,
    color: colors.textMuted,
    textAlign: 'center',
    letterSpacing: 0.3,
  },
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
    backgroundColor: '#FDE8F0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionIconWrapActive: {
    backgroundColor: colors.primary,
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
  panelSection: {
    gap: spacing.sm,
  },
  panelSectionLabel: {
    fontFamily: fontFamily.subheading,
    color: colors.textDark,
    fontSize: fontSize.sm,
    fontWeight: '900',
    letterSpacing: 1.5,
    marginBottom: spacing.xs,
  },
  playerCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    backgroundColor: colors.white,
    borderWidth: 2,
    borderColor: colors.teal,
    padding: spacing.md,
    shadowColor: colors.teal,
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 4,
  },
  playerName: {
    fontFamily: fontFamily.display,
    color: colors.textDark,
    fontSize: fontSize.md,
    marginBottom: 2,
  },
  playerHandle: {
    fontFamily: fontFamily.bodySemi,
    color: colors.teal,
    fontSize: fontSize.sm,
  },
  campfireNote: {
    backgroundColor: colors.accent,
    borderRadius: 0,
    borderWidth: 2,
    borderColor: colors.teal,
    padding: spacing.md,
  },
  campfireNoteTitle: {
    fontFamily: fontFamily.bodyBold,
    color: colors.textDark,
    fontSize: fontSize.sm,
    marginBottom: spacing.xs,
  },
  campfireNoteBody: {
    fontFamily: fontFamily.body,
    color: '#555',
    fontSize: fontSize.sm,
    lineHeight: 20,
  },
});
