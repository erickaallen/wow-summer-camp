import 'react-native-gesture-handler';
import * as SplashScreen from 'expo-splash-screen';
import { registerRootComponent } from 'expo';

import App from './App';

// Must be called as early as possible to prevent the splash from auto-hiding
SplashScreen.preventAutoHideAsync();

// registerRootComponent calls AppRegistry.registerComponent('main', () => App);
// It also ensures that whether you load the app in Expo Go or in a native build,
// the environment is set up appropriately
registerRootComponent(App);
