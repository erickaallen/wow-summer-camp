import { SafeAreaView } from 'react-native-safe-area-context';
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Linking,
} from 'react-native';

const BANNER = require('../../assets/images/wow-banner.png');
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { announcements } from '../data/announcements';
import { colors, spacing, fontSize, fontWeight, radius, shadow } from '../theme';

const EVENT_START = new Date('2026-05-26T09:00:00');
const HASHTAG = 'wowsummercamp';

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
  const days    = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours   = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((diff % (1000 * 60)) / 1000);
  return { days, hours, minutes, seconds };
}

function getDirections() {
  const query = encodeURIComponent('Progress Park, 4501 Progress Blvd, Louisville, KY 40218');
  const appleUrl = `maps:?q=${query}`;
  const googleUrl = `https://www.google.com/maps/search/?api=1&query=${query}`;
  Linking.canOpenURL(appleUrl).then((supported) =>
    Linking.openURL(supported ? appleUrl : googleUrl),
  );
}

function openInstagram() {
  const appUrl = `instagram://tag/${HASHTAG}`;
  const webUrl = `https://www.instagram.com/explore/tags/${HASHTAG}/`;
  Linking.canOpenURL(appUrl).then((supported) =>
    Linking.openURL(supported ? appUrl : webUrl),
  );
}

function getActiveAnnouncements() {
  const now = new Date();
  return announcements.filter((a) => {
    if (a.visibleFrom  && new Date(a.visibleFrom)  > now) return false;
    if (a.visibleUntil && new Date(a.visibleUntil) < now) return false;
    return true;
  });
}

export default function HomeScreen() {
  const countdown = useCountdown(EVENT_START);
  const activeAnnouncements = getActiveAnnouncements();

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>

        {/* ── Banner graphic ── */}
        <View style={styles.bannerSection}>
          <Image
            source={BANNER}
            style={styles.bannerImage}
            resizeMode="contain"
          />
        </View>
        {/* ── Venue card ── */}
        <View style={styles.venueCard}>
          <Text style={styles.venueEyebrow}>✦ TROOP 502 ✦</Text>
          <Text style={styles.venueName}>Progress Park</Text>
          <Text style={styles.venueDetail}>Louisville, Kentucky</Text>
          <View style={styles.venueDivider} />
          <Text style={styles.venueDate}>May 26 – 27, 2026</Text>
          <TouchableOpacity style={styles.directionsBtn} onPress={getDirections} activeOpacity={0.8}>
            <Ionicons name="navigate-outline" size={15} color={colors.teal} />
            <Text style={styles.directionsBtnText}>Get Directions</Text>
          </TouchableOpacity>
        </View>
        {/* ── Countdown card ── */}
        <View style={[styles.card, styles.countdownCard]}>
          {countdown ? (
            <>
              <Text style={styles.countdownLabel}>CAMP STARTS IN</Text>
              <View style={styles.countdownRow}>
                <CountUnit value={countdown.days}    label="DAYS" />
                <Text style={styles.colon}>:</Text>
                <CountUnit value={countdown.hours}   label="HRS" />
                <Text style={styles.colon}>:</Text>
                <CountUnit value={countdown.minutes} label="MIN" />
                <Text style={styles.colon}>:</Text>
                <CountUnit value={countdown.seconds} label="SEC" />
              </View>
            </>
          ) : (
            <Text style={styles.liveText}>🔥 CAMP IS LIVE!</Text>
          )}
        </View>

        {/* ── Announcements card ── */}
        {activeAnnouncements.length > 0 && (
          <View style={styles.card}>
            {activeAnnouncements.map((a, i) => (
              <View
                key={a.id}
                style={[
                  styles.announcementRow,
                  i < activeAnnouncements.length - 1 && styles.announcementDivider,
                ]}
              >
                <View style={styles.announcementAccent} />
                <View style={styles.announcementBody}>
                  <Text style={styles.announcementTitle}>{a.title}</Text>
                  <Text style={styles.announcementText}>{a.body}</Text>
                </View>
              </View>
            ))}
          </View>
        )}


        {/* ── Instagram live feed card ── */}
        <LinearGradient
          colors={['#F77737', '#C13584', '#833AB4']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.instagramBorder}
        >
          <View style={styles.instagramCard}>
            <View style={styles.cardHeader}>
              <Ionicons name="logo-instagram" size={14} color={colors.primary} />
              <Text style={styles.cardTitle}>LIVE FEED</Text>
            </View>
            <Text style={styles.instagramBody}>
              Share your camp moments in real time! Tag your photos and videos with our event hashtag and you'll be part of our shared live feed.
            </Text>
            <Text style={styles.instagramHashtag}>#WOWSummerCamp</Text>
            <TouchableOpacity onPress={openInstagram} activeOpacity={0.85} style={styles.instagramBtn}>
              <LinearGradient
                colors={['#F77737', '#C13584', '#833AB4']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.instagramBtnGradient}
              >
                <Ionicons name="logo-instagram" size={20} color={colors.white} />
                <Text style={styles.instagramBtnText}>View on Instagram</Text>
                <Ionicons name="open-outline" size={14} color={colors.white} />
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </LinearGradient>

      </ScrollView>
    </SafeAreaView>
  );
}

function CountUnit({ value, label }: { value: number; label: string }) {
  return (
    <View style={styles.countUnit}>
      <Text style={styles.countValue}>{String(value).padStart(2, '0')}</Text>
      <Text style={styles.countUnitLabel}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  safe:   { flex: 1, backgroundColor: colors.background },
  scroll: { padding: spacing.md, gap: spacing.md, paddingBottom: spacing.xxl },

  // ── Banner ──
  bannerSection: {
    alignItems: 'center',
    paddingTop: spacing.sm,
    paddingBottom: spacing.xs,
  },
  bannerImage: {
    width: '100%',
    height: 120,
  },
  heroDate: {
    color: colors.textMuted,
    fontSize: fontSize.xs,
    fontWeight: fontWeight.bold,
    letterSpacing: 1.5,
    marginTop: spacing.xs,
  },

  // ── Base card ──
  card: {
    backgroundColor: colors.white,
    borderRadius: radius.lg,
    padding: spacing.md,
    ...shadow.sm,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  sectionDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.primary,
  },
  cardTitle: {
    color: colors.textDark,
    fontSize: fontSize.xs,
    fontWeight: fontWeight.heavy,
    letterSpacing: 2,
  },

  // ── Countdown ──
  countdownCard: {
    alignItems: 'center',
    paddingVertical: spacing.lg,
  },
  countdownLabel: {
    color: colors.primary,
    fontSize: fontSize.xs,
    fontWeight: fontWeight.heavy,
    letterSpacing: 2,
    marginBottom: spacing.sm,
  },
  countdownRow: { flexDirection: 'row', alignItems: 'center' },
  countUnit:    { alignItems: 'center', minWidth: 56 },
  countValue: {
    color: colors.textDark,
    fontSize: fontSize.xl,
    fontWeight: fontWeight.heavy,
  },
  countUnitLabel: {
    color: colors.textMuted,
    fontSize: fontSize.xs,
    fontWeight: fontWeight.bold,
    letterSpacing: 1,
  },
  colon: {
    color: colors.primary,
    fontSize: fontSize.xl,
    fontWeight: fontWeight.heavy,
    marginBottom: spacing.md,
  },
  liveText: {
    color: colors.primary,
    fontSize: fontSize.xl,
    fontWeight: fontWeight.heavy,
    letterSpacing: 2,
  },

  // ── Announcements ──
  announcementRow: {
    flexDirection: 'row',
    overflow: 'hidden',
    borderRadius: radius.sm,
  },
  announcementDivider: {
    marginBottom: spacing.sm,
    paddingBottom: spacing.sm,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.border,
  },
  announcementAccent: { width: 4, backgroundColor: colors.primary, borderRadius: 2 },
  announcementBody:   { flex: 1, paddingLeft: spacing.sm },
  announcementTitle: {
    color: colors.textDark,
    fontSize: fontSize.md,
    fontWeight: fontWeight.bold,
    marginBottom: spacing.xs,
  },
  announcementText: {
    color: colors.textMuted,
    fontSize: fontSize.sm,
    lineHeight: 20,
  },

  // ── Venue ──
  venueCard: {
    backgroundColor: colors.white,
    borderRadius: radius.lg,
    padding: spacing.lg,
    alignItems: 'center',
    ...shadow.sm,
  },
  venueEyebrow: {
    color: colors.primary,
    fontSize: fontSize.xs,
    fontWeight: fontWeight.heavy,
    letterSpacing: 3,
    marginBottom: spacing.sm,
  },
  venueName: {
    color: colors.textDark,
    fontSize: fontSize.xl,
    fontWeight: fontWeight.heavy,
    textAlign: 'center',
  },
  venueDetail: {
    color: colors.textMuted,
    fontSize: fontSize.sm,
    fontWeight: fontWeight.semibold,
    textAlign: 'center',
    marginTop: 2,
  },
  venueDivider: {
    width: 32,
    height: 2,
    backgroundColor: colors.tealLight,
    borderRadius: 1,
    marginVertical: spacing.sm,
  },
  venueDate: {
    color: colors.teal,
    fontSize: fontSize.sm,
    fontWeight: fontWeight.heavy,
    letterSpacing: 1,
    textAlign: 'center',
  },
  directionsBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    marginTop: spacing.md,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.lg,
    borderRadius: radius.full,
    borderWidth: 2,
    borderColor: colors.teal,
  },
  directionsBtnText: {
    color: colors.teal,
    fontSize: fontSize.sm,
    fontWeight: fontWeight.heavy,
    letterSpacing: 0.5,
  },

  // ── Instagram ──
  instagramBorder: {
    borderRadius: radius.lg + 2,
    padding: 2,
    ...shadow.sm,
  },
  instagramCard: {
    backgroundColor: colors.white,
    borderRadius: radius.lg,
    padding: spacing.md,
    gap: spacing.sm,
  },
  instagramBody: {
    color: colors.textMuted,
    fontSize: fontSize.sm,
    lineHeight: 21,
  },
  instagramHashtag: {
    color: colors.primary,
    fontSize: fontSize.md,
    fontWeight: fontWeight.heavy,
    letterSpacing: 0.5,
  },
  instagramBtn: {
    borderRadius: radius.md,
    overflow: 'hidden',
    marginTop: spacing.xs,
  },
  instagramBtnGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
  },
  instagramBtnText: {
    color: colors.white,
    fontSize: fontSize.sm,
    fontWeight: fontWeight.heavy,
    flex: 1,
    textAlign: 'center',
  },
});
