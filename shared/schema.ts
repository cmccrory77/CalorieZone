import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, real, date, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export { conversations, messages, insertConversationSchema, insertMessageSchema } from "./models/chat";
export type { Conversation, InsertConversation, Message, InsertMessage } from "./models/chat";

export const userProfiles = pgTable("user_profiles", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  deviceId: text("device_id"),
  name: text("name"),
  avatarSeed: text("avatar_seed").notNull().default("Felix"),
  startingWeight: real("starting_weight"),
  currentWeight: real("current_weight"),
  targetWeight: real("target_weight"),
  timeframe: integer("timeframe").notNull().default(12),
  targetDate: text("target_date"),
  maintenanceCalories: integer("maintenance_calories").notNull().default(2450),
  activityLevel: text("activity_level").notNull().default("moderate"),
  age: integer("age"),
  heightCm: real("height_cm"),
  sex: text("sex"),
});

export const foodEntries = pgTable("food_entries", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  profileId: varchar("profile_id").notNull(),
  name: text("name").notNull(),
  calories: integer("calories").notNull(),
  protein: real("protein").notNull().default(0),
  carbs: real("carbs").notNull().default(0),
  fat: real("fat").notNull().default(0),
  date: date("date").notNull(),
});

export const savedRecipes = pgTable("saved_recipes", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  profileId: varchar("profile_id").notNull(),
  title: text("title").notNull(),
  type: text("type").notNull(),
  cuisine: text("cuisine").notNull().default("custom"),
  dietaryTag: text("dietary_tag").notNull().default("balanced"),
  calories: integer("calories").notNull(),
  protein: text("protein").notNull(),
  carbs: text("carbs").notNull(),
  fat: text("fat").notNull(),
  time: text("time").notNull(),
  ingredients: jsonb("ingredients").notNull().default([]),
  steps: jsonb("steps").notNull().default([]),
});

export const plannedMeals = pgTable("planned_meals", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  profileId: varchar("profile_id").notNull(),
  date: date("date").notNull(),
  mealType: text("meal_type").notNull(),
  title: text("title").notNull(),
  calories: integer("calories").notNull(),
  protein: text("protein").notNull(),
  carbs: text("carbs").notNull(),
  fat: text("fat").notNull(),
  time: text("time").notNull(),
  ingredients: jsonb("ingredients").notNull().default([]),
  steps: jsonb("steps").notNull().default([]),
});

export const exerciseEntries = pgTable("exercise_entries", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  profileId: varchar("profile_id").notNull(),
  name: text("name").notNull(),
  duration: integer("duration").notNull(),
  caloriesBurned: integer("calories_burned").notNull(),
  date: date("date").notNull(),
});

export const insertUserProfileSchema = createInsertSchema(userProfiles).omit({ id: true });
export const updateUserProfileSchema = insertUserProfileSchema.partial();
export const insertFoodEntrySchema = createInsertSchema(foodEntries).omit({ id: true });
export const insertSavedRecipeSchema = createInsertSchema(savedRecipes).omit({ id: true });
export const insertPlannedMealSchema = createInsertSchema(plannedMeals).omit({ id: true });
export const insertExerciseEntrySchema = createInsertSchema(exerciseEntries).omit({ id: true });

export type InsertUserProfile = z.infer<typeof insertUserProfileSchema>;
export type UserProfile = typeof userProfiles.$inferSelect;
export type InsertFoodEntry = z.infer<typeof insertFoodEntrySchema>;
export type FoodEntry = typeof foodEntries.$inferSelect;
export type InsertSavedRecipe = z.infer<typeof insertSavedRecipeSchema>;
export type SavedRecipe = typeof savedRecipes.$inferSelect;
export type InsertPlannedMeal = z.infer<typeof insertPlannedMealSchema>;
export type PlannedMeal = typeof plannedMeals.$inferSelect;
export type InsertExerciseEntry = z.infer<typeof insertExerciseEntrySchema>;
export type ExerciseEntry = typeof exerciseEntries.$inferSelect;
