import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { RootTabParamList } from '../types';
import { colors } from '../theme';
import HomeScreen from '../screens/HomeScreen';
import ScheduleStack from './ScheduleStack';
import SpeakersStack from './SpeakersStack';
import MapScreen from '../screens/MapScreen';
import MoreStack from './MoreStack';

const Tab = createBottomTabNavigator<RootTabParamList>();

type IoniconsName = React.ComponentProps<typeof Ionicons>['name'];

const TAB_ICONS: Record<string, { active: IoniconsName; inactive: IoniconsName }> = {
  Home: { active: 'home', inactive: 'home-outline' },
  Schedule: { active: 'calendar', inactive: 'calendar-outline' },
  Speakers: { active: 'people', inactive: 'people-outline' },
  Map: { active: 'map', inactive: 'map-outline' },
  More: { active: 'grid', inactive: 'grid-outline' },
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
          borderTopColor: colors.teal,
          borderTopWidth: 2,
        },
        tabBarLabelStyle: { fontWeight: '700', fontSize: 11 },
        tabBarIcon: ({ focused, color, size }) => {
          const icons = TAB_ICONS[route.name];
          const iconName = focused ? icons.active : icons.inactive;
          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Schedule" component={ScheduleStack} />
      <Tab.Screen name="Speakers" component={SpeakersStack} />
      <Tab.Screen name="Map" component={MapScreen} options={{ headerShown: false }} />
      <Tab.Screen name="More" component={MoreStack} />
    </Tab.Navigator>
  );
}
