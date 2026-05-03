import { SafeAreaView } from 'react-native-safe-area-context';
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Linking } from 'react-native';

import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { MoreStackParamList } from '../types';
import { colors, spacing, fontSize, fontWeight, radius } from '../theme';

const PRIVACY_URL  = 'https://www.womanownedwallet.com/policies/privacy-policy';
const WOW_URL      = 'https://www.womanownedwallet.com';
const SHOP_URL      = 'https://www.womanownedwallet.com/collections/shop-all';
const DIRECTORY_URL = 'https://www.womanownedwallet.com/products/wow-directory-posting?_pos=3&_sid=8de28d22e&_ss=r';

type Props = NativeStackScreenProps<MoreStackParamList, 'MoreMenu'>;

type MenuItem = {
  label: string;
  icon: React.ComponentProps<typeof Ionicons>['name'];
  screen: keyof Pick<MoreStackParamList, 'Sponsors' | 'CheckIn' | 'Profile'>;
  description: string;
};

type ExternalItem = {
  label: string;
  icon: React.ComponentProps<typeof Ionicons>['name'];
  url: string;
  description: string;
};

const EXTERNAL_ITEMS: ExternalItem[] = [
  {
    label: 'Shop Woman-Owned Wallet',
    icon: 'bag-handle-outline',
    url: SHOP_URL,
    description: 'Browse the Woman Owned Wallet shop.',
  },
  {
    label: 'Join the W.O.W. Directory',
    icon: 'people-circle-outline',
    url: DIRECTORY_URL,
    description: 'Get listed in the Woman Owned Wallet business directory.',
  },
];

const MENU_ITEMS: MenuItem[] = [
  {
    label: 'My Profile',
    icon: 'person-circle-outline',
    screen: 'Profile',
    description: 'Set up your contact info and networking card.',
  },
  {
    label: 'Check In',
    icon: 'qr-code-outline',
    screen: 'CheckIn',
    description: 'Show your QR code at the registration table.',
  },
  {
    label: 'Sponsors',
    icon: 'ribbon-outline',
    screen: 'Sponsors',
    description: 'Meet the sponsors making WOW Summer Camp possible.',
  },
];

export default function MoreScreen({ navigation }: Props) {
  return (
    <SafeAreaView style={styles.safe} edges={[]}>
      <ScrollView contentContainerStyle={styles.scroll}>
        {MENU_ITEMS.map((item) => (
          <TouchableOpacity
            key={item.screen}
            style={styles.menuItem}
            onPress={() => navigation.navigate(item.screen)}
            activeOpacity={0.8}
          >
            <View style={styles.iconWrap}>
              <Ionicons name={item.icon} size={28} color={colors.primary} />
            </View>
            <View style={styles.menuText}>
              <Text style={styles.menuLabel}>{item.label}</Text>
              <Text style={styles.menuDesc}>{item.description}</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={colors.teal} />
          </TouchableOpacity>
        ))}

        {EXTERNAL_ITEMS.map((item) => (
          <TouchableOpacity
            key={item.url}
            style={styles.menuItem}
            onPress={() => Linking.openURL(item.url)}
            activeOpacity={0.8}
          >
            <View style={styles.iconWrap}>
              <Ionicons name={item.icon} size={28} color={colors.primary} />
            </View>
            <View style={styles.menuText}>
              <Text style={styles.menuLabel}>{item.label}</Text>
              <Text style={styles.menuDesc}>{item.description}</Text>
            </View>
            <Ionicons name="open-outline" size={18} color={colors.teal} />
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* ── Pinned footer ── */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.linkRow}
          onPress={() => Linking.openURL(PRIVACY_URL)}
          activeOpacity={0.7}
        >
          <Ionicons name="shield-checkmark-outline" size={14} color={colors.textMuted} />
          <Text style={styles.linkText}>Privacy Policy</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => Linking.openURL(WOW_URL)} activeOpacity={0.7}>
          <Text style={styles.footerBrand}>Woman Owned Wallet</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  scroll: { padding: spacing.md, paddingBottom: spacing.xxl },
  banner: {
    backgroundColor: colors.accent,
    borderRadius: radius.lg,
    borderWidth: 3,
    borderColor: colors.teal,
    padding: spacing.lg,
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  bannerTag: {
    color: colors.teal,
    fontSize: fontSize.xs,
    fontWeight: fontWeight.heavy,
    letterSpacing: 3,
    marginBottom: spacing.xs,
  },
  bannerTitle: { color: colors.primary, fontSize: fontSize.xl, fontWeight: fontWeight.heavy },
  bannerDate: { color: colors.primary, fontSize: fontSize.sm, fontWeight: fontWeight.bold, marginTop: spacing.xs },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: radius.md,
    padding: spacing.md,
    marginBottom: spacing.sm,
    borderWidth: 1,
    borderColor: colors.surface,
  },
  iconWrap: {
    width: 48,
    height: 48,
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  menuText: { flex: 1, flexShrink: 1, marginRight: spacing.sm },
  menuLabel: { color: colors.textDark, fontSize: fontSize.md, fontWeight: fontWeight.bold, flexWrap: 'wrap' },
  menuDesc: { color: '#888', fontSize: fontSize.xs, marginTop: 2, flexWrap: 'wrap' },
  footer: {
    alignItems: 'center',
    paddingVertical: spacing.md,
    gap: spacing.xs,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.border,
    backgroundColor: colors.background,
  },
  linkRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  linkText: {
    color: colors.textMuted,
    fontSize: fontSize.xs,
    fontWeight: fontWeight.semibold,
  },
  footerBrand: {
    color: colors.primary,
    fontSize: fontSize.sm,
    fontWeight: fontWeight.heavy,
  },
});
