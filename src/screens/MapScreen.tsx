import { SafeAreaView } from 'react-native-safe-area-context';
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  Modal,
  StatusBar,
  useWindowDimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ScreenOrientation from 'expo-screen-orientation';
import { colors, spacing, fontSize, fontFamily, radius, shadow } from '../theme';

const VENUE_MAP_PNG = require('../../assets/images/venue-map-1.png');
// Map natural size
const MAP_NATURAL_W = 750;
const MAP_NATURAL_H = 580;

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

export default function MapScreen() {
  const { width, height } = useWindowDimensions();
  const [fullscreen, setFullscreen] = useState(false);
  const [legendVisible, setLegendVisible] = useState(false);

  // Portrait map: scale to screen width
  const portraitMapW = width;
  const portraitMapH = Math.round(width * (MAP_NATURAL_H / MAP_NATURAL_W));

  // Fullscreen (landscape) map: after orientation lock, dimensions flip.
  // Scale to fill the landscape height while preserving aspect ratio.
  const landscapeH = Math.min(width, height);   // shorter side = landscape height
  const landscapeW = Math.round(landscapeH * (MAP_NATURAL_W / MAP_NATURAL_H));

  const openFullscreen = async () => {
    setFullscreen(true);
    try {
      await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.LANDSCAPE);
    } catch (_) {}
  };

  const closeFullscreen = async () => {
    try {
      await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT_UP);
    } catch (_) {}
    setFullscreen(false);
  };

  return (
    <SafeAreaView style={styles.safe} edges={[]}>

      {/* ── Portrait map with tap-to-expand ── */}
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
        <TouchableOpacity onPress={openFullscreen} activeOpacity={0.92}>
          <Image
            source={VENUE_MAP_PNG}
            style={{ width: portraitMapW, height: portraitMapH }}
            resizeMode="contain"
          />
        </TouchableOpacity>
      </ScrollView>

      {/* Hint pill */}
      <View style={styles.hintRow} pointerEvents="none">
        <View style={styles.hintPill}>
          <Ionicons name="hand-left-outline" size={15} color={colors.textMuted} />
          <Text style={styles.hintText}>Pinch to zoom</Text>
        </View>
        <View style={styles.hintPill}>
          <Ionicons name="expand-outline" size={15} color={colors.textMuted} />
          <Text style={styles.hintText}>Tap to expand</Text>
        </View>
      </View>

      {/* ── Full-screen landscape modal ── */}
      <Modal
        visible={fullscreen}
        animationType="fade"
        presentationStyle="fullScreen"
        statusBarTranslucent
        onRequestClose={closeFullscreen}
      >
        <StatusBar hidden />
        <View style={styles.fullscreenContainer}>
          <ScrollView
            style={styles.fullscreenScroll}
            contentContainerStyle={styles.fullscreenContent}
            maximumZoomScale={5}
            minimumZoomScale={1}
            bouncesZoom
            showsHorizontalScrollIndicator={false}
            showsVerticalScrollIndicator={false}
            centerContent
          >
            <Image
              source={VENUE_MAP_PNG}
              style={{ width: landscapeW, height: landscapeH }}
              resizeMode="contain"
            />
          </ScrollView>

          {/* Rotate hint — only visible in portrait inside the modal */}
          {width < height && (
            <View style={styles.rotateHint} pointerEvents="none">
              <Ionicons name="phone-landscape-outline" size={18} color="rgba(255,255,255,0.8)" />
              <Text style={styles.rotateHintText}>Rotate for landscape view</Text>
            </View>
          )}

          {/* Close button */}
          <TouchableOpacity
            style={styles.closeBtn}
            onPress={closeFullscreen}
            hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
          >
            <View style={styles.closeBtnInner}>
              <Ionicons name="close" size={22} color={colors.white} />
            </View>
          </TouchableOpacity>
        </View>
      </Modal>

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

  // ── Portrait map ──
  mapScroll: { flex: 1, backgroundColor: '#111' },
  mapContent: { flex: 1, alignItems: 'center', justifyContent: 'center' },

  hintRow: {
    position: 'absolute',
    bottom: spacing.xl,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    gap: spacing.sm,
  },
  hintPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    backgroundColor: 'rgba(255,255,255,0.88)',
    borderRadius: radius.full,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    ...shadow.sm,
  },
  hintText: {
    fontFamily: fontFamily.bodySemi,
    color: colors.textMuted,
    fontSize: fontSize.sm,
  },

  // ── Fullscreen landscape ──
  fullscreenContainer: {
    flex: 1,
    backgroundColor: '#111',
  },
  fullscreenScroll: { flex: 1 },
  fullscreenContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rotateHint: {
    position: 'absolute',
    bottom: spacing.xl,
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: radius.full,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  rotateHintText: {
    fontFamily: fontFamily.bodySemi,
    color: 'rgba(255,255,255,0.85)',
    fontSize: fontSize.sm,
  },
  closeBtn: {
    position: 'absolute',
    top: spacing.md,
    right: spacing.md,
  },
  closeBtnInner: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(0,0,0,0.55)',
    alignItems: 'center',
    justifyContent: 'center',
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
