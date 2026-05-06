import React from 'react';
import { View, Image, Text, StyleSheet } from 'react-native';
import { colors, fontFamily } from '../theme';

interface Props {
  source?: number;         // require() image
  name: string;            // fallback initial
  size: number;            // diameter in px
  borderColor?: string;
  borderWidth?: number;
}

export default function HeadshotAvatar({
  source,
  name,
  size,
  borderColor = colors.border,
  borderWidth = 2,
}: Props) {
  const radius = size / 2;

  if (!source) {
    return (
      <View style={[
        styles.placeholder,
        { width: size, height: size, borderRadius: radius, backgroundColor: borderColor },
      ]}>
        <Text style={[styles.initial, { fontSize: size * 0.38 }]}>
          {name.charAt(0).toUpperCase()}
        </Text>
      </View>
    );
  }

  return (
    <View style={{
      width: size,
      height: size,
      borderRadius: radius,
      overflow: 'hidden',
      borderWidth,
      borderColor,
    }}>
      <Image
        source={source}
        style={{
          width: size,
          height: size,
          top: 0,
        }}
        resizeMode="cover"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  placeholder: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  initial: {
    fontFamily: fontFamily.display,
    color: colors.white,
  },
});
