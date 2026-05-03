import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import * as SplashScreen from 'expo-splash-screen';
import RootNavigator from './src/navigation/RootNavigator';
import { AgendaProvider } from './src/hooks/AgendaContext';
import SplashOverlay from './src/components/SplashOverlay';

export default function App() {
  const [splashDone, setSplashDone] = useState(false);

  useEffect(() => {
    // Hide the native splash (works in real builds) as soon as JS is ready
    const timer = setTimeout(() => {
      SplashScreen.hideAsync();
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <AgendaProvider>
          <NavigationContainer>
            <StatusBar style="dark" />
            <RootNavigator />
          </NavigationContainer>
        </AgendaProvider>

        {/* Fake splash — visible in Expo Go where native splash doesn't work */}
        {!splashDone && (
          <SplashOverlay duration={5000} onDone={() => setSplashDone(true)} />
        )}
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
