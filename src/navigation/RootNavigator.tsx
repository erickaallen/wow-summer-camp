import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { RootTabParamList } from '../types';
import { colors, shadow } from '../theme';
import HomeScreen from '../screens/HomeScreen';
import ScheduleStack from './ScheduleStack';
import CounselorsStack from './CounselorsStack';
import MapScreen from '../screens/MapScreen';
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
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: colors.tabBarActive,
        tabBarInactiveTintColor: colors.tabBarInactive,
        tabBarStyle: {
          backgroundColor: colors.tabBar,
          borderTopWidth: 0,
          ...shadow.md,
          height: 60,
          paddingBottom: 8,
          paddingTop: 4,
        },
        tabBarLabelStyle: {
          fontWeight: '700',
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
      <Tab.Screen name="Home"       component={HomeScreen}    />
      <Tab.Screen name="Schedule"   component={ScheduleStack} />
      <Tab.Screen name="Counselors" component={CounselorsStack} />
      <Tab.Screen name="Map"        component={MapScreen}     options={{ headerShown: false }} />
      <Tab.Screen name="More"       component={MoreStack}     />
    </Tab.Navigator>
  );
}
