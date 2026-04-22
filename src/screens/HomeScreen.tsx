import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  SafeAreaView,
} from 'react-native';
import { colors, spacing, fontSize, fontWeight, radius } from '../theme';
import { announcements } from '../data/announcements';

const EVENT_START = new Date('2026-05-26T09:00:00');

function useCountdown(target: Date) {
  const [timeLeft, setTimeLeft] = useState(getTimeLeft(target));

  useEffect(() => {
    const interval = setInterval(() => setTimeLeft(getTimeLeft(target)), 1000);
    return () => clearInterval(interval);
  }, [target]);

  return timeLeft;
}

function getTimeLeft(target: Date) {
  const diff = target.getTime() - Date.now();
  if (diff <= 0) return null;
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((diff % (1000 * 60)) / 1000);
  return { days, hours, minutes, seconds };
}

export default function HomeScreen() {
  const countdown = useCountdown(EVENT_START);

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.tagline}>TROOP 502</Text>
          <Text style={styles.title}>w.o.w.{'\n'}Summer Camp</Text>
          <Text style={styles.subtitle}>MAY 26–27, 2026 · LOUISVILLE, KY</Text>
        </View>

        {countdown ? (
          <View style={styles.countdownCard}>
            <Text style={styles.countdownLabel}>CAMP STARTS IN</Text>
            <View style={styles.countdownRow}>
              <CountUnit value={countdown.days} label="DAYS" />
              <Text style={styles.colon}>:</Text>
              <CountUnit value={countdown.hours} label="HRS" />
              <Text style={styles.colon}>:</Text>
              <CountUnit value={countdown.minutes} label="MIN" />
              <Text style={styles.colon}>:</Text>
              <CountUnit value={countdown.seconds} label="SEC" />
            </View>
          </View>
        ) : (
          <View style={styles.countdownCard}>
            <Text style={styles.liveText}>CAMP IS LIVE!</Text>
          </View>
        )}

        <Text style={styles.sectionTitle}>ANNOUNCEMENTS</Text>
        {announcements.map((a) => (
          <View key={a.id} style={styles.announcementCard}>
            <Text style={styles.announcementTitle}>{a.title}</Text>
            <Text style={styles.announcementBody}>{a.body}</Text>
          </View>
        ))}

        <View style={styles.infoCard}>
          <Text style={styles.infoTitle}>PROGRESS PARK</Text>
          <Text style={styles.infoText}>Louisville, Kentucky</Text>
          <Text style={styles.infoText}>May 26–27, 2026</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function CountUnit({ value, label }: { value: number; label: string }) {
  return (
    <View style={styles.countUnit}>
      <Text style={styles.countValue}>{String(value).padStart(2, '0')}</Text>
      <Text style={styles.countLabel}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  scroll: { padding: spacing.md, paddingBottom: spacing.xxl },
  header: {
    alignItems: 'center',
    backgroundColor: colors.accent,
    borderRadius: radius.lg,
    borderWidth: 3,
    borderColor: colors.teal,
    padding: spacing.xl,
    marginBottom: spacing.md,
  },
  tagline: {
    color: colors.teal,
    fontSize: fontSize.sm,
    fontWeight: fontWeight.heavy,
    letterSpacing: 3,
    marginBottom: spacing.xs,
  },
  title: {
    color: colors.primary,
    fontSize: fontSize.xxl,
    fontWeight: fontWeight.heavy,
    textAlign: 'center',
    lineHeight: 40,
  },
  subtitle: {
    color: colors.primary,
    fontSize: fontSize.sm,
    fontWeight: fontWeight.bold,
    marginTop: spacing.sm,
    letterSpacing: 1,
  },
  countdownCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 3,
    borderColor: colors.primary,
    padding: spacing.lg,
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  countdownLabel: {
    color: colors.primary,
    fontSize: fontSize.sm,
    fontWeight: fontWeight.heavy,
    letterSpacing: 2,
    marginBottom: spacing.sm,
  },
  countdownRow: { flexDirection: 'row', alignItems: 'center' },
  countUnit: { alignItems: 'center', minWidth: 52 },
  countValue: {
    color: colors.primary,
    fontSize: fontSize.xl,
    fontWeight: fontWeight.heavy,
  },
  countLabel: {
    color: colors.teal,
    fontSize: fontSize.xs,
    fontWeight: fontWeight.bold,
    letterSpacing: 1,
  },
  colon: {
    color: colors.primary,
    fontSize: fontSize.xl,
    fontWeight: fontWeight.heavy,
    marginBottom: spacing.sm,
  },
  liveText: {
    color: colors.primary,
    fontSize: fontSize.xl,
    fontWeight: fontWeight.heavy,
    letterSpacing: 2,
  },
  sectionTitle: {
    color: colors.primary,
    fontSize: fontSize.md,
    fontWeight: fontWeight.heavy,
    letterSpacing: 2,
    marginBottom: spacing.sm,
    marginTop: spacing.sm,
  },
  announcementCard: {
    backgroundColor: colors.white,
    borderRadius: radius.md,
    borderLeftWidth: 4,
    borderLeftColor: colors.primary,
    padding: spacing.md,
    marginBottom: spacing.sm,
  },
  announcementTitle: {
    color: colors.textDark,
    fontSize: fontSize.md,
    fontWeight: fontWeight.bold,
    marginBottom: spacing.xs,
  },
  announcementBody: {
    color: '#555',
    fontSize: fontSize.sm,
    lineHeight: 20,
  },
  infoCard: {
    backgroundColor: colors.teal,
    borderRadius: radius.lg,
    padding: spacing.lg,
    alignItems: 'center',
    marginTop: spacing.sm,
  },
  infoTitle: {
    color: colors.white,
    fontSize: fontSize.lg,
    fontWeight: fontWeight.heavy,
    letterSpacing: 2,
  },
  infoText: {
    color: colors.white,
    fontSize: fontSize.sm,
    fontWeight: fontWeight.semibold,
    marginTop: spacing.xs,
  },
});
