import { SafeAreaView } from 'react-native-safe-area-context';
import React from 'react';
import { View, Text, Image, ScrollView, StyleSheet, TouchableOpacity, Linking } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, fontSize, fontFamily, shadow } from '../theme';

const APP_VERSION = '1.0.0';
const BUILDER_SITE = 'https://higherrealmsdigital.com';
const BUILDER_EMAIL = 'upward@higherrealmsdigital.com';
const BUG_EMAIL = 'support@higherrealmsdigital.com';

export default function AboutAppScreen() {
  return (
    <SafeAreaView style={styles.safe} edges={[]}>
      <ScrollView contentContainerStyle={styles.scroll}>

        {/* ── App identity ── */}
        <View style={styles.heroCard}>
          <Image
            source={require('../../assets/images/wow-troop-badge.png')}
            style={styles.appLogo}
            resizeMode="contain"
          />
          <Text style={styles.version}>Version {APP_VERSION}</Text>
          <Text style={styles.tagline}>
            Your pocket guide to campfire sessions, counselors, and all things summer camp.
          </Text>
        </View>

        {/* ── Built by ── */}
        <View style={styles.card}>
          <Text style={styles.cardLabel}>BUILT BY</Text>
          <TouchableOpacity onPress={() => Linking.openURL(BUILDER_SITE)} activeOpacity={0.7}>
            <Image
              source={require('../../assets/images/logos/HigherRealmsDigitalLogo.png')}
              style={styles.builderLogo}
              resizeMode="contain"
            />
          </TouchableOpacity>
          <Text style={styles.cardBody}>
            We design and build custom mobile apps for small businesses, events, and communities — thoughtfully crafted from the ground up.
          </Text>
          <TouchableOpacity
            style={styles.linkRow}
            onPress={() => Linking.openURL(BUILDER_SITE)}
            activeOpacity={0.7}
          >
            <Ionicons name="globe-outline" size={16} color={colors.primary} />
            <Text style={styles.linkText}>higherrealmsdigital.com</Text>
            {/* <Ionicons name="open-outline" size={13} color={colors.primary} /> */}
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.linkRow}
            onPress={() => Linking.openURL(`mailto:${BUILDER_EMAIL}?subject=App Inquiry`)}
            activeOpacity={0.7}
          >
            <Ionicons name="mail-outline" size={16} color={colors.primary} />
            <Text style={styles.linkText}>{BUILDER_EMAIL}</Text>
          </TouchableOpacity>
        </View>

        {/* ── Feedback & bugs ── */}
        <View style={styles.card}>
          <Text style={styles.cardLabel}>FEEDBACK & BUG REPORTS</Text>
          <Text style={styles.cardBody}>
            Noticed something off? Have a suggestion? We genuinely want to hear it. Every piece of feedback helps us make the app better — for this event and every one that comes after.
          </Text>
          <TouchableOpacity
            style={styles.ctaBtn}
            onPress={() => Linking.openURL(
              `mailto:${BUG_EMAIL}?subject=WOW Summer Camp App Feedback&body=Hi! Here's my feedback:`
            )}
            activeOpacity={0.75}
          >
            <Ionicons name="chatbubble-outline" size={18} color={colors.white} />
            <Text style={styles.ctaBtnText}>Send Feedback or Report a Bug</Text>
          </TouchableOpacity>
        </View>

        {/* ── Interested in an app? ── */}
        <View style={[styles.card, styles.accentCard]}>
          <Text style={[styles.cardLabel, { color: colors.teal }]}>INTERESTED IN YOUR OWN APP?</Text>
          <Text style={styles.cardBody}>
            We'd love to build something for you. Whether it's an event app, a client portal, or something entirely new — reach out and let's talk about what we can create together.
          </Text>
          <TouchableOpacity
            style={[styles.ctaBtn, styles.ctaBtnTeal]}
            onPress={() => Linking.openURL(
              `mailto:${BUILDER_EMAIL}?subject=I'm interested in building an app`
            )}
            activeOpacity={0.75}
          >
            <Ionicons name="rocket-outline" size={18} color={colors.white} />
            <Text style={styles.ctaBtnText}>Get in Touch</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.footer}>
          Made with Love for the WOW Gals & Pals.{'\n'}© 2026 Higher Realms Digital
        </Text>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  scroll: { padding: spacing.md, paddingBottom: spacing.xxl, gap: spacing.md },

  heroCard: {
    backgroundColor: colors.white,
    borderRadius: 0,
    padding: spacing.lg,
    alignItems: 'center',
    ...shadow.sm,
  },
  appLogo: {
    width: 160,
    height: 160,
    marginBottom: spacing.xs,
  },
  version: {
    fontFamily: fontFamily.subheading,
    color: colors.textMuted,
    fontSize: fontSize.xs,
    letterSpacing: 1,
    marginBottom: spacing.sm,
  },
  tagline: {
    fontFamily: fontFamily.body,
    color: colors.textMuted,
    fontSize: fontSize.sm,
    textAlign: 'center',
    lineHeight: 22,
  },

  card: {
    backgroundColor: colors.white,
    borderRadius: 0,
    padding: spacing.md,
    gap: spacing.sm,
    ...shadow.sm,
  },
  accentCard: {
    borderWidth: 2,
    borderColor: colors.teal,
    shadowColor: colors.teal,
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 4,
  },
  cardLabel: {
    fontFamily: fontFamily.subheading,
    color: colors.primary,
    fontSize: fontSize.xs,
    letterSpacing: 1.5,
  },
  builderLogo: {
    width: 220,
    height: 60,
    alignSelf: 'center',
  },
  cardBody: {
    fontFamily: fontFamily.body,
    color: colors.textMuted,
    fontSize: fontSize.sm,
    lineHeight: 22,
  },
  linkRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  linkText: {
    fontFamily: fontFamily.bodySemi,
    color: colors.primary,
    fontSize: fontSize.sm,
    flex: 1,
  },

  ctaBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    backgroundColor: colors.primary,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    marginTop: spacing.xs,
  },
  ctaBtnTeal: {
    backgroundColor: colors.teal,
  },
  ctaBtnText: {
    fontFamily: fontFamily.bodySemi,
    color: colors.white,
    fontSize: fontSize.sm,
  },

  footer: {
    fontFamily: fontFamily.body,
    color: colors.textMuted,
    fontSize: fontSize.xs,
    textAlign: 'center',
    lineHeight: 20,
    marginTop: spacing.sm,
  },
});
