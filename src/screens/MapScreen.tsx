import { SafeAreaView } from 'react-native-safe-area-context';
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Linking,
  Image,
  ScrollView,
  Modal,
  Platform,
  useWindowDimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, fontSize, fontFamily, radius, shadow } from '../theme';

const VENUE_MAP = require('../../assets/images/venue-map.pdf');
const DIRECTIONS_URL_IOS     = 'https://maps.apple.com/?daddr=Progress+Park+Louisville+KY&dirflg=d';
const DIRECTIONS_URL_ANDROID = 'https://www.google.com/maps/dir/?api=1&destination=Progress+Park+Louisville+KY';

// All 56 numbered locations from the venue map
const LOCATIONS = [
  { n: 1,  label: '502 House' },
  { n: 2,  label: 'Lake House' },
  { n: 3,  label: 'Lake House Tent' },
  { n: 4,  label: 'Gigi Airstream' },
  { n: 5,  label: 'Basketball' },
  { n: 6,  label: 'Boat Wall' },
  { n: 7,  label: 'Life Jacket Shed' },
  { n: 8,  label: 'Picnic Area' },
  { n: 9,  label: 'Buechel Beach' },
  { n: 10, label: 'Grace Airstream' },
  { n: 11, label: 'Tree Swing' },
  { n: 12, label: 'The Point Beach' },
  { n: 13, label: 'Boat Wall' },
  { n: 14, label: 'Life Jackets' },
  { n: 15, label: 'Pavilion' },
  { n: 16, label: 'Chess Board' },
  { n: 17, label: 'The Grove' },
  { n: 18, label: 'Lawn' },
  { n: 19, label: 'Volleyball Court' },
  { n: 20, label: 'Shuffleboard' },
  { n: 21, label: 'Event Drop Off' },
  { n: 22, label: 'Event Center' },
  { n: 23, label: 'Courtyard' },
  { n: 24, label: 'GaGa Ball' },
  { n: 25, label: "Nature's Playground" },
  { n: 26, label: 'Spillway Beach' },
  { n: 27, label: 'Boat Wall / Picnic Area' },
  { n: 28, label: 'Dart Beach' },
  { n: 29, label: 'Boat Wall / Picnic Area' },
  { n: 30, label: 'Bridge Beach' },
  { n: 31, label: 'Boat Wall' },
  { n: 32, label: 'Swing Set' },
  { n: 33, label: 'Gladys Airstream' },
  { n: 34, label: 'Pearl Airstream' },
  { n: 35, label: 'Marie Airstream' },
  { n: 36, label: "Mucsy's Bunkhouse" },
  { n: 37, label: 'Small Pond' },
  { n: 38, label: 'Pond Catwalk' },
  { n: 39, label: 'Extra Parking' },
  { n: 40, label: 'Bathrooms / Laundry' },
  { n: 41, label: 'Main Parking' },
  { n: 42, label: 'Extra Parking' },
  { n: 43, label: 'Check In Area' },
  { n: 44, label: 'Merch Shop' },
  { n: 45, label: 'Maintenance Area' },
  { n: 46, label: 'Dumpster' },
  { n: 47, label: 'Vendor Parking / Overflow Parking' },
  { n: 48, label: 'Park Map / Rules' },
  { n: 49, label: 'Trails / Trailhead' },
  { n: 50, label: 'Dotti' },
  { n: 51, label: 'Stella' },
  { n: 52, label: 'Green Space / Games Lawn' },
  { n: 53, label: 'Hookups' },
  { n: 54, label: 'Firewood' },
  { n: 55, label: 'YaYa Airstream' },
  { n: 56, label: 'Handicap Accessible Parking' },
];

function openDirections() {
  Linking.openURL(Platform.OS === 'ios' ? DIRECTIONS_URL_IOS : DIRECTIONS_URL_ANDROID);
}

export default function MapScreen() {
  const { width } = useWindowDimensions();
  const [legendVisible, setLegendVisible] = useState(false);

  // Map image natural size: 750 × 580 — scale to fill screen width
  const MAP_W = width;
  const MAP_H = Math.round(width * (580 / 750));


  return (
    <SafeAreaView style={styles.safe} edges={[]}>

      {/* ── Zoomable Map (iOS native scroll zoom, Android basic scroll) ── */}
      <ScrollView
        style={styles.mapScroll}
        contentContainerStyle={styles.mapContent}
        maximumZoomScale={4}
        minimumZoomScale={1}
        bouncesZoom
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
        centerContent
      >
        <Image
          source={VENUE_MAP}
          style={{ width: MAP_W, height: MAP_H }}
          resizeMode="contain"
        />
      </ScrollView>

      {/* Hint pill */}
      <View style={styles.hintPill} pointerEvents="none">
        <Ionicons name="hand-left-outline" size={12} color={colors.textMuted} />
        <Text style={styles.hintText}>Pinch to zoom</Text>
      </View>

      {/* ── Legend Modal ── */}
      <Modal
        visible={legendVisible}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setLegendVisible(false)}
      >
        <SafeAreaView style={styles.legendSafe} edges={[]}>
          <View style={styles.legendHeader}>
            <Text style={styles.legendTitle}>MAP LEGEND</Text>
            <TouchableOpacity onPress={() => setLegendVisible(false)}>
              <Ionicons name="close-circle" size={26} color={colors.textMuted} />
            </TouchableOpacity>
          </View>
          <ScrollView contentContainerStyle={styles.legendList}>
            {LOCATIONS.map((loc) => (
              <View key={loc.n} style={styles.legendRow}>
                <View style={styles.legendBadge}>
                  <Text style={styles.legendBadgeText}>{loc.n}</Text>
                </View>
                <Text style={styles.legendLabel}>{loc.label}</Text>
              </View>
            ))}
          </ScrollView>
        </SafeAreaView>
      </Modal>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#111' },

  directionsBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    backgroundColor: colors.primary,
    borderRadius: radius.full,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs + 2,
    ...shadow.sm,
  },
  directionsBtnText: {
    fontFamily: fontFamily.bodyBold,
    color: colors.white,
    fontSize: fontSize.sm,
  },

  // ── Map ──
  mapScroll: { flex: 1, backgroundColor: '#111' },
  mapContent: { flex: 1, alignItems: 'center', justifyContent: 'center' },

  hintPill: {
    position: 'absolute',
    bottom: spacing.xl,
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    backgroundColor: 'rgba(255,255,255,0.85)',
    borderRadius: radius.full,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    ...shadow.sm,
  },
  hintText: {
    fontFamily: fontFamily.bodySemi,
    color: colors.textMuted,
    fontSize: fontSize.xs,
  },

  // ── Legend Modal ──
  legendSafe: { flex: 1, backgroundColor: colors.background },
  legendHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  legendTitle: {
    fontFamily: fontFamily.subheading,
    color: colors.textDark,
    fontSize: fontSize.sm,
    letterSpacing: 2,
  },
  legendList: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    gap: spacing.sm,
  },
  legendRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingVertical: spacing.xs,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.border,
  },
  legendBadge: {
    width: 28,
    height: 28,
    borderRadius: radius.full,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  legendBadgeText: {
    fontFamily: fontFamily.subheading,
    color: colors.white,
    fontSize: 11,
  },
  legendLabel: {
    fontFamily: fontFamily.bodySemi,
    color: colors.textDark,
    fontSize: fontSize.sm,
    flex: 1,
  },
});
