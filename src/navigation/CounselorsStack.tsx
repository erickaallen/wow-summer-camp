import React from 'react';
import { TouchableOpacity } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { CounselorsStackParamList } from '../types';
import CounselorsScreen from '../screens/CounselorsScreen';
import { colors, fontFamily } from '../theme';

const Stack = createNativeStackNavigator<CounselorsStackParamList>();

export default function CounselorsStack() {
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
      <Stack.Screen name="CounselorList" component={CounselorsScreen} options={{ title: 'Camp Counselors' }} />
    </Stack.Navigator>
  );
}
