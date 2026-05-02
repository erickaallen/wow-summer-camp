import React from 'react';
import { StyleSheet, ViewStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { tieDyeGradient, tieDyeMiniGradient } from '../theme';

interface Props {
  style?: ViewStyle | ViewStyle[];
  children?: React.ReactNode;
  mini?: boolean;  // true → 3-stop mini gradient for smaller elements
}

/**
 * Reusable tie-dye pastel gradient background.
 * Wraps children over a diagonal blue→lavender→pink→peach→yellow gradient
 * extracted from the WOW Summer Camp counselor shirts.
 */
export default function TieDyeGradient({ style, children, mini = false }: Props) {
  const g = mini ? tieDyeMiniGradient : tieDyeGradient;
  return (
    <LinearGradient
      colors={[...g.colors]}
      start={g.start}
      end={g.end}
      style={[styles.base, style]}
    >
      {children}
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  base: { overflow: 'hidden' },
});
