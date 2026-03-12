# Caloriq iOS App - Build & Publish Guide

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

Download this entire project from Replit to your Mac. You can either:

**Option A — Download as ZIP:**
1. In Replit, click the three dots menu (⋯) in the file panel
2. Click "Download as zip"
3. Unzip the downloaded file on your Mac
4. Open Terminal and navigate to the folder:
```bash
cd ~/Downloads/caloriq    # adjust path to wherever you unzipped it
```

**Option B — Use Git (if you have it set up):**
```bash
git clone <your-replit-git-url>
cd caloriq
```

Then install all the packages:

```bash
npm install
```

---

## Step 3: Build the Web App

Still in Terminal, run:

```bash
npm run build
```

This creates the production files that will be bundled into the iOS app. You should see the build complete without errors.

---

## Step 4: Set Up the iOS Project

Run these commands one at a time:

```bash
# Add the iOS platform
npx cap add ios

# Install the HealthKit plugin
npm install @nicepicks/capacitor-healthkit

# Sync web files to the iOS project
npx cap sync ios

# Install iOS dependencies
cd ios/App && pod install && cd ../..
```

This creates an `ios/` folder with a full Xcode project.

---

## Step 5: Open in Xcode

```bash
npx cap open ios
```

This opens the project in Xcode.

---

## Step 6: Configure Signing (Your Apple Account)

In Xcode:

1. In the left panel, click on **App** (the top item with the blue icon)
2. Click the **Signing & Capabilities** tab
3. Check the **"Automatically manage signing"** checkbox
4. Click the **Team** dropdown and select your Apple Developer account
   - If it's not there, go to Xcode > Settings > Accounts and add your Apple ID
5. The **Bundle Identifier** should already be `com.caloriq.app`

---

## Step 7: Add HealthKit Capability

While still on the **Signing & Capabilities** tab:

1. Click the **+ Capability** button (top left area)
2. Search for **HealthKit** and double-click it
3. The HealthKit capability will appear in the list

Now add privacy descriptions:

1. Click the **Info** tab (next to Signing & Capabilities)
2. Hover over any row and click the **+** button to add new rows
3. Add these two entries:
   - Key: `Privacy - Health Share Usage Description`
     Value: `Caloriq reads your health data to track steps, calories burned, and weight to provide personalized recommendations.`
   - Key: `Privacy - Health Update Usage Description`
     Value: `Caloriq writes nutritional data and weight updates to Apple Health to keep your health records complete.`

---

## Step 8: Add Camera Permission

Add one more privacy description for the barcode scanner:

1. Still in the **Info** tab
2. Add a new row:
   - Key: `Privacy - Camera Usage Description`
     Value: `Caloriq uses the camera to scan product barcodes and photograph meals for calorie tracking.`

---

## Step 9: Create App Icons

You need a 1024x1024 app icon image. To generate all required sizes:

1. Go to [appicon.co](https://appicon.co)
2. Upload your 1024x1024 icon image
3. Select **iPhone** and click **Generate**
4. Download the zip and replace the contents of:
   `ios/App/App/Assets.xcassets/AppIcon.appiconset/`

---

## Step 10: Test on Your iPhone

1. Connect your iPhone to your Mac with a USB cable
2. In Xcode, click the device dropdown at the top and select your iPhone
3. Click the **Run** button (▶) or press **Cmd + R**
4. On your iPhone, if prompted, go to:
   **Settings > General > VPN & Device Management** and trust your developer certificate
5. The app should launch on your phone — test everything!

---

## Step 11: Archive for App Store

Once testing looks good:

1. In Xcode, change the device dropdown to **Any iOS Device (arm64)**
2. Click **Product > Archive** in the menu bar
3. Wait for the build to complete (this takes a few minutes)
4. The **Organizer** window will open showing your archive
5. Click **Distribute App**
6. Choose **App Store Connect** > **Upload**
7. Follow the prompts and click **Upload**

---

## Step 12: Create Your App Listing

1. Go to [appstoreconnect.apple.com](https://appstoreconnect.apple.com) and sign in
2. Click **My Apps** > **+** > **New App**
3. Fill in:
   - **Platform:** iOS
   - **Name:** Caloriq
   - **Primary Language:** English
   - **Bundle ID:** Select `com.caloriq.app`
   - **SKU:** `caloriq-001` (any unique string)
4. Click **Create**

---

## Step 13: Fill In App Details

On the app page in App Store Connect:

**App Information tab:**
- **Subtitle:** Smart Calorie & Meal Tracker
- **Category:** Health & Fitness
- **Content Rights:** Does not contain third-party content

**Pricing and Availability tab:**
- Set your price (Free or paid)

**App Privacy tab:**
- Fill in privacy details based on what data the app collects (health data, usage data)
- You'll need a **Privacy Policy URL** — you can create a free one at [freeprivacypolicy.com](https://www.freeprivacypolicy.com)

**Version page (prepare for submission):**
- Add **screenshots** (take them from your iPhone during testing)
  - You need screenshots for 6.7" (iPhone 15 Pro Max) and 6.5" (iPhone 11 Pro Max) at minimum
- **Description:** Write a compelling app description
- **Keywords:** calorie tracker, meal planner, weight loss, nutrition, health, diet, food diary, macro tracker
- **Support URL:** Your website or a support email page
- **Build:** Select the build you uploaded in Step 11

---

## Step 14: Submit for Review

1. On the version page, click **Add for Review**
2. Answer the review questions
3. Click **Submit to App Review**

Apple typically reviews apps within **1-3 business days**. You'll get an email when it's approved (or if changes are needed).

---

## Updating the App Later

After making changes to the code in Replit:

1. Re-publish the app in Replit (this updates the backend)
2. Download the updated code to your Mac
3. Run:
```bash
npm install
npm run build
npx cap sync ios
npx cap open ios
```
4. In Xcode: bump the version number in the **General** tab
5. Archive and upload again (Steps 11)
6. In App Store Connect, create a new version and submit

---

## Troubleshooting

**"No provisioning profiles" error:**
Make sure you've selected your Team in Signing & Capabilities and "Automatically manage signing" is checked.

**App crashes on launch:**
Make sure you ran `npm run build` and `npx cap sync ios` before opening Xcode.

**HealthKit not working:**
Make sure you added the HealthKit capability AND both privacy description keys in the Info tab.

**Build fails with CocoaPods error:**
Run `cd ios/App && pod install && cd ../..` again.

**Camera not working for barcode scanner:**
Make sure you added the Camera Usage Description in Step 8.
