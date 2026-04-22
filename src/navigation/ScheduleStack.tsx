import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ScheduleStackParamList } from '../types';
import ScheduleScreen from '../screens/ScheduleScreen';
import SessionDetailScreen from '../screens/SessionDetailScreen';
import { colors } from '../theme';

const Stack = createNativeStackNavigator<ScheduleStackParamList>();

export default function ScheduleStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: colors.background },
        headerTintColor: colors.primary,
        headerTitleStyle: { fontWeight: '800', color: colors.primary },
      }}
    >
      <Stack.Screen name="ScheduleList" component={ScheduleScreen} options={{ title: 'Schedule' }} />
      <Stack.Screen name="SessionDetail" component={SessionDetailScreen} options={{ title: 'Session' }} />
    </Stack.Navigator>
  );
}
