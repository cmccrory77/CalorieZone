/**
 * Mifflin-St Jeor BMR formula with TDEE multiplier.
 * Returns maintenance calories rounded to nearest integer.
 * Falls back to 2450 if required inputs are missing.
 */
export function calculateMaintenanceCalories(
  weightLbs: number | null | undefined,
  heightCm: number | null | undefined,
  age: number | null | undefined,
  sex: string | null | undefined,
  activityLevel: string | null | undefined,
): number {
  if (!weightLbs || !heightCm || !age || !sex) return 2450;

  const weightKg = weightLbs * 0.453592;

  let bmr: number;
  if (sex === "man") {
    bmr = 10 * weightKg + 6.25 * heightCm - 5 * age + 5;
  } else if (sex === "woman") {
    bmr = 10 * weightKg + 6.25 * heightCm - 5 * age - 161;
  } else {
    bmr = 10 * weightKg + 6.25 * heightCm - 5 * age - 78;
  }

  const multipliers: Record<string, number> = {
    sedentary: 1.2,
    moderate: 1.375,
    active: 1.55,
    very_active: 1.725,
  };
  const multiplier = multipliers[activityLevel ?? "moderate"] ?? 1.375;

  return Math.max(1200, Math.round(bmr * multiplier));
}

export function cmToFeetInches(cm: number): { ft: number; inches: number } {
  const totalInches = cm / 2.54;
  const ft = Math.floor(totalInches / 12);
  const inches = Math.round(totalInches % 12);
  return { ft, inches };
}

export function feetInchesToCm(ft: number, inches: number): number {
  return Math.round((ft * 12 + inches) * 2.54 * 10) / 10;
}
