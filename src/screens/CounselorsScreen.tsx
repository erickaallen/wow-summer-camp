import React, { useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, SafeAreaView } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { CounselorsStackParamList, CounselorCategory } from '../types';
import { counselors } from '../data/counselors';
import { colors, spacing, fontSize, fontWeight, radius } from '../theme';

type Props = NativeStackScreenProps<CounselorsStackParamList, 'CounselorList'>;

const CATEGORIES: CounselorCategory[] = [
  'Movement',
  'Mindset & Storytelling',
  'Craft & Connect',
  'Business & Branding',
  'Leadership',
];

const CATEGORY_ICONS: Record<CounselorCategory, string> = {
  'Movement': '🏃‍♀️',
  'Mindset & Storytelling': '🧠',
  'Craft & Connect': '🎨',
  'Business & Branding': '💼',
  'Leadership': '👑',
};

const CATEGORY_COLORS: Record<CounselorCategory, string> = {
  'Movement': '#4DBFBF',
  'Mindset & Storytelling': '#9B59B6',
  'Craft & Connect': '#E67E22',
  'Business & Branding': colors.primary,
  'Leadership': '#27AE60',
};

export default function CounselorsScreen({ navigation }: Props) {
  const [activeCategory, setActiveCategory] = useState<CounselorCategory | 'All'>('All');

  const filtered = activeCategory === 'All'
    ? counselors
    : counselors.filter((c) => c.category === activeCategory);

  return (
    <SafeAreaView style={styles.safe}>
      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        ListHeaderComponent={
          <View>
            <Text style={styles.heading}>CAMP COUNSELORS</Text>
            <Text style={styles.subheading}>{counselors.length} counselors · 5 campfire tracks</Text>
            <FlatList
              horizontal
              showsHorizontalScrollIndicator={false}
              data={['All', ...CATEGORIES] as (CounselorCategory | 'All')[]}
              keyExtractor={(item) => item}
              contentContainerStyle={styles.filterRow}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[styles.chip, activeCategory === item && styles.chipActive]}
                  onPress={() => setActiveCategory(item)}
                >
                  <Text style={[styles.chipText, activeCategory === item && styles.chipTextActive]}>
                    {item === 'All' ? 'All' : `${CATEGORY_ICONS[item]} ${item}`}
                  </Text>
                </TouchableOpacity>
              )}
              style={styles.filterList}
            />
          </View>
        }
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.card}
            onPress={() => navigation.navigate('CounselorDetail', { counselor: item })}
            activeOpacity={0.8}
          >
            <View style={[styles.categoryBar, { backgroundColor: CATEGORY_COLORS[item.category] }]} />
            <View style={styles.cardContent}>
              <Text style={styles.name}>{item.name}</Text>
              <Text style={styles.topic} numberOfLines={2}>{item.sessionTopic}</Text>
              <View style={styles.categoryPill}>
                <Text style={styles.categoryText}>
                  {CATEGORY_ICONS[item.category]} {item.category}
                </Text>
              </View>
            </View>
            <Text style={styles.chevron}>›</Text>
          </TouchableOpacity>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  list: { padding: spacing.md, paddingBottom: spacing.xxl },
  heading: {
    color: colors.primary,
    fontSize: fontSize.lg,
    fontWeight: fontWeight.heavy,
    letterSpacing: 2,
    marginBottom: spacing.xs,
  },
  subheading: {
    color: colors.teal,
    fontSize: fontSize.sm,
    fontWeight: fontWeight.semibold,
    marginBottom: spacing.md,
  },
  filterList: { marginBottom: spacing.md },
  filterRow: { gap: spacing.xs, paddingRight: spacing.md },
  chip: {
    backgroundColor: colors.white,
    borderRadius: radius.full,
    borderWidth: 2,
    borderColor: colors.teal,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    marginRight: spacing.xs,
  },
  chipActive: { backgroundColor: colors.primary, borderColor: colors.primary },
  chipText: { color: colors.teal, fontWeight: fontWeight.bold, fontSize: fontSize.xs },
  chipTextActive: { color: colors.white },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: radius.md,
    marginBottom: spacing.sm,
    borderWidth: 1,
    borderColor: colors.surface,
    overflow: 'hidden',
  },
  categoryBar: { width: 5, alignSelf: 'stretch' },
  cardContent: { flex: 1, padding: spacing.md },
  name: { color: colors.textDark, fontSize: fontSize.md, fontWeight: fontWeight.heavy, marginBottom: 2 },
  topic: { color: '#555', fontSize: fontSize.sm, lineHeight: 18, marginBottom: spacing.xs },
  categoryPill: {
    alignSelf: 'flex-start',
    backgroundColor: colors.background,
    borderRadius: radius.full,
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
  },
  categoryText: { color: colors.teal, fontSize: fontSize.xs, fontWeight: fontWeight.bold },
  chevron: { color: colors.primary, fontSize: 22, fontWeight: fontWeight.bold, paddingRight: spacing.sm },
});
