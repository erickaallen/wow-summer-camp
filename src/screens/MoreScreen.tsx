import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, ScrollView } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { MoreStackParamList } from '../types';
import { colors, spacing, fontSize, fontWeight, radius } from '../theme';

type Props = NativeStackScreenProps<MoreStackParamList, 'MoreMenu'>;

type MenuItem = {
  label: string;
  icon: React.ComponentProps<typeof Ionicons>['name'];
  screen: keyof Pick<MoreStackParamList, 'Sponsors' | 'CheckIn'>;
  description: string;
};

const MENU_ITEMS: MenuItem[] = [
  {
    label: 'Sponsors',
    icon: 'ribbon-outline',
    screen: 'Sponsors',
    description: 'Meet the sponsors making WOW Summer Camp possible.',
  },
  {
    label: 'Check In',
    icon: 'qr-code-outline',
    screen: 'CheckIn',
    description: 'Scan your QR code to check in at the event.',
  },
];

export default function MoreScreen({ navigation }: Props) {
  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.banner}>
          <Text style={styles.bannerTag}>TROOP 502</Text>
          <Text style={styles.bannerTitle}>WOW Summer Camp</Text>
          <Text style={styles.bannerDate}>May 26–27, 2026</Text>
        </View>

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

        <View style={styles.footer}>
          <Text style={styles.footerText}>Woman Owned Wallet</Text>
          <Text style={styles.footerSub}>womanownedwallet.com</Text>
        </View>
      </ScrollView>
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
  menuText: { flex: 1 },
  menuLabel: { color: colors.textDark, fontSize: fontSize.md, fontWeight: fontWeight.bold },
  menuDesc: { color: '#888', fontSize: fontSize.xs, marginTop: 2 },
  footer: { alignItems: 'center', marginTop: spacing.xl },
  footerText: { color: colors.primary, fontWeight: fontWeight.heavy, fontSize: fontSize.sm },
  footerSub: { color: colors.teal, fontSize: fontSize.xs, marginTop: 2 },
});
