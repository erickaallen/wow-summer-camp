import { SafeAreaView } from 'react-native-safe-area-context';
import React from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Linking } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import HeadshotAvatar from '../components/HeadshotAvatar';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { CounselorsStackParamList } from '../types';
import { counselorSessions } from '../data/counselorSessions';
import { campfireRotations } from '../data/campfireRotations';
import { colors, spacing, fontSize, fontFamily, radius, shadow } from '../theme';

type Props = NativeStackScreenProps<CounselorsStackParamList, 'CounselorDetail'>;

const CATEGORY_COLORS: Record<string, string> = {
  'Movement':              '#4DBFBF',
  'Mindset & Storytelling':'#9B59B6',
  'Craft & Connect':       '#E67E22',
  'Business & Branding':   colors.primary,
  'Leadership':            '#27AE60',
};

export default function CounselorDetailScreen({ route, navigation }: Props) {
  const { counselor } = route.params;
  const categoryColor = CATEGORY_COLORS[counselor.category] ?? colors.primary;
  const firstName = counselor.name.split(' ')[0];

  // Find this counselor's first session + its rotation for the topic card link
  const session  = counselorSessions.find((cs) => cs.counselorId === counselor.id);
  const rotation = session ? campfireRotations.find((r) => r.id === session.rotationId) : undefined;

  React.useLayoutEffect(() => {
    navigation.setOptions({ title: 'Meet Your Counselor' });
  }, [navigation]);

  const handleInstagram = () => {
    if (counselor.instagram) {
      const handle = counselor.instagram.replace('@', '');
      Linking.openURL(`https://instagram.com/${handle}`);
    }
  };

  const handleSessionPress = () => {
    if (session && rotation) {
      navigation.navigate('CounselorSessionDetail', {
        counselorSession: session,
        rotation,
      });
    }
  };

  return (
    <SafeAreaView style={styles.safe} edges={[]}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>

        {/* ── Hero card ── */}
        <View style={[styles.heroCard, shadow.md]}>
          <View style={styles.heroBody}>
            <View style={{ marginBottom: spacing.md }}>
              <HeadshotAvatar
                source={counselor.headshot}
                name={counselor.name}
                size={120}
                borderColor={categoryColor}
                borderWidth={3}
              />
            </View>

            <Text style={styles.name}>{counselor.name}</Text>

            {counselor.instagram && (
              <TouchableOpacity onPress={handleInstagram} style={styles.instagramRow}>
                <Ionicons name="logo-instagram" size={20} color={colors.primary} />
                <Text style={styles.instagram}>{counselor.instagram}</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* ── About card ── */}
        {counselor.bio ? (
          <View style={styles.aboutCard}>
            <Text style={styles.aboutHeader}>ABOUT {firstName.toUpperCase()}</Text>
            <Text style={styles.bio}>{counselor.bio}</Text>
          </View>
        ) : null}

        {/* ── Campfire session topic card ── */}
        <TouchableOpacity
          style={[styles.topicCard, {
            borderColor: categoryColor,
            shadowColor: categoryColor,
          }]}
          onPress={handleSessionPress}
          activeOpacity={session && rotation ? 0.75 : 1}
          disabled={!session || !rotation}
        >
          <Text style={[styles.topicLabel, { color: categoryColor }]}>🔥 CAMPFIRE SESSION TOPIC</Text>
          <Text style={styles.topicText}>{counselor.sessionTopic}</Text>
          {session && rotation && (
            <View style={styles.topicFooter}>
              <Text style={[styles.topicLink, { color: categoryColor }]}>View session details</Text>
              <Ionicons name="chevron-forward" size={14} color={categoryColor} />
            </View>
          )}
        </TouchableOpacity>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe:   { flex: 1, backgroundColor: colors.background },
  scroll: { padding: spacing.md, paddingTop: 0, paddingBottom: spacing.xxl, gap: spacing.md },

  // ── Hero ──
  heroCard: {
    backgroundColor: colors.white,
    borderRadius: 0,
    overflow: 'hidden',
  },
  heroBody: {
    alignItems: 'center',
    paddingTop: spacing.xl,
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.sm,
  },
  name: {
    color: colors.textDark,
    fontFamily: 'Corben_700Bold',
    fontSize: fontSize.xl,
    textAlign: 'center',
    marginBottom: spacing.xs,
  },
  instagramRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs, marginTop: spacing.xs },
  instagram: {
    fontFamily: fontFamily.bodyBold,
    color: colors.primary,
    fontSize: fontSize.md,
  },

  // ── About ──
  aboutCard: {
    backgroundColor: colors.white,
    borderRadius: 0,
    padding: spacing.md,
    ...shadow.sm,
  },
  aboutHeader: {
    fontFamily: fontFamily.subheading,
    color: colors.textDark,
    fontSize: fontSize.sm,
    fontWeight: '900',
    letterSpacing: 1.5,
    marginBottom: spacing.sm,
  },
  bio: {
    fontFamily: fontFamily.body,
    color: colors.textMuted,
    fontSize: fontSize.sm,
    lineHeight: 22,
  },

  // ── Topic ──
  topicCard: {
    backgroundColor: colors.white,
    borderRadius: 0,
    borderWidth: 2,
    padding: spacing.md,
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 4,
  },
  topicLabel: {
    fontFamily: fontFamily.subheading,
    fontSize: fontSize.xs,
    letterSpacing: 1,
    marginBottom: spacing.xs,
  },
  topicText: {
    fontFamily: fontFamily.bodyBold,
    color: colors.textDark,
    fontSize: fontSize.md,
    lineHeight: 24,
  },
  topicFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.sm,
    gap: 2,
  },
  topicLink: {
    fontFamily: fontFamily.bodySemi,
    fontSize: fontSize.xs,
  },
});
