import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { CounselorsStackParamList } from '../types';
import CounselorsScreen from '../screens/CounselorsScreen';
import CounselorDetailScreen from '../screens/CounselorDetailScreen';
import { colors } from '../theme';

const Stack = createNativeStackNavigator<CounselorsStackParamList>();

export default function CounselorsStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: colors.background }, headerShadowVisible: false,
        headerTintColor: colors.primary,
        headerTitleStyle: { fontWeight: '800', color: colors.textDark, fontSize: 17 },
      }}
    >
      <Stack.Screen name="CounselorList" component={CounselorsScreen} options={{ title: 'Camp Counselors' }} />
      <Stack.Screen name="CounselorDetail" component={CounselorDetailScreen} options={{ title: 'Counselor' }} />
    </Stack.Navigator>
  );
}
