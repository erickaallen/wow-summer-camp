import React, { useRef, useEffect } from 'react';
import { Animated, StyleSheet } from 'react-native';
import { useVideoPlayer, VideoView } from 'expo-video';

const SPLASH_VIDEO = require('../../assets/splash-screen-animation.mp4');

interface Props {
  onDone: () => void;
}

export default function SplashOverlay({ onDone }: Props) {
  const opacity = useRef(new Animated.Value(1)).current;
  const player = useVideoPlayer(SPLASH_VIDEO, p => {
    p.muted = true;
    p.loop = false;
    p.play();
  });

  useEffect(() => {
    const sub = player.addListener('playToEnd', () => {
      Animated.timing(opacity, {
        toValue: 0,
        duration: 400,
        useNativeDriver: true,
      }).start(() => onDone());
    });
    return () => sub.remove();
  }, [player]);

  return (
    <Animated.View style={[styles.container, { opacity }]}>
      <VideoView
        player={player}
        style={styles.video}
        contentFit="cover"
        nativeControls={false}
      />
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 999,
    backgroundColor: '#000',
  },
  video: {
    ...StyleSheet.absoluteFillObject,
  },
});
