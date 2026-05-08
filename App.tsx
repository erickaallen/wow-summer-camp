import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import * as SplashScreen from 'expo-splash-screen';
import { useFonts, Corben_700Bold } from '@expo-google-fonts/corben';
import {
  Raleway_400Regular,
  Raleway_600SemiBold,
  Raleway_700Bold,
} from '@expo-google-fonts/raleway';
import { Barlow_500Medium, Barlow_700Bold } from '@expo-google-fonts/barlow';
import RootNavigator from './src/navigation/RootNavigator';
import { AgendaProvider } from './src/hooks/AgendaContext';
import SplashOverlay from './src/components/SplashOverlay';

export default function App() {
  const [splashDone, setSplashDone] = useState(false);
  const [fontsLoaded] = useFonts({
    Corben_700Bold,
    Raleway_400Regular,
    Raleway_600SemiBold,
    Raleway_700Bold,
    Barlow_500Medium,
    Barlow_700Bold,
  });

  useEffect(() => {
    if (fontsLoaded) {
      // Hand off from native static splash to our video overlay immediately
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) return null;

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <AgendaProvider>
          <NavigationContainer>
            <StatusBar style="dark" />
            <RootNavigator />
          </NavigationContainer>
        </AgendaProvider>
      </SafeAreaProvider>
      {!splashDone && (
        <SplashOverlay onDone={() => setSplashDone(true)} />
      )}
    </GestureHandlerRootView>
  );
}
