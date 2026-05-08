import { SafeAreaView } from 'react-native-safe-area-context';
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  Dimensions,
} from 'react-native';
import { GestureDetector, Gesture } from 'react-native-gesture-handler';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
} from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, fontSize, fontFamily, radius, shadow } from '../theme';

const VENUE_MAP_PNG = require('../../assets/images/venue-map-1.png');
const MAP_NATURAL_W = 750;
const MAP_NATURAL_H = 580;
const SCREEN_W = Dimensions.get('window').width;

const MIN_SCALE = 1;
const MAX_SCALE = 5;

export default function MapScreen() {
  const scale = useSharedValue(1);
  const savedScale = useSharedValue(1);
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const savedX = useSharedValue(0);
  const savedY = useSharedValue(0);

  const pinch = Gesture.Pinch()
    .onUpdate((e) => {
      scale.value = Math.min(Math.max(savedScale.value * e.scale, MIN_SCALE), MAX_SCALE);
    })
    .onEnd(() => {
      savedScale.value = scale.value;
      if (scale.value <= MIN_SCALE) {
        translateX.value = 0;
        translateY.value = 0;
        savedX.value = 0;
        savedY.value = 0;
      }
    });

  const pan = Gesture.Pan()
    .onUpdate((e) => {
      translateX.value = savedX.value + e.translationX;
      translateY.value = savedY.value + e.translationY;
    })
    .onEnd(() => {
      savedX.value = translateX.value;
      savedY.value = translateY.value;
    });

  const gesture = Gesture.Simultaneous(pinch, pan);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: translateX.value },
      { translateY: translateY.value },
      { scale: scale.value },
    ],
  }));

  return (
    <SafeAreaView style={styles.safe} edges={[]}>
      <GestureDetector gesture={gesture}>
        <Animated.View style={[styles.canvas, animatedStyle]}>
          <View style={styles.mapWrapper}>
            <Image
              source={VENUE_MAP_PNG}
              style={styles.mapImage}
              resizeMode="contain"
            />
          </View>
        </Animated.View>
      </GestureDetector>

      <View style={styles.hintRow} pointerEvents="none">
        <View style={styles.hintPill}>
          <Ionicons name="hand-left-outline" size={15} color={colors.textMuted} />
          <Text style={styles.hintText}>Pinch to zoom</Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#111' },

  canvas: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },

  mapWrapper: {
    width: SCREEN_W,
    height: SCREEN_W * (MAP_NATURAL_W / MAP_NATURAL_H),
  },

  mapImage: {
    width: SCREEN_W * (MAP_NATURAL_W / MAP_NATURAL_H),
    height: SCREEN_W,
    position: 'absolute',
    top: SCREEN_W * (MAP_NATURAL_W / MAP_NATURAL_H - 1) / 2,
    left: -SCREEN_W * (MAP_NATURAL_W / MAP_NATURAL_H - 1) / 2,
    transform: [{ rotate: '90deg' }],
  },

  hintRow: {
    position: 'absolute',
    bottom: spacing.xl,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
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
});
