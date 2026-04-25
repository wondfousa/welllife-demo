# WELLlife Care — Build & Submit Guide

This project wraps `www/index.html` into a native iOS + Android app using
[Capacitor 6](https://capacitorjs.com). The web UI is unchanged for the
desktop demo (open `index.html` in a browser to preview the device-frame
mockup); inside the native shell, a small boot script applies overrides
to make the layout full-screen with proper safe-area handling.

---

## Project layout

```
welllife app/
├── index.html              ← original demo (with device frame, for browser preview)
├── card.jpg                ← demo asset
├── package.json            ← npm dependencies
├── capacitor.config.json   ← Capacitor app config (id, name, plugins)
├── www/                    ← web bundle that ships in the app
│   ├── index.html          ← modified for native (full-screen + safe areas)
│   └── card.jpg
├── resources/              ← icon + splash source files (svg + 1024px png)
├── ios/                    ← native iOS project (open in Xcode)
└── android/                ← native Android project (open in Android Studio)
```

App identity (change later if needed — see "Renaming" section below):
- App name: **WELLlife Care**
- Bundle ID: **com.welllife.care**

---

## One-time housekeeping (do this first)

### 1. Delete the orphaned scaffolding file

Capacitor created an extra file the sandbox couldn't clean up. Open Windows Explorer and delete this folder:

```
android/app/src/main/java/com/getcapacitor/
```

(The real `MainActivity.java` lives at `android/app/src/main/java/com/welllife/care/MainActivity.java` and is unaffected.)

### 2. Verify Node dependencies

From the project root in a terminal:

```bash
npm install
```

This installs Capacitor and the splash-screen / status-bar plugins.

---

## Running on Android

**Prereqs:** Android Studio (latest), JDK 17, Android SDK with API 34.

```bash
# Sync any web changes from www/ into android/
npx cap sync android

# Open the project in Android Studio
npx cap open android
```

Then in Android Studio: pick a device/emulator and click ▶ Run.

To produce a release `.aab` (App Bundle for Play Store):

1. In Android Studio: **Build → Generate Signed Bundle / APK**
2. Choose **Android App Bundle**
3. Create or pick a keystore (back this up — losing it locks you out of updates)
4. Build variant: `release`
5. Output `.aab` will be in `android/app/release/`

---

## Running on iOS (Mac only)

**Prereqs:** Xcode 15+, CocoaPods (`sudo gem install cocoapods` if missing).

```bash
# Install iOS native dependencies
cd ios/App && pod install && cd ../..

# Sync web assets
npx cap sync ios

# Open in Xcode
npx cap open ios
```

In Xcode:
1. Select the **App** target → **Signing & Capabilities**
2. Pick your Apple Developer team (creates a provisioning profile)
3. Pick a simulator or your physical device, click ▶
4. To archive for App Store: **Product → Archive** → **Distribute App** → **App Store Connect**

---

## Updating after changing the HTML

Whenever you edit `www/index.html` (or any web asset):

```bash
npx cap sync
```

This copies `www/` into both `ios/App/App/public/` and `android/app/src/main/assets/public/`, then refreshes plugin registrations. Run before each native build.

---

## Renaming the app or bundle ID

You can do this freely **before** the first store submission. After publishing, the bundle ID becomes permanent (changing it creates a "new app" on the stores).

To rename:

1. Edit `capacitor.config.json` → `appId` and `appName`
2. **Android**: edit `android/app/build.gradle` (`namespace`, `applicationId`) and `android/app/src/main/res/values/strings.xml`
3. **iOS**: in Xcode, select the App target → **General** tab → change Display Name and Bundle Identifier
4. Run `npx cap sync`

---

## What was modified vs. the original HTML

The native version (`www/index.html`) only adds two things to the original:

1. **Viewport meta tag** — added `viewport-fit=cover`, `user-scalable=no`, status-bar / theme-color metadata
2. **Native overrides block** — appended to the existing `<style>` block, only activates when `<html>` has the `.native` class, which is set by an inline boot script when `window.Capacitor` exists

Effect: in a browser, the file looks identical to the original demo. Inside the wrapper, the device frame disappears, layout is full-screen, the fake status bar is hidden, and the bottom tab bar respects the home-indicator safe area.

You can preview the native layout in a desktop browser by opening `www/index.html?native=1`.

---

## Things to do before you actually submit

These aren't blockers for a test build, but the stores will reject without them:

- [ ] **Replace the placeholder app icon** in `resources/icon.svg` with your real branding, then re-run the icon generation step (or use a tool like Figma → export 1024×1024 PNG → drop into `ios/App/App/Assets.xcassets/AppIcon.appiconset/` and the `android/app/src/main/res/mipmap-*` folders)
- [ ] **Privacy policy URL** — required by both Google Play and Apple. Even a static page on a marketing site works
- [ ] **App Store screenshots** — at minimum 6.7" iPhone screenshots; Apple needs 3
- [ ] **Play Store assets** — feature graphic (1024×500), 2+ screenshots, short + full description
- [ ] **Increase versionCode / versionName** for each store update (Android: `android/app/build.gradle`, iOS: Xcode target settings)
- [ ] **Bundle the Google Fonts locally** so first launch isn't dependent on network (currently `DM Sans` and `DM Serif Display` are loaded from fonts.googleapis.com — fine for dev, slow on first cold launch). Easy fix: download the `.woff2` files into `www/fonts/` and inline `@font-face` rules at the top of the `<style>` block.

---

## Adding native features later

Capacitor plugins drop in with one command. Examples:

```bash
# Health data (Apple Health / Google Health Connect)
npm install @capacitor-community/health

# Push notifications
npm install @capacitor/push-notifications

# Camera (for strip test scanning)
npm install @capacitor/camera
```

Then `npx cap sync` and configure the plugin's required permissions in `Info.plist` (iOS) and `AndroidManifest.xml` (Android). The plugin's README has the specific keys.

---

## Troubleshooting

**"Module not found" after `cap sync`** — run `npm install` again, then `npx cap sync`.

**Android build error about duplicate `MainActivity`** — the orphaned `com.getcapacitor.myapp` folder wasn't deleted. Delete it via Windows Explorer (see section 1 above).

**iOS build error about CocoaPods** — `cd ios/App && pod install` then re-open `App.xcworkspace` (not `.xcodeproj`).

**White screen on first launch** — usually means `www/` wasn't synced. Run `npx cap sync` then rebuild.

**App Store rejection for "non-functional app"** — this is common for HTML wrappers. Apple wants the app to demonstrate value beyond just being a website. The current app already qualifies (interactive features, local state) but if rejected, emphasize in the submission notes that it's a health-tracking tool with offline-capable local features.
