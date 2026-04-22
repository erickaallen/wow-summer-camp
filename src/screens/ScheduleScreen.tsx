import React, { useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { ScheduleStackParamList, Session, EventDay } from '../types';
import { sessions } from '../data/sessions';
import { colors, spacing, fontSize, fontWeight, radius } from '../theme';

type Props = NativeStackScreenProps<ScheduleStackParamList, 'ScheduleList'>;

const CATEGORY_COLORS: Record<Session['category'], string> = {
  keynote: colors.primary,
  workshop: colors.teal,
  panel: '#9B59B6',
  break: '#95A5A6',
  networking: colors.accent,
};

export default function ScheduleScreen({ navigation }: Props) {
  const [activeDay, setActiveDay] = useState<EventDay>('day1');
  const filtered = sessions.filter((s) => s.day === activeDay);

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.tabs}>
        {(['day1', 'day2'] as EventDay[]).map((day) => (
          <TouchableOpacity
            key={day}
            style={[styles.tab, activeDay === day && styles.tabActive]}
            onPress={() => setActiveDay(day)}
          >
            <Text style={[styles.tabText, activeDay === day && styles.tabTextActive]}>
              {day === 'day1' ? 'MAY 26' : 'MAY 27'}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.card}
            onPress={() => navigation.navigate('SessionDetail', { session: item })}
            activeOpacity={0.8}
          >
            <View style={[styles.categoryDot, { backgroundColor: CATEGORY_COLORS[item.category] }]} />
            <View style={styles.cardContent}>
              <Text style={styles.time}>{item.startTime} – {item.endTime}</Text>
              <Text style={styles.sessionTitle}>{item.title}</Text>
              <Text style={styles.location}>📍 {item.location}</Text>
            </View>
            <Text style={styles.chevron}>›</Text>
          </TouchableOpacity>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  tabs: {
    flexDirection: 'row',
    margin: spacing.md,
    backgroundColor: colors.white,
    borderRadius: radius.full,
    borderWidth: 2,
    borderColor: colors.primary,
    overflow: 'hidden',
  },
  tab: {
    flex: 1,
    paddingVertical: spacing.sm,
    alignItems: 'center',
  },
  tabActive: { backgroundColor: colors.primary },
  tabText: { color: colors.primary, fontWeight: fontWeight.bold, fontSize: fontSize.sm, letterSpacing: 1 },
  tabTextActive: { color: colors.white },
  list: { paddingHorizontal: spacing.md, paddingBottom: spacing.xxl },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: radius.md,
    padding: spacing.md,
    marginBottom: spacing.sm,
    borderWidth: 1,
    borderColor: colors.surface,
  },
  categoryDot: {
    width: 10,
    height: 10,
    borderRadius: radius.full,
    marginRight: spacing.sm,
    alignSelf: 'flex-start',
    marginTop: 4,
  },
  cardContent: { flex: 1 },
  time: { color: colors.teal, fontSize: fontSize.xs, fontWeight: fontWeight.bold, letterSpacing: 0.5 },
  sessionTitle: { color: colors.textDark, fontSize: fontSize.md, fontWeight: fontWeight.bold, marginVertical: 2 },
  location: { color: '#888', fontSize: fontSize.xs },
  chevron: { color: colors.primary, fontSize: 22, fontWeight: fontWeight.bold },
});
