import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { MoreStackParamList } from '../types';
import MoreScreen from '../screens/MoreScreen';
import SponsorsScreen from '../screens/SponsorsScreen';
import CheckInScreen from '../screens/CheckInScreen';
import ProfileScreen from '../screens/ProfileScreen';
import { colors } from '../theme';

const Stack = createNativeStackNavigator<MoreStackParamList>();

export default function MoreStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: colors.background }, headerShadowVisible: false,
        headerTintColor: colors.textDark,
        headerTitleStyle: { fontWeight: '800', color: colors.textDark, fontSize: 17 },
      }}
    >
      <Stack.Screen name="MoreMenu" component={MoreScreen} options={{ title: 'More' }} />
      <Stack.Screen name="Sponsors" component={SponsorsScreen} options={{ title: 'Sponsors' }} />
      <Stack.Screen name="CheckIn" component={CheckInScreen} options={{ title: 'Check In' }} />
      <Stack.Screen name="Profile" component={ProfileScreen} options={{ title: 'My Profile' }} />
    </Stack.Navigator>
  );
}
