import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Linking,
  ImageBackground,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import TieDyeGradient from '../components/TieDyeGradient';
import { announcements } from '../data/announcements';
import { colors, spacing, fontSize, fontWeight, radius, shadow } from '../theme';

const TIE_DYE_BG = require('../../assets/images/tiedye-bg.png');

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

function openInstagram() {
  const appUrl = `instagram://tag/${HASHTAG}`;
  const webUrl = `https://www.instagram.com/explore/tags/${HASHTAG}/`;
  Linking.canOpenURL(appUrl).then((supported) =>
    Linking.openURL(supported ? appUrl : webUrl),
  );
}

export default function HomeScreen() {
  const countdown = useCountdown(EVENT_START);

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>

        {/* ── Hero: real tie-dye texture ── */}
        <ImageBackground source={TIE_DYE_BG} style={styles.hero} resizeMode="cover">
          {/* Soft dark overlay so white text stays readable */}
          <View style={styles.heroOverlay} />

          <Text style={styles.troopTag}>✦ TROOP 502 ✦</Text>
          <Text style={styles.heroTitle}>w.o.w.{'\n'}Summer Camp</Text>
          <Text style={styles.heroDate}>MAY 26–27, 2026  ·  LOUISVILLE, KY</Text>

          {/* Countdown inside the hero */}
          {countdown ? (
            <View style={styles.countdownBox}>
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
            </View>
          ) : (
            <View style={styles.countdownBox}>
              <Text style={styles.liveText}>🔥 CAMP IS LIVE!</Text>
            </View>
          )}
        </ImageBackground>

        <View style={styles.body}>

          {/* ── Announcements ── */}
          {announcements.length > 0 && (
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <View style={styles.sectionDot} />
                <Text style={styles.sectionTitle}>ANNOUNCEMENTS</Text>
              </View>
              {announcements.map((a) => (
                <View key={a.id} style={[styles.card, shadow.sm]}>
                  <View style={styles.announcementAccent} />
                  <View style={styles.announcementBody}>
                    <Text style={styles.announcementTitle}>{a.title}</Text>
                    <Text style={styles.announcementText}>{a.body}</Text>
                  </View>
                </View>
              ))}
            </View>
          )}

          {/* ── Instagram CTA ── */}
          <TouchableOpacity style={styles.instagramBtn} onPress={openInstagram} activeOpacity={0.85}>
            <LinearGradient
              colors={['#F77737', '#C13584', '#833AB4']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.instagramGradient}
            >
              <Ionicons name="logo-instagram" size={18} color={colors.white} />
              <Text style={styles.instagramText}>#WOWSummerCamp on Instagram</Text>
              <Ionicons name="open-outline" size={14} color={colors.white} />
            </LinearGradient>
          </TouchableOpacity>

          {/* ── Venue card ── */}
          <TieDyeGradient mini style={[styles.venueCard, shadow.sm]}>
            <Text style={styles.venueEmoji}>🏕️</Text>
            <View>
              <Text style={styles.venueName}>Progress Park</Text>
              <Text style={styles.venueDetail}>Louisville, Kentucky</Text>
              <Text style={styles.venueDetail}>May 26–27, 2026</Text>
            </View>
          </TieDyeGradient>

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
  safe:   { flex: 1, backgroundColor: colors.background },
  scroll: { paddingBottom: spacing.xxl },

  // ── Hero ──
  hero: {
    paddingTop: spacing.xl + spacing.md,
    paddingBottom: spacing.xl,
    paddingHorizontal: spacing.lg,
    alignItems: 'center',
    minHeight: 320,
    overflow: 'hidden',
    justifyContent: 'center',
  },
  // Semi-transparent overlay so text stays crisp over the texture
  heroOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(61,38,69,0.18)',
  },
  troopTag: {
    color: colors.white,
    fontSize: fontSize.xs,
    fontWeight: fontWeight.heavy,
    letterSpacing: 3,
    marginBottom: spacing.sm,
    textShadowColor: 'rgba(61,38,69,0.4)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
  },
  heroTitle: {
    color: colors.white,
    fontSize: 42,
    fontWeight: fontWeight.heavy,
    textAlign: 'center',
    lineHeight: 46,
    textShadowColor: 'rgba(61,38,69,0.55)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 8,
  },
  heroDate: {
    color: colors.white,
    fontSize: fontSize.xs,
    fontWeight: fontWeight.bold,
    letterSpacing: 1.5,
    marginTop: spacing.sm,
    opacity: 0.9,
  },

  // ── Countdown ──
  countdownBox: {
    marginTop: spacing.lg,
    backgroundColor: 'rgba(255,255,255,0.3)',
    borderRadius: radius.lg,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xl,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.5)',
  },
  countdownLabel: {
    color: colors.white,
    fontSize: fontSize.xs,
    fontWeight: fontWeight.heavy,
    letterSpacing: 2,
    marginBottom: spacing.sm,
  },
  countdownRow: { flexDirection: 'row', alignItems: 'center' },
  countUnit:    { alignItems: 'center', minWidth: 52 },
  countValue: {
    color: colors.white,
    fontSize: fontSize.xl,
    fontWeight: fontWeight.heavy,
    textShadowColor: 'rgba(61,38,69,0.2)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
  },
  countLabel: {
    color: 'rgba(255,255,255,0.85)',
    fontSize: fontSize.xs,
    fontWeight: fontWeight.bold,
    letterSpacing: 1,
  },
  colon: {
    color: colors.white,
    fontSize: fontSize.xl,
    fontWeight: fontWeight.heavy,
    marginBottom: spacing.md,
    opacity: 0.8,
  },
  liveText: {
    color: colors.white,
    fontSize: fontSize.xl,
    fontWeight: fontWeight.heavy,
    letterSpacing: 2,
  },

  // ── Body ──
  body: {
    padding: spacing.md,
    gap: spacing.md,
  },
  section: { gap: spacing.sm },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.xs,
  },
  sectionDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.primary,
  },
  sectionTitle: {
    color: colors.textDark,
    fontSize: fontSize.xs,
    fontWeight: fontWeight.heavy,
    letterSpacing: 2,
  },

  // ── Cards ──
  card: {
    backgroundColor: colors.cardBg,
    borderRadius: radius.md,
    flexDirection: 'row',
    overflow: 'hidden',
  },
  announcementAccent: {
    width: 4,
    backgroundColor: colors.primary,
  },
  announcementBody: {
    flex: 1,
    padding: spacing.md,
  },
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

  // ── Instagram ──
  instagramBtn: {
    borderRadius: radius.full,
    overflow: 'hidden',
    ...shadow.sm,
  },
  instagramGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
  },
  instagramText: {
    color: colors.white,
    fontSize: fontSize.sm,
    fontWeight: fontWeight.heavy,
    flex: 1,
    textAlign: 'center',
  },

  // ── Venue ──
  venueCard: {
    borderRadius: radius.lg,
    padding: spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  venueEmoji: { fontSize: 36 },
  venueName: {
    color: colors.white,
    fontSize: fontSize.lg,
    fontWeight: fontWeight.heavy,
    textShadowColor: 'rgba(61,38,69,0.2)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  venueDetail: {
    color: 'rgba(255,255,255,0.9)',
    fontSize: fontSize.sm,
    fontWeight: fontWeight.semibold,
    marginTop: 2,
  },
});
