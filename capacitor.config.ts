import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.caloriezone.app',
  appName: 'CalorieZone',
  webDir: 'dist/public',
  server: {
    url: 'https://b5252e75-7d72-4a27-a063-837869a7ea78-00-1fypdustfwrn6.kirk.replit.dev',
    androidScheme: 'https'
  },
  plugins: {
    CapacitorHealthkit: {
      readPermissions: [
        'HKQuantityTypeIdentifierStepCount',
        'HKQuantityTypeIdentifierActiveEnergyBurned',
        'HKQuantityTypeIdentifierBasalEnergyBurned',
        'HKQuantityTypeIdentifierDistanceWalkingRunning',
        'HKQuantityTypeIdentifierBodyMass',
        'HKQuantityTypeIdentifierBodyMassIndex',
        'HKQuantityTypeIdentifierDietaryEnergyConsumed',
        'HKQuantityTypeIdentifierDietaryProtein',
        'HKQuantityTypeIdentifierDietaryCarbohydrates',
        'HKQuantityTypeIdentifierDietaryFatTotal',
        'HKWorkoutTypeIdentifier'
      ],
      writePermissions: [
        'HKQuantityTypeIdentifierBodyMass',
        'HKQuantityTypeIdentifierDietaryEnergyConsumed',
        'HKQuantityTypeIdentifierDietaryProtein',
        'HKQuantityTypeIdentifierDietaryCarbohydrates',
        'HKQuantityTypeIdentifierDietaryFatTotal'
      ]
    }
  }
};

export default config;
