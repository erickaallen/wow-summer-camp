import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import RootNavigator from './src/navigation/RootNavigator';
import { AgendaProvider } from './src/hooks/AgendaContext';

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <AgendaProvider>
        <NavigationContainer>
          <StatusBar style="dark" />
          <RootNavigator />
        </NavigationContainer>
      </AgendaProvider>
    </GestureHandlerRootView>
  );
}
