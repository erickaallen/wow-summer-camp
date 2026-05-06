import { SafeAreaView } from 'react-native-safe-area-context';
import React from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Linking } from 'react-native';
import HeadshotAvatar from '../components/HeadshotAvatar';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { CounselorsStackParamList } from '../types';
import { colors, spacing, fontSize, fontFamily, radius, shadow } from '../theme';

type Props = NativeStackScreenProps<CounselorsStackParamList, 'CounselorDetail'>;

const CATEGORY_COLORS: Record<string, string> = {
  'Movement': '#4DBFBF',
  'Mindset & Storytelling': '#9B59B6',
  'Craft & Connect': '#E67E22',
  'Business & Branding': colors.primary,
  'Leadership': '#27AE60',
};

export default function CounselorDetailScreen({ route, navigation }: Props) {
  const { counselor } = route.params;
  const categoryColor = CATEGORY_COLORS[counselor.category] ?? colors.primary;

  React.useLayoutEffect(() => {
    navigation.setOptions({ title: counselor.name });
  }, [navigation, counselor.name]);

  const handleInstagram = () => {
    if (counselor.instagram) {
      const handle = counselor.instagram.replace('@', '');
      Linking.openURL(`https://instagram.com/${handle}`);
    }
  };

  return (
    <SafeAreaView style={styles.safe} edges={[]}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>

        {/* ── Hero card with headshot ── */}
        <View style={[styles.heroCard, shadow.md]}>
          {/* Category colour strip across the top */}
          <View style={[styles.heroStrip, { backgroundColor: categoryColor }]} />

          <View style={styles.heroBody}>
            {/* Headshot */}
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
                <Text style={styles.instagram}>{counselor.instagram}</Text>
              </TouchableOpacity>
            )}

            {counselor.bio ? (
              <Text style={styles.bio}>{counselor.bio}</Text>
            ) : null}
          </View>
        </View>

        {/* ── Session topic ── */}
        <View style={[styles.topicCard, shadow.sm]}>
          <Text style={styles.topicLabel}>🔥 CAMPFIRE SESSION TOPIC</Text>
          <Text style={styles.topicText}>{counselor.sessionTopic}</Text>
          {counselor.sessionDescription ? (
            <Text style={styles.sessionDescription}>{counselor.sessionDescription}</Text>
          ) : null}
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe:   { flex: 1, backgroundColor: colors.background },
  scroll: { padding: spacing.md, paddingBottom: spacing.xxl, gap: spacing.md },

  // ── Hero ──
  heroCard: {
    backgroundColor: colors.white,
    borderRadius: 0,
    overflow: 'hidden',
  },
  heroStrip: { height: 8 },
  heroBody: {
    alignItems: 'center',
    padding: spacing.lg,
    paddingTop: spacing.xl,
  },
  headshot: {
    marginBottom: spacing.md,
  },
  categoryBadge: {
    borderRadius: radius.full,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    marginBottom: spacing.sm,
  },
  categoryText: {
    fontFamily: fontFamily.subheading,
    color: colors.white,
    fontSize: fontSize.xs,
    letterSpacing: 2,
  },
  name: {
    color: colors.textDark,
    fontFamily: 'Corben_700Bold',
    fontSize: fontSize.xl,
    textAlign: 'center',
    marginBottom: spacing.xs,
  },
  instagramRow: { marginTop: spacing.xs },
  instagram: {
    fontFamily: fontFamily.bodyBold,
    color: colors.primary,
    fontSize: fontSize.sm,
    textDecorationLine: 'underline',
  },

  // ── Topic ──
  topicCard: {
    backgroundColor: colors.white,
    borderRadius: 0,
    padding: spacing.md,
    borderLeftWidth: 4,
    borderLeftColor: colors.primary,
  },
  topicLabel: {
    fontFamily: fontFamily.subheading,
    color: colors.primary,
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
  sessionDescription: {
    fontFamily: fontFamily.body,
    color: colors.textMuted,
    fontSize: fontSize.sm,
    lineHeight: 22,
    textAlign: 'justify',
    marginTop: spacing.sm,
  },

  bio: {
    fontFamily: fontFamily.body,
    color: colors.textMuted,
    fontSize: fontSize.sm,
    lineHeight: 22,
    textAlign: 'justify',
    alignSelf: 'stretch',
    marginTop: spacing.md,
    paddingHorizontal: spacing.sm,
  },
});
