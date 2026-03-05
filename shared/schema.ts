import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, real, date } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const userProfiles = pgTable("user_profiles", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  startingWeight: real("starting_weight").notNull().default(185),
  currentWeight: real("current_weight").notNull().default(185),
  targetWeight: real("target_weight").notNull().default(165),
  timeframe: integer("timeframe").notNull().default(12),
  maintenanceCalories: integer("maintenance_calories").notNull().default(2450),
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

export const insertUserProfileSchema = createInsertSchema(userProfiles).omit({ id: true });
export const updateUserProfileSchema = insertUserProfileSchema.partial();
export const insertFoodEntrySchema = createInsertSchema(foodEntries).omit({ id: true });

export type InsertUserProfile = z.infer<typeof insertUserProfileSchema>;
export type UserProfile = typeof userProfiles.$inferSelect;
export type InsertFoodEntry = z.infer<typeof insertFoodEntrySchema>;
export type FoodEntry = typeof foodEntries.$inferSelect;
