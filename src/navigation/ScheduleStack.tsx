import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ScheduleStackParamList } from '../types';
import ScheduleScreen from '../screens/ScheduleScreen';
import SessionDetailScreen from '../screens/SessionDetailScreen';
import CounselorSessionDetailScreen from '../screens/CounselorSessionDetailScreen';
import { colors, fontFamily } from '../theme';

const Stack = createNativeStackNavigator<ScheduleStackParamList>();

export default function ScheduleStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: colors.background }, headerShadowVisible: false,
        headerTintColor: colors.textDark,
        headerTitleStyle: { fontFamily: fontFamily.display, color: colors.textDark, fontSize: 17 },
        headerBackTitle: 'Back',
      }}
    >
      <Stack.Screen name="ScheduleList" component={ScheduleScreen} options={{ title: 'Schedule' }} />
      <Stack.Screen name="SessionDetail" component={SessionDetailScreen} options={{ title: 'Session' }} />
      <Stack.Screen name="CounselorSessionDetail" component={CounselorSessionDetailScreen} options={{ title: 'Session Detail' }} />
    </Stack.Navigator>
  );
}
