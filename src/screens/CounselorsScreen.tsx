import { SafeAreaView } from 'react-native-safe-area-context';
import React, { useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import HeadshotAvatar from '../components/HeadshotAvatar';
import { useNavigation } from '@react-navigation/native';
import { NativeStackScreenProps, NativeStackNavigationProp } from '@react-navigation/native-stack';
import { CounselorsStackParamList, RootStackParamList, CounselorCategory } from '../types';
import { counselors } from '../data/counselors';
import { colors, spacing, fontSize, fontFamily, radius } from '../theme';

type Props = NativeStackScreenProps<CounselorsStackParamList, 'CounselorList'>;

const CATEGORIES: CounselorCategory[] = [
  'Movement',
  'Mindset & Storytelling',
  'Craft & Connect',
  'Business & Branding',
  'Leadership',
];

const CATEGORY_ICONS: Record<CounselorCategory, string> = {
  'Movement': '🧘🏾‍♀️',
  'Mindset & Storytelling': '🧠',
  'Craft & Connect': '💕',
  'Business & Branding': '💰',
  'Leadership': '👑',
  'Racing Louisville': '⚽',
};

const CATEGORY_COLORS: Record<CounselorCategory, string> = {
  'Movement':              '#CEB2FB',
  'Mindset & Storytelling': '#F5C435',
  'Craft & Connect':       '#FFB0D0',
  'Business & Branding':   '#4DBFBF',
  'Leadership':            colors.primary,
  'Racing Louisville':     '#CEB2FB',
};

export default function CounselorsScreen(_props: Props) {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [activeCategory, setActiveCategory] = useState<CounselorCategory | 'All'>('All');

  const filtered = (activeCategory === 'All'
    ? counselors
    : counselors.filter((c) =>
        c.category === activeCategory ||
        // Racing Louisville players appear under the Movement filter
        (activeCategory === 'Movement' && c.category === 'Racing Louisville')
      )
  ).slice().sort((a, b) => a.name.localeCompare(b.name));

  return (
    <SafeAreaView style={styles.safe} edges={[]}>
      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        ListHeaderComponent={
          <View>
            {/* <Text style={styles.heading}>CAMP COUNSELORS</Text>
            <Text style={styles.subheading}>{counselors.length} counselors · 5 campfire tracks</Text> */}
            <FlatList
              horizontal
              showsHorizontalScrollIndicator={false}
              data={['All', ...CATEGORIES] as (CounselorCategory | 'All')[]}
              keyExtractor={(item) => item}
              contentContainerStyle={styles.filterRow}
              renderItem={({ item }) => {
                const catColor = item === 'All' ? colors.primary : CATEGORY_COLORS[item];
                const isActive = activeCategory === item;
                return (
                  <TouchableOpacity
                    style={[
                      styles.chip,
                      { borderColor: catColor },
                      isActive && { backgroundColor: catColor },
                    ]}
                    onPress={() => setActiveCategory(item)}
                  >
                    {item === 'All' ? (
                      <Text style={[styles.chipText, { color: isActive ? colors.white : catColor }]}>All</Text>
                    ) : (
                      <View style={styles.chipInner}>
                        <Text style={styles.chipEmoji}>{CATEGORY_ICONS[item]}</Text>
                        <Text style={[styles.chipText, { color: isActive ? colors.white : catColor }]}>{item}</Text>
                      </View>
                    )}
                  </TouchableOpacity>
                );
              }}
              style={styles.filterList}
            />
          </View>
        }
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[styles.card, {
              borderColor: CATEGORY_COLORS[item.category],
              shadowColor: CATEGORY_COLORS[item.category],
              shadowOffset: { width: 4, height: 4 },
              shadowOpacity: 1,
              shadowRadius: 0,
            }]}
            onPress={() => navigation.navigate('CounselorDetail', { counselor: item })}
            activeOpacity={0.8}
          >

            {/* Headshot */}
            <View style={{ marginLeft: spacing.sm }}>
              <HeadshotAvatar
                source={item.headshot}
                name={item.name}
                size={62}
                borderColor={CATEGORY_COLORS[item.category]}
              />
            </View>

            <View style={styles.cardContent}>
              <Text style={styles.name}>{item.name}</Text>
              <Text style={styles.topic} numberOfLines={2}>{item.sessionTopic}</Text>
              <View style={styles.categoryPill}>
                <Text style={styles.categoryText}>
                  {item.category}
                </Text>
              </View>
            </View>
            <Text style={[styles.chevron, { color: CATEGORY_COLORS[item.category] }]}>›</Text>
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
    fontFamily: fontFamily.display,
    color: colors.primary,
    fontSize: fontSize.lg,
    letterSpacing: 2,
    marginBottom: spacing.xs,
  },
  subheading: {
    fontFamily: fontFamily.bodySemi,
    color: colors.textMuted,
    fontSize: fontSize.sm,
    marginBottom: spacing.md,
  },
  filterList: { marginBottom: spacing.md, marginHorizontal: -spacing.md },
  filterRow: { gap: spacing.xs, paddingHorizontal: spacing.md },
  chip: {
    backgroundColor: colors.white,
    borderRadius: radius.full,
    borderWidth: 2,
    paddingHorizontal: spacing.sm,
    paddingVertical: 5,
    marginRight: spacing.xs,
  },
  chipInner: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs },
  chipEmoji: { fontSize: fontSize.sm },
  chipText: { fontFamily: 'Corben_700Bold', fontSize: fontSize.sm },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: 0,
    marginBottom: spacing.lg,
    borderWidth: 2,
  },
  avatar: {
    marginLeft: spacing.sm,
  },
  cardContent: { flex: 1, padding: spacing.md },
  name: { color: colors.textDark, fontFamily: 'Corben_700Bold', fontSize: fontSize.md, lineHeight: 20, marginBottom: 2 },
  topic: { fontFamily: fontFamily.subheading, color: colors.textMuted, fontSize: fontSize.sm, lineHeight: 18, letterSpacing: 0.5, textTransform: 'uppercase', marginBottom: spacing.xs },
  categoryPill: {
    alignSelf: 'flex-start',
    backgroundColor: colors.background,
    borderRadius: radius.full,
    paddingLeft: 0,
    paddingRight: spacing.sm,
    paddingVertical: 2,
  },
  categoryText: { fontFamily: fontFamily.body, color: colors.textMuted, fontSize: fontSize.xs },
  chevron: { fontSize: 22, paddingRight: spacing.sm },
});
