import React from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, SafeAreaView } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { SpeakersStackParamList } from '../types';
import { speakers } from '../data/speakers';
import { sessions } from '../data/sessions';
import { colors, spacing, fontSize, fontWeight, radius } from '../theme';

type Props = NativeStackScreenProps<SpeakersStackParamList, 'SpeakerList'>;

export default function SpeakersScreen({ navigation }: Props) {
  return (
    <SafeAreaView style={styles.safe}>
      <FlatList
        data={speakers}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        ListHeaderComponent={<Text style={styles.heading}>SPEAKERS & FACILITATORS</Text>}
        renderItem={({ item }) => {
          const speakerSessions = sessions.filter((s) => s.speakerId === item.id);
          return (
            <TouchableOpacity
              style={styles.card}
              onPress={() => navigation.navigate('SpeakerDetail', { speaker: item })}
              activeOpacity={0.8}
            >
              <Text style={styles.avatar}>{item.photoPlaceholder}</Text>
              <View style={styles.info}>
                <Text style={styles.name}>{item.name}</Text>
                <Text style={styles.title}>{item.title}</Text>
                <Text style={styles.company}>{item.company}</Text>
                {speakerSessions.length > 0 && (
                  <Text style={styles.sessionCount}>
                    {speakerSessions.length} session{speakerSessions.length > 1 ? 's' : ''}
                  </Text>
                )}
              </View>
              <Text style={styles.chevron}>›</Text>
            </TouchableOpacity>
          );
        }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  list: { padding: spacing.md, paddingBottom: spacing.xxl },
  heading: {
    color: colors.primary,
    fontSize: fontSize.md,
    fontWeight: fontWeight.heavy,
    letterSpacing: 2,
    marginBottom: spacing.md,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: radius.md,
    padding: spacing.md,
    marginBottom: spacing.sm,
    borderWidth: 2,
    borderColor: colors.surface,
  },
  avatar: { fontSize: 40, marginRight: spacing.md },
  info: { flex: 1 },
  name: { color: colors.textDark, fontSize: fontSize.md, fontWeight: fontWeight.heavy },
  title: { color: '#555', fontSize: fontSize.sm },
  company: { color: colors.teal, fontSize: fontSize.sm, fontWeight: fontWeight.bold },
  sessionCount: {
    marginTop: spacing.xs,
    color: colors.primary,
    fontSize: fontSize.xs,
    fontWeight: fontWeight.bold,
  },
  chevron: { color: colors.primary, fontSize: 22, fontWeight: fontWeight.bold },
});
