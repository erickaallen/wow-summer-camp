import React from 'react';
import { TouchableOpacity } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { ScheduleStackParamList } from '../types';
import ScheduleScreen from '../screens/ScheduleScreen';
import SessionDetailScreen from '../screens/SessionDetailScreen';
import CounselorSessionDetailScreen from '../screens/CounselorSessionDetailScreen';
import { colors, fontFamily } from '../theme';

const Stack = createNativeStackNavigator<ScheduleStackParamList>();

export default function ScheduleStack() {
  return (
    <Stack.Navigator
      screenOptions={({ navigation }) => ({
        headerStyle: { backgroundColor: colors.background }, headerShadowVisible: false,
        headerTintColor: colors.textDark,
        headerTitleAlign: 'center',
        headerTitleStyle: { fontFamily: fontFamily.display, color: colors.textDark, fontSize: 17 },
        headerLeft: ({ canGoBack }) =>
          canGoBack ? (
            <TouchableOpacity onPress={() => navigation.goBack()} hitSlop={8} style={{ marginLeft: 4 }}>
              <Ionicons name="chevron-back" size={28} color={colors.textDark} />
            </TouchableOpacity>
          ) : null,
      })}
    >
      <Stack.Screen name="ScheduleList" component={ScheduleScreen} options={{ title: 'Schedule' }} />
      <Stack.Screen name="SessionDetail" component={SessionDetailScreen} options={{ title: 'Session' }} />
      <Stack.Screen name="CounselorSessionDetail" component={CounselorSessionDetailScreen} options={{ title: 'Campfire Session' }} />
    </Stack.Navigator>
  );
}
