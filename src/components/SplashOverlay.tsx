import React, { useEffect, useRef } from 'react';
import { Animated, Image, StyleSheet, Dimensions } from 'react-native';

const SPLASH = require('../../assets/splash-icon.png');
const { width, height } = Dimensions.get('window');

interface Props {
  onDone: () => void;
  duration?: number; // ms to show before fading — default 2000
}

export default function SplashOverlay({ onDone, duration = 2000 }: Props) {
  const opacity = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const showTimer = setTimeout(() => {
      Animated.timing(opacity, {
        toValue: 0,
        duration: 400,
        useNativeDriver: true,
      }).start(() => onDone());
    }, duration);

    return () => clearTimeout(showTimer);
  }, []);

  return (
    <Animated.View style={[styles.container, { opacity }]}>
      <Image source={SPLASH} style={styles.image} resizeMode="cover" />
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 999,
    backgroundColor: '#7DCEF0',
  },
  image: {
    width,
    height,
  },
});
