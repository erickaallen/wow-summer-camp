import React from 'react';
import { View, Text, ScrollView, StyleSheet, SafeAreaView, TouchableOpacity, Linking } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { CounselorsStackParamList } from '../types';
import { colors, spacing, fontSize, fontWeight, radius } from '../theme';

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
  const categoryColor = CATEGORY_COLORS[counselor.category] ?? colors.teal;

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
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={[styles.heroCard, { borderColor: categoryColor }]}>
          <View style={[styles.categoryBadge, { backgroundColor: categoryColor }]}>
            <Text style={styles.categoryText}>{counselor.category.toUpperCase()}</Text>
          </View>
          <Text style={styles.name}>{counselor.name}</Text>
          {counselor.instagram && (
            <TouchableOpacity onPress={handleInstagram}>
              <Text style={styles.instagram}>{counselor.instagram}</Text>
            </TouchableOpacity>
          )}
        </View>

        <View style={styles.topicCard}>
          <Text style={styles.topicLabel}>🔥 CAMPFIRE SESSION TOPIC</Text>
          <Text style={styles.topicText}>{counselor.sessionTopic}</Text>
        </View>

        {counselor.bio ? (
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>ABOUT</Text>
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
    padding: spacing.xl,
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  categoryBadge: {
    borderRadius: radius.full,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    marginBottom: spacing.md,
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
  topicCard: {
    backgroundColor: colors.accent,
    borderRadius: radius.md,
    borderWidth: 2,
    borderColor: colors.teal,
    padding: spacing.md,
    marginBottom: spacing.sm,
  },
  topicLabel: {
    color: colors.teal,
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
  section: {
    backgroundColor: colors.white,
    borderRadius: radius.md,
    padding: spacing.md,
  },
  sectionLabel: {
    color: colors.teal,
    fontSize: fontSize.xs,
    fontWeight: fontWeight.heavy,
    letterSpacing: 2,
    marginBottom: spacing.sm,
  },
  bio: { color: '#444', fontSize: fontSize.md, lineHeight: 24 },
});
