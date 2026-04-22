import React from 'react';
import { View, Text, ScrollView, StyleSheet, SafeAreaView, TouchableOpacity } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { SpeakersStackParamList } from '../types';
import { sessions } from '../data/sessions';
import { colors, spacing, fontSize, fontWeight, radius } from '../theme';

type Props = NativeStackScreenProps<SpeakersStackParamList, 'SpeakerDetail'>;

export default function SpeakerDetailScreen({ route, navigation }: Props) {
  const { speaker } = route.params;
  const speakerSessions = sessions.filter((s) => s.speakerId === speaker.id);

  React.useLayoutEffect(() => {
    navigation.setOptions({ title: speaker.name });
  }, [navigation, speaker.name]);

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.heroCard}>
          <Text style={styles.avatar}>{speaker.photoPlaceholder}</Text>
          <Text style={styles.name}>{speaker.name}</Text>
          <Text style={styles.title}>{speaker.title}</Text>
          <Text style={styles.company}>{speaker.company}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionLabel}>ABOUT</Text>
          <Text style={styles.bio}>{speaker.bio}</Text>
        </View>

        {speakerSessions.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>SESSIONS</Text>
            {speakerSessions.map((s) => (
              <View key={s.id} style={styles.sessionRow}>
                <Text style={styles.sessionTime}>{s.startTime} · {s.day === 'day1' ? 'May 26' : 'May 27'}</Text>
                <Text style={styles.sessionTitle}>{s.title}</Text>
                <Text style={styles.sessionLocation}>📍 {s.location}</Text>
              </View>
            ))}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  scroll: { padding: spacing.md },
  heroCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 3,
    borderColor: colors.primary,
    padding: spacing.xl,
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  avatar: { fontSize: 64, marginBottom: spacing.sm },
  name: { color: colors.primary, fontSize: fontSize.xl, fontWeight: fontWeight.heavy, textAlign: 'center' },
  title: { color: '#555', fontSize: fontSize.sm, marginTop: spacing.xs },
  company: { color: colors.teal, fontSize: fontSize.sm, fontWeight: fontWeight.bold, marginTop: 2 },
  section: {
    backgroundColor: colors.white,
    borderRadius: radius.md,
    padding: spacing.md,
    marginBottom: spacing.sm,
  },
  sectionLabel: {
    color: colors.teal,
    fontSize: fontSize.xs,
    fontWeight: fontWeight.heavy,
    letterSpacing: 2,
    marginBottom: spacing.sm,
  },
  bio: { color: '#444', fontSize: fontSize.md, lineHeight: 24 },
  sessionRow: {
    borderLeftWidth: 3,
    borderLeftColor: colors.primary,
    paddingLeft: spacing.sm,
    marginBottom: spacing.sm,
  },
  sessionTime: { color: colors.teal, fontSize: fontSize.xs, fontWeight: fontWeight.bold },
  sessionTitle: { color: colors.textDark, fontSize: fontSize.md, fontWeight: fontWeight.bold, marginVertical: 2 },
  sessionLocation: { color: '#888', fontSize: fontSize.xs },
});
