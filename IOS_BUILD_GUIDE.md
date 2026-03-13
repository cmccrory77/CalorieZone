# CalorieZone iOS App - Build & Publish Guide

## What You'll Need

- A **Mac** with **Xcode 15+** (free from the Mac App Store)
- An **Apple Developer Account** ($99/year) — sign up at [developer.apple.com](https://developer.apple.com)
- **Node.js 18+** installed on your Mac — download at [nodejs.org](https://nodejs.org)

---

## Step 1: Install Command Line Tools

Open the **Terminal** app on your Mac (search for "Terminal" in Spotlight) and run these one at a time:

```bash
# Install CocoaPods (manages iOS dependencies)
sudo gem install cocoapods
```

Enter your Mac password when prompted.

---

## Step 2: Download the Project

Download this entire project from Replit as a ZIP:

1. In Replit, click the three dots menu (⋯) in the file panel
2. Click **"Download as zip"**
3. Unzip the downloaded file on your Mac
4. Open Terminal and navigate to the folder:

```bash
cd ~/Downloads/caloriezone    # adjust path to wherever you unzipped it
```

Then install all the packages:

```bash
npm install
```

---

## Step 3: Set Up the iOS Project

Run these commands one at a time:

```bash
# Add the iOS platform
npx cap add ios

# Sync web files to the iOS project
npx cap sync ios
```

Now fix the iOS platform version in the Podfile:

```bash
# Open the Podfile
open ios/App/Podfile
```

Change the first line from `platform :ios, '13.0'` to:
```
platform :ios, '16.0'
```

Save and close, then install iOS dependencies:

```bash
cd ios/App && pod install && cd ../..
```

---

## Step 4: Open in Xcode

```bash
npx cap open ios
```

This opens the project in Xcode.

---

## Step 5: Configure Signing (Your Apple Account)

In Xcode:

1. In the left panel, click on **App** (the top item with the blue icon)
2. Click the **Signing & Capabilities** tab
3. Check the **"Automatically manage signing"** checkbox
4. Click the **Team** dropdown and select your Apple Developer account
   - If it's not there, go to Xcode > Settings > Accounts and add your Apple ID
5. The **Bundle Identifier** should be: `com.caloriezone.app`
6. If you see any signing errors, try changing the bundle ID to something unique like `com.yourname.caloriezone`

---

## Step 6: Set Your iPhone as the Build Target

1. Connect your iPhone to your Mac with a USB cable
2. At the top of Xcode, click the device dropdown (it may say "Any iOS Device")
3. Select your iPhone from the list
4. On your iPhone: go to Settings > Privacy & Security > Developer Mode and turn it **ON** (restart required)

---

## Step 7: Build & Run

1. Click the **Play button** (▶) in the top-left of Xcode, or press **⌘+R**
2. The first time, Xcode will ask you to trust the developer certificate on your phone:
   - On your iPhone: Settings > General > VPN & Device Management > tap your developer certificate > Trust
3. Run again from Xcode if needed

The app will install on your phone and load from the server automatically.

---

## Important Notes

- **The app loads from the Replit server** — it needs internet to work. The Replit workspace must be open/running for the dev server to be active.
- **You don't need to rebuild in Xcode** after code changes on Replit — just close and reopen the app on your phone to get updates. Only rebuild if the Capacitor config or native settings change.
- **If buttons/features don't work**, make sure the Replit workspace is open and the server is running.

---

## Updating the App After Code Changes

If you need to update the app with new changes from Replit:

1. **If only web/server code changed**: Just close and reopen the app — it loads from the server
2. **If Capacitor config or native code changed**:
   - Download a fresh ZIP from Replit
   - Unzip and run `npm install`
   - Copy your existing `ios/` folder into the new project (to keep signing config)
   - Run `npx cap sync ios`
   - Rebuild in Xcode

---

## Troubleshooting

**"Sandbox: rsync" errors during build:**
```bash
find ios/App/Pods -name "*.sh" -exec chmod +x {} \;
```
Then try building again.

**Xcode can't find developer tools:**
```bash
sudo xcode-select -s /Applications/Xcode.app/Contents/Developer
```

**Pod install fails:**
```bash
cd ios/App
pod repo update
pod install
cd ../..
```
