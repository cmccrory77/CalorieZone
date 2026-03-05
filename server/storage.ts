import { eq, and } from "drizzle-orm";
import { db } from "./db";
import {
  userProfiles,
  foodEntries,
  type UserProfile,
  type InsertUserProfile,
  type FoodEntry,
  type InsertFoodEntry,
} from "@shared/schema";

export interface IStorage {
  getProfile(id: string): Promise<UserProfile | undefined>;
  getDefaultProfile(): Promise<UserProfile>;
  updateProfile(id: string, data: Partial<InsertUserProfile>): Promise<UserProfile>;

  getFoodEntries(profileId: string, date: string): Promise<FoodEntry[]>;
  addFoodEntry(entry: InsertFoodEntry): Promise<FoodEntry>;
  removeFoodEntry(id: string): Promise<void>;
}

export class DatabaseStorage implements IStorage {
  async getProfile(id: string): Promise<UserProfile | undefined> {
    const [profile] = await db.select().from(userProfiles).where(eq(userProfiles.id, id));
    return profile;
  }

  async getDefaultProfile(): Promise<UserProfile> {
    const [existing] = await db.select().from(userProfiles).limit(1);
    if (existing) return existing;

    const [created] = await db.insert(userProfiles).values({}).returning();
    return created;
  }

  async updateProfile(id: string, data: Partial<InsertUserProfile>): Promise<UserProfile> {
    const [updated] = await db
      .update(userProfiles)
      .set(data)
      .where(eq(userProfiles.id, id))
      .returning();
    return updated;
  }

  async getFoodEntries(profileId: string, date: string): Promise<FoodEntry[]> {
    return db
      .select()
      .from(foodEntries)
      .where(and(eq(foodEntries.profileId, profileId), eq(foodEntries.date, date)));
  }

  async addFoodEntry(entry: InsertFoodEntry): Promise<FoodEntry> {
    const [created] = await db.insert(foodEntries).values(entry).returning();
    return created;
  }

  async removeFoodEntry(id: string): Promise<void> {
    await db.delete(foodEntries).where(eq(foodEntries.id, id));
  }
}

export const storage = new DatabaseStorage();
