import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { MapStackParamList } from '../types';
import MapScreen from '../screens/MapScreen';
import { colors, fontFamily } from '../theme';

const Stack = createNativeStackNavigator<MapStackParamList>();

export default function MapStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: colors.background },
        headerShadowVisible: false,
        headerTintColor: colors.textDark,
        headerTitleStyle: { fontFamily: fontFamily.display, color: colors.textDark, fontSize: 17 },
      }}
    >
      <Stack.Screen
        name="MapMain"
        component={MapScreen}
        options={{ title: 'Venue Map' }}
      />
    </Stack.Navigator>
  );
}
