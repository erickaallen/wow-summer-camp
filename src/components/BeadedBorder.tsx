import React from 'react';
import { View, Text, StyleSheet, useWindowDimensions } from 'react-native';
import { colors } from '../theme';

// ─── Palette ─────────────────────────────────────────────────────────────────
const PALETTE = [
  colors.primary,
  colors.yellow,
  colors.teal,
  colors.blush,
  colors.tealLight,
  colors.primary,
  colors.yellow,
  colors.tealLight,
  colors.teal,
  colors.blush,
];

// ─── Bead dimensions ─────────────────────────────────────────────────────────
const BEAD_W     = 9;
const BEAD_H     = 13;
const BEAD_GAP   = 1.5;
const BEAD_PITCH = BEAD_W + BEAD_GAP;
const BETWEEN    = 2; // colored beads between letters

const MESSAGE = 'TRAILBLAZER';

// ─── Types ───────────────────────────────────────────────────────────────────
type ColorBead  = { type: 'color';  color: string };
type LetterBead = { type: 'letter'; char: string  };
type BeadDef    = ColorBead | LetterBead;

// ─── Component ───────────────────────────────────────────────────────────────
export default function BeadedBorder() {
  const { width } = useWindowDimensions();
  const totalBeads = Math.ceil(width / BEAD_PITCH) + 1;

  // Build the message segment: letters with colored beads between each
  const msgBeads: BeadDef[] = [];
  for (let i = 0; i < MESSAGE.length; i++) {
    msgBeads.push({ type: 'letter', char: MESSAGE[i] });
    if (i < MESSAGE.length - 1) {
      for (let j = 0; j < BETWEEN; j++) {
        msgBeads.push({ type: 'color', color: PALETTE[(i * BETWEEN + j) % PALETTE.length] });
      }
    }
  }

  // Center the message by computing equal padding on each side
  const padCount = Math.max(0, Math.floor((totalBeads - msgBeads.length) / 2));

  // Assemble full sequence: left pad → message → right pad (fill to edge)
  const seq: BeadDef[] = [];
  let ci = 0;
  const addColor = () => seq.push({ type: 'color', color: PALETTE[ci++ % PALETTE.length] });

  for (let i = 0; i < padCount; i++) addColor();
  seq.push(...msgBeads);
  while (seq.length < totalBeads) addColor();

  return (
    <View style={styles.strip}>
      {seq.map((def, i) => {
        const wobble = { transform: [{ translateY: Math.sin(i * 1.7) * 2.5 }] };

        if (def.type === 'letter') {
          return (
            <View key={i} style={[styles.bead, styles.letterBead, wobble]}>
              <Text style={styles.letterText}>{def.char}</Text>
            </View>
          );
        }

        return (
          <View key={i} style={[styles.bead, { backgroundColor: def.color }, wobble]} />
        );
      })}
    </View>
  );
}

// ─── Styles ──────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  strip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: BEAD_GAP,
    paddingHorizontal: 1,
    height: BEAD_H + 6,
    backgroundColor: colors.white,
    overflow: 'hidden',
  },
  bead: {
    width: BEAD_W,
    height: BEAD_H,
    borderRadius: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.25,
    shadowRadius: 1.5,
    elevation: 2,
  },
  letterBead: {
    backgroundColor: '#FFFFFF',
    borderWidth: 0.5,
    borderColor: '#DDD',
    alignItems: 'center',
    justifyContent: 'center',
  },
  letterText: {
    fontSize: 7,
    fontWeight: '900',
    color: '#111',
    lineHeight: 8,
    includeFontPadding: false,
  },
});
