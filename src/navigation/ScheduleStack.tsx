import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ScheduleStackParamList } from '../types';
import ScheduleScreen from '../screens/ScheduleScreen';
import SessionDetailScreen from '../screens/SessionDetailScreen';
import CampfireSlotScreen from '../screens/CampfireSlotScreen';
import CounselorSessionDetailScreen from '../screens/CounselorSessionDetailScreen';
import { colors } from '../theme';

const Stack = createNativeStackNavigator<ScheduleStackParamList>();

export default function ScheduleStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: colors.background }, headerShadowVisible: false,
        headerTintColor: colors.primary,
        headerTitleStyle: { fontWeight: '800', color: colors.textDark, fontSize: 17 },
      }}
    >
      <Stack.Screen name="ScheduleList" component={ScheduleScreen} options={{ title: 'Schedule' }} />
      <Stack.Screen name="SessionDetail" component={SessionDetailScreen} options={{ title: 'Session' }} />
      <Stack.Screen name="CampfireSlot" component={CampfireSlotScreen} options={{ title: 'Choose Your Campfire' }} />
      <Stack.Screen name="CounselorSessionDetail" component={CounselorSessionDetailScreen} options={{ title: 'Session Detail' }} />
    </Stack.Navigator>
  );
}
