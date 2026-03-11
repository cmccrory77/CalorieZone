# Caloriq iOS App - Build & Publish Guide

## Prerequisites

- Mac with **Xcode 15+** installed (free from Mac App Store)
- **Apple Developer Account** ($99/year) — [developer.apple.com](https://developer.apple.com)
- **Node.js 18+** installed on your Mac
- **CocoaPods** installed (`sudo gem install cocoapods`)

## Step 1: Clone the Project

Download/clone this project to your Mac.

```bash
cd caloriq
npm install
```

## Step 2: Build the Web App

```bash
npm run build
```

This creates the production web build in `dist/public/`.

## Step 3: Initialize iOS Platform

```bash
npx cap add ios
npx cap sync ios
```

This creates the `ios/` folder with the Xcode project.

## Step 4: Configure HealthKit in Xcode

Open the Xcode project:

```bash
npx cap open ios
```

In Xcode:

1. Select the **App** target in the project navigator
2. Go to **Signing & Capabilities** tab
3. Click **+ Capability** and add **HealthKit**
4. Check **Clinical Health Records** if needed
5. Go to **Info** tab and add these keys:
   - `NSHealthShareUsageDescription` — "Caloriq reads your health data to track steps, calories burned, and weight to provide personalized recommendations."
   - `NSHealthUpdateUsageDescription` — "Caloriq writes nutritional data and weight updates to Apple Health to keep your health records complete."

## Step 5: Configure App Signing

1. In Xcode, select the **App** target
2. Go to **Signing & Capabilities**
3. Select your **Team** (your Apple Developer account)
4. Set **Bundle Identifier** to `com.caloriq.app` (or your preferred ID)
5. Xcode will automatically create provisioning profiles

## Step 6: Update Server URL

The app needs to communicate with your backend. In `capacitor.config.ts`, add your production server URL:

```typescript
server: {
  url: 'https://your-deployed-backend.replit.app',
  cleartext: false
}
```

Deploy your backend first using Replit's deploy feature, then use that URL.

## Step 7: Install HealthKit Plugin

```bash
npm install @nicepicks/capacitor-healthkit
npx cap sync ios
cd ios/App && pod install && cd ../..
```

## Step 8: App Icons & Splash Screen

Replace the default icons in `ios/App/App/Assets.xcassets/AppIcon.appiconset/`:

- You need icons in these sizes: 20pt, 29pt, 40pt, 60pt, 76pt, 83.5pt (at 1x, 2x, 3x scales)
- Use a tool like [appicon.co](https://appicon.co) to generate all sizes from a single 1024x1024 image

## Step 9: Test on Device

1. Connect your iPhone to your Mac via USB
2. In Xcode, select your iPhone as the build target
3. Click **Run** (or Cmd+R)
4. Trust the developer certificate on your iPhone: Settings > General > Device Management

## Step 10: Build for App Store

1. In Xcode, select **Product > Archive**
2. Once archived, click **Distribute App**
3. Choose **App Store Connect**
4. Follow the prompts to upload

## Step 11: Submit in App Store Connect

1. Go to [appstoreconnect.apple.com](https://appstoreconnect.apple.com)
2. Create a new app listing
3. Fill in:
   - App name: **Caloriq**
   - Subtitle: "Smart Calorie & Meal Tracker"
   - Description, keywords, screenshots
   - Privacy policy URL (required)
   - Category: Health & Fitness
4. Select the uploaded build
5. Submit for review

## In-App Purchases (Optional)

To add a freemium model with RevenueCat:

```bash
npm install @revenuecat/purchases-capacitor
npx cap sync ios
```

Configure in App Store Connect:
1. Create subscription groups and products
2. Set up RevenueCat account at [revenuecat.com](https://revenuecat.com)
3. Link your App Store Connect account to RevenueCat

## Important Notes

- Apple review typically takes 1-3 days
- HealthKit apps require a privacy policy
- Apple requires real native functionality (HealthKit qualifies)
- Test thoroughly on a real device before submitting
- The web app continues to work as a PWA alongside the native app

## Updating the App

After making changes to the web code:

```bash
npm run build
npx cap sync ios
npx cap open ios
```

Then archive and upload the new version in Xcode.

## Project Structure

```
caloriq/
├── client/                    # Web frontend (React)
│   └── src/
│       └── services/
│           └── healthkit.ts   # Apple Health integration
├── server/                    # Express backend
├── shared/                    # Shared types
├── capacitor.config.ts        # Capacitor configuration
├── ios/                       # Generated Xcode project (after cap add ios)
└── IOS_BUILD_GUIDE.md         # This file
```
