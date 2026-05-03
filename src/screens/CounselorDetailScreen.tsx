import { SafeAreaView } from 'react-native-safe-area-context';
import React from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Linking } from 'react-native';
import HeadshotAvatar from '../components/HeadshotAvatar';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { CounselorsStackParamList } from '../types';
import { colors, spacing, fontSize, fontWeight, radius, shadow } from '../theme';

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

            {/* Category badge */}
            <View style={[styles.categoryBadge, { backgroundColor: categoryColor }]}>
              <Text style={styles.categoryText}>{counselor.category.toUpperCase()}</Text>
            </View>

            <Text style={styles.name}>{counselor.name}</Text>

            {counselor.instagram && (
              <TouchableOpacity onPress={handleInstagram} style={styles.instagramRow}>
                <Text style={styles.instagram}>{counselor.instagram}</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* ── Session topic ── */}
        <View style={[styles.topicCard, shadow.sm]}>
          <Text style={styles.topicLabel}>🔥 CAMPFIRE SESSION TOPIC</Text>
          <Text style={styles.topicText}>{counselor.sessionTopic}</Text>
        </View>

        {/* ── Bio (when available) ── */}
        {counselor.bio ? (
          <View style={[styles.bioCard, shadow.sm]}>
            <Text style={styles.bioLabel}>ABOUT</Text>
            <Text style={styles.bio}>{counselor.bio}</Text>
          </View>
        ) : null}

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
    borderRadius: radius.lg,
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
    color: colors.white,
    fontSize: fontSize.xs,
    fontWeight: fontWeight.heavy,
    letterSpacing: 2,
  },
  name: {
    color: colors.textDark,
    fontSize: fontSize.xl,
    fontWeight: fontWeight.heavy,
    textAlign: 'center',
    marginBottom: spacing.xs,
  },
  instagramRow: { marginTop: spacing.xs },
  instagram: {
    color: colors.primary,
    fontSize: fontSize.sm,
    fontWeight: fontWeight.bold,
    textDecorationLine: 'underline',
  },

  // ── Topic ──
  topicCard: {
    backgroundColor: colors.white,
    borderRadius: radius.md,
    padding: spacing.md,
    borderLeftWidth: 4,
    borderLeftColor: colors.primary,
  },
  topicLabel: {
    color: colors.primary,
    fontSize: fontSize.xs,
    fontWeight: fontWeight.heavy,
    letterSpacing: 1,
    marginBottom: spacing.xs,
  },
  topicText: {
    color: colors.textDark,
    fontSize: fontSize.md,
    fontWeight: fontWeight.bold,
    lineHeight: 24,
  },

  // ── Bio ──
  bioCard: {
    backgroundColor: colors.white,
    borderRadius: radius.md,
    padding: spacing.md,
  },
  bioLabel: {
    color: colors.textMuted,
    fontSize: fontSize.xs,
    fontWeight: fontWeight.heavy,
    letterSpacing: 2,
    marginBottom: spacing.sm,
  },
  bio: { color: colors.textDark, fontSize: fontSize.md, lineHeight: 24 },
});
