import React from 'react';
import { View, Text, StyleSheet, SafeAreaView } from 'react-native';
import { colors, spacing, fontSize, fontWeight, radius } from '../theme';

export default function CheckInScreen() {
  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        <View style={styles.card}>
          <Text style={styles.icon}>📲</Text>
          <Text style={styles.title}>QR Check-In</Text>
          <Text style={styles.subtitle}>Coming Soon</Text>
          <Text style={styles.body}>
            Scan your ticket QR code at the registration desk to check in. This feature will be
            available closer to the event date.
          </Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoIcon}>📍</Text>
          <Text style={styles.infoText}>Registration & Check-in · Main Entrance</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoIcon}>🕗</Text>
          <Text style={styles.infoText}>Check-in opens at 8:00 AM on May 26th</Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  container: { flex: 1, padding: spacing.md, justifyContent: 'center' },
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 3,
    borderColor: colors.primary,
    padding: spacing.xl,
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  icon: { fontSize: 56, marginBottom: spacing.md },
  title: { color: colors.primary, fontSize: fontSize.xl, fontWeight: fontWeight.heavy },
  subtitle: {
    color: colors.teal,
    fontSize: fontSize.md,
    fontWeight: fontWeight.bold,
    letterSpacing: 1,
    marginTop: spacing.xs,
    marginBottom: spacing.md,
  },
  body: { color: '#555', fontSize: fontSize.sm, textAlign: 'center', lineHeight: 22 },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: radius.md,
    padding: spacing.md,
    marginBottom: spacing.sm,
  },
  infoIcon: { fontSize: 20, marginRight: spacing.sm },
  infoText: { color: colors.textDark, fontSize: fontSize.sm, fontWeight: fontWeight.semibold, flex: 1 },
});
