import type { UserProfile, FoodEntry, SavedRecipe, PlannedMeal, ExerciseEntry } from "@shared/schema";

const KEYS = {
  profile: "cz-profile",
  foodEntries: "cz-food-entries",
  savedRecipes: "cz-saved-recipes",
  plannedMeals: "cz-planned-meals",
  exerciseEntries: "cz-exercise-entries",
};

function generateId(): string {
  const chars = "abcdefghijklmnopqrstuvwxyz0123456789";
  let id = "";
  for (let i = 0; i < 24; i++) id += chars[Math.floor(Math.random() * chars.length)];
  return id;
}

function load<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function save<T>(key: string, data: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch {}
}

const DEFAULT_PROFILE: UserProfile = {
  id: "local",
  deviceId: null,
  name: null,
  avatarSeed: "Felix",
  startingWeight: null,
  currentWeight: null,
  targetWeight: null,
  timeframe: 12,
  targetDate: null,
  maintenanceCalories: 2450,
  activityLevel: "moderate",
};

export function getProfile(): UserProfile {
  return load<UserProfile>(KEYS.profile, { ...DEFAULT_PROFILE });
}

export function updateProfile(data: Partial<UserProfile>): UserProfile {
  const current = getProfile();
  const updated = { ...current, ...data };
  save(KEYS.profile, updated);
  return updated;
}

export function getFoodEntries(date: string): FoodEntry[] {
  const all = load<FoodEntry[]>(KEYS.foodEntries, []);
  return all.filter((e) => e.date === date);
}

export function getFoodEntriesForRange(startDate: string, endDate: string): FoodEntry[] {
  const all = load<FoodEntry[]>(KEYS.foodEntries, []);
  return all.filter((e) => e.date >= startDate && e.date <= endDate);
}

export function addFoodEntry(entry: Omit<FoodEntry, "id">): FoodEntry {
  const all = load<FoodEntry[]>(KEYS.foodEntries, []);
  const newEntry: FoodEntry = { ...entry, id: generateId() };
  all.push(newEntry);
  save(KEYS.foodEntries, all);
  return newEntry;
}

export function removeFoodEntry(id: string): void {
  const all = load<FoodEntry[]>(KEYS.foodEntries, []);
  save(KEYS.foodEntries, all.filter((e) => e.id !== id));
}

export interface FrequentFood {
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  frequency: number;
  lastUsed: string;
}

export function getFrequentFoods(): FrequentFood[] {
  const all = load<FoodEntry[]>(KEYS.foodEntries, []);
  const map = new Map<string, FrequentFood>();
  for (const entry of all) {
    const key = entry.name.toLowerCase();
    const existing = map.get(key);
    if (existing) {
      existing.frequency += 1;
      if (entry.date > existing.lastUsed) {
        existing.lastUsed = entry.date;
        existing.calories = entry.calories;
        existing.protein = entry.protein;
        existing.carbs = entry.carbs;
        existing.fat = entry.fat;
      }
    } else {
      map.set(key, {
        name: entry.name,
        calories: entry.calories,
        protein: entry.protein,
        carbs: entry.carbs,
        fat: entry.fat,
        frequency: 1,
        lastUsed: entry.date,
      });
    }
  }
  return Array.from(map.values())
    .sort((a, b) => b.frequency - a.frequency)
    .slice(0, 20);
}

export function getSavedRecipes(): SavedRecipe[] {
  return load<SavedRecipe[]>(KEYS.savedRecipes, []);
}

export function addSavedRecipe(recipe: Omit<SavedRecipe, "id">): SavedRecipe {
  const all = load<SavedRecipe[]>(KEYS.savedRecipes, []);
  const newRecipe: SavedRecipe = { ...recipe, id: generateId() };
  all.push(newRecipe);
  save(KEYS.savedRecipes, all);
  return newRecipe;
}

export function removeSavedRecipe(id: string): void {
  const all = load<SavedRecipe[]>(KEYS.savedRecipes, []);
  save(KEYS.savedRecipes, all.filter((r) => r.id !== id));
}

export function getPlannedMeals(startDate: string, endDate: string): PlannedMeal[] {
  const all = load<PlannedMeal[]>(KEYS.plannedMeals, []);
  return all.filter((m) => m.date >= startDate && m.date <= endDate);
}

export function addPlannedMeals(meals: Omit<PlannedMeal, "id">[]): PlannedMeal[] {
  const all = load<PlannedMeal[]>(KEYS.plannedMeals, []);
  const created: PlannedMeal[] = meals.map((m) => ({ ...m, id: generateId() }));
  all.push(...created);
  save(KEYS.plannedMeals, all);
  return created;
}

export function clearPlannedMealsForWeek(startDate: string, endDate: string): void {
  const all = load<PlannedMeal[]>(KEYS.plannedMeals, []);
  save(KEYS.plannedMeals, all.filter((m) => m.date < startDate || m.date > endDate));
}

export function getExerciseEntries(date: string): ExerciseEntry[] {
  const all = load<ExerciseEntry[]>(KEYS.exerciseEntries, []);
  return all.filter((e) => e.date === date);
}

export function addExerciseEntry(entry: Omit<ExerciseEntry, "id">): ExerciseEntry {
  const all = load<ExerciseEntry[]>(KEYS.exerciseEntries, []);
  const newEntry: ExerciseEntry = { ...entry, id: generateId() };
  all.push(newEntry);
  save(KEYS.exerciseEntries, all);
  return newEntry;
}

export function removeExerciseEntry(id: string): void {
  const all = load<ExerciseEntry[]>(KEYS.exerciseEntries, []);
  save(KEYS.exerciseEntries, all.filter((e) => e.id !== id));
}

export function resetAllData(): void {
  Object.values(KEYS).forEach((key) => localStorage.removeItem(key));
}
