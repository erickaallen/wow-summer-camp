import { SafeAreaView } from 'react-native-safe-area-context';
import React, { useCallback } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import QRCode from 'react-native-qrcode-svg';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useFocusEffect } from '@react-navigation/native';
import { MoreStackParamList } from '../types';
import { useProfile } from '../hooks/useProfile';
import { colors, spacing, fontSize, fontWeight, radius, shadow } from '../theme';

type Props = NativeStackScreenProps<MoreStackParamList, 'CheckIn'>;

export default function CheckInScreen({ navigation }: Props) {
  const { profile, loaded, reload, isComplete } = useProfile();

  // Re-read from storage every time this screen comes into focus so that
  // completing a profile on the Profile screen is immediately reflected here.
  useFocusEffect(
    useCallback(() => {
      reload();
    }, [reload])
  );

  if (!loaded) {
    return (
      <SafeAreaView style={styles.safe} edges={[]}>
        <ActivityIndicator style={{ marginTop: spacing.xxl }} color={colors.primary} />
      </SafeAreaView>
    );
  }

  // ── Profile not set up yet ──────────────────────────────────────────────────
  if (!isComplete) {
    return (
      <SafeAreaView style={styles.safe} edges={[]}>
        <View style={styles.emptyState}>
          <Ionicons name="person-circle-outline" size={72} color={colors.tealLight} />
          <Text style={styles.emptyTitle}>Set Up Your Profile First</Text>
          <Text style={styles.emptyBody}>
            Your check-in QR code is generated from your ticket email. Add your profile to get your code.
          </Text>
          <TouchableOpacity
            style={styles.setupBtn}
            onPress={() => navigation.navigate('Profile')}
            activeOpacity={0.85}
          >
            <Ionicons name="person-add-outline" size={18} color={colors.white} />
            <Text style={styles.setupBtnText}>Set Up Profile</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  // ── Profile complete — show QR code ─────────────────────────────────────────
  return (
    <SafeAreaView style={styles.safe} edges={[]}>
      <View style={styles.content}>

        <View style={styles.qrCard}>
          <Text style={styles.qrLabel}>SHOW THIS TO CHECK IN</Text>
          <View style={styles.qrBox}>
            <QRCode
              value={profile!.ticketEmail}
              size={220}
              color={colors.textDark}
              backgroundColor={colors.white}
            />
          </View>
          <Text style={styles.qrEmail}>{profile!.ticketEmail}</Text>
          <Text style={styles.qrHint}>
            A staff member will scan this code to verify your registration.
          </Text>
        </View>

        <View style={styles.nameCard}>
          {profile!.photo ? (
            <Image
              source={{ uri: profile!.photo }}
              style={styles.nameAvatar}
            />
          ) : (
            <View style={styles.nameAvatarPlaceholder}>
              <Ionicons name="person" size={32} color={colors.tealLight} />
            </View>
          )}
          <Text style={styles.nameText}>
            {profile!.firstName} {profile!.lastName}
          </Text>
          {!!profile!.businessName && (
            <Text style={styles.businessText}>{profile!.businessName}</Text>
          )}
        </View>

        <TouchableOpacity
          style={styles.editBtn}
          onPress={() => navigation.navigate('Profile')}
          activeOpacity={0.8}
        >
          <Ionicons name="pencil-outline" size={16} color={colors.teal} />
          <Text style={styles.editBtnText}>Edit Profile</Text>
        </TouchableOpacity>

      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  content: { flex: 1, padding: spacing.md, gap: spacing.md },

  // ── Empty state ──
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.xl,
    gap: spacing.md,
  },
  emptyTitle: {
    color: colors.textDark,
    fontSize: fontSize.lg,
    fontWeight: fontWeight.heavy,
    textAlign: 'center',
  },
  emptyBody: {
    color: colors.textMuted,
    fontSize: fontSize.sm,
    textAlign: 'center',
    lineHeight: 22,
  },
  setupBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    backgroundColor: colors.primary,
    borderRadius: radius.full,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xl,
    marginTop: spacing.sm,
  },
  setupBtnText: {
    color: colors.white,
    fontSize: fontSize.md,
    fontWeight: fontWeight.heavy,
  },

  // ── QR card ──
  qrCard: {
    backgroundColor: colors.white,
    borderRadius: radius.lg,
    padding: spacing.lg,
    alignItems: 'center',
    gap: spacing.md,
    ...shadow.md,
  },
  qrLabel: {
    color: colors.primary,
    fontSize: fontSize.xs,
    fontWeight: fontWeight.heavy,
    letterSpacing: 2,
  },
  qrBox: {
    padding: spacing.md,
    backgroundColor: colors.white,
    borderRadius: radius.md,
    borderWidth: 3,
    borderColor: colors.tealLight,
  },
  qrEmail: {
    color: colors.textDark,
    fontSize: fontSize.sm,
    fontWeight: fontWeight.bold,
  },
  qrHint: {
    color: colors.textMuted,
    fontSize: fontSize.xs,
    textAlign: 'center',
    lineHeight: 18,
  },

  // ── Name card ──
  nameCard: {
    backgroundColor: colors.white,
    borderRadius: radius.md,
    padding: spacing.md,
    alignItems: 'center',
    gap: spacing.xs,
    ...shadow.sm,
  },
  nameAvatar: {
    width: 72,
    height: 72,
    borderRadius: 36,
    borderWidth: 3,
    borderColor: colors.tealLight,
    marginBottom: spacing.xs,
  },
  nameAvatarPlaceholder: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: colors.surface,
    borderWidth: 3,
    borderColor: colors.tealLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.xs,
  },
  nameText: {
    color: colors.textDark,
    fontSize: fontSize.xl,
    fontWeight: fontWeight.heavy,
  },
  businessText: {
    color: colors.textMuted,
    fontSize: fontSize.sm,
    marginTop: 4,
  },

  // ── Edit link ──
  editBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xs,
  },
  editBtnText: {
    color: colors.teal,
    fontSize: fontSize.sm,
    fontWeight: fontWeight.semibold,
  },
});
