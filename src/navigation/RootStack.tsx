import React from 'react';
import { TouchableOpacity } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { RootStackParamList } from '../types';
import RootNavigator from './RootNavigator';
import SessionDetailScreen from '../screens/SessionDetailScreen';
import CounselorDetailScreen from '../screens/CounselorDetailScreen';
import CounselorSessionDetailScreen from '../screens/CounselorSessionDetailScreen';
import { colors, fontFamily } from '../theme';

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function RootStack() {
  return (
    <Stack.Navigator
      screenOptions={({ navigation }) => ({
        headerStyle: { backgroundColor: colors.background },
        headerShadowVisible: false,
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
      <Stack.Screen name="Tabs" component={RootNavigator} options={{ headerShown: false }} />
      <Stack.Screen name="SessionDetail" component={SessionDetailScreen} options={{ title: 'Session Details' }} />
      <Stack.Screen name="CounselorDetail" component={CounselorDetailScreen} options={{ title: 'Meet Your Counselor' }} />
      <Stack.Screen name="CounselorSessionDetail" component={CounselorSessionDetailScreen} options={{ title: 'Session Details' }} />
    </Stack.Navigator>
  );
}
