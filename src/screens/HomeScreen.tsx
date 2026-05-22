import { SafeAreaView } from 'react-native-safe-area-context';
import React, { useCallback, useEffect, useState } from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Linking,
  Alert,
  Dimensions,
} from 'react-native';

const SCREEN_W = Dimensions.get('window').width;
const BANNER      = require('../../assets/images/wow-banner.png');
const HEART_HANDS = require('../../assets/images/home-screen-heart-hands.png');

import { Ionicons } from '@expo/vector-icons';
import Svg, { Path } from 'react-native-svg';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { RootTabParamList, Session } from '../types';
import { sessions } from '../data/sessions';
import { useProfile } from '../hooks/useProfile';
import { useChecklist } from '../hooks/useChecklist';
import { shareVCard } from '../utils/vcard';
import { getEventPhase, getNowNext, EventPhase, NowNext } from '../utils/eventPhase';
import { colors, spacing, fontSize, fontFamily, radius, shadow } from '../theme';
import { announcements } from '../data/announcements';

// ─── Constants ───────────────────────────────────────────────────────────────

// Countdown target: kickoff party on Day 1
const EVENT_START    = new Date('2026-05-26T18:00:00');
const HASHTAG        = 'wowsummercamp';
const DIRECTORY_URL  = 'https://www.womanownedwallet.com/products/wow-directory-posting?_pos=3&_sid=8de28d22e&_ss=r';
const FEEDBACK_URL   = 'https://forms.gle/PLzhVCZm6d1LA1bAA';

// ─── Set to false and rebuild once phase demo has been reviewed ───────────────
const SHOW_PHASE_DEMO = false;

// ─── Screenshot helper — set to a phase name to freeze the home screen in that
//     phase. Set back to null to restore live behavior. ─────────────────────────
const FORCE_PHASE: EventPhase | null = 'day2_morning'; // May 26, 9:00 PM – May 27, 8:00 AM

// ─── Demo sessions (used only in the demo section below) ─────────────────────
const DEMO = {
  checkin:   sessions.find(s => s.id === 's7')!,  // Check-In 8–9 AM
  opening:   sessions.find(s => s.id === 's8')!,  // Opening Ceremony 9:15–9:45 AM
  campfire1: sessions.find(s => s.id === 's9')!,  // Campfire #1 10–10:30 AM
  break1:    sessions.find(s => s.id === 's10')!, // Canteen Break 10:30–10:45 AM
  campfire2: sessions.find(s => s.id === 's11')!, // Campfire #2 10:45–11:15 AM
  panel:     sessions.find(s => s.id === 's23')!, // Player Panel 4:15–5:15 PM
  closing:   sessions.find(s => s.id === 's24')!, // Closing 5:30–6 PM
};

// ─── Helpers ─────────────────────────────────────────────────────────────────

function getTimeLeft(target: Date) {
  const diff = target.getTime() - Date.now();
  if (diff <= 0) return null;
  const days    = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours   = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((diff % (1000 * 60)) / 1000);
  return { days, hours, minutes, seconds };
}

function useCountdown(target: Date) {
  const [timeLeft, setTimeLeft] = useState(getTimeLeft(target));
  useEffect(() => {
    const interval = setInterval(() => setTimeLeft(getTimeLeft(target)), 1000);
    return () => clearInterval(interval);
  }, [target]);
  return timeLeft;
}

function getDirections() {
  const query = encodeURIComponent('Progress Park, 4501 Progress Blvd, Louisville, KY 40218');
  const appleUrl  = `maps:?q=${query}`;
  const googleUrl = `https://www.google.com/maps/search/?api=1&query=${query}`;
  Linking.canOpenURL(appleUrl).then(supported =>
    Linking.openURL(supported ? appleUrl : googleUrl),
  );
}

async function openInstagram() {
  const appUrl = `instagram://tag?name=${HASHTAG}`;
  const webUrl = `https://www.instagram.com/explore/tags/${HASHTAG}/`;
  try { await Linking.openURL(appUrl); } catch { Linking.openURL(webUrl); }
}
function getActiveAnnouncements() {
  const now = new Date();
  return announcements.filter(a => {
    if (a.visibleFrom  && new Date(a.visibleFrom)  > now) return false;
    if (a.visibleUntil && new Date(a.visibleUntil) < now) return false;
    return true;
  });
}

function sessionEmoji(s: Session): string {
  switch (s.category) {
    case 'campfire':  return '🔥';
    case 'keynote':   return '🎤';
    case 'checkin':   return '☕';
    case 'break':     return '☕';
    case 'social':    return '✨';
    default:          return '✦';
  }
}

// ─── Screen ───────────────────────────────────────────────────────────────────

export default function HomeScreen() {
  const navigation       = useNavigation<BottomTabNavigationProp<RootTabParamList>>();
  const rawCountdown     = useCountdown(EVENT_START);
  const countdown        = (FORCE_PHASE && FORCE_PHASE !== 'pre_event') ? null : rawCountdown;
  const { profile, reload, isComplete } = useProfile();
  const { checks, toggle } = useChecklist();
  const activeAnnouncements = getActiveAnnouncements();
  const [sharing, setSharing] = useState(false);

  // ── Phase state (updates every minute) ──────────────────────────────────────
  const [phase,   setPhase]   = useState<EventPhase>(() => FORCE_PHASE ?? getEventPhase());
  const [nowNext, setNowNext] = useState<NowNext>(() => getNowNext());

  useEffect(() => {
    if (FORCE_PHASE) return;
    const tick = () => {
      setPhase(getEventPhase());
      setNowNext(getNowNext());
    };
    const id = setInterval(tick, 60_000);
    return () => clearInterval(id);
  }, []);

  // Refresh profile + phase on focus (handles backgrounded-app case)
  useFocusEffect(
    useCallback(() => {
      reload();
      if (!FORCE_PHASE) {
        setPhase(getEventPhase());
        setNowNext(getNowNext());
      }
    }, [reload]),
  );

  const doneCount = [isComplete, checks.adventure, checks.instagram].filter(Boolean).length;

  // True from 5:00 PM on camp day through 6:00 PM one week later (June 3)
  const showFeedback = new Date() >= new Date(2026, 4, 27, 17, 0) && new Date() < new Date(2026, 5, 3, 18, 0);

  // True during day2_active while still in check-in / opening (before first campfire)
  const isEarlyDay2 = phase === 'day2_active' &&
    nowNext.current?.category !== 'campfire' &&
    nowNext.current?.category !== 'break';

  // Countdown card + prep checklist stay visible through all pre-campfire phases
  const showCountdownBlock = phase === 'pre_event' || phase === 'day1_evening' ||
    phase === 'day2_morning' || isEarlyDay2;

  const handleShare = async () => {
    if (!isComplete) {
      Alert.alert('Profile Not Set Up', 'Add your contact info in More → My Profile, then come back to share.');
      return;
    }
    setSharing(true);
    try { await shareVCard(profile!); } catch { Alert.alert('Error', 'Could not share contact. Please try again.'); }
    setSharing(false);
  };

  const goToSchedule = () => navigation.navigate('Schedule');

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>

        {/* ── Banner ── */}
        <View style={styles.bannerSection}>
          <Image source={BANNER} style={styles.bannerImage} resizeMode="contain" />
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

        {/* ══════════════════════════════════════════════════════
            Phase-specific content
            ══════════════════════════════════════════════════════ */}

        {/* Countdown card — pre-event timer → CAMP IS LIVE! during camp → gone after */}
        {phase !== 'post_event' && (
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
        )}

        {/* Prep checklist — visible until campfires are underway on day 2 */}
        {showCountdownBlock && (
          <>
            <View style={styles.card}>
              <View style={styles.checklistHeader}>
                <Text style={styles.checklistTitle}>🏕 PREP FOR CAMP</Text>
                <Text style={styles.checklistProgress}>{doneCount} / 3</Text>
              </View>
              <CheckItem
                checked={isComplete}
                label="Create your shareable profile"
                onNavigate={() => navigation.navigate('More', { screen: 'Profile', params: { fromHome: true } })}
                readonly
              />
              <CheckItem
                checked={checks.adventure}
                label="Plan your adventure"
                onToggle={() => toggle('adventure')}
                onNavigate={goToSchedule}
              />
              <CheckItem
                checked={checks.instagram}
                label="Say hey on Instagram"
                onToggle={() => toggle('instagram')}
                onNavigate={openInstagram}
              />
            </View>
          </>
        )}

        {/* Announcements */}
        {activeAnnouncements.length > 0 && (
          <View style={[styles.card, styles.announcementCard]}>
            <View style={styles.cardHeader}>
              <Ionicons name="megaphone-outline" size={14} color={colors.primary} />
              <Text style={styles.cardTitle}>ANNOUNCEMENTS</Text>
            </View>
            {activeAnnouncements.map((a, i) => (
              <View
                key={a.id}
                style={[styles.announcementRow, i < activeAnnouncements.length - 1 && styles.announcementDivider]}
              >
                <View style={styles.announcementBody}>
                  <Text style={styles.announcementTitle}>{a.title}</Text>
                  <Text style={styles.announcementText}>{a.body}</Text>
                </View>
              </View>
            ))}
          </View>
        )}

        {/* DAY 1 EVENING: tonight's lineup */}
        {phase === 'day1_evening' && <TonightLineupCard />}

        {/* DAY 2 MORNING: check-in reminder */}
        {phase === 'day2_morning' && <Day2MorningCard />}

        {/* DAY 2 ACTIVE: live now/next tracker */}
        {phase === 'day2_active' && (
          <NowNextCard
            current={nowNext.current}
            next={nowNext.next}
            onSchedule={goToSchedule}
          />
        )}

        {/* ══════════════════════════════════════════════════════
            Always-on cards
            ══════════════════════════════════════════════════════ */}

        {/* END-OF-CAMP: feedback survey CTA (visible 5 PM May 27 – 6 PM June 3) */}
        {showFeedback && <FeedbackCard />}

        {/* POST-EVENT: directory CTA (Amanda's #1 ask) */}
        {phase === 'post_event' && <DirectoryCard />}

        {/* Share My Contact — hidden post-event (no longer in person) */}
        {phase !== 'post_event' && <View style={[styles.card, styles.shareCard]}>
          <View style={styles.cardHeader}>
            <Ionicons name="people-outline" size={14} color={colors.teal} />
            <Text style={[styles.cardTitle, { color: colors.textDark }]}>STAY CONNECTED</Text>
          </View>
          <Text style={styles.shareTitle}>Swap Profile Details</Text>
          <Text style={styles.shareBlurb}>
            Meet a new business bestie? Share your contact info — your name, email, phone, and socials go straight to their phone.
          </Text>
          <TouchableOpacity
            style={[styles.shareSubtleBtn, (!isComplete || sharing) && styles.shareSubtleBtnDisabled]}
            onPress={handleShare}
            activeOpacity={0.8}
            disabled={sharing || !isComplete}
          >
            <Ionicons name="person-add-outline" size={16} color={isComplete ? colors.teal : colors.border} />
            <Text style={[styles.shareSubtleBtnText, !isComplete && styles.shareSubtleBtnTextDisabled]}>
              {sharing ? 'Opening Share Sheet…' : 'Share My Contact'}
            </Text>
          </TouchableOpacity>
          {!isComplete && (
            <Text style={styles.shareIncompleteHint}>
              Complete your profile in More → My Profile to unlock sharing.
            </Text>
          )}
        </View>}

        {/* Instagram */}
        <View style={[styles.card, styles.instagramBorder]}>
          <View style={styles.instagramCard}>
            <View style={styles.cardHeader}>
              <Ionicons name="logo-instagram" size={14} color={colors.primary} />
              <Text style={styles.cardTitle}>LIVE FEED</Text>
            </View>
            <Text style={styles.instagramTitle}>Show Us Your Best Camp Pics</Text>
            <Text style={styles.instagramBody}>
              Share your camp moments in real time! Tag your photos and videos with our event hashtag and you'll be part of our shared live feed.
            </Text>
            <Text style={styles.instagramHashtag}>#WOWSummerCamp</Text>
            <TouchableOpacity onPress={openInstagram} activeOpacity={0.8} style={styles.instagramBtn}>
              <Ionicons name="logo-instagram" size={16} color={colors.primary} />
              <Text style={styles.instagramBtnText}>View on Instagram</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* ══════════════════════════════════════════════════════
            PHASE DEMO — remove this entire block after review
            Set SHOW_PHASE_DEMO = false to hide without deleting
            ══════════════════════════════════════════════════════ */}
        {SHOW_PHASE_DEMO && (
          <>
            <DemoDivider label="DAY 1 · EVENING KICKOFF  (May 26, 6–9 PM)" />
            <View style={[styles.card, styles.countdownCard]}>
              <Text style={styles.liveText}>🔥 CAMP IS LIVE!</Text>
            </View>
            <DemoChecklist doneCount={doneCount} isComplete={isComplete} adventure={checks.adventure} instagram={checks.instagram} onToggleAdventure={() => toggle('adventure')} onToggleInstagram={() => toggle('instagram')} onSchedule={goToSchedule} onProfile={() => navigation.navigate('More', { screen: 'Profile', params: { fromHome: true } })} />
            <TonightLineupCard />

            <DemoDivider label="DAY 2 · MORNING  (May 26 9 PM – May 27 8 AM)" />
            <View style={[styles.card, styles.countdownCard]}>
              <Text style={styles.liveText}>🔥 CAMP IS LIVE!</Text>
            </View>
            <DemoChecklist doneCount={doneCount} isComplete={isComplete} adventure={checks.adventure} instagram={checks.instagram} onToggleAdventure={() => toggle('adventure')} onToggleInstagram={() => toggle('instagram')} onSchedule={goToSchedule} onProfile={() => navigation.navigate('More', { screen: 'Profile', params: { fromHome: true } })} />
            <Day2MorningCard />

            <DemoDivider label="DAY 2 · CHECK-IN  (8:00–9:00 AM)" />
            <View style={[styles.card, styles.countdownCard]}>
              <Text style={styles.liveText}>🔥 CAMP IS LIVE!</Text>
            </View>
            <DemoChecklist doneCount={doneCount} isComplete={isComplete} adventure={checks.adventure} instagram={checks.instagram} onToggleAdventure={() => toggle('adventure')} onToggleInstagram={() => toggle('instagram')} onSchedule={goToSchedule} onProfile={() => navigation.navigate('More', { screen: 'Profile', params: { fromHome: true } })} />
            <NowNextCard current={DEMO.checkin} next={DEMO.opening} onSchedule={goToSchedule} />

            <DemoDivider label="DAY 2 · CAMPFIRE IN PROGRESS  (e.g. 10:00–10:30 AM)" />
            <NowNextCard current={DEMO.campfire1} next={DEMO.break1} onSchedule={goToSchedule} />

            <DemoDivider label="DAY 2 · CANTEEN BREAK  (e.g. 10:30–10:45 AM)" />
            <NowNextCard current={DEMO.break1} next={DEMO.campfire2} onSchedule={goToSchedule} />

            <DemoDivider label="DAY 2 · PLAYER PANEL  (4:15–5:15 PM)" />
            <NowNextCard current={DEMO.panel} next={DEMO.closing} onSchedule={goToSchedule} />

            <DemoDivider label="DAY 2 · CLOSING CEREMONIES  (5:30–6:00 PM)" />
            <NowNextCard current={DEMO.closing} next={null} onSchedule={goToSchedule} />

            <DemoDivider label="POST-EVENT  (after May 27, 6 PM)" />
            <DirectoryCard />
          </>
        )}

        {/* ── Bottom illustration ── */}
        <Image source={HEART_HANDS} style={styles.heartHandsImage} resizeMode="cover" />

      </ScrollView>
    </SafeAreaView>
  );
}

// ─── Card components ──────────────────────────────────────────────────────────

function TonightLineupCard() {
  const lineup = [
    { time: '6:00 PM', label: 'Welcome to Camp' },
    { time: '6:30 PM', label: 'How to Build a Fruitful Community Speech' },
  ];
  return (
    <View style={[styles.card, styles.tonightCard]}>
      <View style={styles.cardHeader}>
        <Ionicons name="moon-outline" size={14} color={colors.primary} />
        <Text style={styles.cardTitle}>TONIGHT AT CAMP</Text>
      </View>
      {lineup.map(({ time, label }) => (
        <View key={time} style={styles.tonightRow}>
          <Text style={styles.tonightTime}>{time}</Text>
          <Text style={styles.tonightLabel}>{label}</Text>
        </View>
      ))}
    </View>
  );
}

function Day2MorningCard() {
  return (
    <View style={[styles.card, styles.tealAccentCard]}>
      <View style={styles.cardHeader}>
        <Ionicons name="sunny-outline" size={14} color={colors.primary} />
        <Text style={[styles.cardTitle, { color: colors.textDark }]}>MAIN CAMP DAY</Text>
      </View>
      <Text style={styles.day2Title}>Check-in Opens at 8 AM</Text>
      <Text style={styles.day2Body}>
        Coffee, breakfast, and badge pickup at the Mess Hall. Today is going to be so much fun!
      </Text>
    </View>
  );
}

function NowNextCard({
  current,
  next,
  onSchedule,
}: {
  current: Session | null;
  next:    Session | null;
  onSchedule: () => void;
}) {
  return (
    <View style={[styles.card, styles.nowNextCard]}>
      <View style={styles.cardHeader}>
        <Ionicons name="time-outline" size={14} color={colors.primary} />
        <Text style={[styles.cardTitle, { color: colors.primary }]}>HAPPENING NOW</Text>
      </View>

      {/* Current session row */}
      <View style={styles.nowRow}>
        <View style={styles.nowBadge}>
          <Text style={styles.nowBadgeText}>NOW</Text>
        </View>
        {current ? (
          <View style={{ flex: 1 }}>
            <Text style={styles.nowSessionTitle}>{sessionEmoji(current)} {current.title}</Text>
            <Text style={styles.nowSessionMeta}>
              {current.startTime}{current.endTime ? ` – ${current.endTime}` : ''} · {current.location}
            </Text>
          </View>
        ) : (
          <Text style={styles.nowIdleText}>Heads up — something's coming up next!</Text>
        )}
      </View>

      {/* Next session row */}
      {next && (
        <View style={styles.nextRow}>
          <Text style={styles.nextLabel}>UP NEXT</Text>
          <Text style={styles.nextText}>
            {sessionEmoji(next)} {next.title} · {next.startTime}
          </Text>
        </View>
      )}

      <TouchableOpacity style={styles.scheduleLink} onPress={onSchedule} activeOpacity={0.7}>
        <Text style={styles.scheduleLinkText}>Full Schedule</Text>
        <Ionicons name="chevron-forward" size={14} color={colors.primary} />
      </TouchableOpacity>
    </View>
  );
}

function DirectoryCard() {
  return (
    <View style={[styles.card, styles.directoryCard]}>
      <Text style={styles.directoryThankYou}>
        What an incredible two days. Thank you for being here. 💖
      </Text>
      <View style={styles.cardHeader}>
        <Ionicons name="briefcase-outline" size={14} color={colors.primary} />
        <Text style={styles.cardTitle}>KEEP YOUR BUSINESS GROWING</Text>
      </View>
      <Text style={styles.directoryBody}>
        Join the W.O.W. Women-Owned Business Directory and let Amanda and the entire W.O.W. community help promote what you've built — all year long.
      </Text>
      <TouchableOpacity
        style={styles.directoryBtn}
        onPress={() => Linking.openURL(DIRECTORY_URL)}
        activeOpacity={0.8}
      >
        <Ionicons name="rocket-outline" size={16} color={colors.white} />
        <Text style={styles.directoryBtnText}>Join the W.O.W. Directory</Text>
      </TouchableOpacity>
    </View>
  );
}

function FeedbackCard() {
  return (
    <View style={[styles.card, styles.feedbackCard]}>
      <View style={styles.cardHeader}>
        <Ionicons name="star-outline" size={14} color={colors.primary} />
        <Text style={[styles.cardTitle, { color: colors.primary }]}>SHARE YOUR EXPERIENCE</Text>
      </View>
      <Text style={styles.feedbackBody}>
        Camp is almost a wrap! Before you go, take 2 minutes to fill out our feedback survey. Your input shapes what W.O.W. looks like next year — we read every single response.
      </Text>
      <TouchableOpacity
        style={styles.feedbackBtn}
        onPress={() => Linking.openURL(FEEDBACK_URL)}
        activeOpacity={0.8}
      >
        <Ionicons name="clipboard-outline" size={16} color={colors.white} />
        <Text style={styles.feedbackBtnText}>Take the Survey</Text>
      </TouchableOpacity>
    </View>
  );
}

function DemoChecklist({ doneCount, isComplete, adventure, instagram, onToggleAdventure, onToggleInstagram, onSchedule, onProfile }: {
  doneCount: number; isComplete: boolean; adventure: boolean; instagram: boolean;
  onToggleAdventure: () => void; onToggleInstagram: () => void;
  onSchedule: () => void; onProfile: () => void;
}) {
  return (
    <View style={styles.card}>
      <View style={styles.checklistHeader}>
        <Text style={styles.checklistTitle}>🏕 PREP FOR CAMP</Text>
        <Text style={styles.checklistProgress}>{doneCount} / 3</Text>
      </View>
      <CheckItem checked={isComplete} label="Create your profile" onNavigate={onProfile} readonly />
      <CheckItem checked={adventure} label="Plan your adventure" onToggle={onToggleAdventure} onNavigate={onSchedule} />
      <CheckItem checked={instagram} label="Say hey on Instagram" onToggle={onToggleInstagram} onNavigate={openInstagram} />
    </View>
  );
}

function DemoDivider({ label }: { label: string }) {
  return (
    <View style={styles.demoDividerWrap}>
      <View style={styles.demoDividerLine} />
      <Text style={styles.demoDividerText}>DEMO · {label}</Text>
      <View style={styles.demoDividerLine} />
    </View>
  );
}

// ─── Existing sub-components ──────────────────────────────────────────────────

function CheckItem({
  checked,
  label,
  onToggle,
  onNavigate,
  readonly = false,
}: {
  checked: boolean;
  label: string;
  onToggle?: () => void;
  onNavigate: () => void;
  readonly?: boolean;
}) {
  return (
    <View style={styles.checkRow}>
      <TouchableOpacity
        onPress={onToggle}
        activeOpacity={0.7}
        disabled={readonly || !onToggle}
      >
        <View style={[styles.checkBox, checked && styles.checkBoxChecked]}>
          {checked && (
            <Svg width="20" height="20" viewBox="0 0 20 20" style={{ position: 'absolute' }}>
              <Path d="M 3 10 Q 7 15 9 17 Q 13 8 18 3" stroke={colors.primary} strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" fill="none" />
            </Svg>
          )}
        </View>
      </TouchableOpacity>
      <TouchableOpacity style={styles.checkToggle} onPress={onNavigate} activeOpacity={0.7}>
        <Text style={[styles.checkLabel, checked && styles.checkLabelDone]}>{label}</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={onNavigate} activeOpacity={0.7} hitSlop={8}>
        <Ionicons name="chevron-forward" size={20} color={colors.textDark} />
      </TouchableOpacity>
    </View>
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

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  safe:   { flex: 1, backgroundColor: colors.background },
  scroll: { padding: spacing.md, gap: spacing.md, paddingBottom: 0 },

  // ── Banner ──
  bannerSection: { alignItems: 'center', paddingTop: spacing.sm, paddingBottom: spacing.xs },
  bannerImage:   { width: '100%', height: 120 },

  // ── Base card ──
  card: {
    backgroundColor: colors.white,
    borderRadius: 0,
    padding: spacing.md,
    ...shadow.sm,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.md,
    color: colors.textDark,
  },
  cardTitle: {
    fontFamily: fontFamily.subheading,
    color: colors.textDark,
    fontSize: fontSize.xs,
    letterSpacing: 2,
  },

  // ── Venue ──
  venueCard: {
    backgroundColor: colors.white,
    borderRadius: 0,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    alignItems: 'center',
    ...shadow.sm,
  },
  venueEyebrow: {
    fontFamily: fontFamily.subheading,
    color: colors.primary,
    fontSize: fontSize.xs,
    letterSpacing: 3,
    marginBottom: 2,
  },
  venueName:   { fontFamily: fontFamily.display, color: colors.textDark, fontSize: fontSize.md, textAlign: 'center' },
  venueDetail: { fontFamily: fontFamily.body, color: colors.textMuted, fontSize: fontSize.sm, textAlign: 'center', marginTop: 1 },
  venueDivider: { width: 24, height: 2, backgroundColor: colors.tealLight, borderRadius: 1, marginVertical: spacing.xs },
  venueDate: {
    fontFamily: fontFamily.subheading,
    color: colors.teal,
    fontSize: fontSize.xs,
    letterSpacing: 1,
    textAlign: 'center',
  },
  directionsBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    marginTop: spacing.sm,
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.md,
    borderRadius: radius.full,
    borderWidth: 1.5,
    borderColor: colors.teal,
  },
  directionsBtnText: {
    fontFamily: fontFamily.bodySemi,
    color: colors.teal,
    fontSize: fontSize.xs,
    letterSpacing: 0.5,
  },

  // ── Countdown ──
  countdownCard:  { alignItems: 'center', paddingVertical: spacing.lg },
  countdownLabel: { fontFamily: fontFamily.subheading, color: colors.primary, fontSize: fontSize.xs, letterSpacing: 2, marginBottom: spacing.sm },
  countdownRow:   { flexDirection: 'row', alignItems: 'center' },
  countUnit:      { alignItems: 'center', minWidth: 56 },
  countValue:     { fontFamily: fontFamily.display, color: colors.textDark, fontSize: fontSize.xl },
  countUnitLabel: { fontFamily: fontFamily.subheading, color: colors.textDark, fontSize: fontSize.xs, letterSpacing: 1 },
  colon:          { fontFamily: fontFamily.display, color: colors.primary, fontSize: fontSize.xl, marginBottom: spacing.md },
  liveText:       { fontFamily: fontFamily.display, color: colors.primary, fontSize: fontSize.xl, letterSpacing: 2 },
  liveSubtext:    { fontFamily: fontFamily.body, color: colors.textDark, fontSize: fontSize.sm, textAlign: 'center', marginTop: spacing.xs },

  // ── Prep checklist ──
  checklistHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: spacing.sm },
  checklistTitle:  { fontFamily: fontFamily.subheading, color: colors.textDark, fontSize: fontSize.sm, letterSpacing: 1.5 },
  checklistProgress: { fontFamily: fontFamily.bodyBold, color: colors.textDark, fontSize: fontSize.sm },
  checkRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.sm,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.border,
  },
  checkToggle:      { flex: 1, flexDirection: 'row', alignItems: 'center', gap: spacing.sm, paddingRight: spacing.sm, paddingLeft: spacing.sm },
  checkLabel:       { flex: 1, fontFamily: fontFamily.display, color: colors.textDark, fontSize: fontSize.sm, lineHeight: 20 },
  checkLabelDone:   { color: colors.textMuted, textDecorationLine: 'line-through' },
  checkBox: {
    width: 26,
    height: 26,
    borderRadius: 4,
    borderWidth: 2.5,
    borderColor: colors.textDark,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.white,
  },
  checkBoxChecked: { borderColor: colors.textDark },

  // ── Tonight lineup (Day 1 evening) ──
  tonightCard: {
    borderWidth: 2,
    borderColor: colors.primary,
    shadowColor: colors.primary,
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 4,
  },
  tonightRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    paddingVertical: spacing.xs,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.border,
  },
  tonightTime:  { fontFamily: fontFamily.bodySemi, color: colors.primary, fontSize: fontSize.sm, width: 64 },
  tonightLabel: { flex: 1, fontFamily: fontFamily.body, color: colors.textDark, fontSize: fontSize.sm, lineHeight: 20 },

  // ── Day 2 morning card ──
  tealAccentCard: {
    borderWidth: 2,
    borderColor: colors.primary,
    shadowColor: colors.primary,
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 4,
  },
  day2Title: { fontFamily: fontFamily.display, color: colors.textDark, fontSize: fontSize.md, marginBottom: spacing.xs },
  day2Body:  { fontFamily: fontFamily.body, color: colors.textDark, fontSize: fontSize.sm, lineHeight: 20, marginBottom: spacing.md },

  // ── Now/Next card ──
  nowNextCard: {
    borderWidth: 2,
    borderColor: colors.primary,
    shadowColor: colors.primary,
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 4,
  },
  nowRow: { flexDirection: 'row', alignItems: 'flex-start', gap: spacing.sm, marginBottom: spacing.sm },
  nowBadge: {
    backgroundColor: colors.primary,
    borderRadius: radius.full,
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    alignSelf: 'flex-start',
    marginTop: 2,
  },
  nowBadgeText:    { fontFamily: fontFamily.subheading, color: colors.white, fontSize: 10, letterSpacing: 1 },
  nowSessionTitle: { fontFamily: fontFamily.display, color: colors.textDark, fontSize: fontSize.md },
  nowSessionMeta:  { fontFamily: fontFamily.body, color: colors.textDark, fontSize: fontSize.sm, marginTop: 2 },
  nowIdleText:     { flex: 1, fontFamily: fontFamily.body, color: colors.textDark, fontSize: fontSize.sm, fontStyle: 'italic' },
  nextRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.border,
    paddingTop: spacing.sm,
    marginTop: spacing.xs,
  },
  nextLabel: { fontFamily: fontFamily.subheading, color: colors.primary, fontSize: 10, letterSpacing: 1 },
  nextText:  { flex: 1, fontFamily: fontFamily.body, color: colors.textDark, fontSize: fontSize.sm },
  scheduleLink: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
    alignSelf: 'flex-end',
    marginTop: spacing.sm,
    paddingTop: spacing.xs,
  },
  scheduleLinkText: { fontFamily: fontFamily.bodySemi, color: colors.primary, fontSize: fontSize.xs },

  // ── Post-event Directory card ──
  directoryCard: {
    borderWidth: 2,
    borderColor: colors.primary,
    shadowColor: colors.primary,
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 4,
  },
  directoryThankYou: {
    fontFamily: fontFamily.bodyItalic,
    color: colors.textDark,
    fontSize: fontSize.sm,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: spacing.md,
  },
  directoryBody: { fontFamily: fontFamily.body, color: colors.textDark, fontSize: fontSize.sm, lineHeight: 22, marginBottom: spacing.md },
  directoryBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    backgroundColor: colors.primary,
    borderRadius: radius.full,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
  },
  directoryBtnText: { fontFamily: fontFamily.bodyBold, color: colors.white, fontSize: fontSize.sm },

  // ── End-of-camp Feedback card ──
  feedbackCard: {
    borderWidth: 2,
    borderColor: colors.primary,
    shadowColor: colors.primary,
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 4,
  },
  feedbackBody: { fontFamily: fontFamily.body, color: colors.textDark, fontSize: fontSize.sm, lineHeight: 22, marginBottom: spacing.md },
  feedbackBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    backgroundColor: colors.primary,
    borderRadius: radius.full,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
  },
  feedbackBtnText: { fontFamily: fontFamily.bodyBold, color: colors.white, fontSize: fontSize.sm },

  // ── Announcements ──
  announcementCard: {
    borderWidth: 2,
    borderColor: colors.primary,
    shadowColor: colors.primary,
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 4,
  },
  announcementRow:     { flexDirection: 'row', overflow: 'hidden', borderRadius: 0 },
  announcementDivider: { marginBottom: spacing.sm, paddingBottom: spacing.sm, borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: colors.border },
  announcementBody:    { flex: 1, paddingLeft: spacing.sm },
  announcementTitle:   { fontFamily: fontFamily.display, color: colors.textDark, fontSize: fontSize.md, marginBottom: spacing.xs },
  announcementText:    { fontFamily: fontFamily.body, color: colors.textDark, fontSize: fontSize.sm, lineHeight: 20 },

  // ── Share My Contact ──
  shareCard: {
    borderWidth: 2,
    borderColor: colors.teal,
    shadowColor: colors.teal,
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 4,
  },
  shareTitle: { fontFamily: fontFamily.display, color: colors.textDark, fontSize: fontSize.md, marginBottom: spacing.xs },
  shareBlurb: { fontFamily: fontFamily.body, color: colors.textDark, fontSize: fontSize.sm, lineHeight: 20, marginBottom: spacing.md },
  shareSubtleBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    alignSelf: 'center',
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: radius.full,
    borderWidth: 1.5,
    borderColor: colors.teal,
  },
  shareSubtleBtnDisabled:     { borderColor: colors.border },
  shareSubtleBtnText:         { fontFamily: fontFamily.bodySemi, color: colors.teal, fontSize: fontSize.sm },
  shareSubtleBtnTextDisabled: { color: colors.textMuted },
  shareIncompleteHint: { fontFamily: fontFamily.body, color: colors.textDark, fontSize: fontSize.xs, textAlign: 'center', marginTop: spacing.sm },

  // ── Instagram ──
  instagramBorder: {
    borderWidth: 2,
    borderColor: colors.yellow,
    shadowColor: colors.yellow,
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 4,
  },
  instagramCard:     { gap: spacing.sm },
  instagramTitle:    { fontFamily: fontFamily.display, color: colors.textDark, fontSize: fontSize.md, marginBottom: spacing.xs },
  instagramBody:     { fontFamily: fontFamily.body, color: colors.textDark, fontSize: fontSize.sm, lineHeight: 21 },
  instagramHashtag:  { alignSelf: 'center', fontFamily: fontFamily.display, color: colors.primary, fontSize: fontSize.md, letterSpacing: 0.5 },
  instagramBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    alignSelf: 'center',
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: radius.full,
    borderWidth: 1.5,
    borderColor: colors.primary,
    marginTop: spacing.xs,
  },
  instagramBtnText: { fontFamily: fontFamily.bodySemi, color: colors.primary, fontSize: fontSize.sm },

  // ── Demo section ──
  demoDividerWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginTop: spacing.xl,
    marginBottom: spacing.xs,
  },
  demoDividerLine: { flex: 1, height: 1, backgroundColor: colors.primary },
  demoDividerText: {
    fontFamily: fontFamily.subheading,
    color: colors.primary,
    fontSize: 9,
    letterSpacing: 1,
    textAlign: 'center',
    flexShrink: 1,
  },

  // ── Bottom illustration ──
  heartHandsImage: {
    width: SCREEN_W,
    height: 180,
    marginHorizontal: -spacing.md,
    marginTop: spacing.md - 5,
    marginBottom: -spacing.md,
  },
});
