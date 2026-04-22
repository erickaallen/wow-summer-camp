import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SpeakersStackParamList } from '../types';
import SpeakersScreen from '../screens/SpeakersScreen';
import SpeakerDetailScreen from '../screens/SpeakerDetailScreen';
import { colors } from '../theme';

const Stack = createNativeStackNavigator<SpeakersStackParamList>();

export default function SpeakersStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: colors.background },
        headerTintColor: colors.primary,
        headerTitleStyle: { fontWeight: '800', color: colors.primary },
      }}
    >
      <Stack.Screen name="SpeakerList" component={SpeakersScreen} options={{ title: 'Speakers' }} />
      <Stack.Screen name="SpeakerDetail" component={SpeakerDetailScreen} options={{ title: 'Speaker' }} />
    </Stack.Navigator>
  );
}
