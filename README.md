# wow-summer-camp
Mobile App for WOW Summer Camp 2026 Event

## Building

Builds are managed with EAS. Use the appropriate profile and platform flag:

| Build | Command |
|-------|---------|
| iOS dev (internal, `.dev` bundle ID) | `eas build --profile ios-dev --platform ios` |
| iOS production (App Store) | `eas build --profile ios-prod --platform ios` |
| Submit iOS to App Store | `eas submit --profile ios-prod --platform ios` |
| Android APK (internal) | `eas build --profile android --platform android` |

The `ios-dev` profile uses the bundle ID `com.womanownedwallet.summercamp.dev` so it installs alongside the production app on the same device. This is handled automatically via `app.config.js` — no manual changes needed when switching profiles.
