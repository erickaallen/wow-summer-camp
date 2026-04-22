import React from 'react';
import { View, Text, ScrollView, StyleSheet, SafeAreaView } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { ScheduleStackParamList } from '../types';
import { speakers } from '../data/speakers';
import { colors, spacing, fontSize, fontWeight, radius } from '../theme';

type Props = NativeStackScreenProps<ScheduleStackParamList, 'SessionDetail'>;

export default function SessionDetailScreen({ route, navigation }: Props) {
  const { session } = route.params;
  const speaker = session.speakerId ? speakers.find((s) => s.id === session.speakerId) : null;

  React.useLayoutEffect(() => {
    navigation.setOptions({ title: session.title });
  }, [navigation, session.title]);

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.header}>
          <Text style={styles.category}>{session.category.toUpperCase()}</Text>
          <Text style={styles.title}>{session.title}</Text>
          <Text style={styles.time}>{session.startTime} – {session.endTime}</Text>
          <Text style={styles.location}>📍 {session.location}</Text>
        </View>

        <Text style={styles.description}>{session.description}</Text>

        {speaker && (
          <View style={styles.speakerCard}>
            <Text style={styles.speakerEmoji}>{speaker.photoPlaceholder}</Text>
            <View style={styles.speakerInfo}>
              <Text style={styles.speakerName}>{speaker.name}</Text>
              <Text style={styles.speakerTitle}>{speaker.title}</Text>
              <Text style={styles.speakerCompany}>{speaker.company}</Text>
            </View>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  scroll: { padding: spacing.md },
  header: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 3,
    borderColor: colors.primary,
    padding: spacing.lg,
    marginBottom: spacing.md,
  },
  category: {
    color: colors.teal,
    fontSize: fontSize.xs,
    fontWeight: fontWeight.heavy,
    letterSpacing: 2,
    marginBottom: spacing.xs,
  },
  title: {
    color: colors.primary,
    fontSize: fontSize.xl,
    fontWeight: fontWeight.heavy,
    marginBottom: spacing.sm,
  },
  time: { color: colors.textDark, fontSize: fontSize.sm, fontWeight: fontWeight.bold },
  location: { color: '#888', fontSize: fontSize.sm, marginTop: spacing.xs },
  description: {
    color: '#444',
    fontSize: fontSize.md,
    lineHeight: 24,
    backgroundColor: colors.white,
    borderRadius: radius.md,
    padding: spacing.md,
    marginBottom: spacing.md,
  },
  speakerCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.accent,
    borderRadius: radius.md,
    borderWidth: 2,
    borderColor: colors.teal,
    padding: spacing.md,
  },
  speakerEmoji: { fontSize: 44, marginRight: spacing.md },
  speakerInfo: { flex: 1 },
  speakerName: { color: colors.textDark, fontSize: fontSize.md, fontWeight: fontWeight.heavy },
  speakerTitle: { color: '#555', fontSize: fontSize.sm },
  speakerCompany: { color: colors.teal, fontSize: fontSize.sm, fontWeight: fontWeight.bold },
});
