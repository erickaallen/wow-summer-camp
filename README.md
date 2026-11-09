# WOW Summer Camp

Companion mobile app for WOW Summer Camp 2026, a two-day conference for leaders and creatives hosted by [Woman Owned Wallet](https://www.womanownedwallet.com) in Louisville, KY (May 26 to 27, 2026).

Built solo by [Ericka Allen](https://higherrealmsdigital.com) of Higher Realms Digital, from first commit to App Store release in about five weeks (April 22 to May 26, 2026). Roughly 100 to 150 attendees used it over the event weekend.

**Status:** live on the iOS App Store. Android build submitted to Google Play, release pending.

The app and its branding belong to Woman Owned Wallet. The source is published here with the owner's permission as a sample of my work. Counselor email addresses have been removed from the data files and from the commit history.

## What it does

- **Phase-aware home screen.** The home screen changes with the event: countdown and prep checklist before camp, live schedule and announcements during, feedback survey and "share your photos" after. Phase is derived from the device clock (`src/utils/eventPhase.ts`), with a `FORCE_PHASE` override for previewing each state during development.
- **Schedule and personal agenda.** Full two-day schedule plus campfire breakout rotations across the venue. Attendees star sessions into a personal agenda and set reminders that fire as local notifications on their device.
- **Counselors.** Bios, session descriptions, Instagram handles and headshots for the 30-plus session leaders and panelists, grouped by track.
- **QR check-in.** A check-in code generated on-device from the attendee's ticket email, so check-in works with no network and no attendee data leaving the phone.
- **Share My Contact.** Attendees fill in a networking profile once and share it as a vCard from any screen, straight into the other person's contacts.
- **Map, sponsors, announcements, about.** Venue map with campfire locations, sponsor directory with outbound links, time-windowed announcements, and an about screen that reads its version from the build.

## Stack

- Expo SDK 54, React Native 0.81, React 19, TypeScript
- React Navigation 7 (bottom tabs plus native stacks)
- expo-notifications for local reminders, AsyncStorage for agenda, checklist, profile and reminder state
- react-native-qrcode-svg for check-in codes; expo-file-system and expo-sharing for vCard export
- react-native-maps, Reanimated 4, expo-linear-gradient, Google Fonts via expo-font (Corben, Raleway, Barlow)
- EAS Build and EAS Update; a small custom config plugin (`plugins/remove-android-permissions.js`) strips a permission a dependency added to the Android manifest so the build passes Google Play review

## Design decisions worth knowing

**No backend, by choice.** Schedule, counselors, sponsors and announcements live as typed TypeScript data in `src/data/`. For a single weekend event with a fixed program and a five-week build window, a backend would have added hosting, auth and a CMS without changing what attendees saw. Content updates shipped through EAS Update instead. If this were a recurring or multi-event product, the data layer is already isolated behind types, so swapping in an API is a contained change.

**Everything stays on the device.** There is no account, no login and no analytics. Profile, agenda and reminders are stored locally. The check-in QR encodes the ticket email on the phone. This kept the privacy story simple for a small community event and kept the app out of the data-collection questions on both store reviews.

**Time windows over feature flags.** Announcements and the home screen read the clock rather than a remote flag, so the app behaved correctly across the weekend without anyone touching a dashboard.

## Project layout

```
src/
  components/   BeadedBorder, HeadshotAvatar, SplashOverlay
  data/         typed static content: sessions, counselors, rotations, locations, sponsors, announcements
  hooks/        useAgenda, useReminders, useChecklist, useProfile (+ AgendaContext)
  navigation/   root tabs and per-tab native stacks
  screens/      Home, Schedule, SessionDetail, Counselors, CounselorDetail, CounselorSessionDetail,
                Map, Sponsors, CheckIn, Profile, More, AboutApp
  theme/        colors, type scale, spacing
  types/        shared interfaces
  utils/        eventPhase, sessionTime, vcard
plugins/        Expo config plugin for Android manifest permissions
```

## Running it

```bash
npm install
npx expo start
```

Notifications need a development build rather than Expo Go (expo-notifications left Expo Go in SDK 53). Build profiles live in `eas.json`:

| Build | Command |
|---|---|
| iOS dev client (installs alongside production via the `.dev` bundle ID) | `eas build --profile ios-dev --platform ios` |
| iOS production | `eas build --profile ios-prod --platform ios` |
| Android app bundle | `eas build --profile android --platform android` |
| Android APK (internal testing) | `eas build --profile android-apk --platform android` |

`app.config.js` switches the bundle identifier based on `APP_ENV`. App Store submit credentials are kept outside the repo.

## Credits

Client and owner: Amanda Dare, Woman Owned Wallet. Design, engineering and store releases: Ericka Allen, Higher Realms Digital.
