import type { Express } from "express";
import { type Server } from "http";
import { storage } from "./storage";
import { insertFoodEntrySchema, updateUserProfileSchema } from "@shared/schema";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  app.get("/api/profile", async (_req, res) => {
    try {
      const profile = await storage.getDefaultProfile();
      res.json(profile);
    } catch (error) {
      res.status(500).json({ message: "Failed to load profile" });
    }
  });

  app.patch("/api/profile/:id", async (req, res) => {
    try {
      const parsed = updateUserProfileSchema.parse(req.body);
      const profile = await storage.updateProfile(req.params.id, parsed);
      res.json(profile);
    } catch (error) {
      res.status(400).json({ message: "Invalid profile data" });
    }
  });

  app.get("/api/food-entries/:profileId/:date", async (req, res) => {
    try {
      const entries = await storage.getFoodEntries(req.params.profileId, req.params.date);
      res.json(entries);
    } catch (error) {
      res.status(500).json({ message: "Failed to load food entries" });
    }
  });

  app.post("/api/food-entries", async (req, res) => {
    try {
      const parsed = insertFoodEntrySchema.parse(req.body);
      const entry = await storage.addFoodEntry(parsed);
      res.json(entry);
    } catch (error) {
      res.status(400).json({ message: "Invalid food entry data" });
    }
  });

  app.delete("/api/food-entries/:id", async (req, res) => {
    try {
      await storage.removeFoodEntry(req.params.id);
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ message: "Failed to remove food entry" });
    }
  });

  return httpServer;
}
