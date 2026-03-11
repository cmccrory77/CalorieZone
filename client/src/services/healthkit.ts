interface HealthKitPlugin {
  requestAuthorization(options: {
    readPermissions: string[];
    writePermissions: string[];
  }): Promise<void>;
  queryHKitSampleType(options: {
    sampleName: string;
    startDate: string;
    endDate: string;
    limit?: number;
  }): Promise<{ resultData: Array<{ value: number; startDate: string; endDate: string }> }>;
  writeHKitSampleType(options: {
    sampleName: string;
    value: number;
    startDate: string;
    endDate: string;
  }): Promise<void>;
}

let healthKitPlugin: HealthKitPlugin | null = null;

function isNativePlatform(): boolean {
  try {
    const w = window as any;
    return !!(w.Capacitor && w.Capacitor.isNativePlatform && w.Capacitor.isNativePlatform());
  } catch {
    return false;
  }
}

function getNativePlatform(): string {
  try {
    const w = window as any;
    return w.Capacitor?.getPlatform?.() || 'web';
  } catch {
    return 'web';
  }
}

async function getPlugin(): Promise<HealthKitPlugin | null> {
  if (!isNativePlatform()) return null;
  if (healthKitPlugin) return healthKitPlugin;

  try {
    const pluginName = '@nicepicks/capacitor-healthkit';
    const mod = await (Function('specifier', 'return import(specifier)')(pluginName));
    healthKitPlugin = mod.CapacitorHealthkit;
    return healthKitPlugin;
  } catch {
    return null;
  }
}

export function isHealthKitAvailable(): boolean {
  return isNativePlatform() && getNativePlatform() === 'ios';
}

export async function requestHealthKitPermissions(): Promise<boolean> {
  const plugin = await getPlugin();
  if (!plugin) return false;

  try {
    await plugin.requestAuthorization({
      readPermissions: [
        'HKQuantityTypeIdentifierStepCount',
        'HKQuantityTypeIdentifierActiveEnergyBurned',
        'HKQuantityTypeIdentifierBasalEnergyBurned',
        'HKQuantityTypeIdentifierDistanceWalkingRunning',
        'HKQuantityTypeIdentifierBodyMass',
        'HKQuantityTypeIdentifierDietaryEnergyConsumed',
        'HKWorkoutTypeIdentifier'
      ],
      writePermissions: [
        'HKQuantityTypeIdentifierBodyMass',
        'HKQuantityTypeIdentifierDietaryEnergyConsumed',
        'HKQuantityTypeIdentifierDietaryProtein',
        'HKQuantityTypeIdentifierDietaryCarbohydrates',
        'HKQuantityTypeIdentifierDietaryFatTotal'
      ]
    });
    return true;
  } catch {
    return false;
  }
}

export async function getTodaySteps(): Promise<number> {
  const plugin = await getPlugin();
  if (!plugin) return 0;

  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const result = await plugin.queryHKitSampleType({
      sampleName: 'HKQuantityTypeIdentifierStepCount',
      startDate: today.toISOString(),
      endDate: new Date().toISOString()
    });
    return result.resultData.reduce((sum, entry) => sum + entry.value, 0);
  } catch {
    return 0;
  }
}

export async function getTodayActiveCalories(): Promise<number> {
  const plugin = await getPlugin();
  if (!plugin) return 0;

  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const result = await plugin.queryHKitSampleType({
      sampleName: 'HKQuantityTypeIdentifierActiveEnergyBurned',
      startDate: today.toISOString(),
      endDate: new Date().toISOString()
    });
    return Math.round(result.resultData.reduce((sum, entry) => sum + entry.value, 0));
  } catch {
    return 0;
  }
}

export async function getBodyWeight(): Promise<number | null> {
  const plugin = await getPlugin();
  if (!plugin) return null;

  try {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const result = await plugin.queryHKitSampleType({
      sampleName: 'HKQuantityTypeIdentifierBodyMass',
      startDate: thirtyDaysAgo.toISOString(),
      endDate: new Date().toISOString(),
      limit: 1
    });
    if (result.resultData.length > 0) {
      return Math.round(result.resultData[0].value * 2.20462 * 10) / 10;
    }
    return null;
  } catch {
    return null;
  }
}

export async function writeBodyWeight(weightLbs: number): Promise<boolean> {
  const plugin = await getPlugin();
  if (!plugin) return false;

  try {
    const now = new Date().toISOString();
    await plugin.writeHKitSampleType({
      sampleName: 'HKQuantityTypeIdentifierBodyMass',
      value: weightLbs / 2.20462,
      startDate: now,
      endDate: now
    });
    return true;
  } catch {
    return false;
  }
}

export async function writeFoodEntry(calories: number, protein: number, carbs: number, fat: number): Promise<boolean> {
  const plugin = await getPlugin();
  if (!plugin) return false;

  try {
    const now = new Date().toISOString();
    await Promise.all([
      plugin.writeHKitSampleType({
        sampleName: 'HKQuantityTypeIdentifierDietaryEnergyConsumed',
        value: calories,
        startDate: now,
        endDate: now
      }),
      plugin.writeHKitSampleType({
        sampleName: 'HKQuantityTypeIdentifierDietaryProtein',
        value: protein,
        startDate: now,
        endDate: now
      }),
      plugin.writeHKitSampleType({
        sampleName: 'HKQuantityTypeIdentifierDietaryCarbohydrates',
        value: carbs,
        startDate: now,
        endDate: now
      }),
      plugin.writeHKitSampleType({
        sampleName: 'HKQuantityTypeIdentifierDietaryFatTotal',
        value: fat,
        startDate: now,
        endDate: now
      })
    ]);
    return true;
  } catch {
    return false;
  }
}
