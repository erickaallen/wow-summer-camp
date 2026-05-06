import React from 'react';
import { View } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { RootTabParamList } from '../types';
import { colors, shadow, fontFamily } from '../theme';
import BeadedBorder from '../components/BeadedBorder';
import HomeScreen from '../screens/HomeScreen';
import ScheduleStack from './ScheduleStack';
import CounselorsStack from './CounselorsStack';
import MapStack from './MapStack';
import MoreStack from './MoreStack';

const Tab = createBottomTabNavigator<RootTabParamList>();

type IoniconsName = React.ComponentProps<typeof Ionicons>['name'];

const TAB_ICONS: Record<string, { active: IoniconsName; inactive: IoniconsName }> = {
  Home:      { active: 'home',     inactive: 'home-outline'     },
  Schedule:  { active: 'calendar', inactive: 'calendar-outline' },
  Counselors:{ active: 'people',   inactive: 'people-outline'   },
  Map:       { active: 'map',      inactive: 'map-outline'      },
  More:      { active: 'grid',     inactive: 'grid-outline'     },
};

export default function RootNavigator() {
  const insets = useSafeAreaInsets();
  const tabBarHeight = 65 + insets.bottom;

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: colors.tabBarActive,
        tabBarInactiveTintColor: colors.tabBarInactive,
        tabBarBackground: () => (
          <View style={{ flex: 1, backgroundColor: colors.tabBar }}>
            <BeadedBorder />
          </View>
        ),
        tabBarStyle: {
          backgroundColor: 'transparent',
          borderTopWidth: 0,
          ...shadow.md,
          height: tabBarHeight,
          paddingBottom: insets.bottom + 4,
          paddingTop: 21,
        },
        tabBarLabelStyle: {
          fontFamily: fontFamily.subheading,
          fontSize: 10,
          letterSpacing: 0.3,
        },
        tabBarIcon: ({ focused, color, size }) => {
          const icons = TAB_ICONS[route.name];
          return (
            <Ionicons
              name={focused ? icons.active : icons.inactive}
              size={focused ? size + 1 : size}
              color={color}
            />
          );
        },
      })}
    >
      <Tab.Screen name="Home"       component={HomeScreen} />
      <Tab.Screen name="Schedule"   component={ScheduleStack} />
      <Tab.Screen name="Counselors" component={CounselorsStack} />
      <Tab.Screen name="Map"        component={MapStack} />
      <Tab.Screen name="More"       component={MoreStack} />
    </Tab.Navigator>
  );
}
