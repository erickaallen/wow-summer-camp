import React from 'react';
import { TouchableOpacity } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { MoreStackParamList } from '../types';
import MoreScreen from '../screens/MoreScreen';
import SponsorsScreen from '../screens/SponsorsScreen';
import CheckInScreen from '../screens/CheckInScreen';
import ProfileScreen from '../screens/ProfileScreen';
import { colors, fontFamily } from '../theme';

const Stack = createNativeStackNavigator<MoreStackParamList>();

export default function MoreStack() {
  return (
    <Stack.Navigator
      screenOptions={({ navigation }) => ({
        headerStyle: { backgroundColor: colors.background }, headerShadowVisible: false,
        headerTintColor: colors.textDark,
        headerTitleStyle: { fontFamily: fontFamily.display, color: colors.textDark, fontSize: 17 },
        headerLeft: ({ canGoBack }) =>
          canGoBack ? (
            <TouchableOpacity onPress={() => navigation.goBack()} hitSlop={8} style={{ marginLeft: 4 }}>
              <Ionicons name="chevron-back" size={28} color={colors.textDark} />
            </TouchableOpacity>
          ) : null,
      })}
    >
      <Stack.Screen name="MoreMenu" component={MoreScreen} options={{ title: 'More' }} />
      <Stack.Screen name="Sponsors" component={SponsorsScreen} options={{ title: 'Sponsors' }} />
      <Stack.Screen name="CheckIn" component={CheckInScreen} options={{ title: 'Check In' }} />
      <Stack.Screen name="Profile" component={ProfileScreen} options={{ title: 'My Profile' }} />
    </Stack.Navigator>
  );
}
