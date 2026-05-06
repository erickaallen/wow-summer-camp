import { SafeAreaView } from 'react-native-safe-area-context';
import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { sponsors } from '../data/sponsors';
import { Sponsor } from '../types';
import { colors, spacing, fontSize, fontFamily, radius } from '../theme';

const TIER_LABELS: Record<Sponsor['tier'], string> = {
  presenting: 'PRESENTING',
  gold: 'GOLD',
  silver: 'SILVER',
  pink: 'PINK',
};

const TIER_COLORS: Record<Sponsor['tier'], string> = {
  presenting: '#B0C4DE',
  gold: colors.accent,
  silver: '#D3D3D3',
  pink: colors.surface,
};

const TIER_ORDER: Sponsor['tier'][] = ['presenting', 'gold', 'silver', 'pink'];

export default function SponsorsScreen() {
  return (
    <SafeAreaView style={styles.safe} edges={[]}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={styles.heading}>THANK YOU TO OUR SPONSORS</Text>
        {TIER_ORDER.map((tier) => {
          const tierSponsors = sponsors.filter((s) => s.tier === tier);
          if (tierSponsors.length === 0) return null;
          return (
            <View key={tier} style={styles.tierSection}>
              <View style={[styles.tierBadge, { backgroundColor: TIER_COLORS[tier] }]}>
                <Text style={styles.tierLabel}>{TIER_LABELS[tier]}</Text>
              </View>
              {tierSponsors.map((sponsor) => (
                <View key={sponsor.id} style={styles.sponsorCard}>
                  <Text style={styles.logo}>{sponsor.logoPlaceholder}</Text>
                  <View style={styles.sponsorInfo}>
                    <Text style={styles.sponsorName}>{sponsor.name}</Text>
                    <Text style={styles.sponsorDesc}>{sponsor.description}</Text>
                  </View>
                </View>
              ))}
            </View>
          );
        })}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  scroll: { padding: spacing.md, paddingBottom: spacing.xxl },
  heading: {
    fontFamily: fontFamily.subheading,
    color: colors.primary,
    fontSize: fontSize.md,
    letterSpacing: 2,
    textAlign: 'center',
    marginBottom: spacing.lg,
  },
  tierSection: { marginBottom: spacing.lg },
  tierBadge: {
    borderRadius: radius.full,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    alignSelf: 'flex-start',
    marginBottom: spacing.sm,
    borderWidth: 2,
    borderColor: colors.teal,
  },
  tierLabel: {
    fontFamily: fontFamily.subheading,
    color: colors.textDark,
    fontSize: fontSize.xs,
    letterSpacing: 2,
  },
  sponsorCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: 0,
    padding: spacing.md,
    marginBottom: spacing.sm,
    borderWidth: 1,
    borderColor: colors.surface,
  },
  logo: { fontSize: 36, marginRight: spacing.md },
  sponsorInfo: { flex: 1 },
  sponsorName: { fontFamily: fontFamily.bodyBold, color: colors.textDark, fontSize: fontSize.md },
  sponsorDesc: { color: '#888', fontSize: fontSize.xs, marginTop: 2 },
});
